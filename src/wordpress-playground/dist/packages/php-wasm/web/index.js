const K = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (K === "NODE") {
  let e = function(r) {
    return new Promise(function(n, s) {
      r.onload = r.onerror = function(o) {
        r.onload = r.onerror = null, o.type === "load" ? n(r.result) : s(new Error("Failed to read the blob/file"));
      };
    });
  }, t = function() {
    const r = new Uint8Array([1, 2, 3, 4]), s = new File([r], "test").stream();
    try {
      return s.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class r extends Blob {
      constructor(s, o, i) {
        super(s);
        let a;
        i != null && i.lastModified && (a = /* @__PURE__ */ new Date()), (!a || isNaN(a.getFullYear())) && (a = /* @__PURE__ */ new Date()), this.lastModifiedDate = a, this.lastModified = a.getMilliseconds(), this.name = o || "";
      }
    }
    global.File = r;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const n = new FileReader();
    return n.readAsArrayBuffer(this), e(n);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const n = new FileReader();
    return n.readAsText(this), e(n);
  }), (typeof Blob.prototype.stream > "u" || !t()) && (Blob.prototype.stream = function() {
    let r = 0;
    const n = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(s) {
        const o = s.byobRequest.view, a = await n.slice(
          r,
          r + o.byteLength
        ).arrayBuffer(), u = new Uint8Array(a);
        new Uint8Array(o.buffer).set(u);
        const l = u.byteLength;
        s.byobRequest.respond(l), r += l, r >= n.size && s.close();
      }
    });
  });
}
if (K === "NODE" && typeof CustomEvent > "u") {
  class e extends Event {
    constructor(r, n = {}) {
      super(r, n), this.detail = n.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = e;
}
const x = {
  0: "No error occurred. System call completed successfully.",
  1: "Argument list too long.",
  2: "Permission denied.",
  3: "Address in use.",
  4: "Address not available.",
  5: "Address family not supported.",
  6: "Resource unavailable, or operation would block.",
  7: "Connection already in progress.",
  8: "Bad file descriptor.",
  9: "Bad message.",
  10: "Device or resource busy.",
  11: "Operation canceled.",
  12: "No child processes.",
  13: "Connection aborted.",
  14: "Connection refused.",
  15: "Connection reset.",
  16: "Resource deadlock would occur.",
  17: "Destination address required.",
  18: "Mathematics argument out of domain of function.",
  19: "Reserved.",
  20: "File exists.",
  21: "Bad address.",
  22: "File too large.",
  23: "Host is unreachable.",
  24: "Identifier removed.",
  25: "Illegal byte sequence.",
  26: "Operation in progress.",
  27: "Interrupted function.",
  28: "Invalid argument.",
  29: "I/O error.",
  30: "Socket is connected.",
  31: "There is a directory under that path.",
  32: "Too many levels of symbolic links.",
  33: "File descriptor value too large.",
  34: "Too many links.",
  35: "Message too large.",
  36: "Reserved.",
  37: "Filename too long.",
  38: "Network is down.",
  39: "Connection aborted by network.",
  40: "Network unreachable.",
  41: "Too many files open in system.",
  42: "No buffer space available.",
  43: "No such device.",
  44: "There is no such file or directory OR the parent directory does not exist.",
  45: "Executable file format error.",
  46: "No locks available.",
  47: "Reserved.",
  48: "Not enough space.",
  49: "No message of the desired type.",
  50: "Protocol not available.",
  51: "No space left on device.",
  52: "Function not supported.",
  53: "The socket is not connected.",
  54: "Not a directory or a symbolic link to a directory.",
  55: "Directory not empty.",
  56: "State not recoverable.",
  57: "Not a socket.",
  58: "Not supported, or operation not supported on socket.",
  59: "Inappropriate I/O control operation.",
  60: "No such device or address.",
  61: "Value too large to be stored in data type.",
  62: "Previous owner died.",
  63: "Operation not permitted.",
  64: "Broken pipe.",
  65: "Protocol error.",
  66: "Protocol not supported.",
  67: "Protocol wrong type for socket.",
  68: "Result too large.",
  69: "Read-only file system.",
  70: "Invalid seek.",
  71: "No such process.",
  72: "Reserved.",
  73: "Connection timed out.",
  74: "Text file busy.",
  75: "Cross-device link.",
  76: "Extension: Capabilities insufficient."
};
function ue(e) {
  const t = typeof e == "object" ? e == null ? void 0 : e.errno : null;
  if (t in x)
    return x[t];
}
function y(e = "") {
  return function(r, n, s) {
    const o = s.value;
    s.value = function(...i) {
      try {
        return o.apply(this, i);
      } catch (a) {
        const u = typeof a == "object" ? a == null ? void 0 : a.errno : null;
        if (u in x) {
          const l = x[u], c = typeof i[1] == "string" ? i[1] : null, d = c !== null ? e.replaceAll("{path}", c) : e;
          throw new Error(`${d}: ${l}`, {
            cause: a
          });
        }
        throw a;
      }
    };
  };
}
const le = "playground-log", B = (e, ...t) => {
  v.dispatchEvent(
    new CustomEvent(le, {
      detail: {
        log: e,
        args: t
      }
    })
  );
}, de = (e, ...t) => {
  switch (typeof e.message == "string" ? e.message = W(e.message) : e.message.message && typeof e.message.message == "string" && (e.message.message = W(e.message.message)), e.severity) {
    case "Debug":
      console.debug(e.message, ...t);
      break;
    case "Info":
      console.info(e.message, ...t);
      break;
    case "Warn":
      console.warn(e.message, ...t);
      break;
    case "Error":
      console.error(e.message, ...t);
      break;
    case "Fatal":
      console.error(e.message, ...t);
      break;
    default:
      console.log(e.message, ...t);
  }
}, fe = (e) => e instanceof Error ? [e.message, e.stack].join(`
`) : JSON.stringify(e, null, 2), Y = [], $ = (e) => {
  Y.push(e);
}, N = (e) => {
  if (e.raw === !0)
    $(e.message);
  else {
    const t = ye(
      typeof e.message == "object" ? fe(e.message) : e.message,
      e.severity ?? "Info",
      e.prefix ?? "JavaScript"
    );
    $(t);
  }
};
class me extends EventTarget {
  // constructor
  constructor(t = []) {
    super(), this.handlers = t, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(N) ? [...Y] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`), []);
  }
  /**
   * Log message with severity.
   *
   * @param message any
   * @param severity LogSeverity
   * @param raw boolean
   * @param args any
   */
  logMessage(t, ...r) {
    for (const n of this.handlers)
      n(t, ...r);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
}
const pe = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [N, B];
  } catch {
  }
  return [N, de, B];
}, v = new me(pe()), W = (e) => e.replace(/\t/g, ""), ye = (e, t, r) => {
  const n = /* @__PURE__ */ new Date(), s = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(n).replace(/ /g, "-"), o = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(n), i = s + " " + o;
  return e = W(e), `[${i}] ${r} ${t}: ${e}`;
}, Z = Symbol("SleepFinished");
function he(e) {
  return new Promise((t) => {
    setTimeout(() => t(Z), e);
  });
}
class we extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class ge {
  constructor({ concurrency: t, timeout: r }) {
    this._running = 0, this.concurrency = t, this.timeout = r, this.queue = [];
  }
  get remaining() {
    return this.concurrency - this.running;
  }
  get running() {
    return this._running;
  }
  async acquire() {
    for (; ; )
      if (this._running >= this.concurrency) {
        const t = new Promise((r) => {
          this.queue.push(r);
        });
        this.timeout !== void 0 ? await Promise.race([t, he(this.timeout)]).then(
          (r) => {
            if (r === Z)
              throw new we();
          }
        ) : await t;
      } else {
        this._running++;
        let t = !1;
        return () => {
          t || (t = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(t) {
    const r = await this.acquire();
    try {
      return await t();
    } finally {
      r();
    }
  }
}
class j extends Error {
  constructor(t, r) {
    super(t), this.userFriendlyMessage = r, this.userFriendlyMessage || (this.userFriendlyMessage = t);
  }
}
function b(...e) {
  let t = e.join("/");
  const r = t[0] === "/", n = t.substring(t.length - 1) === "/";
  return t = H(t), !t && !r && (t = "."), t && n && (t += "/"), t;
}
function be(e) {
  if (e === "/")
    return "/";
  e = H(e);
  const t = e.lastIndexOf("/");
  return t === -1 ? "" : t === 0 ? "/" : e.substr(0, t);
}
function Ee(e) {
  if (e === "/")
    return "/";
  e = H(e);
  const t = e.lastIndexOf("/");
  return t === -1 ? e : e.substr(t + 1);
}
function H(e) {
  const t = e[0] === "/";
  return e = ke(
    e.split("/").filter((r) => !!r),
    !t
  ).join("/"), (t ? "/" : "") + e.replace(/\/$/, "");
}
function ke(e, t) {
  let r = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    const s = e[n];
    s === "." ? e.splice(n, 1) : s === ".." ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
  }
  if (t)
    for (; r; r--)
      e.unshift("..");
  return e;
}
var ve = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, h = (e, t, r, n) => {
  for (var s = n > 1 ? void 0 : n ? Pe(t, r) : t, o = e.length - 1, i; o >= 0; o--)
    (i = e[o]) && (s = (n ? i(t, r, s) : i(s)) || s);
  return n && s && ve(t, r, s), s;
};
const p = class m {
  static readFileAsText(t, r) {
    return new TextDecoder().decode(m.readFileAsBuffer(t, r));
  }
  static readFileAsBuffer(t, r) {
    return t.readFile(r);
  }
  static writeFile(t, r, n) {
    t.writeFile(r, n);
  }
  static unlink(t, r) {
    t.unlink(r);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(t, r, n) {
    try {
      const s = t.lookupPath(r).node.mount, o = m.fileExists(t, n) ? t.lookupPath(n).node.mount : t.lookupPath(be(n)).node.mount;
      s.mountpoint !== o.mountpoint ? (m.copyRecursive(t, r, n), m.rmdir(t, r, { recursive: !0 })) : t.rename(r, n);
    } catch (s) {
      const o = ue(s);
      throw o ? new Error(
        `Could not move ${r} to ${n}: ${o}`,
        {
          cause: s
        }
      ) : s;
    }
  }
  static rmdir(t, r, n = { recursive: !0 }) {
    n != null && n.recursive && m.listFiles(t, r).forEach((s) => {
      const o = `${r}/${s}`;
      m.isDir(t, o) ? m.rmdir(t, o, n) : m.unlink(t, o);
    }), t.rmdir(r);
  }
  static listFiles(t, r, n = { prependPath: !1 }) {
    if (!m.fileExists(t, r))
      return [];
    try {
      const s = t.readdir(r).filter(
        (o) => o !== "." && o !== ".."
      );
      if (n.prependPath) {
        const o = r.replace(/\/$/, "");
        return s.map((i) => `${o}/${i}`);
      }
      return s;
    } catch (s) {
      return v.error(s, { path: r }), [];
    }
  }
  static isDir(t, r) {
    return m.fileExists(t, r) ? t.isDir(t.lookupPath(r).node.mode) : !1;
  }
  static fileExists(t, r) {
    try {
      return t.lookupPath(r), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(t, r) {
    t.mkdirTree(r);
  }
  static copyRecursive(t, r, n) {
    const s = t.lookupPath(r).node;
    if (t.isDir(s.mode)) {
      t.mkdirTree(n);
      const o = t.readdir(r).filter(
        (i) => i !== "." && i !== ".."
      );
      for (const i of o)
        m.copyRecursive(
          t,
          b(r, i),
          b(n, i)
        );
    } else
      t.writeFile(n, t.readFile(r));
  }
};
h([
  y('Could not read "{path}"')
], p, "readFileAsText", 1);
h([
  y('Could not read "{path}"')
], p, "readFileAsBuffer", 1);
h([
  y('Could not write to "{path}"')
], p, "writeFile", 1);
h([
  y('Could not unlink "{path}"')
], p, "unlink", 1);
h([
  y('Could not remove directory "{path}"')
], p, "rmdir", 1);
h([
  y('Could not list files in "{path}"')
], p, "listFiles", 1);
h([
  y('Could not stat "{path}"')
], p, "isDir", 1);
h([
  y('Could not stat "{path}"')
], p, "fileExists", 1);
h([
  y('Could not create directory "{path}"')
], p, "mkdir", 1);
h([
  y('Could not copy files from "{path}"')
], p, "copyRecursive", 1);
let R = p;
const Te = {
  500: "Internal Server Error",
  502: "Bad Gateway",
  404: "Not Found",
  403: "Forbidden",
  401: "Unauthorized",
  400: "Bad Request",
  301: "Moved Permanently",
  302: "Found",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  204: "No Content",
  201: "Created",
  200: "OK"
};
class O {
  constructor(t, r, n, s = "", o = 0) {
    this.httpStatusCode = t, this.headers = r, this.bytes = n, this.exitCode = o, this.errors = s;
  }
  static forHttpCode(t, r = "") {
    return new O(
      t,
      {},
      new TextEncoder().encode(
        r || Te[t] || ""
      )
    );
  }
  static fromRawData(t) {
    return new O(
      t.httpStatusCode,
      t.headers,
      t.bytes,
      t.errors,
      t.exitCode
    );
  }
  toRawData() {
    return {
      headers: this.headers,
      bytes: this.bytes,
      errors: this.errors,
      exitCode: this.exitCode,
      httpStatusCode: this.httpStatusCode
    };
  }
  /**
   * Response body as JSON.
   */
  get json() {
    return JSON.parse(this.text);
  }
  /**
   * Response body as text.
   */
  get text() {
    return new TextDecoder().decode(this.bytes);
  }
}
const Re = Symbol("RuntimeId"), _ = /* @__PURE__ */ new Map();
let Ce = 0;
async function xe(e, t = {}) {
  const [r, n, s] = Se(), o = e.init(Oe, {
    onAbort(a) {
      s(a), v.error(a);
    },
    ENV: {},
    // Emscripten sometimes prepends a '/' to the path, which
    // breaks vite dev mode. An identity `locateFile` function
    // fixes it.
    locateFile: (a) => a,
    ...t,
    noInitialRun: !0,
    onRuntimeInitialized() {
      t.onRuntimeInitialized && t.onRuntimeInitialized(), n();
    }
  });
  await r;
  const i = ++Ce;
  return o.id = i, o.originalExit = o._exit, o._exit = function(a) {
    return _.delete(i), o.originalExit(a);
  }, o[Re] = i, _.set(i, o), i;
}
const Oe = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
}(), Se = () => {
  const e = [], t = new Promise((r, n) => {
    e.push(r, n);
  });
  return e.unshift(t), e;
}, w = Symbol("__private__dont__use");
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const e = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: r } = await e.read();
      if (t)
        return;
      yield r;
    }
  } finally {
    e.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const De = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], Ae = De[0];
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Q = Symbol("Comlink.proxy"), Me = Symbol("Comlink.endpoint"), Le = Symbol("Comlink.releaseProxy"), L = Symbol("Comlink.finalizer"), C = Symbol("Comlink.thrown"), X = (e) => typeof e == "object" && e !== null || typeof e == "function", Ne = {
  canHandle: (e) => X(e) && e[Q],
  serialize(e) {
    const { port1: t, port2: r } = new MessageChannel();
    return M(e, t), [r, [r]];
  },
  deserialize(e) {
    return e.start(), F(e);
  }
}, We = {
  canHandle: (e) => X(e) && C in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(new Error(e.value.message), e.value) : e.value;
  }
}, k = /* @__PURE__ */ new Map([
  ["proxy", Ne],
  ["throw", We]
]);
function Ie(e, t) {
  for (const r of e)
    if (t === r || r === "*" || r instanceof RegExp && r.test(t))
      return !0;
  return !1;
}
function M(e, t = globalThis, r = ["*"]) {
  t.addEventListener("message", function n(s) {
    if (!s || !s.data)
      return;
    if (!Ie(r, s.origin)) {
      console.warn(`Invalid origin '${s.origin}' for comlink proxy`);
      return;
    }
    const { id: o, type: i, path: a } = Object.assign({ path: [] }, s.data), u = (s.data.argumentList || []).map(g);
    let l;
    try {
      const c = a.slice(0, -1).reduce((f, P) => f[P], e), d = a.reduce((f, P) => f[P], e);
      switch (i) {
        case "GET":
          l = d;
          break;
        case "SET":
          c[a.slice(-1)[0]] = g(s.data.value), l = !0;
          break;
        case "APPLY":
          l = d.apply(c, u);
          break;
        case "CONSTRUCT":
          {
            const f = new d(...u);
            l = ne(f);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: f, port2: P } = new MessageChannel();
            M(e, P), l = $e(f, [f]);
          }
          break;
        case "RELEASE":
          l = void 0;
          break;
        default:
          return;
      }
    } catch (c) {
      l = { value: c, [C]: 0 };
    }
    Promise.resolve(l).catch((c) => ({ value: c, [C]: 0 })).then((c) => {
      const [d, f] = A(c);
      t.postMessage(Object.assign(Object.assign({}, d), { id: o }), f), i === "RELEASE" && (t.removeEventListener("message", n), ee(t), L in e && typeof e[L] == "function" && e[L]());
    }).catch((c) => {
      const [d, f] = A({
        value: new TypeError("Unserializable return value"),
        [C]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, d), { id: o }), f);
    });
  }), t.start && t.start();
}
function He(e) {
  return e.constructor.name === "MessagePort";
}
function ee(e) {
  He(e) && e.close();
}
function F(e, t) {
  return I(e, [], t);
}
function T(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function te(e) {
  return E(e, {
    type: "RELEASE"
  }).then(() => {
    ee(e);
  });
}
const S = /* @__PURE__ */ new WeakMap(), D = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = (S.get(e) || 0) - 1;
  S.set(e, t), t === 0 && te(e);
});
function Fe(e, t) {
  const r = (S.get(t) || 0) + 1;
  S.set(t, r), D && D.register(e, t, e);
}
function ze(e) {
  D && D.unregister(e);
}
function I(e, t = [], r = function() {
}) {
  let n = !1;
  const s = new Proxy(r, {
    get(o, i) {
      if (T(n), i === Le)
        return () => {
          ze(s), te(e), n = !0;
        };
      if (i === "then") {
        if (t.length === 0)
          return { then: () => s };
        const a = E(e, {
          type: "GET",
          path: t.map((u) => u.toString())
        }).then(g);
        return a.then.bind(a);
      }
      return I(e, [...t, i]);
    },
    set(o, i, a) {
      T(n);
      const [u, l] = A(a);
      return E(e, {
        type: "SET",
        path: [...t, i].map((c) => c.toString()),
        value: u
      }, l).then(g);
    },
    apply(o, i, a) {
      T(n);
      const u = t[t.length - 1];
      if (u === Me)
        return E(e, {
          type: "ENDPOINT"
        }).then(g);
      if (u === "bind")
        return I(e, t.slice(0, -1));
      const [l, c] = q(a);
      return E(e, {
        type: "APPLY",
        path: t.map((d) => d.toString()),
        argumentList: l
      }, c).then(g);
    },
    construct(o, i) {
      T(n);
      const [a, u] = q(i);
      return E(e, {
        type: "CONSTRUCT",
        path: t.map((l) => l.toString()),
        argumentList: a
      }, u).then(g);
    }
  });
  return Fe(s, e), s;
}
function Be(e) {
  return Array.prototype.concat.apply([], e);
}
function q(e) {
  const t = e.map(A);
  return [t.map((r) => r[0]), Be(t.map((r) => r[1]))];
}
const re = /* @__PURE__ */ new WeakMap();
function $e(e, t) {
  return re.set(e, t), e;
}
function ne(e) {
  return Object.assign(e, { [Q]: !0 });
}
function se(e, t = globalThis, r = "*") {
  return {
    postMessage: (n, s) => e.postMessage(n, r, s),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function A(e) {
  for (const [t, r] of k)
    if (r.canHandle(e)) {
      const [n, s] = r.serialize(e);
      return [
        {
          type: "HANDLER",
          name: t,
          value: n
        },
        s
      ];
    }
  return [
    {
      type: "RAW",
      value: e
    },
    re.get(e) || []
  ];
}
function g(e) {
  switch (e.type) {
    case "HANDLER":
      return k.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function E(e, t, r) {
  return new Promise((n) => {
    const s = je();
    e.addEventListener("message", function o(i) {
      !i.data || !i.data.id || i.data.id !== s || (e.removeEventListener("message", o), n(i.data));
    }), e.start && e.start(), e.postMessage(Object.assign({ id: s }, t), r);
  });
}
function je() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function tt(e, t = void 0) {
  oe();
  const r = e instanceof Worker ? e : se(e, t), n = F(r), s = z(n);
  return new Proxy(s, {
    get: (o, i) => i === "isConnected" ? async () => {
      for (; ; )
        try {
          await _e(n.isConnected(), 200);
          break;
        } catch {
        }
    } : n[i]
  });
}
async function _e(e, t) {
  return new Promise((r, n) => {
    setTimeout(n, t), e.then(r);
  });
}
function rt(e, t) {
  oe();
  const r = Promise.resolve();
  let n, s;
  const o = new Promise((u, l) => {
    n = u, s = l;
  }), i = z(e), a = new Proxy(i, {
    get: (u, l) => l === "isConnected" ? () => r : l === "isReady" ? () => o : l in u ? u[l] : t == null ? void 0 : t[l]
  });
  return M(
    a,
    typeof window < "u" ? se(self.parent) : void 0
  ), [n, s, a];
}
let J = !1;
function oe() {
  if (J)
    return;
  J = !0, k.set("EVENT", {
    canHandle: (r) => r instanceof CustomEvent,
    serialize: (r) => [
      {
        detail: r.detail
      },
      []
    ],
    deserialize: (r) => r
  }), k.set("FUNCTION", {
    canHandle: (r) => typeof r == "function",
    serialize(r) {
      const { port1: n, port2: s } = new MessageChannel();
      return M(r, n), [s, [s]];
    },
    deserialize(r) {
      return r.start(), F(r);
    }
  }), k.set("PHPResponse", {
    canHandle: (r) => typeof r == "object" && r !== null && "headers" in r && "bytes" in r && "errors" in r && "exitCode" in r && "httpStatusCode" in r,
    serialize(r) {
      return [r.toRawData(), []];
    },
    deserialize(r) {
      return O.fromRawData(r);
    }
  });
  const e = k.get("throw"), t = e == null ? void 0 : e.serialize;
  e.serialize = ({ value: r }) => {
    const n = t({ value: r });
    return r.response && (n[0].value.response = r.response), r.source && (n[0].value.source = r.source), n;
  };
}
function z(e) {
  return new Proxy(e, {
    get(t, r) {
      switch (typeof t[r]) {
        case "function":
          return (...n) => t[r](...n);
        case "object":
          return t[r] === null ? t[r] : z(t[r]);
        case "undefined":
        case "number":
        case "string":
          return t[r];
        default:
          return ne(t[r]);
      }
    }
  });
}
async function qe(e = Ae, t = "light") {
  if (t === "kitchen-sink")
    switch (e) {
      case "8.3":
        return await import("./kitchen-sink/php_8_3.js");
      case "8.2":
        return await import("./kitchen-sink/php_8_2.js");
      case "8.1":
        return await import("./kitchen-sink/php_8_1.js");
      case "8.0":
        return await import("./kitchen-sink/php_8_0.js");
      case "7.4":
        return await import("./kitchen-sink/php_7_4.js");
      case "7.3":
        return await import("./kitchen-sink/php_7_3.js");
      case "7.2":
        return await import("./kitchen-sink/php_7_2.js");
      case "7.1":
        return await import("./kitchen-sink/php_7_1.js");
      case "7.0":
        return await import("./kitchen-sink/php_7_0.js");
    }
  else
    switch (e) {
      case "8.3":
        return await import("./light/php_8_3.js");
      case "8.2":
        return await import("./light/php_8_2.js");
      case "8.1":
        return await import("./light/php_8_1.js");
      case "8.0":
        return await import("./light/php_8_0.js");
      case "7.4":
        return await import("./light/php_7_4.js");
      case "7.3":
        return await import("./light/php_7_3.js");
      case "7.2":
        return await import("./light/php_7_2.js");
      case "7.1":
        return await import("./light/php_7_1.js");
      case "7.0":
        return await import("./light/php_7_0.js");
    }
  throw new Error(`Unsupported PHP version ${e}`);
}
const Je = () => ({
  websocket: {
    decorator: (e) => class extends e {
      constructor() {
        try {
          super();
        } catch {
        }
      }
      send() {
        return null;
      }
    }
  }
});
async function st(e, t = {}) {
  var s;
  const r = t.loadAllExtensions ? "kitchen-sink" : "light", n = await qe(e, r);
  return (s = t.onPhpLoaderModuleLoaded) == null || s.call(t, n), await xe(n, {
    ...t.emscriptenOptions || {},
    ...Je()
  });
}
function Ve(e, t) {
  return {
    type: "response",
    requestId: e,
    response: t
  };
}
async function ot(e, t, r) {
  const n = navigator.serviceWorker;
  if (!n)
    throw window.isSecureContext ? new j(
      "Service workers are not supported in your browser."
    ) : new j(
      "WordPress Playground uses service workers and may only work on HTTPS and http://localhost/ sites, but the current site is neither."
    );
  await (await n.register(r, {
    type: "module",
    // Always bypass HTTP cache when fetching the new Service Worker script:
    updateViaCache: "none"
  })).update(), navigator.serviceWorker.addEventListener(
    "message",
    async function(i) {
      if (t && i.data.scope !== t)
        return;
      const a = i.data.args || [], u = i.data.method, l = await e[u](...a);
      i.source.postMessage(Ve(i.data.requestId, l));
    }
  ), n.startMessages();
}
function it(e, t) {
  window.addEventListener("message", (r) => {
    r.source === e.contentWindow && (t && r.origin !== t || typeof r.data != "object" || r.data.type !== "relay" || window.parent.postMessage(r.data, "*"));
  }), window.addEventListener("message", (r) => {
    var n;
    r.source === window.parent && (typeof r.data != "object" || r.data.type !== "relay" || (n = e == null ? void 0 : e.contentWindow) == null || n.postMessage(r.data));
  });
}
async function at(e, t = {}) {
  e = Ue(e, t);
  const r = new Worker(e, { type: "module" });
  return new Promise((n, s) => {
    r.onerror = (i) => {
      const a = new Error(
        `WebWorker failed to load at ${e}. ${i.message ? `Original error: ${i.message}` : ""}`
      );
      a.filename = i.filename, s(a);
    };
    function o(i) {
      i.data === "worker-script-started" && (n(r), r.removeEventListener("message", o));
    }
    r.addEventListener("message", o);
  });
}
function Ue(e, t) {
  if (!Object.entries(t).length)
    return e + "";
  const r = new URL(e);
  for (const [n, s] of Object.entries(t))
    if (Array.isArray(s))
      for (const o of s)
        r.searchParams.append(n, o);
    else
      r.searchParams.set(n, s);
  return r.toString();
}
function Ge(e, t, r = () => {
}) {
  function n() {
    t = Ye(t);
    const o = e[w].FS, i = Ke(o, (c) => {
      if (c.path.startsWith(t))
        r(c);
      else if (c.operation === "RENAME" && c.toPath.startsWith(t))
        for (const d of ie(
          e,
          c.path,
          c.toPath
        ))
          r(d);
    }), a = {};
    for (const [c] of Object.entries(i))
      a[c] = o[c];
    function u() {
      for (const [c, d] of Object.entries(i))
        o[c] = function(...f) {
          return d(...f), a[c].apply(this, f);
        };
    }
    function l() {
      for (const [c, d] of Object.entries(a))
        e[w].FS[c] = d;
    }
    e[w].journal = {
      bind: u,
      unbind: l
    }, u();
  }
  e.addEventListener("runtime.initialized", n), e[w] && n();
  function s() {
    e[w].journal.unbind(), delete e[w].journal;
  }
  return e.addEventListener("runtime.beforedestroy", s), function() {
    return e.removeEventListener("runtime.initialized", n), e.removeEventListener("runtime.beforedestroy", s), e[w].journal.unbind();
  };
}
const Ke = (e, t = () => {
}) => ({
  write(r) {
    t({
      operation: "WRITE",
      path: r.path,
      nodeType: "file"
    });
  },
  truncate(r) {
    let n;
    typeof r == "string" ? n = e.lookupPath(r, {
      follow: !0
    }).node : n = r, t({
      operation: "WRITE",
      path: e.getPath(n),
      nodeType: "file"
    });
  },
  unlink(r) {
    t({
      operation: "DELETE",
      path: r,
      nodeType: "file"
    });
  },
  mknod(r, n) {
    e.isFile(n) && t({
      operation: "CREATE",
      path: r,
      nodeType: "file"
    });
  },
  mkdir(r) {
    t({
      operation: "CREATE",
      path: r,
      nodeType: "directory"
    });
  },
  rmdir(r) {
    t({
      operation: "DELETE",
      path: r,
      nodeType: "directory"
    });
  },
  rename(r, n) {
    try {
      const s = e.lookupPath(r, {
        follow: !0
      }), o = e.lookupPath(n, {
        parent: !0
      }).path;
      t({
        operation: "RENAME",
        nodeType: e.isDir(s.node.mode) ? "directory" : "file",
        path: s.path,
        toPath: b(o, Ee(n))
      });
    } catch {
    }
  }
});
function* ie(e, t, r) {
  if (e.isDir(t)) {
    yield {
      operation: "CREATE",
      path: r,
      nodeType: "directory"
    };
    for (const n of e.listFiles(t))
      yield* ie(
        e,
        b(t, n),
        b(r, n)
      );
  } else
    yield {
      operation: "CREATE",
      path: r,
      nodeType: "file"
    }, yield {
      operation: "WRITE",
      nodeType: "file",
      path: r
    };
}
function Ye(e) {
  return e.replace(/\/$/, "").replace(/\/\/+/g, "/");
}
function ct(e, t = { initialSync: {} }) {
  return t = {
    ...t,
    initialSync: {
      ...t.initialSync,
      direction: t.initialSync.direction ?? "opfs-to-memfs"
    }
  }, async function(r, n, s) {
    return t.initialSync.direction === "opfs-to-memfs" ? (R.fileExists(n, s) && R.rmdir(n, s), R.mkdir(n, s), await Ze(n, e, s)) : await ae(
      n,
      e,
      s,
      t.initialSync.onProgress
    ), Xe(r, e, s);
  };
}
async function Ze(e, t, r) {
  R.mkdir(e, r);
  const n = new ge({
    concurrency: 40
  }), s = [], o = [
    [t, r]
  ];
  for (; o.length > 0; ) {
    const [i, a] = o.pop();
    for await (const u of i.values()) {
      const l = n.run(async () => {
        const c = b(
          a,
          u.name
        );
        if (u.kind === "directory") {
          try {
            e.mkdir(c);
          } catch (d) {
            if ((d == null ? void 0 : d.errno) !== 20)
              throw v.error(d), d;
          }
          o.push([u, c]);
        } else if (u.kind === "file") {
          const d = await u.getFile(), f = new Uint8Array(await d.arrayBuffer());
          e.createDataFile(
            a,
            u.name,
            f,
            !0,
            !0,
            !0
          );
        }
        s.splice(s.indexOf(l), 1);
      });
      s.push(l);
    }
    for (; o.length === 0 && s.length > 0; )
      await Promise.any(s);
  }
}
async function ae(e, t, r, n) {
  e.mkdirTree(r);
  const s = [];
  async function o(u, l) {
    await Promise.all(
      e.readdir(u).filter(
        (c) => c !== "." && c !== ".."
      ).map(async (c) => {
        const d = b(u, c);
        if (!Qe(e, d)) {
          s.push([l, d, c]);
          return;
        }
        const f = await l.getDirectoryHandle(c, {
          create: !0
        });
        return await o(d, f);
      })
    );
  }
  await o(r, t);
  let i = 0;
  const a = s.map(
    ([u, l, c]) => ce(u, c, e, l).then(() => {
      n == null || n({ files: ++i, total: s.length });
    })
  );
  await Promise.all(a);
}
function Qe(e, t) {
  return e.isDir(e.lookupPath(t, { follow: !0 }).node.mode);
}
async function ce(e, t, r, n) {
  let s;
  try {
    s = r.readFile(n, {
      encoding: "binary"
    });
  } catch {
    return;
  }
  const o = await e.getFileHandle(t, { create: !0 }), i = o.createWritable !== void 0 ? (
    // Google Chrome, Firefox, probably more browsers
    await o.createWritable()
  ) : (
    // Safari
    await o.createSyncAccessHandle()
  );
  try {
    await i.truncate(0), await i.write(s);
  } finally {
    await i.close();
  }
}
function Xe(e, t, r) {
  const n = [], s = Ge(e, r, (a) => {
    n.push(a);
  }), o = new et(e, t, r);
  async function i() {
    const a = await e.semaphore.acquire();
    try {
      for (; n.length; )
        await o.processEntry(n.shift());
    } finally {
      a();
    }
  }
  return e.addEventListener("request.end", i), function() {
    s(), e.removeEventListener("request.end", i);
  };
}
class et {
  constructor(t, r, n) {
    this.php = t, this.opfs = r, this.memfsRoot = V(n);
  }
  toOpfsPath(t) {
    return V(t.substring(this.memfsRoot.length));
  }
  async processEntry(t) {
    if (!t.path.startsWith(this.memfsRoot) || t.path === this.memfsRoot)
      return;
    const r = this.toOpfsPath(t.path), n = await G(this.opfs, r), s = U(r);
    if (s)
      try {
        if (t.operation === "DELETE")
          try {
            await n.removeEntry(s, {
              recursive: !0
            });
          } catch {
          }
        else if (t.operation === "CREATE")
          t.nodeType === "directory" ? await n.getDirectoryHandle(s, {
            create: !0
          }) : await n.getFileHandle(s, {
            create: !0
          });
        else if (t.operation === "WRITE")
          await ce(
            n,
            s,
            this.php[w].FS,
            t.path
          );
        else if (t.operation === "RENAME" && t.toPath.startsWith(this.memfsRoot)) {
          const o = this.toOpfsPath(t.toPath), i = await G(
            this.opfs,
            o
          ), a = U(o);
          if (t.nodeType === "directory") {
            const u = await i.getDirectoryHandle(
              s,
              {
                create: !0
              }
            );
            await ae(
              this.php[w].FS,
              u,
              t.toPath
            ), await n.removeEntry(s, {
              recursive: !0
            });
          } else
            (await n.getFileHandle(s)).move(i, a);
        }
      } catch (o) {
        throw v.log({ entry: t, name: s }), v.error(o), o;
      }
  }
}
function V(e) {
  return e.replace(/\/$/, "").replace(/\/\/+/g, "/");
}
function U(e) {
  return e.substring(e.lastIndexOf("/") + 1);
}
async function G(e, t) {
  const r = t.replace(/^\/+|\/+$/g, "").replace(/\/+/, "/");
  if (!r)
    return e;
  const n = r.split("/");
  let s = e;
  for (let o = 0; o < n.length - 1; o++) {
    const i = n[o];
    s = await s.getDirectoryHandle(i, { create: !0 });
  }
  return s;
}
export {
  tt as consumeAPI,
  ct as createDirectoryHandleMountHandler,
  rt as exposeAPI,
  qe as getPHPLoaderModule,
  st as loadWebRuntime,
  ot as registerServiceWorker,
  it as setupPostMessageRelay,
  at as spawnPHPWorkerThread
};
