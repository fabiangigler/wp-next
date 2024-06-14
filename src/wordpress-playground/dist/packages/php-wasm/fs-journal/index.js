const C = function() {
  var r;
  return typeof process < "u" && ((r = process.release) == null ? void 0 : r.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (C === "NODE") {
  let r = function(t) {
    return new Promise(function(o, n) {
      t.onload = t.onerror = function(i) {
        t.onload = t.onerror = null, i.type === "load" ? o(t.result) : n(new Error("Failed to read the blob/file"));
      };
    });
  }, e = function() {
    const t = new Uint8Array([1, 2, 3, 4]), n = new File([t], "test").stream();
    try {
      return n.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class t extends Blob {
      constructor(n, i, s) {
        super(n);
        let a;
        s != null && s.lastModified && (a = /* @__PURE__ */ new Date()), (!a || isNaN(a.getFullYear())) && (a = /* @__PURE__ */ new Date()), this.lastModifiedDate = a, this.lastModified = a.getMilliseconds(), this.name = i || "";
      }
    }
    global.File = t;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const o = new FileReader();
    return o.readAsArrayBuffer(this), r(o);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const o = new FileReader();
    return o.readAsText(this), r(o);
  }), (typeof Blob.prototype.stream > "u" || !e()) && (Blob.prototype.stream = function() {
    let t = 0;
    const o = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(n) {
        const i = n.byobRequest.view, a = await o.slice(
          t,
          t + i.byteLength
        ).arrayBuffer(), m = new Uint8Array(a);
        new Uint8Array(i.buffer).set(m);
        const h = m.byteLength;
        n.byobRequest.respond(h), t += h, t >= o.size && n.close();
      }
    });
  });
}
if (C === "NODE" && typeof CustomEvent > "u") {
  class r extends Event {
    constructor(t, o = {}) {
      super(t, o), this.detail = o.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = r;
}
const E = {
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
function O(r) {
  const e = typeof r == "object" ? r == null ? void 0 : r.errno : null;
  if (e in E)
    return E[e];
}
function u(r = "") {
  return function(t, o, n) {
    const i = n.value;
    n.value = function(...s) {
      try {
        return i.apply(this, s);
      } catch (a) {
        const m = typeof a == "object" ? a == null ? void 0 : a.errno : null;
        if (m in E) {
          const h = E[m], l = typeof s[1] == "string" ? s[1] : null, y = l !== null ? r.replaceAll("{path}", l) : r;
          throw new Error(`${y}: ${h}`, {
            cause: a
          });
        }
        throw a;
      }
    };
  };
}
const x = "playground-log", R = (r, ...e) => {
  b.dispatchEvent(
    new CustomEvent(x, {
      detail: {
        log: r,
        args: e
      }
    })
  );
}, I = (r, ...e) => {
  switch (typeof r.message == "string" ? r.message = w(r.message) : r.message.message && typeof r.message.message == "string" && (r.message.message = w(r.message.message)), r.severity) {
    case "Debug":
      console.debug(r.message, ...e);
      break;
    case "Info":
      console.info(r.message, ...e);
      break;
    case "Warn":
      console.warn(r.message, ...e);
      break;
    case "Error":
      console.error(r.message, ...e);
      break;
    case "Fatal":
      console.error(r.message, ...e);
      break;
    default:
      console.log(r.message, ...e);
  }
}, B = (r) => r instanceof Error ? [r.message, r.stack].join(`
`) : JSON.stringify(r, null, 2), N = [], A = (r) => {
  N.push(r);
}, v = (r) => {
  if (r.raw === !0)
    A(r.message);
  else {
    const e = W(
      typeof r.message == "object" ? B(r.message) : r.message,
      r.severity ?? "Info",
      r.prefix ?? "JavaScript"
    );
    A(e);
  }
};
class P extends EventTarget {
  // constructor
  constructor(e = []) {
    super(), this.handlers = e, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(v) ? [...N] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
  logMessage(e, ...t) {
    for (const o of this.handlers)
      o(e, ...t);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
}
const M = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [v, R];
  } catch {
  }
  return [v, I, R];
}, b = new P(M()), w = (r) => r.replace(/\t/g, ""), W = (r, e, t) => {
  const o = /* @__PURE__ */ new Date(), n = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(o).replace(/ /g, "-"), i = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(o), s = n + " " + i;
  return r = w(r), `[${s}] ${t} ${e}: ${r}`;
}, D = Symbol("SleepFinished");
function L(r) {
  return new Promise((e) => {
    setTimeout(() => e(D), r);
  });
}
class S extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class $ {
  constructor({ concurrency: e, timeout: t }) {
    this._running = 0, this.concurrency = e, this.timeout = t, this.queue = [];
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
        const e = new Promise((t) => {
          this.queue.push(t);
        });
        this.timeout !== void 0 ? await Promise.race([e, L(this.timeout)]).then(
          (t) => {
            if (t === D)
              throw new S();
          }
        ) : await e;
      } else {
        this._running++;
        let e = !1;
        return () => {
          e || (e = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(e) {
    const t = await this.acquire();
    try {
      return await e();
    } finally {
      t();
    }
  }
}
function g(...r) {
  let e = r.join("/");
  const t = e[0] === "/", o = e.substring(e.length - 1) === "/";
  return e = T(e), !e && !t && (e = "."), e && o && (e += "/"), e;
}
function _(r) {
  if (r === "/")
    return "/";
  r = T(r);
  const e = r.lastIndexOf("/");
  return e === -1 ? "" : e === 0 ? "/" : r.substr(0, e);
}
function q(r) {
  if (r === "/")
    return "/";
  r = T(r);
  const e = r.lastIndexOf("/");
  return e === -1 ? r : r.substr(e + 1);
}
function T(r) {
  const e = r[0] === "/";
  return r = j(
    r.split("/").filter((t) => !!t),
    !e
  ).join("/"), (e ? "/" : "") + r.replace(/\/$/, "");
}
function j(r, e) {
  let t = 0;
  for (let o = r.length - 1; o >= 0; o--) {
    const n = r[o];
    n === "." ? r.splice(o, 1) : n === ".." ? (r.splice(o, 1), t++) : t && (r.splice(o, 1), t--);
  }
  if (e)
    for (; t; t--)
      r.unshift("..");
  return r;
}
var J = Object.defineProperty, z = Object.getOwnPropertyDescriptor, d = (r, e, t, o) => {
  for (var n = o > 1 ? void 0 : o ? z(e, t) : e, i = r.length - 1, s; i >= 0; i--)
    (s = r[i]) && (n = (o ? s(e, t, n) : s(n)) || n);
  return o && n && J(e, t, n), n;
};
const f = class c {
  static readFileAsText(e, t) {
    return new TextDecoder().decode(c.readFileAsBuffer(e, t));
  }
  static readFileAsBuffer(e, t) {
    return e.readFile(t);
  }
  static writeFile(e, t, o) {
    e.writeFile(t, o);
  }
  static unlink(e, t) {
    e.unlink(t);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(e, t, o) {
    try {
      const n = e.lookupPath(t).node.mount, i = c.fileExists(e, o) ? e.lookupPath(o).node.mount : e.lookupPath(_(o)).node.mount;
      n.mountpoint !== i.mountpoint ? (c.copyRecursive(e, t, o), c.rmdir(e, t, { recursive: !0 })) : e.rename(t, o);
    } catch (n) {
      const i = O(n);
      throw i ? new Error(
        `Could not move ${t} to ${o}: ${i}`,
        {
          cause: n
        }
      ) : n;
    }
  }
  static rmdir(e, t, o = { recursive: !0 }) {
    o != null && o.recursive && c.listFiles(e, t).forEach((n) => {
      const i = `${t}/${n}`;
      c.isDir(e, i) ? c.rmdir(e, i, o) : c.unlink(e, i);
    }), e.rmdir(t);
  }
  static listFiles(e, t, o = { prependPath: !1 }) {
    if (!c.fileExists(e, t))
      return [];
    try {
      const n = e.readdir(t).filter(
        (i) => i !== "." && i !== ".."
      );
      if (o.prependPath) {
        const i = t.replace(/\/$/, "");
        return n.map((s) => `${i}/${s}`);
      }
      return n;
    } catch (n) {
      return b.error(n, { path: t }), [];
    }
  }
  static isDir(e, t) {
    return c.fileExists(e, t) ? e.isDir(e.lookupPath(t).node.mode) : !1;
  }
  static fileExists(e, t) {
    try {
      return e.lookupPath(t), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(e, t) {
    e.mkdirTree(t);
  }
  static copyRecursive(e, t, o) {
    const n = e.lookupPath(t).node;
    if (e.isDir(n.mode)) {
      e.mkdirTree(o);
      const i = e.readdir(t).filter(
        (s) => s !== "." && s !== ".."
      );
      for (const s of i)
        c.copyRecursive(
          e,
          g(t, s),
          g(o, s)
        );
    } else
      e.writeFile(o, e.readFile(t));
  }
};
d([
  u('Could not read "{path}"')
], f, "readFileAsText", 1);
d([
  u('Could not read "{path}"')
], f, "readFileAsBuffer", 1);
d([
  u('Could not write to "{path}"')
], f, "writeFile", 1);
d([
  u('Could not unlink "{path}"')
], f, "unlink", 1);
d([
  u('Could not remove directory "{path}"')
], f, "rmdir", 1);
d([
  u('Could not list files in "{path}"')
], f, "listFiles", 1);
d([
  u('Could not stat "{path}"')
], f, "isDir", 1);
d([
  u('Could not stat "{path}"')
], f, "fileExists", 1);
d([
  u('Could not create directory "{path}"')
], f, "mkdir", 1);
d([
  u('Could not copy files from "{path}"')
], f, "copyRecursive", 1);
(function() {
  var r;
  return typeof process < "u" && ((r = process.release) == null ? void 0 : r.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
const p = Symbol("__private__dont__use");
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const r = this.getReader();
  try {
    for (; ; ) {
      const { done: e, value: t } = await r.read();
      if (e)
        return;
      yield t;
    }
  } finally {
    r.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
function Y(r, e, t = () => {
}) {
  function o() {
    e = H(e);
    const i = r[p].FS, s = G(i, (l) => {
      if (l.path.startsWith(e))
        t(l);
      else if (l.operation === "RENAME" && l.toPath.startsWith(e))
        for (const y of F(
          r,
          l.path,
          l.toPath
        ))
          t(y);
    }), a = {};
    for (const [l] of Object.entries(s))
      a[l] = i[l];
    function m() {
      for (const [l, y] of Object.entries(s))
        i[l] = function(...k) {
          return y(...k), a[l].apply(this, k);
        };
    }
    function h() {
      for (const [l, y] of Object.entries(a))
        r[p].FS[l] = y;
    }
    r[p].journal = {
      bind: m,
      unbind: h
    }, m();
  }
  r.addEventListener("runtime.initialized", o), r[p] && o();
  function n() {
    r[p].journal.unbind(), delete r[p].journal;
  }
  return r.addEventListener("runtime.beforedestroy", n), function() {
    return r.removeEventListener("runtime.initialized", o), r.removeEventListener("runtime.beforedestroy", n), r[p].journal.unbind();
  };
}
const G = (r, e = () => {
}) => ({
  write(t) {
    e({
      operation: "WRITE",
      path: t.path,
      nodeType: "file"
    });
  },
  truncate(t) {
    let o;
    typeof t == "string" ? o = r.lookupPath(t, {
      follow: !0
    }).node : o = t, e({
      operation: "WRITE",
      path: r.getPath(o),
      nodeType: "file"
    });
  },
  unlink(t) {
    e({
      operation: "DELETE",
      path: t,
      nodeType: "file"
    });
  },
  mknod(t, o) {
    r.isFile(o) && e({
      operation: "CREATE",
      path: t,
      nodeType: "file"
    });
  },
  mkdir(t) {
    e({
      operation: "CREATE",
      path: t,
      nodeType: "directory"
    });
  },
  rmdir(t) {
    e({
      operation: "DELETE",
      path: t,
      nodeType: "directory"
    });
  },
  rename(t, o) {
    try {
      const n = r.lookupPath(t, {
        follow: !0
      }), i = r.lookupPath(o, {
        parent: !0
      }).path;
      e({
        operation: "RENAME",
        nodeType: r.isDir(n.node.mode) ? "directory" : "file",
        path: n.path,
        toPath: g(i, q(o))
      });
    } catch {
    }
  }
});
function Q(r, e) {
  r[p].journal.unbind();
  try {
    for (const t of e)
      t.operation === "CREATE" ? t.nodeType === "file" ? r.writeFile(t.path, " ") : r.mkdir(t.path) : t.operation === "DELETE" ? t.nodeType === "file" ? r.unlink(t.path) : r.rmdir(t.path) : t.operation === "WRITE" ? r.writeFile(t.path, t.data) : t.operation === "RENAME" && r.mv(t.path, t.toPath);
  } finally {
    r[p].journal.bind();
  }
}
function* F(r, e, t) {
  if (r.isDir(e)) {
    yield {
      operation: "CREATE",
      path: t,
      nodeType: "directory"
    };
    for (const o of r.listFiles(e))
      yield* F(
        r,
        g(e, o),
        g(t, o)
      );
  } else
    yield {
      operation: "CREATE",
      path: t,
      nodeType: "file"
    }, yield {
      operation: "WRITE",
      nodeType: "file",
      path: t
    };
}
function H(r) {
  return r.replace(/\/$/, "").replace(/\/\/+/g, "/");
}
function U(r) {
  const e = {};
  for (let t = r.length - 1; t >= 0; t--) {
    for (let o = t - 1; o >= 0; o--) {
      const n = Z(r[t], r[o]);
      if (n === "none")
        continue;
      const i = r[t], s = r[o];
      if (i.operation === "RENAME" && s.operation === "RENAME") {
        b.warn(
          "[FS Journal] Normalizing a double rename is not yet supported:",
          {
            current: i,
            last: s
          }
        );
        continue;
      }
      (s.operation === "CREATE" || s.operation === "WRITE") && (i.operation === "RENAME" ? n === "same_node" ? (e[o] = [], e[t] = [
        {
          ...s,
          path: i.toPath
        },
        ...e[t] || []
      ]) : n === "descendant" && (e[o] = [], e[t] = [
        {
          ...s,
          path: g(
            i.toPath,
            s.path.substring(i.path.length)
          )
        },
        ...e[t] || []
      ]) : i.operation === "WRITE" && n === "same_node" ? e[o] = [] : i.operation === "DELETE" && n === "same_node" && (e[o] = [], e[t] = []));
    }
    if (Object.entries(e).length > 0) {
      const o = r.flatMap((n, i) => i in e ? e[i] : [n]);
      return U(o);
    }
  }
  return r;
}
function Z(r, e) {
  const t = r.path, o = r.operation !== "WRITE" && r.nodeType === "directory", n = e.operation !== "WRITE" && e.nodeType === "directory", i = e.operation === "RENAME" ? e.toPath : e.path;
  return i === t ? "same_node" : n && t.startsWith(i + "/") ? "ancestor" : o && i.startsWith(t + "/") ? "descendant" : "none";
}
async function X(r, e) {
  const o = e.filter(
    (n) => n.operation === "WRITE"
  ).map((n) => V(r, n));
  return await Promise.all(o), e;
}
const K = new $({ concurrency: 15 });
async function V(r, e) {
  const t = await K.acquire();
  try {
    e.data = await r.readFileAsBuffer(e.path);
  } catch (o) {
    b.warn(
      `Journal failed to hydrate a file on flush: the path ${e.path} no longer exists`
    ), b.error(o);
  }
  t();
}
export {
  X as hydrateUpdateFileOps,
  Y as journalFSEvents,
  U as normalizeFilesystemOperations,
  Q as replayFSJournal
};
