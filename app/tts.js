var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/types.ts
var DEFAULT_CONFIG = {
  symbols: Array.from("$;:,.!?\xA1\xBF\u2014\u2026\u201C\xAB\xBB\u201D\u201E ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u0251\u0250\u0252\xE6\u0253\u0299\u03B2\u0254\u0255\xE7\u0257\u0256\xF0\u02A4\u0259\u0258\u025A\u025B\u025C\u025D\u025E\u025F\u0284\u0261\u0260\u0262\u029B\u0266\u0267\u0127\u0265\u029C\u0268\u026A\u029D\u026D\u026C\u026B\u026E\u029F\u0271\u026F\u0270\u014B\u0273\u0272\u0274\xF8\u0275\u0278\u03B8\u0153\u0276\u0298\u0279\u027A\u027E\u027B\u0280\u0281\u027D\u0282\u0283\u0288\u02A7\u0289\u028A\u028B\u2C71\u028C\u0263\u0264\u028D\u03C7\u028E\u028F\u0291\u0290\u0292\u0294\u02A1\u0295\u02A2\u01C0\u01C1\u01C2\u01C3\u02C8\u02CC\u02D0\u02D1\u02BC\u02B4\u02B0\u02B1\u02B2\u02B7\u02E0\u02E4\u02DE\u2193\u2191\u2192\u2197\u2198'\u0329'\u1D7B"),
  voiceAliases: {
    "Bella": "expr-voice-2-f",
    "Jasper": "expr-voice-2-m",
    "Luna": "expr-voice-3-f",
    "Bruno": "expr-voice-3-m",
    "Rosie": "expr-voice-4-f",
    "Hugo": "expr-voice-4-m",
    "Kiki": "expr-voice-5-f",
    "Leo": "expr-voice-5-m"
  },
  sampleRate: 24e3
};

