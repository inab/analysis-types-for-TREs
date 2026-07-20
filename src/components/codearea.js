import {html} from "npm:htl";
import hljs from "highlight.js";

// --- inlined helpers from @observablehq/inputs internals ---

function truefalse(value) {
  return value == null ? null : `${value}`;
}

function onoff(value) {
  return value == null ? null : `${value === false ? "off" : value === true ? "on" : value}`;
}

function maybeWidth(width) {
  if (width == null) return "width:100%";
  return `max-width:${typeof width === "number" ? `${width}px` : width}`;
}

function maybeLabel(label, input) {
  if (label == null) return "";
  if (!(label instanceof Node)) label = document.createTextNode(label);
  const l = html`<label>${label}</label>`;
  if (input.id) l.setAttribute("for", input.id);
  return l;
}

function stringify(value) {
  return value == null ? "" : `${value}`;
}

function checkValidity(input) {
  return input.checkValidity();
}

function dispatchInput(event) {
  event.target.dispatchEvent(new Event("input", {bubbles: true}));
}

function preventDefault(event) {
  event.preventDefault();
}

function createText(form, input, value, {
  validate = checkValidity,
  submit
} = {}, {
  get = (input) => input.value,
  set = (input, value) => input.value = stringify(value),
  same = (input, value) => input.value === value,
  after = (button) => input.after(button)
} = {}) {
  submit = submit === true ? "Submit" : submit || null;
  const button = submit ? html`<button type=submit disabled>${submit}` : null;
  if (submit) after(button);
  set(input, value);
  value = validate(input) ? get(input) : undefined;
  form.addEventListener("submit", onsubmit);
  input.oninput = oninput;

  function update() {
    if (validate(input)) { value = get(input); return true; }
  }
  function onsubmit(event) {
    preventDefault(event);
    if (submit) {
      if (update()) { button.disabled = true; dispatchInput(event); }
      else input.reportValidity();
    }
  }
  function oninput(event) {
    if (submit) { button.disabled = same(input, value); event.stopPropagation(); }
    else if (!update()) event.stopPropagation();
  }

  return Object.defineProperty(form, "value", {
    get() { return value; },
    set(v) { set(input, v); update(); }
  });
}

export function codearea({
  value = "",
  label,
  placeholder,
  language = "javascript",
  spellcheck,
  autocomplete,
  autocapitalize,
  rows = 3,
  minlength,
  maxlength,
  required = minlength > 0,
  readonly,
  disabled,
  resize = rows < 12,
  width,
  ...options
} = {}) {

  // Shared style values
  const fontFamily = "var(--monospace, monospace)";
  const fontSize   = "var(--monospace-size, 0.9em)";
  const padding    = "4px 8px";
  const lineHeight = "1.5";

  const code = html`<code style=${{
    fontFamily: "inherit",
    fontSize: "inherit",
    whiteSpace: "inherit",
  }}>`;
  const pre  = html`<pre style=${{
    margin: 0,
    padding,
    fontFamily,
    fontSize,
    lineHeight,
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    pointerEvents: "none",
    userSelect: "none",
  }}>${code}</pre>`;

  const input = html`<textarea
    name=text
    readonly=${readonly}
    disabled=${disabled}
    required=${required}
    rows=${rows}
    minlength=${minlength}
    maxlength=${maxlength}
    spellcheck=${truefalse(spellcheck) ?? "false"}
    autocomplete=${onoff(autocomplete) ?? "off"}
    autocapitalize=${onoff(autocapitalize) ?? "off"}
    placeholder=${placeholder}
    oninput=${oninput}
    onscroll=${onscroll}
    onkeydown=${onkeydown}
    style=${{
      // Position on top of <pre>, same box
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      width: "100%",
      height: "100%",
      margin: 0,
      padding,
      boxSizing: "border-box",
      border: "none",
      background: "transparent",
      color: "transparent",
      caretColor: "var(--theme-foreground, currentColor)",
      fontFamily,
      fontSize,
      lineHeight,
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      resize: resize ? null : "none",
      outline: "none",
      overflow: "auto",
    }}
  >`;

  // The wrapper must have explicit height so children fill it.
  // We use a grid with min-content so it grows with the textarea.
  const wrapper = html`<div style=${{
    position: "relative",
    display: "grid",           // ← makes the div adopt the textarea's natural height
    border: "1px solid var(--theme-foreground-faint, #ccc)",
    borderRadius: "4px",
    background: "var(--theme-background, #fff)",
    overflow: "hidden",
    boxSizing: "border-box",
  }}>`;

  // Both children sit in the same grid cell, perfectly overlaid.
  pre.style.gridArea   = "1 / 1";
  input.style.gridArea = "1 / 1";
  wrapper.append(pre, input);

  const form = html`<form class="__ns__ __ns__-textarea" style=${maybeWidth(width)}>
    ${maybeLabel(label, wrapper)}
    <div>${wrapper}</div>
  </form>`;

  function highlight(text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const result = hljs.highlight(escaped, {language, ignoreIllegals: true});
    // Trailing newline stops the last line from collapsing
    code.innerHTML = result.value + "\n";
  }

  function oninput() {
    highlight(input.value);
  }

  function onscroll() {
    pre.scrollTop  = input.scrollTop;
    pre.scrollLeft = input.scrollLeft;
  }

  function onkeydown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      const {selectionStart: s, selectionEnd: e} = input;
      input.value = input.value.slice(0, s) + "  " + input.value.slice(e);
      input.selectionStart = input.selectionEnd = s + 2;
      highlight(input.value);
    }
    if (options.submit && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      form.dispatchEvent(new Event("submit", bubbles));
    }
  }

  // Seed
  input.value = value;
  highlight(value);

  const result =  createText(form, input, value, options, {
    after: (button) => wrapper.after(button),
  });

  input.addEventListener("input", () => highlight(input.value));

  return result;
}
