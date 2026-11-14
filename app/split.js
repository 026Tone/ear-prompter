// "Paste many scripts": where one script stops and the next starts.
// The rules come from Short & Sweet Studio's Story Arcs box (short-and-sweet-studio/app/lib/topics.mjs splitTopics),
// so his own exports split the same way there and here: "---" dividers, numbered titles ("1. Title", "#1Title",
// "Script 3"), blank lines between scripts, scripts ending on a comment-keyword line. The app's card lines
// ("COMMENT GUIDE · ... · 140 words", "Stage 2 · ...", "SECTION 2" + its heading) are left out of what gets read.

const DIVIDER = /^\s*(?:-{3,}|\*{3,}|_{3,}|={3,}|~{3,}|•\s*•\s*•)\s*$/;
const NUMBERED = /^\s*(?:(?:script|video|reel|short|story|topic|idea)\s*(?:#|no\.?)?\s*(\d{1,3})\b[\s.:)\-–—]*|#\s*(\d{1,3})(?=\D|$)\s*[.:)\-–—]?\s*|(?:no\.?\s*)?(\d{1,3})\s*[.)\]:]\s+|(\d{1,3})\s*[-–—]\s+(?=[A-Z"“']))(.*)$/i;
const MD_HEAD = /^\s*(?:#{1,6}\s+(.+)|\*\*([^*]{2,120})\*\*\s*:?)\s*$/;
const KEYWORD_LINE = /^\s*(?:comment|Comment|COMMENT)\s+(?:the word\s+|THE WORD\s+)?([A-Z][A-Z0-9]{2,})\b(?:\s*[·|•:-].*)?\s*$/;
const META_LINE = /^\s*(?:(?:free guide|course|free ai lab|free lab)\s*:.*|\d{2,4}\s+words|your script, rebuilt|built from your topic|another version|story arc\s*·.*|stage\s+\d\s*·.*|teaches:.*|worth a look:.*|checked:.*|fact checked and proofread\.?|copy\s+edit\s+rewrite.*)\s*$/i;
const SECTION_LINE = /^\s*SECTION\s+\d+\b.*$/;
const CTA_END = /\b(?:comment|Comment|COMMENT)\b[^.!?]*\b[A-Z][A-Z0-9]{2,}\b/;
const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;
const endsSentence = (l) => /[.!?]["”')\]]?\s*$/.test(l);

function headingOf(line) {
  const m = line.match(NUMBERED);
  if (m) {
    const no = Number(m[1] || m[2] || m[3] || m[4]);
    const rest = String(m[5] || '').trim();
    return words(rest) <= 16 ? { no, title: rest } : null;
  }
  const h = line.match(MD_HEAD);
  if (h) { const t = (h[1] || h[2] || '').trim(); if (t && words(t) <= 16) return { no: null, title: t.replace(/\*\*/g, '') }; }
  return null;
}
const titleish = (l) => words(l) >= 1 && words(l) <= 12 && !endsSentence(l) && !/[,;]$/.test(l) && /^["“']?[A-Z0-9]/.test(l) && !KEYWORD_LINE.test(l) && !META_LINE.test(l);

/** One script: its name and the words to read. The comment-keyword line stays in only if it's part of what he says. */
function scriptItem(title, body) {
  const kept = [];
  let afterCount = false;
  for (const l of body) {
    if (KEYWORD_LINE.test(l) && /·|\|/.test(l)) continue;           // the app's card line, not something to say
    if (META_LINE.test(l)) { afterCount = /^\s*\d{2,4}\s+words\s*$/i.test(l); continue; }
    if (afterCount && titleish(l) && !kept.length) { afterCount = false; continue; }
    afterCount = false;
    kept.push(l);
  }
  const text = kept.join('\n').replace(/([^.!?"”'\n])\n(?=[a-z(])/g, '$1 ').trim();
  return { name: String(title || '').trim(), text };
}

function scriptLike(lines) {
  if (!lines.length) return false;
  const long = lines.filter((l) => words(l) >= 8).length;
  const ends = lines.filter(endsSentence).length;
  const avg = lines.reduce((n, l) => n + words(l), 0) / lines.length;
  return lines.length >= 3 && avg >= 8 && (long / lines.length >= 0.6 || ends / lines.length >= 0.5);
}

function split(raw) {
  // the app's section headers ("SECTION 2" + the line under it) sit between scripts - drop both
  const all = String(raw || '').replace(/\r\n?/g, '\n').replace(/ /g, ' ').split('\n').map((l) => l.replace(/\s+$/, ''));
  const lines = [];
  for (let i = 0; i < all.length; i++) {
    if (SECTION_LINE.test(all[i])) { if (all[i + 1] && all[i + 1].trim() && words(all[i + 1]) <= 8) i++; continue; }
    lines.push(all[i]);
  }
  const nonEmpty = lines.map((l) => l.trim()).filter(Boolean);
  if (!nonEmpty.length) return [];
  const whole = () => [scriptItem('', nonEmpty)];

  // 1) "---" dividers between scripts
  if (lines.some((l) => DIVIDER.test(l))) {
    const groups = [[]];
    for (const l of lines) { if (DIVIDER.test(l)) groups.push([]); else groups[groups.length - 1].push(l.trim()); }
    const items = groups.map((g) => g.filter(Boolean)).filter((g) => g.length).map((g) => {
      const h = headingOf(g[0]) || (g.length > 1 && titleish(g[0]) ? { title: g[0] } : null);
      return h ? scriptItem(h.title, g.slice(1)) : scriptItem('', g);
    });
    if (items.length >= 2) return items;
  }

  // 2) numbered or marked titles with a script under each one
  const heads = [];
  nonEmpty.forEach((l, i) => { const h = headingOf(l); if (h) heads.push({ i, ...h }); });
  if (heads.length >= 2) {
    let use = heads;
    const numbered = heads.filter((h) => h.no !== null);
    if (numbered.length >= 2) {
      const seq = [];
      for (const h of numbered) if (!seq.length || h.no > seq[seq.length - 1].no) seq.push(h);
      use = seq.length >= 2 ? seq : numbered;
    }
    const bodies = use.map((h, k) => nonEmpty.slice(h.i + 1, k + 1 < use.length ? use[k + 1].i : nonEmpty.length));
    const withBody = bodies.filter((b) => b.filter((l) => !KEYWORD_LINE.test(l) && !META_LINE.test(l)).length >= 1 && words(b.join(' ')) >= 25).length;
    if (withBody >= Math.max(1, Math.ceil(use.length / 2))) {
      const items = use.map((h, k) => scriptItem(h.title, bodies[k]));
      const before = nonEmpty.slice(0, use[0].i);
      if (words(before.join(' ')) >= 40) items.unshift(scriptItem('', before));
      return items;
    }
  }

  // 3) blank lines between scripts
  const blocks = [];
  let cur = [];
  for (const l of lines) { if (l.trim()) cur.push(l.trim()); else if (cur.length) { blocks.push(cur); cur = []; } }
  if (cur.length) blocks.push(cur);
  // two or more blank lines in a row are the clearest break; when they're there, single blank lines are paragraphs
  const big = lines.join('\n').split(/\n[ \t]*\n(?:[ \t]*\n)+/).map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean)).filter((p) => p.length);
  if (big.length >= 2 && big.length < blocks.length && big.every((p) => words(p.join(' ')) >= 15)) {
    return big.map((p) => {
      const h = p.length > 1 && (headingOf(p[0]) || (titleish(p[0]) ? { title: p[0] } : null));
      return h ? scriptItem(h.title, p.slice(1)) : scriptItem('', p);
    });
  }
  if (blocks.length >= 2 && blocks.some((bl) => bl.length >= 3 || words(bl.join(' ')) >= 30)) {
    const merged = [];
    for (let k = 0; k < blocks.length; k++) {
      const bl = blocks[k];
      if (bl.length === 1 && titleish(bl[0]) && blocks[k + 1] && (blocks[k + 1].length >= 2 || words(blocks[k + 1].join(' ')) >= 25)) { merged.push({ title: bl[0], body: blocks[k + 1] }); k++; continue; }
      merged.push({ title: '', body: bl });
    }
    // when scripts end on a comment-keyword line, paragraphs between those endings belong together
    const ctaEnds = merged.filter((m) => m.body.slice(-2).some((l) => CTA_END.test(l))).length;
    let groups = merged;
    if (ctaEnds >= 2 && ctaEnds < merged.length) {
      groups = [];
      let acc = null;
      for (const m of merged) {
        if (!acc) acc = { title: m.title, body: [...m.body] }; else acc.body.push(...(m.title ? [m.title] : []), ...m.body);
        if (m.body.slice(-2).some((l) => CTA_END.test(l))) { groups.push(acc); acc = null; }
      }
      if (acc) groups.push(acc);
    }
    return groups.map((g) => {
      if (g.title) return scriptItem(g.title, g.body);
      const h = g.body.length > 1 && (headingOf(g.body[0]) || (titleish(g.body[0]) ? { title: g.body[0] } : null));
      return h ? scriptItem(h.title, g.body.slice(1)) : scriptItem('', g.body);
    });
  }

  // 4) no markers: titles sitting between scripts, or scripts that each end on a comment-keyword line
  if (scriptLike(nonEmpty)) {
    const tIdx = nonEmpty.map((l, i) => (titleish(l) && i + 1 < nonEmpty.length && words(nonEmpty[i + 1]) >= 6 ? i : -1)).filter((i) => i >= 0);
    if (tIdx.length >= 2) {
      const items = tIdx.map((i, k) => scriptItem(nonEmpty[i], nonEmpty.slice(i + 1, tIdx[k + 1] ?? nonEmpty.length)));
      if (items.every((x) => words(x.text) >= 25)) return items;
    }
    const ends = nonEmpty.map((l, i) => (CTA_END.test(l) ? i : -1)).filter((i) => i >= 0);
    if (ends.length >= 2 && ends[ends.length - 1] >= nonEmpty.length - 2) {
      const items = []; let from = 0;
      for (const e of ends) { items.push(scriptItem('', nonEmpty.slice(from, e + 1))); from = e + 1; }
      if (from < nonEmpty.length && words(nonEmpty.slice(from).join(' ')) >= 25) items.push(scriptItem('', nonEmpty.slice(from)));
      if (items.every((x) => words(x.text) >= 40)) return items;
    }
  }
  return whole();
}

/** [{ name, text }] - empty scripts and exact repeats left out. */
export function splitScripts(raw) {
  const seen = new Set(), out = [];
  for (const it of split(raw)) {
    if (!it.text.trim()) continue;
    const k = it.text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 300);
    if (seen.has(k)) continue;
    seen.add(k); out.push(it);
  }
  return out;
}