// src/espeak-rules.ts
var PHONEME_TO_IPA = {
  // Vowels
  "a": "\xE6",
  "a#": "\u0250",
  "A:": "\u0251\u02D0",
  "A@": "\u0251\u02D0\u0279",
  // espeak A@ = /ɑːɹ/
  "aa": "\u0251\u02D0",
  "a:": "\u0251\u02D0",
  "ai": "a\u026A",
  "aI": "a\u026A",
  "aU": "a\u028A",
  "au": "a\u028A",
  "e": "\u025B",
  "E": "\u025B",
  "E2": "\u025B",
  "e#": "\u025B",
  "eI": "e\u026A",
  "e@": "\u025B\u0279",
  "i": "\u026A",
  "i:": "i\u02D0",
  "I": "\u026A",
  "I2": "\u026A",
  "I#": "\u026A",
  "0": "\u0252",
  "0#": "\u0252",
  "oU": "o\u028A",
  "O:": "\u0254\u02D0",
  "O@": "\u0254\u02D0\u0279",
  "O2": "\u0252",
  "OI": "\u0254\u026A",
  "u:": "u\u02D0",
  "U": "\u028A",
  "V": "\u028C",
  "VR": "\u025C\u02D0\u0279",
  "3:": "\u025C\u02D0",
  "3": "\u025C",
  "@": "\u0259",
  "@2": "\u0259",
  "@5": "\u0259",
  "@L": "\u0259l",
  "@-": "\u0259",
  // Diphthongs (already covered above, but be explicit)
  // Consonants
  "b": "b",
  "d": "d",
  "f": "f",
  "g": "\u0261",
  "h": "h",
  "j": "j",
  "k": "k",
  "l": "l",
  "L": "l",
  "m": "m",
  "n": "n",
  "N": "\u014B",
  "p": "p",
  "r": "\u0279",
  "R": "\u0279",
  "s": "s",
  "S": "\u0283",
  "t": "t",
  "t2": "t",
  "T": "\u03B8",
  "D": "\xF0",
  "v": "v",
  "w": "w",
  "x": "x",
  "z": "z",
  "Z": "\u0292",
  "dZ": "d\u0292",
  "tS": "t\u0283",
  "?": "\u0294",
  // Stress / prosody
  "'": "\u02C8",
  ",": "\u02CC",
  "%": "",
  // unstressed marker — omit
  ":": "\u02D0",
  "=": "",
  // syllable boundary marker — omit
  "#": "",
  // unused/variant marker — omit
  "-": "",
  // morpheme boundary — omit
  "|": "",
  // tie marker — omit
  "_": " ",
  // word boundary in phonemes
  // Clusters
  "IR": "\u026A\u0279",
  "th": "t\u03B8",
  // rarely used
  "n-": "n",
  "z#": "z",
  "z/2": "z"
};
var PHONEME_KEYS_SORTED = Object.keys(PHONEME_TO_IPA).sort((a, b) => b.length - a.length);
function espeakToIPA(espeak) {
  let result = "";
  let i = 0;
  while (i < espeak.length) {
    let matched = false;
    for (const key of PHONEME_KEYS_SORTED) {
      if (espeak.startsWith(key, i)) {
        result += PHONEME_TO_IPA[key];
        i += key.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      i++;
    }
  }
  return result;
}
var LETTER_GROUPS = {};
var RULE_GROUPS = /* @__PURE__ */ new Map();
var VOWELS = new Set("aeiouy\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF2\xF3\xF4\xF5\xF6\xF9\xFA\xFB\xFC\xFD".split(""));
var CONSONANTS = new Set("bcdfghjklmnpqrstvwxz".split(""));
function isVowel(ch) {
  return VOWELS.has(ch.toLowerCase());
}
function isConsonant(ch) {
  return CONSONANTS.has(ch.toLowerCase());
}
function isLetter(ch) {
  return /[a-zA-Zàáâãäåæèéêëìíîïòóôõöùúûüýÿ]/u.test(ch);
}
var VOICED_CONSONANTS = new Set("bdgjlmnrvwz".split(""));
function matchPost(cond, text, pos) {
  let ci = 0;
  let ti = pos;
  while (ci < cond.length) {
    const cc = cond[ci];
    if (cc === "?" || cc === "@" || cc === "$") {
      return ti - pos;
    }
    if (cc === "+") {
      if (ti < text.length && isLetter(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "_") {
      if (ti >= text.length || !isLetter(text[ti])) {
        ci++;
        continue;
      }
      return -1;
    }
    if (cc === "#") {
      if (ti >= text.length || !isLetter(text[ti]) || isVowel(text[ti])) {
        ci++;
        continue;
      }
      return -1;
    }
    if (cc === "A") {
      if (ti < text.length && isVowel(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "B") {
      if (ti < text.length && VOICED_CONSONANTS.has(text[ti].toLowerCase())) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "C") {
      if (ti < text.length && isConsonant(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "D") {
      if (ti < text.length && /\d/.test(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "K") {
      if (ti >= text.length || !isVowel(text[ti])) {
        ci++;
        if (ti < text.length && isLetter(text[ti])) ti++;
        continue;
      }
      return -1;
    }
    if (cc === "N") {
      if (ti < text.length && "mn".includes(text[ti].toLowerCase())) {
        ci++;
        ti++;
        continue;
      }
      if (ti + 1 < text.length && text[ti].toLowerCase() === "n" && text[ti + 1].toLowerCase() === "g") {
        ci++;
        ti += 2;
        continue;
      }
      return -1;
    }
    if (cc === "X") {
      if (ti < text.length && isLetter(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      return -1;
    }
    if (cc === "Y") {
      if (ti < text.length && isConsonant(text[ti])) {
        ci++;
        ti++;
        continue;
      }
      if (ti >= text.length) {
        ci++;
        continue;
      }
      return -1;
    }
    if (cc === "L" && ci + 2 < cond.length && /\d/.test(cond[ci + 1]) && /\d/.test(cond[ci + 2])) {
      const groupId = cond[ci + 1] + cond[ci + 2];
      const group = LETTER_GROUPS[groupId];
      ci += 3;
      if (group) {
        let found = false;
        for (const entry of group) {
          if (text.substring(ti, ti + entry.length).toLowerCase() === entry) {
            ti += entry.length;
            found = true;
            break;
          }
        }
        if (!found) return -1;
      }
      continue;
    }
    if (ti < text.length && text[ti].toLowerCase() === cc.toLowerCase()) {
      ci++;
      ti++;
      continue;
    }
    return -1;
  }
  return ti - pos;
}
function matchPre(cond, text, pos) {
  let ci = cond.length - 1;
  let ti = pos - 1;
  while (ci >= 0) {
    const cc = cond[ci];
    if (cc === "?" || cc === "@" || cc === "$") {
      return pos - ti - 1;
    }
    if (cc === "_") {
      if (ti < 0 || !isLetter(text[ti])) {
        ci--;
        continue;
      }
      return -1;
    }
    if (cc === "#") {
      if (ti < 0 || !isLetter(text[ti]) || isVowel(text[ti])) {
        ci--;
        continue;
      }
      return -1;
    }
    if (cc === "&" || cc === "@") {
      if (ti >= 0 && isLetter(text[ti])) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (cc === "A") {
      if (ti >= 0 && isVowel(text[ti])) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (cc === "B") {
      if (ti >= 0 && VOICED_CONSONANTS.has(text[ti].toLowerCase())) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (cc === "C") {
      if (ti >= 0 && isConsonant(text[ti])) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (cc === "D") {
      if (ti >= 0 && /\d/.test(text[ti])) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (cc === "K") {
      if (ti < 0 || !isVowel(text[ti])) {
        ci--;
        if (ti >= 0 && isLetter(text[ti])) ti--;
        continue;
      }
      return -1;
    }
    if (cc === "X") {
      if (ti >= 0 && isLetter(text[ti])) {
        ci--;
        ti--;
        continue;
      }
      return -1;
    }
    if (/\d/.test(cc) && ci >= 2 && /\d/.test(cond[ci - 1]) && cond[ci - 2] === "L") {
      const groupId = cond[ci - 1] + cc;
      const group = LETTER_GROUPS[groupId];
      ci -= 3;
      if (group) {
        let found = false;
        for (const entry of group) {
          const start = ti - entry.length + 1;
          if (start >= 0 && text.substring(start, ti + 1).toLowerCase() === entry) {
            ti = start - 1;
            found = true;
            break;
          }
        }
        if (!found) return -1;
      }
      continue;
    }
    if (ti >= 0 && text[ti].toLowerCase() === cc.toLowerCase()) {
      ci--;
      ti--;
      continue;
    }
    return -1;
  }
  return pos - ti - 1;
}
function parseRules(rulesText) {
  RULE_GROUPS.clear();
  for (const k of Object.keys(LETTER_GROUPS)) delete LETTER_GROUPS[k];
  const lines = rulesText.split("\n");
  let currentGroup = "";
  let inReplace = false;
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    let line = lines[lineNum];
    const commentIdx = line.indexOf("//");
    if (commentIdx >= 0) {
      line = line.substring(0, commentIdx);
    }
    line = line.trimEnd();
    if (!line.trim()) continue;
    const groupMatch = line.match(/^\.L(\d+)\s+(.*)/);
    if (groupMatch) {
      const groupId = groupMatch[1];
      const entries = groupMatch[2].trim().split(/\s+/);
      LETTER_GROUPS[groupId] = new Set(entries.map((e) => e.toLowerCase()));
      continue;
    }
    if (line.trim() === ".replace") {
      inReplace = true;
      continue;
    }
    if (line.trim().startsWith(".group")) {
      inReplace = false;
      currentGroup = line.trim().substring(7).trim();
      if (!RULE_GROUPS.has(currentGroup)) {
        RULE_GROUPS.set(currentGroup, []);
      }
      continue;
    }
    if (inReplace) continue;
    if (!currentGroup && !RULE_GROUPS.has("")) continue;
    const rule = parseRuleLine(line.trim());
    if (rule) {
      const group = currentGroup;
      if (!RULE_GROUPS.has(group)) {
        RULE_GROUPS.set(group, []);
      }
      RULE_GROUPS.get(group).push(rule);
    }
  }
}
function parseRuleLine(line) {
  if (!line) return null;
  let conditionNum = 0;
  let conditionNeg = false;
  let idx = 0;
  while (idx < line.length && (line[idx] === " " || line[idx] === "	")) idx++;
  if (line[idx] === "?" || line[idx] === "!") {
    if (line[idx] === "!" && line[idx + 1] === "?") {
      conditionNeg = true;
      idx += 2;
    } else if (line[idx] === "?" && line[idx + 1] === "!") {
      conditionNeg = true;
      idx += 2;
    } else if (line[idx] === "?") {
      idx++;
    }
    let numStr = "";
    while (idx < line.length && /\d/.test(line[idx])) {
      numStr += line[idx];
      idx++;
    }
    conditionNum = parseInt(numStr, 10) || 0;
  }
  while (idx < line.length && (line[idx] === " " || line[idx] === "	")) idx++;
  const rest = line.substring(idx);
  if (!rest) return null;
  let pre = "";
  let pattern = "";
  let post = "";
  let phonemes = "";
  const parenClose = rest.indexOf(")");
  const parenOpen = rest.indexOf("(");
  let patternStart = 0;
  if (parenClose >= 0) {
    pre = rest.substring(0, parenClose).trim();
    patternStart = parenClose + 1;
  }
  while (patternStart < rest.length && rest[patternStart] === " ") patternStart++;
  if (parenOpen >= 0 && parenOpen > parenClose) {
    pattern = rest.substring(patternStart, parenOpen).trim();
    let postEnd = parenOpen + 1;
    while (postEnd < rest.length && rest[postEnd] !== " " && rest[postEnd] !== "	") {
      postEnd++;
    }
    post = rest.substring(parenOpen + 1, postEnd);
    phonemes = rest.substring(postEnd).trim();
  } else {
    let patternEnd = patternStart;
    while (patternEnd < rest.length && rest[patternEnd] !== " " && rest[patternEnd] !== "	") {
      patternEnd++;
    }
    pattern = rest.substring(patternStart, patternEnd).trim();
    phonemes = rest.substring(patternEnd).trim();
  }
  if (!pattern) return null;
  return { pattern, pre, post, phonemes, conditionNum, conditionNeg };
}
function applyRulesToWord(word) {
  const lower = word.toLowerCase();
  let result = "";
  let i = 0;
  while (i < lower.length) {
    let bestRule = null;
    let bestPatternLen = 0;
    let bestScore = -1;
    const groupKeys = [];
    for (let len = Math.min(4, lower.length - i); len >= 1; len--) {
      const key = lower.substring(i, i + len);
      if (RULE_GROUPS.has(key)) {
        groupKeys.push(key);
      }
    }
    const singleKey = lower[i];
    if (!groupKeys.includes(singleKey) && RULE_GROUPS.has(singleKey)) {
      groupKeys.push(singleKey);
    }
    for (const groupKey of groupKeys) {
      const rules = RULE_GROUPS.get(groupKey);
      if (!rules) continue;
      for (const rule of rules) {
        if (rule.conditionNum > 0) continue;
        const patternLower = rule.pattern.toLowerCase();
        if (!lower.startsWith(patternLower, i)) continue;
        const patternEnd = i + patternLower.length;
        if (rule.pre) {
          const preMatch = matchPre(rule.pre, lower, i);
          if (preMatch < 0) continue;
        }
        if (rule.post) {
          const postMatch = matchPost(rule.post, lower, patternEnd);
          if (postMatch < 0) continue;
        }
        const score = patternLower.length * 100 + rule.pre.length * 10 + rule.post.length;
        if (score > bestScore) {
          bestScore = score;
          bestRule = rule;
          bestPatternLen = patternLower.length;
        }
      }
    }
    const defaultRules = RULE_GROUPS.get("");
    if (defaultRules) {
      for (const rule of defaultRules) {
        if (rule.conditionNum > 0) continue;
        const patternLower = rule.pattern.toLowerCase();
        if (!lower.startsWith(patternLower, i)) continue;
        const patternEnd = i + patternLower.length;
        if (rule.pre) {
          const preMatch = matchPre(rule.pre, lower, i);
          if (preMatch < 0) continue;
        }
        if (rule.post) {
          const postMatch = matchPost(rule.post, lower, patternEnd);
          if (postMatch < 0) continue;
        }
        const score = patternLower.length * 100 + rule.pre.length * 10 + rule.post.length;
        if (score > bestScore) {
          bestScore = score;
          bestRule = rule;
          bestPatternLen = patternLower.length;
        }
      }
    }
    if (bestRule) {
      result += bestRule.phonemes;
      i += bestPatternLen;
    } else {
      i++;
    }
  }
  return result;
}
function wordToIPA(word) {
  const espeak = applyRulesToWord(word);
  return espeakToIPA(espeak);
}
var _rulesLoaded = false;
var _rulesText = null;
function initRules(rulesText) {
  _rulesText = rulesText;
  parseRules(rulesText);
  _rulesLoaded = true;
}
function isRulesLoaded() {
  return _rulesLoaded;
}

// src/phonemize.ts
var symbolToIndex = /* @__PURE__ */ new Map();
DEFAULT_CONFIG.symbols.forEach((s, i) => symbolToIndex.set(s, i));
function phonemesToInputIds(phonemes) {
  const tokens = phonemes.match(/[\p{L}\p{N}_]+|[^\p{L}\p{N}_\s]/gu) || [];
  const joined = tokens.join(" ");
  const ids = [0];
  for (const char of joined) {
    const idx = symbolToIndex.get(char);
    if (idx !== void 0) {
      ids.push(idx);
    }
  }
  ids.push(0);
  return ids;
}
var FUNCTION_WORD_CONNECTED = {
  "a": "\u0250",
  "an": "\u0250n",
  "the": "\xF0\u0259",
  "to": "t\u0259",
  "of": "\u028Cv",
  "in": "\u026An",
  "on": "\u0254n",
  "at": "\xE6t",
  "by": "ba\u026A",
  "for": "f\u0254\u02D0\u0279",
  "or": "\u0254\u02D0\u0279",
  "and": "\xE6nd",
  "but": "b\u028Ct",
  "that": "\xF0\xE6t",
  "this": "\xF0\u026As",
  "these": "\xF0i\u02D0z",
  "those": "\xF0o\u028Az",
  "i": "a\u026A",
  "you": "ju\u02D0",
  "he": "hi\u02D0",
  "she": "\u0283i\u02D0",
  "we": "wi\u02D0",
  "it": "\u026At",
  "is": "\u026Az",
  "was": "w\u028Cz",
  "are": "\u0251\u02D0\u0279",
  "were": "w\u025C\u02D0",
  "be": "bi\u02D0",
  "been": "b\u026An",
  "have": "h\xE6v",
  "has": "h\xE6z",
  "had": "h\xE6d",
  "do": "du\u02D0",
  "does": "d\u028Cz",
  "did": "d\u026Ad",
  "will": "w\u026Al",
  "would": "w\u028Ad",
  "could": "k\u028Ad",
  "should": "\u0283\u028Ad",
  "can": "k\xE6n",
  "may": "me\u026A",
  "might": "ma\u026At",
  "must": "m\u028Cst",
  "shall": "\u0283\xE6l",
  "not": "n\u02CC\u0251\u02D0t",
  "no": "n\u02C8o\u028A",
  "if": "\u026Af",
  "how": "h\u02CCa\u028A",
  "with": "w\u026A\xF0",
  "from": "f\u0279\u028Cm",
  "your": "j\u028A\u0279",
  "my": "ma\u026A",
  "his": "h\u026Az",
  "her": "h\u025C\u02D0",
  "its": "\u026Ats",
  "our": "a\u028A\u025A",
  "their": "\xF0\u025B\u0279",
  "some": "s\u02CC\u028Cm",
  "new": "n\u02C8u\u02D0",
  "all": "\u02C8\u0254\u02D0l"
};
var dictMap = null;
function initPhonemizer(dictText, rulesText) {
  const map = /* @__PURE__ */ new Map();
  for (const line of dictText.split("\n")) {
    if (!line) continue;
    const tab = line.indexOf("	");
    if (tab < 0) continue;
    map.set(line.substring(0, tab), line.substring(tab + 1));
  }
  dictMap = map;
  if (rulesText && !isRulesLoaded()) initRules(rulesText);
  return map.size;
}
async function loadDictionary() {
  if (!dictMap) throw new Error("Pronunciation dictionary not loaded");
  return dictMap;
}
async function ensureRulesLoaded() {
}
function phonemizerReady() {
  return !!dictMap;
}
async function textToPhonemesDictRules(text) {
  const [dict] = await Promise.all([loadDictionary(), ensureRulesLoaded()]);
  const normalized = text.trim();
  if (!normalized) return "";
  const rawTokens = normalized.match(/\S+/g) || [];
  const cleanWords = [];
  const trailingPuncts = [];
  const leadingPuncts = [];
  for (const token of rawTokens) {
    let word = token;
    let trailing = "";
    while (word.length > 0 && /[;:,.!?¡¿—…""«»""]/.test(word[word.length - 1])) {
      trailing = word[word.length - 1] + trailing;
      word = word.slice(0, -1);
    }
    let leading = "";
    while (word.length > 0 && /[;:,.!?¡¿—…""«»""]/.test(word[0])) {
      leading += word[0];
      word = word.slice(1);
    }
    cleanWords.push(word);
    trailingPuncts.push(trailing);
    leadingPuncts.push(leading);
  }
  const outputParts = [];
  const wordCount = cleanWords.filter((w) => w.length > 0).length;
  for (let i = 0; i < cleanWords.length; i++) {
    let part = "";
    if (leadingPuncts[i]) part += leadingPuncts[i];
    if (cleanWords[i].length > 0) {
      const lower = cleanWords[i].toLowerCase();
      if (wordCount > 1 && lower in FUNCTION_WORD_CONNECTED) {
        part += FUNCTION_WORD_CONNECTED[lower];
      } else {
        part += lookupWord(lower, dict, cleanWords[i]);
      }
    }
    if (trailingPuncts[i]) part += trailingPuncts[i];
    if (part) outputParts.push(part);
  }
  return outputParts.join(" ");
}
function lookupWord(word, dict, originalWord) {
  if (dict.has(word)) return dict.get(word);
  if (CONTRACTIONS[word]) return CONTRACTIONS[word];
  if (word.endsWith("n't")) {
    const b = word.slice(0, -3);
    if (dict.has(b)) return dict.get(b).replace(/[ː]$/, "") + "\u0259nt";
  }
  for (const [suf, ipa] of [["'ll", "l"], ["'ve", "v"], ["'re", "\u0279"], ["'d", "d"], ["'m", "m"]]) {
    if (word.endsWith(suf)) {
      const b = word.slice(0, -suf.length);
      if (dict.has(b)) return dict.get(b) + ipa;
    }
  }
  if (word.endsWith("'s") || word.endsWith("s'")) {
    const base = word.slice(0, -2);
    const b = base && (dict.has(base) ? dict.get(base) : word.endsWith("s'") ? lookupWord(base + "s", dict) : lookupWord(base, dict));
    if (b) return word.endsWith("s'") ? b : plural(b);
  }
  if (word.endsWith("s") && word.length > 2 && !word.endsWith("ss")) {
    if (word.endsWith("ies") && word.length > 4 && dict.has(word.slice(0, -3) + "y")) return plural(dict.get(word.slice(0, -3) + "y"));
    if (word.endsWith("es") && dict.has(word.slice(0, -2)) && /(s|x|z|ch|sh)$/.test(word.slice(0, -2))) return plural(dict.get(word.slice(0, -2)));
    if (dict.has(word.slice(0, -1))) return plural(dict.get(word.slice(0, -1)));
  }
  if (word.endsWith("ed") && word.length > 3) {
    const cands = [word.slice(0, -2), word.slice(0, -1)];
    if (word.endsWith("ied")) cands.unshift(word.slice(0, -3) + "y");
    const b2 = word.slice(0, -3);
    if (b2.length > 1 && word[word.length - 3] === word[word.length - 4]) cands.push(b2);
    for (const c of cands) if (c.length > 1 && dict.has(c)) return past(dict.get(c));
  }
  if (word.endsWith("ing") && word.length > 4) {
    const base = word.slice(0, -3);
    if (dict.has(base)) return dict.get(base) + "\u026A\u014B";
    if (dict.has(base + "e")) return dict.get(base + "e").replace(/[ə]$/, "") + "\u026A\u014B";
    if (base.length > 1 && base[base.length - 1] === base[base.length - 2]) {
      const dedup = base.slice(0, -1);
      if (dict.has(dedup)) return dict.get(dedup) + "\u026A\u014B";
    }
  }
  if (word.endsWith("ly") && word.length > 3) {
    const base = word.slice(0, -2);
    if (dict.has(base)) return dict.get(base) + "li";
  }
  if (word.endsWith("er") && word.length > 3) {
    const base = word.slice(0, -2);
    if (dict.has(base)) return dict.get(base) + "\u025A";
    if (dict.has(base + "e")) return dict.get(base + "e").replace(/[ə]$/, "") + "\u025A";
  }
  if (word.endsWith("est") && word.length > 4) {
    const base = word.slice(0, -3);
    if (dict.has(base)) return dict.get(base) + "\u026Ast";
  }
  if (word.endsWith("ness") && word.length > 5) {
    const base = word.slice(0, -4);
    if (dict.has(base)) return dict.get(base) + "n\u0259s";
  }
  if (word.includes("-")) {
    const parts = word.split("-");
    const phonemeParts = parts.map((p) => {
      if (p in FUNCTION_WORD_CONNECTED) return FUNCTION_WORD_CONNECTED[p];
      return lookupWord(p, dict);
    });
    return phonemeParts.join("");
  }
  const orig = originalWord || word;
  if (orig.length >= 2 && orig === orig.toUpperCase() && /^[A-Z]+$/.test(orig)) {
    const spelled = word.split("").map((c) => LETTER_NAMES[c] || c).join("");
    if (spelled !== word) return spelled;
  }
  const compound = trySplitCompound(word, dict);
  if (compound) return compound;
  if (isRulesLoaded()) {
    return wordToIPA(word);
  }
  return letterFallback(word);
}
function bare(ipa) {
  return ipa.replace(/[ˈˌːˑ]+$/g, "").replace(/[ˈˌ]/g, "");
}
function plural(ipa) {
  const b = bare(ipa);
  if (/(s|z|ʃ|ʒ|tʃ|dʒ|ʧ|ʤ)$/.test(b)) return ipa + "\u026Az";
  if (/[ptkfθ]$/.test(b)) return ipa + "s";
  return ipa + "z";
}
function past(ipa) {
  const b = bare(ipa).replace(/ə$/, "");
  if (/[td]$/.test(b)) return ipa + "\u026Ad";
  if (/(p|k|f|θ|s|ʃ|tʃ|ʧ)$/.test(b)) return ipa + "t";
  return ipa + "d";
}
var CONTRACTIONS = {
  "don't": "d\u02C8o\u028Ant",
  "won't": "w\u02C8o\u028Ant",
  "can't": "k\u02C8\xE6nt",
  "ain't": "\u02C8e\u026Ant",
  "shan't": "\u0283\u02C8\xE6nt",
  "i'm": "a\u026Am",
  "i've": "a\u026Av",
  "i'll": "a\u026Al",
  "i'd": "a\u026Ad",
  "you're": "j\u028A\u0279",
  "you've": "ju\u02D0v",
  "you'll": "ju\u02D0l",
  "you'd": "ju\u02D0d",
  "we're": "w\u026A\u0279",
  "we've": "wi\u02D0v",
  "we'll": "wi\u02D0l",
  "we'd": "wi\u02D0d",
  "they're": "\xF0\u025B\u0279",
  "they've": "\xF0e\u026Av",
  "they'll": "\xF0e\u026Al",
  "they'd": "\xF0e\u026Ad",
  "he's": "hi\u02D0z",
  "she's": "\u0283i\u02D0z",
  "it's": "\u026Ats",
  "that's": "\xF0\xE6ts",
  "what's": "w\u028Cts",
  "here's": "h\u02C8\u026A\u0279z",
  "there's": "\xF0\u025B\u0279z",
  "let's": "l\u02C8\u025Bts",
  "who's": "hu\u02D0z",
  "where's": "w\u02C8\u025B\u0279z",
  "how's": "h\u02C8a\u028Az",
  "when's": "w\u02C8\u025Bnz",
  "he'll": "hi\u02D0l",
  "she'll": "\u0283i\u02D0l",
  "it'll": "\u02C8\u026A\u027E\u0259l",
  "that'll": "\xF0\u02C8\xE6\u027E\u0259l",
  "he'd": "hi\u02D0d",
  "she'd": "\u0283i\u02D0d",
  "could've": "k\u02C8\u028Ad\u0259v",
  "should've": "\u0283\u02C8\u028Ad\u0259v",
  "would've": "w\u02C8\u028Ad\u0259v",
  "might've": "m\u02C8a\u026At\u0259v",
  "must've": "m\u02C8\u028Cst\u0259v",
  "y'all": "j\u02C8\u0254\u02D0l",
  "gonna": "\u0261\u02C8\u028Cn\u0259",
  "wanna": "w\u02C8\u0251\u02D0n\u0259",
  "gotta": "\u0261\u02C8\u0251\u02D0\u027E\u0259",
  "lemme": "l\u02C8\u025Bmi",
  "kinda": "k\u02C8a\u026And\u0259",
  "dunno": "d\u0259n\u02C8o\u028A",
  "'em": "\u0259m",
  "o'clock": "\u0259kl\u02C8\u0251\u02D0k",
  "doin'": "d\u02C8u\u02D0\u026An",
  "goin'": "\u0261\u02C8o\u028A\u026An",
  "nothin'": "n\u02C8\u028C\u03B8\u026An",
  "somethin'": "s\u02C8\u028Cm\u03B8\u026An",
  "fixin'": "f\u02C8\u026Aks\u026An",
  "lookin'": "l\u02C8\u028Ak\u026An",
  "talkin'": "t\u02C8\u0254\u02D0k\u026An",
  "makin'": "m\u02C8e\u026Ak\u026An",
  "iphone": "\u02C8a\u026Afo\u028An",
  "youtube": "j\u02C8u\u02D0tu\u02D0b",
  "tiktok": "t\u02C8\u026Akt\u0251\u02D0k",
  "instagram": "\u02C8\u026Anst\u0259\u0261\u0279\xE6m",
  "okay": "\u02CCo\u028Ak\u02C8e\u026A",
  "video": "v\u02C8\u026Ad\u026Ao\u028A",
  "videos": "v\u02C8\u026Ad\u026Ao\u028Az",
  "content": "k\u02C8\u0251\u02D0nt\u025Bnt",
  "creator": "k\u0279i\u02D0\u02C8e\u026A\u027E\u025A",
  "creators": "k\u0279i\u02D0\u02C8e\u026A\u027E\u025Az"
};
var LETTER_NAMES = {
  "a": "\u02C8e\u026A",
  "b": "b\u02C8i\u02D0",
  "c": "s\u02C8i\u02D0",
  "d": "d\u02C8i\u02D0",
  "e": "\u02C8i\u02D0",
  "f": "\u02C8\u025Bf",
  "g": "d\u0292\u02C8i\u02D0",
  "h": "\u02C8e\u026At\u0283",
  "i": "\u02C8a\u026A",
  "j": "d\u0292\u02C8e\u026A",
  "k": "k\u02C8e\u026A",
  "l": "\u02C8\u025Bl",
  "m": "\u02C8\u025Bm",
  "n": "\u02C8\u025Bn",
  "o": "\u02C8o\u028A",
  "p": "p\u02C8i\u02D0",
  "q": "kj\u02C8u\u02D0",
  "r": "\u02C8\u0251\u02D0\u0279",
  "s": "\u02C8\u025Bs",
  "t": "t\u02C8i\u02D0",
  "u": "j\u02C8u\u02D0",
  "v": "v\u02C8i\u02D0",
  "w": "d\u02C8\u028Cb\u0259lj\u02CCu\u02D0",
  "x": "\u02C8\u025Bks",
  "y": "w\u02C8a\u026A",
  "z": "z\u02C8i\u02D0"
};
function trySplitCompound(word, dict) {
  for (let i = word.length - 2; i >= 2; i--) {
    const prefix = word.slice(0, i);
    const suffix = word.slice(i);
    if (dict.has(prefix) && dict.has(suffix)) {
      return dict.get(prefix) + dict.get(suffix);
    }
    if (suffix.endsWith("s") && dict.has(suffix.slice(0, -1))) {
      if (dict.has(prefix)) {
        const base = dict.get(suffix.slice(0, -1));
        return dict.get(prefix) + base + "z";
      }
    }
  }
  return null;
}
var LETTER_PHONEMES = {
  "a": "\xE6",
  "b": "b",
  "c": "k",
  "d": "d",
  "e": "\u025B",
  "f": "f",
  "g": "\u0261",
  "h": "h",
  "i": "\u026A",
  "j": "d\u0292",
  "k": "k",
  "l": "l",
  "m": "m",
  "n": "n",
  "o": "\u0251\u02D0",
  "p": "p",
  "q": "k",
  "r": "\u0279",
  "s": "s",
  "t": "t",
  "u": "\u028C",
  "v": "v",
  "w": "w",
  "x": "ks",
  "y": "j",
  "z": "z"
};
function letterFallback(word) {
  return word.split("").map((c) => LETTER_PHONEMES[c] || c).join("");
}

// src/norm.ts
var ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen"
];
var TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
var BIG = [[1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]];
function intToWords(n) {
  if (!isFinite(n)) return "";
  if (n < 0) return "minus " + intToWords(-n);
  n = Math.floor(n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  if (n < 1e3) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + intToWords(n % 100) : "");
  for (const [v, name] of BIG) {
    if (n >= v) {
      const head = Math.floor(n / v), rest = n % v;
      return intToWords(head) + " " + name + (rest ? " " + intToWords(rest) : "");
    }
  }
  return String(n);
}
var ORD = {
  one: "first",
  two: "second",
  three: "third",
  five: "fifth",
  eight: "eighth",
  nine: "ninth",
  twelve: "twelfth"
};
function ordinalWords(n) {
  const w = intToWords(n);
  const m = w.match(/^(.*?)([a-z]+)$/);
  if (!m) return w;
  const [, pre, last] = m;
  if (ORD[last]) return pre + ORD[last];
  if (last.endsWith("y")) return pre + last.slice(0, -1) + "ieth";
  return pre + last + "th";
}
function yearWords(s) {
  const y = parseInt(s, 10);
  if (y < 1100 || y > 2099 || y % 1e3 < 10) return intToWords(y);
  const hi = Math.floor(y / 100), lo = y % 100;
  if (lo === 0) return intToWords(hi) + " hundred";
  if (lo < 10) return intToWords(hi) + " oh " + intToWords(lo);
  return intToWords(hi) + " " + intToWords(lo);
}
function moneyWords(sym, num, cents, mult) {
  const unit = sym === "\xA3" ? "pound" : sym === "\u20AC" ? "euro" : "dollar";
  const n = parseInt(num.replace(/,/g, ""), 10);
  const m = (mult || "").toLowerCase();
  const multWord = m === "k" ? " thousand" : m === "m" ? " million" : m === "b" ? " billion" : "";
  if (multWord) return intToWords(n) + multWord + " " + unit + "s";
  let out = intToWords(n) + " " + unit + (n === 1 ? "" : "s");
  if (cents) {
    const c = parseInt(cents.padEnd(2, "0").slice(0, 2), 10);
    if (c) out += " and " + intToWords(c) + (sym === "\xA3" ? c === 1 ? " penny" : " pence" : c === 1 ? " cent" : " cents");
  }
  return out;
}
var WORDS = [
  [/\biPhones\b/g, "eye phones"],
  [/\biPhone\b/g, "eye phone"],
  [/\biPads?\b/g, "eye pad"],
  [/\biMacs?\b/g, "eye mac"],
  [/\biOS\b/g, "eye O S"],
  [/\bmacOS\b/gi, "mac O S"],
  [/\bYouTube(rs?)?\b/g, "You Tube$1"],
  [/\bTikTok(s)?\b/gi, "Tik Tok$1"],
  [/\bChatGPT\b/gi, "Chat G P T"],
  [/\bManyChat\b/gi, "Many Chat"],
  [/\bCapCut\b/gi, "Cap Cut"],
  [/\bLinkedIn\b/gi, "Linked In"],
  [/\bInstagram\b/gi, "Instagram"],
  [/\bFinal Cut Pro\b/g, "Final Cut Pro"],
  [/\bAirPods?\b/g, "Air Pods"],
  [/\bDMs\b/g, "D Ms"],
  [/\bDM'?d\b/g, "D Emd"],
  [/\bOK\b/g, "okay"],
  [/\bok\b/g, "okay"],
  [/(\d)\s?fps\b/gi, "$1 F P S"],
  [/\bfps\b/gi, "F P S"],
  [/\b[Vv]s\.?(?=\s)/g, "versus"],
  [/\bw\/(?=\s)/g, "with"],
  [/\be\.g\.(?=\s|$)/gi, "for example"],
  [/\bi\.e\.(?=\s|$)/gi, "that is"],
  [/\betc\.(?=\s|$)/gi, "etcetera"],
  [/\bDr\.(?= [A-Z])/g, "Doctor"],
  [/\bMr\.(?= [A-Z])/g, "Mister"],
  [/\bMrs\.(?= [A-Z])/g, "Missus"],
  [/\bMs\.(?= [A-Z])/g, "Miz"],
  [/\bSt\.(?= [A-Z])/g, "Saint"]
];
function speakable(input) {
  let t = " " + input + " ";
  t = t.replace(/[‘’ʼ`]/g, "'").replace(/[“”«»]/g, '"');
  t = t.replace(/\p{Extended_Pictographic}|️|‍/gu, " ");
  t = t.replace(/https?:\/\/\S+/g, " link ");
  t = t.replace(/\b([A-Za-z][\w-]*)\.(com|net|org|io|ai|co|tv|app)\b/gi, (_, a, b) => a + " dot " + b);
  for (const [re, w] of WORDS) t = t.replace(re, w);
  t = t.replace(/\b([A-Z][a-z]+)((?:[A-Z][a-z]+)+)\b/g, (m) => m.replace(/([a-z])([A-Z])/g, "$1 $2"));
  t = t.replace(/#(\w)/g, "$1").replace(/@(\w)/g, "at $1");
  t = t.replace(/(\d),(\d{3})/g, "$1$2").replace(/(\d),(\d{3})/g, "$1$2");
  t = t.replace(/([$£€])\s?(\d+)(?:\.(\d{1,2}))?(?:\s?([kKmMbB])\b)?/g, (_, s, n, c, m) => moneyWords(s, n, c, m));
  t = t.replace(/(\d+(?:\.\d+)?)\s?%/g, "$1 percent");
  t = t.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (_, n) => ordinalWords(parseInt(n, 10)));
  t = t.replace(/\b(\d+)\s?[kK]\b(?=\s+(?:video|footage|resolution|camera|at|or|and|\d))/g, "$1 K");
  t = t.replace(/\b4[kK]\b/g, "four K").replace(/\b8[kK]\b/g, "eight K");
  t = t.replace(/\b(\d+)[kK]\b/g, (_, n) => intToWords(parseInt(n, 10)) + " thousand");
  t = t.replace(/\b(\d+)\s?[mM]\b(?=\s+(?:followers|views|people|dollars|subscribers))/g, (_, n) => intToWords(parseInt(n, 10)) + " million");
  t = t.replace(/\b(\d+)p\b/g, "$1 P");
  t = t.replace(/\b(\d+)x\b/gi, (_, n) => intToWords(parseInt(n, 10)) + " times");
  t = t.replace(/\b(\d{1,2}):(\d\d)\s?(am|pm|a\.m\.|p\.m\.)?/gi, (_, h, m, ap) => {
    const hh = intToWords(parseInt(h, 10));
    const mm = parseInt(m, 10);
    const tail = ap ? " " + ap.replace(/\./g, "").toUpperCase().split("").join(" ") : "";
    return (mm === 0 ? hh + (ap ? "" : " o'clock") : hh + " " + (mm < 10 ? "oh " + intToWords(mm) : intToWords(mm))) + tail;
  });
  t = t.replace(/\b(\d+)\s?(am|pm)\b/gi, (_, h, ap) => intToWords(parseInt(h, 10)) + " " + ap.toUpperCase().split("").join(" "));
  t = t.replace(/\b(\d+)\s?[-–]\s?(\d+)\b/g, "$1 to $2");
  t = t.replace(/\b(\d+)\.(\d+)\b/g, (_, a, b) => intToWords(parseInt(a, 10)) + " point " + b.split("").map((d) => ONES[+d]).join(" "));
  t = t.replace(/\b(1[1-9]\d\d|20\d\d)s\b/g, (_, y) => yearWords(y).replace(/y$/, "ie") + "s");
  t = t.replace(/\b(1[1-9]\d\d|20\d\d)\b/g, (y) => yearWords(y));
  t = t.replace(/\b(\d+)s\b/g, (_, n) => intToWords(parseInt(n, 10)).replace(/y$/, "ie") + "s");
  t = t.replace(/\d+/g, (n) => " " + intToWords(parseInt(n, 10)) + " ");
  t = t.replace(/&/g, " and ").replace(/\+/g, " plus ").replace(/=/g, " equals ").replace(/(\w)\/(\w)/g, "$1 or $2");
  t = t.replace(/\s[-–—]+\s|—|–/g, ", ").replace(/[()[\]{}]/g, ", ").replace(/\*|_|~|\^|\|/g, " ");
  t = t.replace(/\.{3,}/g, "\u2026").replace(/"/g, " ");
  t = t.replace(/\s+([,.!?;:…])/g, "$1").replace(/([,;:])(?:\s*[,;:])+/g, "$1");
  t = t.replace(/^[\s,;:]+/, "").replace(/\s+/g, " ").trim();
  return t;
}
var LABELS = /^\s*(?:hook|intro|opening|body|main|point|cta|call to action|outro|close|closing|ending|scene|beat|line|step|vo|voiceover|voice over|b-?roll|on[- ]screen(?: text)?|text|caption|title|headline|part|section)\s*\d*\s*[:\-–—]\s*/i;
function wordsOf(s) {
  return (s.match(/\S+/g) || []).length;
}
function splitSentence(s, maxWords) {
  if (wordsOf(s) <= maxWords) return [s];
  const parts = s.split(/(?<=[,;:—–])\s+|\s+(?=[—–-]\s)/).filter((p) => p.trim());
  const out = [];
  let cur = "";
  for (const p of parts) {
    const cand = cur ? cur + " " + p : p;
    if (cur && wordsOf(cand) > maxWords) {
      out.push(cur);
      cur = p;
    } else cur = cand;
  }
  if (cur) out.push(cur);
  const res = [];
  for (const piece of out) {
    if (wordsOf(piece) <= Math.round(maxWords * 1.4)) {
      res.push(piece);
      continue;
    }
    const w = piece.split(/\s+/);
    const n = Math.ceil(w.length / maxWords);
    const size = Math.ceil(w.length / n);
    let i = 0;
    while (i < w.length) {
      let end = Math.min(w.length, i + size);
      for (let k = end; k > i + 2 && k > end - 4; k--) {
        if (k < w.length && /^(and|but|so|because|which|that|when|if|or|then|while|until|before|after|where|who)$/i.test(w[k])) {
          end = k;
          break;
        }
      }
      res.push(w.slice(i, end).join(" "));
      i = end;
    }
  }
  return res;
}
function scriptToLines(text, opt) {
  const lines = [];
  const maxWords = opt.maxWords > 0 ? opt.maxWords : 45;
  for (let para of text.replace(/\r/g, "").split("\n")) {
    if (opt.skipNotes) {
      para = para.replace(/\[[^\]]*\]/g, " ").replace(LABELS, "");
      if (/^\s*(?:#|\/\/|---+\s*$)/.test(para)) continue;
    }
    para = para.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim();
    if (!para || !/[\p{L}\p{N}]/u.test(para)) continue;
    const sentences = para.split(/(?<=[.!?…]["')\]”’]*)\s+(?=["'(\[“‘]?[\p{Lu}\p{N}])/u).filter((x) => x.trim());
    for (const s of sentences) for (const piece of splitSentence(s.trim(), maxWords)) {
      if (/[\p{L}\p{N}]/u.test(piece)) lines.push(piece.trim());
    }
  }
  return lines;
}

// src/kokoro-vocab.json
var kokoro_vocab_default = { ";": 1, ":": 2, ",": 3, ".": 4, "!": 5, "?": 6, "\u2014": 9, "\u2026": 10, '"': 11, "(": 12, ")": 13, "\u201C": 14, "\u201D": 15, " ": 16, "\u0303": 17, \u02A3: 18, \u02A5: 19, \u02A6: 20, \u02A8: 21, "\u1D5D": 22, "\uAB67": 23, A: 24, I: 25, O: 31, Q: 33, S: 35, T: 36, W: 39, Y: 41, "\u1D4A": 42, a: 43, b: 44, c: 45, d: 46, e: 47, f: 48, h: 50, i: 51, j: 52, k: 53, l: 54, m: 55, n: 56, o: 57, p: 58, q: 59, r: 60, s: 61, t: 62, u: 63, v: 64, w: 65, x: 66, y: 67, z: 68, \u0251: 69, \u0250: 70, \u0252: 71, \u00E6: 72, \u03B2: 75, \u0254: 76, \u0255: 77, \u00E7: 78, \u0256: 80, \u00F0: 81, \u02A4: 82, \u0259: 83, \u025A: 85, \u025B: 86, \u025C: 87, \u025F: 90, \u0261: 92, \u0265: 99, \u0268: 101, \u026A: 102, \u029D: 103, \u026F: 110, \u0270: 111, \u014B: 112, \u0273: 113, \u0272: 114, \u0274: 115, \u00F8: 116, \u0278: 118, \u03B8: 119, \u0153: 120, \u0279: 123, \u027E: 125, \u027B: 126, \u0281: 128, \u027D: 129, \u0282: 130, \u0283: 131, \u0288: 132, \u02A7: 133, \u028A: 135, \u028B: 136, \u028C: 138, \u0263: 139, \u0264: 140, \u03C7: 142, \u028E: 143, \u0292: 147, \u0294: 148, "\u02C8": 156, "\u02CC": 157, \u02D0: 158, \u02B0: 162, \u02B2: 164, "\u2193": 169, "\u2192": 171, "\u2197": 172, "\u2198": 173, "\u1D7B": 177 };

// src/tts.ts
var SAMPLE_RATE = 24e3;
var KV = kokoro_vocab_default;
async function phonemesFor(text) {
  return textToPhonemesDictRules(speakable(text));
}
function kokoroIds(ph) {
  const p = ph.replace(/ʲ/g, "j").replace(/r/g, "\u0279").replace(/x/g, "k").replace(/ɬ/g, "l");
  const ids = [];
  for (const ch of p) {
    const id = KV[ch];
    if (id !== void 0) ids.push(id);
  }
  return ids;
}
function trimSilence(x, thr = 0.012, rate = SAMPLE_RATE) {
  const win = Math.round(rate / 100);
  let a = 0, b = x.length;
  const loud = (i) => {
    let m = 0;
    for (let j = i; j < Math.min(x.length, i + win); j++) m = Math.max(m, Math.abs(x[j]));
    return m > thr;
  };
  while (a < x.length && !loud(a)) a += win;
  while (b > a && !loud(Math.max(0, b - win))) b -= win;
  a = Math.max(0, a - Math.round(rate * 0.05));
  b = Math.min(x.length, b + Math.round(rate * 0.1));
  return b > a ? x.slice(a, b) : x;
}
function splitPh(ph, max) {
  if (ph.length <= max) return [ph];
  const mid = ph.lastIndexOf(" ", Math.floor(ph.length / 2)) > 0 ? ph.lastIndexOf(" ", Math.floor(ph.length / 2)) : Math.floor(ph.length / 2);
  return [...splitPh(ph.slice(0, mid).trim(), max), ...splitPh(ph.slice(mid).trim(), max)];
}
var Engine = class _Engine {
  constructor(kind, ort, session) {
    this.kind = kind;
    this.ort = ort;
    this.session = session;
    __publicField(this, "rate", SAMPLE_RATE);
    __publicField(this, "pmap", {});
    __publicField(this, "scales", [0.667, 1, 0.8]);
  }
  /** piperConfig: the model's .onnx.json (phoneme_id_map, sample rate, inference scales). */
  static async create(kind, ort, model, piperConfig) {
    const session = await ort.InferenceSession.create(model, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
      enableCpuMemArena: false,
      enableMemPattern: false
    });
    const e = new _Engine(kind, ort, session);
    if (kind === "piper" && piperConfig) {
      for (const [k, v] of Object.entries(piperConfig.phoneme_id_map)) e.pmap[k] = v[0];
      e.rate = piperConfig.audio?.sample_rate || 22050;
      const inf = piperConfig.inference || {};
      e.scales = [inf.noise_scale ?? 0.667, inf.length_scale ?? 1, inf.noise_w ?? 0.8];
    }
    return e;
  }
  piperIds(ph) {
    const m = this.pmap, pad = m["_"] ?? 0;
    const ids = [m["^"] ?? 1, pad];
    for (const ch of ph.replace(/ʤ/g, "d\u0292").replace(/ʧ/g, "t\u0283")) {
      const id = m[ch];
      if (id !== void 0) ids.push(id, pad);
    }
    ids.push(m["$"] ?? 2);
    return ids;
  }
  /** voice: Kokoro = 510x256 floats, Kitten = 256 floats. */
  async synthPhonemes(ph, voice, speed) {
    const ort = this.ort;
    const parts = splitPh(ph, this.kind === "kokoro" ? 480 : 380);
    const chunks = [];
    for (const part of parts) {
      let feeds;
      if (this.kind === "kokoro") {
        const ids = kokoroIds(part);
        if (!ids.length) continue;
        const n = Math.min(ids.length, 509);
        const style = voice.slice(n * 256, n * 256 + 256);
        feeds = {
          tokens: new ort.Tensor("int64", BigInt64Array.from([0, ...ids, 0].map(BigInt)), [1, ids.length + 2]),
          style: new ort.Tensor("float32", style, [1, 256]),
          speed: new ort.Tensor("float32", new Float32Array([speed]), [1])
        };
      } else if (this.kind === "piper") {
        const ids = this.piperIds(part);
        if (ids.length <= 3) continue;
        feeds = {
          input: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
          input_lengths: new ort.Tensor("int64", BigInt64Array.from([BigInt(ids.length)]), [1]),
          scales: new ort.Tensor("float32", new Float32Array([this.scales[0], this.scales[1] / speed, this.scales[2]]), [3])
        };
      } else {
        const ids = phonemesToInputIds(part);
        if (ids.length <= 2) continue;
        feeds = {
          input_ids: new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
          style: new ort.Tensor("float32", voice.slice(0, 256), [1, 256]),
          speed: new ort.Tensor("float32", new Float32Array([speed]), [1])
        };
      }
      const out = await this.session.run(feeds);
      const first = out[this.session.outputNames[0]];
      chunks.push(trimSilence(first.data, 0.012, this.rate));
      for (const k of Object.keys(out)) {
        try {
          out[k].dispose?.();
        } catch {
        }
      }
    }
    if (chunks.length === 1) return chunks[0];
    const gap = Math.round(this.rate * 0.12);
    const total = chunks.reduce((s, c) => s + c.length, 0) + gap * (chunks.length - 1);
    const all = new Float32Array(Math.max(0, total));
    let o = 0;
    chunks.forEach((c, i) => {
      all.set(c, o);
      o += c.length + (i < chunks.length - 1 ? gap : 0);
    });
    return all;
  }
  async synth(text, voice, speed) {
    const phonemes = await phonemesFor(text);
    const audio = phonemes ? await this.synthPhonemes(phonemes, voice, speed) : new Float32Array(0);
    return { audio, phonemes };
  }
};
function wavBytes(x, rate = SAMPLE_RATE) {
  const buf = new ArrayBuffer(44 + x.length * 2), v = new DataView(buf);
  const w = (o2, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o2 + i, s.charCodeAt(i));
  };
  w(0, "RIFF");
  v.setUint32(4, 36 + x.length * 2, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  w(36, "data");
  v.setUint32(40, x.length * 2, true);
  let o = 44;
  for (let i = 0; i < x.length; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, x[i]));
    v.setInt16(o, s < 0 ? s * 32768 : s * 32767, true);
  }
  return new Uint8Array(buf);
}
export {
  Engine,
  SAMPLE_RATE,
  initPhonemizer,
  intToWords,
  kokoroIds,
  phonemesFor,
  phonemizerReady,
  scriptToLines,
  speakable,
  trimSilence,
  wavBytes
};
