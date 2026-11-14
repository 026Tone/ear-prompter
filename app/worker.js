// Ear Prompter voice worker: runs the voice core off the page so the screen stays smooth.
import { handle, setPost } from './core.js';
setPost((m, t) => self.postMessage(m, t || []));
self.onmessage = (ev) => { handle(ev.data); };
self.postMessage({ type: 'hello' });
