// Ear Prompter voice core: downloads the voice model once (kept in the browser's cache), then turns lines into audio.
// Runs inside a Web Worker (worker.js) or, if the page can't start one, right in the page.
import * as ort from './ort.wasm.bundle.min.js';
import * as T from './tts.js';

ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy = false;
ort.env.wasm.wasmPaths = { wasm: new URL('./ort-wasm-simd-threaded.wasm', import.meta.url).href };
ort.env.logLevel = 'error';

const CACHE_NAME = 'ear-prompter-files-v1';
const here = (p) => new URL(p, import.meta.url).href;

let textReady = null;          // promise: dictionary + rules loaded
let engine = null;             // { key, eng, voices }
let loading = null;            // { key, promise }
let wanted = null;             // the voice the page wants now (a newer request cancels an older download)

let post = () => {};

async function openCache() {
  try { return await caches.open(CACHE_NAME); } catch { return null; }
}

/** Bytes of one file, from the browser cache when we have it, with download progress. */
async function getBytes(url, onBytes) {
  const cache = await openCache();
  if (cache) {
    try {
      const hit = await cache.match(url);
      if (hit) { const b = new Uint8Array(await hit.arrayBuffer()); onBytes?.(b.length, true); return b; }
    } catch { /* cache not usable */ }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  let bytes;
  if (res.body && res.body.getReader) {
    const total = +res.headers.get('content-length') || 0;
    const reader = res.body.getReader();
    const parts = []; let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(value); got += value.length; onBytes?.(got, false);
    }
    bytes = new Uint8Array(total && total === got ? total : got);
    let o = 0; for (const p of parts) { bytes.set(p, o); o += p.length; }
  } else {
    bytes = new Uint8Array(await res.arrayBuffer()); onBytes?.(bytes.length, false);
  }
  if (cache) { try { await cache.put(url, new Response(bytes.slice())); } catch { /* storage full or blocked */ } }
  return bytes;
}

async function getText(url) { return new TextDecoder().decode(await getBytes(url)); }

function initText() {
  if (!textReady) {
    textReady = (async () => {
      const [dict, rules] = await Promise.all([getText(here('../data/dict.txt')), getText(here('../data/en_rules.txt'))]);
      const n = T.initPhonemizer(dict, rules);
      if (n < 1000) throw new Error('Pronunciation dictionary did not load');
      return n;
    })();
    textReady.catch(() => { textReady = null; });
  }
  return textReady;
}

async function loadEngine(spec) {
  wanted = spec.key;
  if (engine && engine.key === spec.key) return engine;
  if (loading && loading.key === spec.key) return loading.promise;
  // one voice in memory at a time: let an older load stop first
  while (loading) { try { await loading.promise; } catch { /* cancelled or failed */ } }
  if (engine && engine.key === spec.key) return engine;
  const promise = (async () => {
    const t0 = performance.now();
    await initText();
    if (engine) { try { await engine.eng.session?.release?.(); } catch { /* */ } engine = null; }
    const total = spec.size;
    const model = new Uint8Array(total);
    let done = 0, fromCache = true;
    for (const part of spec.parts) {
      if (wanted !== spec.key) throw new Error('cancelled');
      const base = done;
      const b = await getBytes(here('../' + part), (n, cached) => {
        if (!cached) fromCache = false;
        post({ type: 'progress', key: spec.key, loaded: Math.min(total, base + n), total, cached });
      });
      model.set(b, done); done += b.length;
    }
    if (done !== total) throw new Error(`Voice file is incomplete (${done} of ${total} bytes)`);
    post({ type: 'progress', key: spec.key, loaded: total, total, stage: 'starting' });
    let cfg, voices = null;
    if (spec.config) cfg = JSON.parse(await getText(here('../' + spec.config)));
    if (spec.voices) voices = new Float32Array((await getBytes(here('../' + spec.voices))).buffer);
    if (wanted !== spec.key) throw new Error('cancelled');
    const eng = await T.Engine.create(spec.kind, ort, model, cfg);
    const e = { key: spec.key, eng, voices };
    engine = e;
    post({ type: 'engine-ready', key: spec.key, ms: Math.round(performance.now() - t0), fromCache });
    return e;
  })();
  loading = { key: spec.key, promise };
  try { return await promise; } finally { if (loading && loading.promise === promise) loading = null; }
}

export function setPost(fn) { post = fn; }
export async function handle(m) {
  m = m || {};
  try {
    if (m.type === 'init') {
      await initText();
      post({ type: 'text-ready' });
    } else if (m.type === 'engine') {
      await loadEngine(m.spec);
    } else if (m.type === 'synth') {
      const e = await loadEngine(m.spec);
      let voice = new Float32Array(0);
      if (e.voices && m.voiceIndex != null) {
        const per = 510 * 256;
        voice = e.voices.subarray(m.voiceIndex * per, (m.voiceIndex + 1) * per);
      }
      const t0 = performance.now();
      const { audio } = await e.eng.synth(m.text, voice, m.speed || 1);
      const samples = audio.length ? audio : new Float32Array(Math.round(e.eng.rate * 0.2));
      post({ type: 'line', id: m.id, samples, rate: e.eng.rate, ms: Math.round(performance.now() - t0) }, [samples.buffer]);
    } else if (m.type === 'phonemes') {
      await initText();
      post({ type: 'phonemes', id: m.id, speakable: T.speakable(m.text), phonemes: await T.phonemesFor(m.text) });
    }
  } catch (err) {
    if (String(err && err.message) === 'cancelled' && m.type === 'engine') return;
    post({ type: 'error', id: m.id, key: m.spec?.key, stage: m.type, message: String(err && err.message || err) });
  }
}
