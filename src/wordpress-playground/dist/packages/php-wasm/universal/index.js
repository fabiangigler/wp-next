var Y = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var u = (t, e, r) => (Y(t, e, "read from private field"), r ? r.call(t) : e.get(t)), p = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, f = (t, e, r, s) => (Y(t, e, "write to private field"), s ? s.call(t, r) : e.set(t, r), r);
var h = (t, e, r) => (Y(t, e, "access private method"), r);
const currentJsRuntime$1 = function() {
  var t;
  return typeof process < "u" && ((t = process.release) == null ? void 0 : t.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (currentJsRuntime$1 === "NODE") {
  let t = function(r) {
    return new Promise(function(s, n) {
      r.onload = r.onerror = function(i) {
        r.onload = r.onerror = null, i.type === "load" ? s(r.result) : n(new Error("Failed to read the blob/file"));
      };
    });
  }, e = function() {
    const r = new Uint8Array([1, 2, 3, 4]), n = new File([r], "test").stream();
    try {
      return n.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class r extends Blob {
      constructor(n, i, o) {
        super(n);
        let l;
        o != null && o.lastModified && (l = /* @__PURE__ */ new Date()), (!l || isNaN(l.getFullYear())) && (l = /* @__PURE__ */ new Date()), this.lastModifiedDate = l, this.lastModified = l.getMilliseconds(), this.name = i || "";
      }
    }
    global.File = r;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const s = new FileReader();
    return s.readAsArrayBuffer(this), t(s);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const s = new FileReader();
    return s.readAsText(this), t(s);
  }), (typeof Blob.prototype.stream > "u" || !e()) && (Blob.prototype.stream = function() {
    let r = 0;
    const s = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(n) {
        const i = n.byobRequest.view, l = await s.slice(
          r,
          r + i.byteLength
        ).arrayBuffer(), c = new Uint8Array(l);
        new Uint8Array(i.buffer).set(c);
        const a = c.byteLength;
        n.byobRequest.respond(a), r += a, r >= s.size && n.close();
      }
    });
  });
}
if (currentJsRuntime$1 === "NODE" && typeof CustomEvent > "u") {
  class t extends Event {
    constructor(r, s = {}) {
      super(r, s), this.detail = s.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = t;
}
const FileErrorCodes = {
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
function getEmscriptenFsError(t) {
  const e = typeof t == "object" ? t == null ? void 0 : t.errno : null;
  if (e in FileErrorCodes)
    return FileErrorCodes[e];
}
function rethrowFileSystemError(t = "") {
  return function(r, s, n) {
    const i = n.value;
    n.value = function(...o) {
      try {
        return i.apply(this, o);
      } catch (l) {
        const c = typeof l == "object" ? l == null ? void 0 : l.errno : null;
        if (c in FileErrorCodes) {
          const a = FileErrorCodes[c], d = typeof o[1] == "string" ? o[1] : null, m = d !== null ? t.replaceAll("{path}", d) : t;
          throw new Error(`${m}: ${a}`, {
            cause: l
          });
        }
        throw l;
      }
    };
  };
}
const logEventType = "playground-log", logEvent = (t, ...e) => {
  logger.dispatchEvent(
    new CustomEvent(logEventType, {
      detail: {
        log: t,
        args: e
      }
    })
  );
}, logToConsole = (t, ...e) => {
  switch (typeof t.message == "string" ? t.message = prepareLogMessage(t.message) : t.message.message && typeof t.message.message == "string" && (t.message.message = prepareLogMessage(t.message.message)), t.severity) {
    case "Debug":
      console.debug(t.message, ...e);
      break;
    case "Info":
      console.info(t.message, ...e);
      break;
    case "Warn":
      console.warn(t.message, ...e);
      break;
    case "Error":
      console.error(t.message, ...e);
      break;
    case "Fatal":
      console.error(t.message, ...e);
      break;
    default:
      console.log(t.message, ...e);
  }
}, prepareLogMessage$1 = (t) => t instanceof Error ? [t.message, t.stack].join(`
`) : JSON.stringify(t, null, 2), logs = [], addToLogArray = (t) => {
  logs.push(t);
}, logToMemory = (t) => {
  if (t.raw === !0)
    addToLogArray(t.message);
  else {
    const e = formatLogEntry(
      typeof t.message == "object" ? prepareLogMessage$1(t.message) : t.message,
      t.severity ?? "Info",
      t.prefix ?? "JavaScript"
    );
    addToLogArray(e);
  }
};
class Logger extends EventTarget {
  // constructor
  constructor(e = []) {
    super(), this.handlers = e, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(logToMemory) ? [...logs] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
  logMessage(e, ...r) {
    for (const s of this.handlers)
      s(e, ...r);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(e, ...r) {
    this.logMessage(
      {
        message: e,
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
  debug(e, ...r) {
    this.logMessage(
      {
        message: e,
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
  info(e, ...r) {
    this.logMessage(
      {
        message: e,
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
  warn(e, ...r) {
    this.logMessage(
      {
        message: e,
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
  error(e, ...r) {
    this.logMessage(
      {
        message: e,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
}
const getDefaultHandlers = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [logToMemory, logEvent];
  } catch {
  }
  return [logToMemory, logToConsole, logEvent];
}, logger = new Logger(getDefaultHandlers()), prepareLogMessage = (t) => t.replace(/\t/g, ""), formatLogEntry = (t, e, r) => {
  const s = /* @__PURE__ */ new Date(), n = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(s).replace(/ /g, "-"), i = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(s), o = n + " " + i;
  return t = prepareLogMessage(t), `[${o}] ${r} ${e}: ${t}`;
}, SleepFinished = Symbol("SleepFinished");
function sleep(t) {
  return new Promise((e) => {
    setTimeout(() => e(SleepFinished), t);
  });
}
class AcquireTimeoutError extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Semaphore {
  constructor({ concurrency: e, timeout: r }) {
    this._running = 0, this.concurrency = e, this.timeout = r, this.queue = [];
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
        const e = new Promise((r) => {
          this.queue.push(r);
        });
        this.timeout !== void 0 ? await Promise.race([e, sleep(this.timeout)]).then(
          (r) => {
            if (r === SleepFinished)
              throw new AcquireTimeoutError();
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
    const r = await this.acquire();
    try {
      return await e();
    } finally {
      r();
    }
  }
}
function joinPaths(...t) {
  let e = t.join("/");
  const r = e[0] === "/", s = e.substring(e.length - 1) === "/";
  return e = normalizePath(e), !e && !r && (e = "."), e && s && (e += "/"), e;
}
function dirname(t) {
  if (t === "/")
    return "/";
  t = normalizePath(t);
  const e = t.lastIndexOf("/");
  return e === -1 ? "" : e === 0 ? "/" : t.substr(0, e);
}
function normalizePath(t) {
  const e = t[0] === "/";
  return t = normalizePathsArray(
    t.split("/").filter((r) => !!r),
    !e
  ).join("/"), (e ? "/" : "") + t.replace(/\/$/, "");
}
function normalizePathsArray(t, e) {
  let r = 0;
  for (let s = t.length - 1; s >= 0; s--) {
    const n = t[s];
    n === "." ? t.splice(s, 1) : n === ".." ? (t.splice(s, 1), r++) : r && (t.splice(s, 1), r--);
  }
  if (e)
    for (; r; r--)
      t.unshift("..");
  return t;
}
function splitShellCommand(t) {
  let s = 0, n = "";
  const i = [];
  let o = "";
  for (let l = 0; l < t.length; l++) {
    const c = t[l];
    c === "\\" ? ((t[l + 1] === '"' || t[l + 1] === "'") && l++, o += t[l]) : s === 0 ? c === '"' || c === "'" ? (s = 1, n = c) : c.match(/\s/) ? (o.trim().length && i.push(o.trim()), o = c) : i.length && !o ? o = i.pop() + c : o += c : s === 1 && (c === n ? (s = 0, n = "") : o += c);
  }
  return o && i.push(o.trim()), i;
}
function createSpawnHandler(t) {
  return function(e, r = [], s = {}) {
    const n = new ChildProcess(), i = new ProcessApi(n);
    return setTimeout(async () => {
      let o = [];
      if (r.length)
        o = [e, ...r];
      else if (typeof e == "string")
        o = splitShellCommand(e);
      else if (Array.isArray(e))
        o = e;
      else
        throw new Error("Invalid command ", e);
      try {
        await t(o, i, s);
      } catch (l) {
        n.emit("error", l), typeof l == "object" && l !== null && "message" in l && typeof l.message == "string" && i.stderr(l.message), i.exit(1);
      }
      n.emit("spawn", !0);
    }), n;
  };
}
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  emit(e, r) {
    this.listeners[e] && this.listeners[e].forEach(function(s) {
      s(r);
    });
  }
  on(e, r) {
    this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(r);
  }
}
class ProcessApi extends EventEmitter {
  constructor(e) {
    super(), this.childProcess = e, this.exited = !1, this.stdinData = [], e.on("stdin", (r) => {
      this.stdinData ? this.stdinData.push(r.slice()) : this.emit("stdin", r);
    });
  }
  stdout(e) {
    typeof e == "string" && (e = new TextEncoder().encode(e)), this.childProcess.stdout.emit("data", e);
  }
  stdoutEnd() {
    this.childProcess.stdout.emit("end", {});
  }
  stderr(e) {
    typeof e == "string" && (e = new TextEncoder().encode(e)), this.childProcess.stderr.emit("data", e);
  }
  stderrEnd() {
    this.childProcess.stderr.emit("end", {});
  }
  exit(e) {
    this.exited || (this.exited = !0, this.childProcess.emit("exit", e));
  }
  flushStdin() {
    if (this.stdinData)
      for (let e = 0; e < this.stdinData.length; e++)
        this.emit("stdin", this.stdinData[e]);
    this.stdinData = null;
  }
}
let lastPid = 9743;
class ChildProcess extends EventEmitter {
  constructor(e = lastPid++) {
    super(), this.pid = e, this.stdout = new EventEmitter(), this.stderr = new EventEmitter();
    const r = this;
    this.stdin = {
      write: (s) => {
        r.emit("stdin", s);
      }
    };
  }
}
var __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __decorateClass = (t, e, r, s) => {
  for (var n = s > 1 ? void 0 : s ? __getOwnPropDesc(e, r) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (n = (s ? o(e, r, n) : o(n)) || n);
  return s && n && __defProp(e, r, n), n;
};
const _FSHelpers = class g {
  static readFileAsText(e, r) {
    return new TextDecoder().decode(g.readFileAsBuffer(e, r));
  }
  static readFileAsBuffer(e, r) {
    return e.readFile(r);
  }
  static writeFile(e, r, s) {
    e.writeFile(r, s);
  }
  static unlink(e, r) {
    e.unlink(r);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(e, r, s) {
    try {
      const n = e.lookupPath(r).node.mount, i = g.fileExists(e, s) ? e.lookupPath(s).node.mount : e.lookupPath(dirname(s)).node.mount;
      n.mountpoint !== i.mountpoint ? (g.copyRecursive(e, r, s), g.rmdir(e, r, { recursive: !0 })) : e.rename(r, s);
    } catch (n) {
      const i = getEmscriptenFsError(n);
      throw i ? new Error(
        `Could not move ${r} to ${s}: ${i}`,
        {
          cause: n
        }
      ) : n;
    }
  }
  static rmdir(e, r, s = { recursive: !0 }) {
    s != null && s.recursive && g.listFiles(e, r).forEach((n) => {
      const i = `${r}/${n}`;
      g.isDir(e, i) ? g.rmdir(e, i, s) : g.unlink(e, i);
    }), e.rmdir(r);
  }
  static listFiles(e, r, s = { prependPath: !1 }) {
    if (!g.fileExists(e, r))
      return [];
    try {
      const n = e.readdir(r).filter(
        (i) => i !== "." && i !== ".."
      );
      if (s.prependPath) {
        const i = r.replace(/\/$/, "");
        return n.map((o) => `${i}/${o}`);
      }
      return n;
    } catch (n) {
      return logger.error(n, { path: r }), [];
    }
  }
  static isDir(e, r) {
    return g.fileExists(e, r) ? e.isDir(e.lookupPath(r).node.mode) : !1;
  }
  static fileExists(e, r) {
    try {
      return e.lookupPath(r), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(e, r) {
    e.mkdirTree(r);
  }
  static copyRecursive(e, r, s) {
    const n = e.lookupPath(r).node;
    if (e.isDir(n.mode)) {
      e.mkdirTree(s);
      const i = e.readdir(r).filter(
        (o) => o !== "." && o !== ".."
      );
      for (const o of i)
        g.copyRecursive(
          e,
          joinPaths(r, o),
          joinPaths(s, o)
        );
    } else
      e.writeFile(s, e.readFile(r));
  }
};
__decorateClass([
  rethrowFileSystemError('Could not read "{path}"')
], _FSHelpers, "readFileAsText", 1);
__decorateClass([
  rethrowFileSystemError('Could not read "{path}"')
], _FSHelpers, "readFileAsBuffer", 1);
__decorateClass([
  rethrowFileSystemError('Could not write to "{path}"')
], _FSHelpers, "writeFile", 1);
__decorateClass([
  rethrowFileSystemError('Could not unlink "{path}"')
], _FSHelpers, "unlink", 1);
__decorateClass([
  rethrowFileSystemError('Could not remove directory "{path}"')
], _FSHelpers, "rmdir", 1);
__decorateClass([
  rethrowFileSystemError('Could not list files in "{path}"')
], _FSHelpers, "listFiles", 1);
__decorateClass([
  rethrowFileSystemError('Could not stat "{path}"')
], _FSHelpers, "isDir", 1);
__decorateClass([
  rethrowFileSystemError('Could not stat "{path}"')
], _FSHelpers, "fileExists", 1);
__decorateClass([
  rethrowFileSystemError('Could not create directory "{path}"')
], _FSHelpers, "mkdir", 1);
__decorateClass([
  rethrowFileSystemError('Could not copy files from "{path}"')
], _FSHelpers, "copyRecursive", 1);
let FSHelpers = _FSHelpers;
const _private = /* @__PURE__ */ new WeakMap();
class PHPWorker {
  /** @inheritDoc */
  constructor(e, r) {
    this.absoluteUrl = "", this.documentRoot = "", _private.set(this, {
      monitor: r
    }), e && this.__internal_setRequestHandler(e);
  }
  __internal_setRequestHandler(e) {
    this.absoluteUrl = e.absoluteUrl, this.documentRoot = e.documentRoot, _private.set(this, {
      ..._private.get(this),
      requestHandler: e
    });
  }
  /**
   * @internal
   * @deprecated
   * Do not use this method directly in the code consuming
   * the web API. It will change or even be removed without
   * a warning.
   */
  __internal_getPHP() {
    return _private.get(this).php;
  }
  async setPrimaryPHP(e) {
    _private.set(this, {
      ..._private.get(this),
      php: e
    });
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.pathToInternalUrl  */
  pathToInternalUrl(e) {
    return _private.get(this).requestHandler.pathToInternalUrl(e);
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.internalUrlToPath  */
  internalUrlToPath(e) {
    return _private.get(this).requestHandler.internalUrlToPath(e);
  }
  /**
   * The onDownloadProgress event listener.
   */
  async onDownloadProgress(e) {
    var r;
    return (r = _private.get(this).monitor) == null ? void 0 : r.addEventListener("progress", e);
  }
  /** @inheritDoc @php-wasm/universal!PHP.mv  */
  async mv(e, r) {
    return _private.get(this).php.mv(e, r);
  }
  /** @inheritDoc @php-wasm/universal!PHP.rmdir  */
  async rmdir(e, r) {
    return _private.get(this).php.rmdir(e, r);
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.request */
  async request(e) {
    return await _private.get(this).requestHandler.request(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.run */
  async run(e) {
    const { php: r, reap: s } = await _private.get(this).requestHandler.processManager.acquirePHPInstance();
    try {
      return await r.run(e);
    } finally {
      s();
    }
  }
  /** @inheritDoc @php-wasm/universal!/PHP.chdir */
  chdir(e) {
    return _private.get(this).php.chdir(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.setSapiName */
  setSapiName(e) {
    _private.get(this).php.setSapiName(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.mkdir */
  mkdir(e) {
    return _private.get(this).php.mkdir(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.mkdirTree */
  mkdirTree(e) {
    return _private.get(this).php.mkdirTree(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.readFileAsText */
  readFileAsText(e) {
    return _private.get(this).php.readFileAsText(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.readFileAsBuffer */
  readFileAsBuffer(e) {
    return _private.get(this).php.readFileAsBuffer(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.writeFile */
  writeFile(e, r) {
    return _private.get(this).php.writeFile(e, r);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.unlink */
  unlink(e) {
    return _private.get(this).php.unlink(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.listFiles */
  listFiles(e, r) {
    return _private.get(this).php.listFiles(e, r);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.isDir */
  isDir(e) {
    return _private.get(this).php.isDir(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.fileExists */
  fileExists(e) {
    return _private.get(this).php.fileExists(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.onMessage */
  onMessage(e) {
    _private.get(this).php.onMessage(e);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.defineConstant */
  defineConstant(e, r) {
    _private.get(this).php.defineConstant(e, r);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.addEventListener */
  addEventListener(e, r) {
    _private.get(this).php.addEventListener(e, r);
  }
  /** @inheritDoc @php-wasm/universal!/PHP.removeEventListener */
  removeEventListener(e, r) {
    _private.get(this).php.removeEventListener(e, r);
  }
}
const responseTexts = {
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
class PHPResponse {
  constructor(e, r, s, n = "", i = 0) {
    this.httpStatusCode = e, this.headers = r, this.bytes = s, this.exitCode = i, this.errors = n;
  }
  static forHttpCode(e, r = "") {
    return new PHPResponse(
      e,
      {},
      new TextEncoder().encode(
        r || responseTexts[e] || ""
      )
    );
  }
  static fromRawData(e) {
    return new PHPResponse(
      e.httpStatusCode,
      e.headers,
      e.bytes,
      e.errors,
      e.exitCode
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
const RuntimeId = Symbol("RuntimeId"), loadedRuntimes = /* @__PURE__ */ new Map();
let lastRuntimeId = 0;
async function loadPHPRuntime(t, e = {}) {
  const [r, s, n] = makePromise(), i = t.init(currentJsRuntime, {
    onAbort(l) {
      n(l), logger.error(l);
    },
    ENV: {},
    // Emscripten sometimes prepends a '/' to the path, which
    // breaks vite dev mode. An identity `locateFile` function
    // fixes it.
    locateFile: (l) => l,
    ...e,
    noInitialRun: !0,
    onRuntimeInitialized() {
      e.onRuntimeInitialized && e.onRuntimeInitialized(), s();
    }
  });
  await r;
  const o = ++lastRuntimeId;
  return i.id = o, i.originalExit = i._exit, i._exit = function(l) {
    return loadedRuntimes.delete(o), i.originalExit(l);
  }, i[RuntimeId] = o, loadedRuntimes.set(o, i), o;
}
function getLoadedRuntime(t) {
  return loadedRuntimes.get(t);
}
const currentJsRuntime = function() {
  var t;
  return typeof process < "u" && ((t = process.release) == null ? void 0 : t.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
}(), makePromise = () => {
  const t = [], e = new Promise((r, s) => {
    t.push(r, s);
  });
  return t.unshift(e), t;
}, kError = Symbol("error"), kMessage = Symbol("message");
class ErrorEvent2 extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param type The name of the event
   * @param options A dictionary object that allows for setting
   *                  attributes via object members of the same name.
   */
  constructor(e, r = {}) {
    super(e), this[kError] = r.error === void 0 ? null : r.error, this[kMessage] = r.message === void 0 ? "" : r.message;
  }
  get error() {
    return this[kError];
  }
  get message() {
    return this[kMessage];
  }
}
Object.defineProperty(ErrorEvent2.prototype, "error", { enumerable: !0 });
Object.defineProperty(ErrorEvent2.prototype, "message", { enumerable: !0 });
const ErrorEvent = typeof globalThis.ErrorEvent == "function" ? globalThis.ErrorEvent : ErrorEvent2;
function isExitCodeZero(t) {
  return t instanceof Error ? "exitCode" in t && (t == null ? void 0 : t.exitCode) === 0 || (t == null ? void 0 : t.name) === "ExitStatus" && "status" in t && t.status === 0 : !1;
}
class UnhandledRejectionsTarget extends EventTarget {
  constructor() {
    super(...arguments), this.listenersCount = 0;
  }
  addEventListener(e, r) {
    ++this.listenersCount, super.addEventListener(e, r);
  }
  removeEventListener(e, r) {
    --this.listenersCount, super.removeEventListener(e, r);
  }
  hasListeners() {
    return this.listenersCount > 0;
  }
}
function improveWASMErrorReporting(t) {
  const e = new UnhandledRejectionsTarget();
  for (const r in t.wasmExports)
    if (typeof t.wasmExports[r] == "function") {
      const s = t.wasmExports[r];
      t.wasmExports[r] = function(...n) {
        var i;
        try {
          return s(...n);
        } catch (o) {
          if (!(o instanceof Error))
            throw o;
          const l = clarifyErrorMessage(
            o,
            (i = t.lastAsyncifyStackSource) == null ? void 0 : i.stack
          );
          if (t.lastAsyncifyStackSource && (o.cause = t.lastAsyncifyStackSource), e.hasListeners()) {
            e.dispatchEvent(
              new ErrorEvent("error", {
                error: o,
                message: l
              })
            );
            return;
          }
          throw isExitCodeZero(o) || showCriticalErrorBox(l), o;
        }
      };
    }
  return e;
}
let functionsMaybeMissingFromAsyncify = [];
function getFunctionsMaybeMissingFromAsyncify() {
  return functionsMaybeMissingFromAsyncify;
}
function clarifyErrorMessage(t, e) {
  if (t.message === "unreachable") {
    let r = UNREACHABLE_ERROR;
    e || (r += `

This stack trace is lacking. For a better one initialize 
the PHP runtime with { debug: true }, e.g. PHPNode.load('8.1', { debug: true }).

`), functionsMaybeMissingFromAsyncify = extractPHPFunctionsFromStack(
      e || t.stack || ""
    );
    for (const s of functionsMaybeMissingFromAsyncify)
      r += `    * ${s}
`;
    return r;
  }
  return t.message;
}
const UNREACHABLE_ERROR = `
"unreachable" WASM instruction executed.

The typical reason is a PHP function missing from the ASYNCIFY_ONLY
list when building PHP.wasm.

You will need to file a new issue in the WordPress Playground repository
and paste this error message there:

https://github.com/WordPress/wordpress-playground/issues/new

If you're a core developer, the typical fix is to:

* Isolate a minimal reproduction of the error
* Add a reproduction of the error to php-asyncify.spec.ts in the WordPress Playground repository
* Run 'npm run fix-asyncify'
* Commit the changes, push to the repo, release updated NPM packages

Below is a list of all the PHP functions found in the stack trace to
help with the minimal reproduction. If they're all already listed in
the Dockerfile, you'll need to trigger this error again with long stack
traces enabled. In node.js, you can do it using the --stack-trace-limit=100
CLI option: 

`, redBg = "\x1B[41m", bold = "\x1B[1m", reset = "\x1B[0m", eol = "\x1B[K";
let logged = !1;
function showCriticalErrorBox(t) {
  if (!logged && (logged = !0, !(t != null && t.trim().startsWith("Program terminated with exit")))) {
    logger.log(`${redBg}
${eol}
${bold}  WASM ERROR${reset}${redBg}`);
    for (const e of t.split(`
`))
      logger.log(`${eol}  ${e} `);
    logger.log(`${reset}`);
  }
}
function extractPHPFunctionsFromStack(t) {
  try {
    const e = t.split(`
`).slice(1).map((r) => {
      const s = r.trim().substring(3).split(" ");
      return {
        fn: s.length >= 2 ? s[0] : "<unknown>",
        isWasm: r.includes("wasm://")
      };
    }).filter(
      ({ fn: r, isWasm: s }) => s && !r.startsWith("dynCall_") && !r.startsWith("invoke_")
    ).map(({ fn: r }) => r);
    return Array.from(new Set(e));
  } catch {
    return [];
  }
}
const STRING = "string", NUMBER = "number", __private__dont__use = Symbol("__private__dont__use");
class PHPExecutionFailureError extends Error {
  constructor(e, r, s) {
    super(e), this.response = r, this.source = s;
  }
}
const PHP_INI_PATH = "/internal/shared/php.ini", AUTO_PREPEND_SCRIPT = "/internal/shared/auto_prepend_file.php";
var S, E, x, v, R, M, ee, N, te, U, re, O, se, L, ne, D, ie, j, oe, $, ae, B, le, q, ce, I, K, z, ue, W, pe, G, de;
class PHP {
  /**
   * Initializes a PHP runtime.
   *
   * @internal
   * @param  PHPRuntime - Optional. PHP Runtime ID as initialized by loadPHPRuntime.
   * @param  requestHandlerOptions - Optional. Options for the PHPRequestHandler. If undefined, no request handler will be initialized.
   */
  constructor(t) {
    /**
     * Prepares the $_SERVER entries for the PHP runtime.
     *
     * @param defaults Default entries to include in $_SERVER.
     * @param headers HTTP headers to include in $_SERVER (as HTTP_ prefixed entries).
     * @param port HTTP port, used to determine infer $_SERVER['HTTPS'] value if none
     *             was provided.
     * @returns Computed $_SERVER entries.
     */
    p(this, M);
    p(this, N);
    p(this, U);
    p(this, O);
    p(this, L);
    p(this, D);
    p(this, j);
    p(this, $);
    p(this, B);
    p(this, q);
    p(this, I);
    p(this, z);
    p(this, W);
    p(this, G);
    p(this, S, void 0);
    p(this, E, void 0);
    p(this, x, void 0);
    p(this, v, void 0);
    p(this, R, void 0);
    f(this, E, !1), f(this, x, null), f(this, v, /* @__PURE__ */ new Map()), f(this, R, []), this.semaphore = new Semaphore({ concurrency: 1 }), t !== void 0 && this.initializeRuntime(t);
  }
  /**
   * Adds an event listener for a PHP event.
   * @param eventType - The type of event to listen for.
   * @param listener - The listener function to be called when the event is triggered.
   */
  addEventListener(t, e) {
    u(this, v).has(t) || u(this, v).set(t, /* @__PURE__ */ new Set()), u(this, v).get(t).add(e);
  }
  /**
   * Removes an event listener for a PHP event.
   * @param eventType - The type of event to remove the listener from.
   * @param listener - The listener function to be removed.
   */
  removeEventListener(t, e) {
    var r;
    (r = u(this, v).get(t)) == null || r.delete(e);
  }
  dispatchEvent(t) {
    const e = u(this, v).get(t.type);
    if (e)
      for (const r of e)
        r(t);
  }
  /**
   * Listens to message sent by the PHP code.
   *
   * To dispatch messages, call:
   *
   *     post_message_to_js(string $data)
   *
   *     Arguments:
   *         $data (string) – Data to pass to JavaScript.
   *
   * @example
   *
   * ```ts
   * const php = await PHP.load('8.0');
   *
   * php.onMessage(
   *     // The data is always passed as a string
   *     function (data: string) {
   *         // Let's decode and log the data:
   *         console.log(JSON.parse(data));
   *     }
   * );
   *
   * // Now that we have a listener in place, let's
   * // dispatch a message:
   * await php.run({
   *     code: `<?php
   *         post_message_to_js(
   *             json_encode([
   *                 'post_id' => '15',
   *                 'post_title' => 'This is a blog post!'
   *             ])
   *         ));
   *     `,
   * });
   * ```
   *
   * @param listener Callback function to handle the message.
   */
  onMessage(t) {
    u(this, R).push(t);
  }
  async setSpawnHandler(handler) {
    typeof handler == "string" && (handler = createSpawnHandler(eval(handler))), this[__private__dont__use].spawnProcess = handler;
  }
  /** @deprecated Use PHPRequestHandler instead. */
  get absoluteUrl() {
    return this.requestHandler.absoluteUrl;
  }
  /** @deprecated Use PHPRequestHandler instead. */
  get documentRoot() {
    return this.requestHandler.documentRoot;
  }
  /** @deprecated Use PHPRequestHandler instead. */
  pathToInternalUrl(t) {
    return this.requestHandler.pathToInternalUrl(t);
  }
  /** @deprecated Use PHPRequestHandler instead. */
  internalUrlToPath(t) {
    return this.requestHandler.internalUrlToPath(t);
  }
  initializeRuntime(t) {
    if (this[__private__dont__use])
      throw new Error("PHP runtime already initialized.");
    const e = getLoadedRuntime(t);
    if (!e)
      throw new Error("Invalid PHP runtime id.");
    this[__private__dont__use] = e, this[__private__dont__use].ccall(
      "wasm_set_phpini_path",
      null,
      ["string"],
      [PHP_INI_PATH]
    ), this.fileExists(PHP_INI_PATH) || this.writeFile(
      PHP_INI_PATH,
      [
        "auto_prepend_file=" + AUTO_PREPEND_SCRIPT,
        "memory_limit=256M",
        "ignore_repeated_errors = 1",
        "error_reporting = E_ALL",
        "display_errors = 1",
        "html_errors = 1",
        "display_startup_errors = On",
        "log_errors = 1",
        "always_populate_raw_post_data = -1",
        "upload_max_filesize = 2000M",
        "post_max_size = 2000M",
        "disable_functions = curl_exec,curl_multi_exec",
        "allow_url_fopen = Off",
        "allow_url_include = Off",
        "session.save_path = /home/web_user",
        "implicit_flush = 1",
        "output_buffering = 0",
        "max_execution_time = 0",
        "max_input_time = -1"
      ].join(`
`)
    ), this.fileExists(AUTO_PREPEND_SCRIPT) || this.writeFile(
      AUTO_PREPEND_SCRIPT,
      `<?php
				// Define constants set via defineConstant() calls
				if(file_exists('/internal/shared/consts.json')) {
					$consts = json_decode(file_get_contents('/internal/shared/consts.json'), true);
					foreach ($consts as $const => $value) {
						if (!defined($const) && is_scalar($value)) {
							define($const, $value);
						}
					}
				}
				// Preload all the files from /internal/shared/preload
				foreach (glob('/internal/shared/preload/*.php') as $file) {
					require_once $file;
				}
				`
    ), e.onMessage = async (r) => {
      for (const s of u(this, R)) {
        const n = await s(r);
        if (n)
          return n;
      }
      return "";
    }, f(this, x, improveWASMErrorReporting(e)), this.dispatchEvent({
      type: "runtime.initialized"
    });
  }
  /** @inheritDoc */
  async setSapiName(t) {
    if (this[__private__dont__use].ccall(
      "wasm_set_sapi_name",
      NUMBER,
      [STRING],
      [t]
    ) !== 0)
      throw new Error(
        "Could not set SAPI name. This can only be done before the PHP WASM module is initialized.Did you already dispatch any requests?"
      );
    f(this, S, t);
  }
  /**
   * Changes the current working directory in the PHP filesystem.
   * This is the directory that will be used as the base for relative paths.
   * For example, if the current working directory is `/root/php`, and the
   * path is `data`, the absolute path will be `/root/php/data`.
   *
   * @param  path - The new working directory.
   */
  chdir(t) {
    this[__private__dont__use].FS.chdir(t);
  }
  /**
   * Do not use. Use new PHPRequestHandler() instead.
   * @deprecated
   */
  async request(t) {
    if (logger.warn(
      "PHP.request() is deprecated. Please use new PHPRequestHandler() instead."
    ), !this.requestHandler)
      throw new Error("No request handler available.");
    return this.requestHandler.request(t);
  }
  /**
   * Runs PHP code.
   *
   * This low-level method directly interacts with the WebAssembly
   * PHP interpreter.
   *
   * Every time you call run(), it prepares the PHP
   * environment and:
   *
   * * Resets the internal PHP state
   * * Populates superglobals ($_SERVER, $_GET, etc.)
   * * Handles file uploads
   * * Populates input streams (stdin, argv, etc.)
   * * Sets the current working directory
   *
   * You can use run() in two primary modes:
   *
   * ### Code snippet mode
   *
   * In this mode, you pass a string containing PHP code to run.
   *
   * ```ts
   * const result = await php.run({
   * 	code: `<?php echo "Hello world!";`
   * });
   * // result.text === "Hello world!"
   * ```
   *
   * In this mode, information like __DIR__ or __FILE__ isn't very
   * useful because the code is not associated with any file.
   *
   * Under the hood, the PHP snippet is passed to the `zend_eval_string`
   * C function.
   *
   * ### File mode
   *
   * In the file mode, you pass a scriptPath and PHP executes a file
   * found at a that path:
   *
   * ```ts
   * php.writeFile(
   * 	"/www/index.php",
   * 	`<?php echo "Hello world!";"`
   * );
   * const result = await php.run({
   * 	scriptPath: "/www/index.php"
   * });
   * // result.text === "Hello world!"
   * ```
   *
   * In this mode, you can rely on path-related information like __DIR__
   * or __FILE__.
   *
   * Under the hood, the PHP file is executed with the `php_execute_script`
   * C function.
   *
   * The `run()` method cannot be used in conjunction with `cli()`.
   *
   * @example
   * ```js
   * const result = await php.run(`<?php
   *  $fp = fopen('php://stderr', 'w');
   *  fwrite($fp, "Hello, world!");
   * `);
   * // result.errors === "Hello, world!"
   * ```
   *
   * @param  options - PHP runtime options.
   */
  async run(t) {
    const e = await this.semaphore.acquire();
    let r;
    try {
      if (u(this, E) || (h(this, N, te).call(this), f(this, E, !0)), t.scriptPath && !this.fileExists(t.scriptPath))
        throw new Error(
          `The script path "${t.scriptPath}" does not exist.`
        );
      h(this, O, se).call(this, t.relativeUri || ""), h(this, $, ae).call(this, t.method || "GET");
      const s = normalizeHeaders(t.headers || {}), n = s.host || "example.com:443", i = h(this, j, oe).call(this, n, t.protocol || "http");
      h(this, L, ne).call(this, n), h(this, D, ie).call(this, i), h(this, B, le).call(this, s), t.body && (r = h(this, q, ce).call(this, t.body)), typeof t.code == "string" ? (this.writeFile("/internal/eval.php", t.code), h(this, I, K).call(this, "/internal/eval.php")) : h(this, I, K).call(this, t.scriptPath || "");
      const o = h(this, M, ee).call(this, t.$_SERVER, s, i);
      for (const a in o)
        h(this, z, ue).call(this, a, o[a]);
      const l = t.env || {};
      for (const a in l)
        h(this, W, pe).call(this, a, l[a]);
      const c = await h(this, G, de).call(this);
      if (c.exitCode !== 0) {
        logger.warn("PHP.run() output was:", c.text);
        const a = new PHPExecutionFailureError(
          `PHP.run() failed with exit code ${c.exitCode} and the following output: ` + c.errors,
          c,
          "request"
        );
        throw logger.error(a), a;
      }
      return c;
    } catch (s) {
      throw this.dispatchEvent({
        type: "request.error",
        error: s,
        // Distinguish between PHP request and PHP-wasm errors
        source: s.source ?? "php-wasm"
      }), s;
    } finally {
      try {
        r && this[__private__dont__use].free(r);
      } finally {
        e(), this.dispatchEvent({
          type: "request.end"
        });
      }
    }
  }
  /**
   * Defines a constant in the PHP runtime.
   * @param key - The name of the constant.
   * @param value - The value of the constant.
   */
  defineConstant(t, e) {
    let r = {};
    try {
      r = JSON.parse(
        this.fileExists("/internal/shared/consts.json") && this.readFileAsText("/internal/shared/consts.json") || "{}"
      );
    } catch {
    }
    this.writeFile(
      "/internal/shared/consts.json",
      JSON.stringify({
        ...r,
        [t]: e
      })
    );
  }
  /**
   * Recursively creates a directory with the given path in the PHP filesystem.
   * For example, if the path is `/root/php/data`, and `/root` already exists,
   * it will create the directories `/root/php` and `/root/php/data`.
   *
   * @param  path - The directory path to create.
   */
  mkdir(t) {
    return FSHelpers.mkdir(this[__private__dont__use].FS, t);
  }
  /**
   * @deprecated Use mkdir instead.
   */
  mkdirTree(t) {
    return FSHelpers.mkdir(this[__private__dont__use].FS, t);
  }
  /**
   * Reads a file from the PHP filesystem and returns it as a string.
   *
   * @throws {@link @php-wasm/universal:ErrnoError} – If the file doesn't exist.
   * @param  path - The file path to read.
   * @returns The file contents.
   */
  readFileAsText(t) {
    return FSHelpers.readFileAsText(this[__private__dont__use].FS, t);
  }
  /**
   * Reads a file from the PHP filesystem and returns it as an array buffer.
   *
   * @throws {@link @php-wasm/universal:ErrnoError} – If the file doesn't exist.
   * @param  path - The file path to read.
   * @returns The file contents.
   */
  readFileAsBuffer(t) {
    return FSHelpers.readFileAsBuffer(this[__private__dont__use].FS, t);
  }
  /**
   * Overwrites data in a file in the PHP filesystem.
   * Creates a new file if one doesn't exist yet.
   *
   * @param  path - The file path to write to.
   * @param  data - The data to write to the file.
   */
  writeFile(t, e) {
    return FSHelpers.writeFile(this[__private__dont__use].FS, t, e);
  }
  /**
   * Removes a file from the PHP filesystem.
   *
   * @throws {@link @php-wasm/universal:ErrnoError} – If the file doesn't exist.
   * @param  path - The file path to remove.
   */
  unlink(t) {
    return FSHelpers.unlink(this[__private__dont__use].FS, t);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  mv(t, e) {
    return FSHelpers.mv(this[__private__dont__use].FS, t, e);
  }
  /**
   * Removes a directory from the PHP filesystem.
   *
   * @param path The directory path to remove.
   * @param options Options for the removal.
   */
  rmdir(t, e = { recursive: !0 }) {
    return FSHelpers.rmdir(this[__private__dont__use].FS, t, e);
  }
  /**
   * Lists the files and directories in the given directory.
   *
   * @param  path - The directory path to list.
   * @param  options - Options for the listing.
   * @returns The list of files and directories in the given directory.
   */
  listFiles(t, e = { prependPath: !1 }) {
    return FSHelpers.listFiles(
      this[__private__dont__use].FS,
      t,
      e
    );
  }
  /**
   * Checks if a directory exists in the PHP filesystem.
   *
   * @param  path – The path to check.
   * @returns True if the path is a directory, false otherwise.
   */
  isDir(t) {
    return FSHelpers.isDir(this[__private__dont__use].FS, t);
  }
  /**
   * Checks if a file (or a directory) exists in the PHP filesystem.
   *
   * @param  path - The file path to check.
   * @returns True if the file exists, false otherwise.
   */
  fileExists(t) {
    return FSHelpers.fileExists(this[__private__dont__use].FS, t);
  }
  /**
   * Hot-swaps the PHP runtime for a new one without
   * interrupting the operations of this PHP instance.
   *
   * @param runtime
   * @param cwd. Internal, the VFS path to recreate in the new runtime.
   *             This arg is temporary and will be removed once BasePHP
   *             is fully decoupled from the request handler and
   *             accepts a constructor-level cwd argument.
   */
  hotSwapPHPRuntime(t, e) {
    const r = this[__private__dont__use].FS;
    try {
      this.exit();
    } catch {
    }
    this.initializeRuntime(t), u(this, S) && this.setSapiName(u(this, S)), e && copyFS(r, this[__private__dont__use].FS, e);
  }
  /**
   * Mounts a filesystem to a given path in the PHP filesystem.
   *
   * @param  virtualFSPath - Where to mount it in the PHP virtual filesystem.
   * @param  mountHandler - The mount handler to use.
   * @return Unmount function to unmount the filesystem.
   */
  async mount(t, e) {
    return await e(
      this,
      this[__private__dont__use].FS,
      t
    );
  }
  /**
   * Starts a PHP CLI session with given arguments.
   *
   * This method can only be used when PHP was compiled with the CLI SAPI
   * and it cannot be used in conjunction with `run()`.
   *
   * Once this method finishes running, the PHP instance is no
   * longer usable and should be discarded. This is because PHP
   * internally cleans up all the resources and calls exit().
   *
   * @param  argv - The arguments to pass to the CLI.
   * @returns The exit code of the CLI session.
   */
  async cli(t) {
    for (const e of t)
      this[__private__dont__use].ccall(
        "wasm_add_cli_arg",
        null,
        [STRING],
        [e]
      );
    try {
      return await this[__private__dont__use].ccall(
        "run_cli",
        null,
        [],
        [],
        {
          async: !0
        }
      );
    } catch (e) {
      if (isExitCodeZero(e))
        return 0;
      throw e;
    }
  }
  setSkipShebang(t) {
    this[__private__dont__use].ccall(
      "wasm_set_skip_shebang",
      null,
      [NUMBER],
      [t ? 1 : 0]
    );
  }
  exit(t = 0) {
    this.dispatchEvent({
      type: "runtime.beforedestroy"
    });
    try {
      this[__private__dont__use]._exit(t);
    } catch {
    }
    f(this, E, !1), f(this, x, null), delete this[__private__dont__use].onMessage, delete this[__private__dont__use];
  }
  [Symbol.dispose]() {
    u(this, E) && this.exit(0);
  }
}
S = new WeakMap(), E = new WeakMap(), x = new WeakMap(), v = new WeakMap(), R = new WeakMap(), M = new WeakSet(), ee = function(t, e, r) {
  const s = {
    ...t || {}
  };
  s.HTTPS = s.HTTPS || r === 443 ? "on" : "off";
  for (const n in e) {
    let i = "HTTP_";
    ["content-type", "content-length"].includes(n.toLowerCase()) && (i = ""), s[`${i}${n.toUpperCase().replace(/-/g, "_")}`] = e[n];
  }
  return s;
}, N = new WeakSet(), te = function() {
  this[__private__dont__use].ccall("php_wasm_init", null, [], []);
}, U = new WeakSet(), re = function() {
  const t = "/internal/headers.json";
  if (!this.fileExists(t))
    throw new Error(
      "SAPI Error: Could not find response headers file."
    );
  const e = JSON.parse(this.readFileAsText(t)), r = {};
  for (const s of e.headers) {
    if (!s.includes(": "))
      continue;
    const n = s.indexOf(": "), i = s.substring(0, n).toLowerCase(), o = s.substring(n + 2);
    i in r || (r[i] = []), r[i].push(o);
  }
  return {
    headers: r,
    httpStatusCode: e.status
  };
}, O = new WeakSet(), se = function(t) {
  if (this[__private__dont__use].ccall(
    "wasm_set_request_uri",
    null,
    [STRING],
    [t]
  ), t.includes("?")) {
    const e = t.substring(t.indexOf("?") + 1);
    this[__private__dont__use].ccall(
      "wasm_set_query_string",
      null,
      [STRING],
      [e]
    );
  }
}, L = new WeakSet(), ne = function(t) {
  this[__private__dont__use].ccall(
    "wasm_set_request_host",
    null,
    [STRING],
    [t]
  );
}, D = new WeakSet(), ie = function(t) {
  this[__private__dont__use].ccall(
    "wasm_set_request_port",
    null,
    [NUMBER],
    [t]
  );
}, j = new WeakSet(), oe = function(t, e) {
  let r;
  try {
    r = parseInt(new URL(t).port, 10);
  } catch {
  }
  return (!r || isNaN(r) || r === 80) && (r = e === "https" ? 443 : 80), r;
}, $ = new WeakSet(), ae = function(t) {
  this[__private__dont__use].ccall(
    "wasm_set_request_method",
    null,
    [STRING],
    [t]
  );
}, B = new WeakSet(), le = function(t) {
  t.cookie && this[__private__dont__use].ccall(
    "wasm_set_cookies",
    null,
    [STRING],
    [t.cookie]
  ), t["content-type"] && this[__private__dont__use].ccall(
    "wasm_set_content_type",
    null,
    [STRING],
    [t["content-type"]]
  ), t["content-length"] && this[__private__dont__use].ccall(
    "wasm_set_content_length",
    null,
    [NUMBER],
    [parseInt(t["content-length"], 10)]
  );
}, q = new WeakSet(), ce = function(t) {
  let e, r;
  typeof t == "string" ? (logger.warn(
    "Passing a string as the request body is deprecated. Please use a Uint8Array instead. See https://github.com/WordPress/wordpress-playground/issues/997 for more details"
  ), r = this[__private__dont__use].lengthBytesUTF8(t), e = r + 1) : (r = t.byteLength, e = t.byteLength);
  const s = this[__private__dont__use].malloc(e);
  if (!s)
    throw new Error("Could not allocate memory for the request body.");
  return typeof t == "string" ? this[__private__dont__use].stringToUTF8(
    t,
    s,
    e + 1
  ) : this[__private__dont__use].HEAPU8.set(t, s), this[__private__dont__use].ccall(
    "wasm_set_request_body",
    null,
    [NUMBER],
    [s]
  ), this[__private__dont__use].ccall(
    "wasm_set_content_length",
    null,
    [NUMBER],
    [r]
  ), s;
}, I = new WeakSet(), K = function(t) {
  this[__private__dont__use].ccall(
    "wasm_set_path_translated",
    null,
    [STRING],
    [t]
  );
}, z = new WeakSet(), ue = function(t, e) {
  this[__private__dont__use].ccall(
    "wasm_add_SERVER_entry",
    null,
    [STRING, STRING],
    [t, e]
  );
}, W = new WeakSet(), pe = function(t, e) {
  this[__private__dont__use].ccall(
    "wasm_add_ENV_entry",
    null,
    [STRING, STRING],
    [t, e]
  );
}, G = new WeakSet(), de = async function() {
  var n;
  let t, e;
  try {
    t = await new Promise((i, o) => {
      var c;
      e = (a) => {
        logger.error(a), logger.error(a.error);
        const d = new Error("Rethrown");
        d.cause = a.error, d.betterMessage = a.message, o(d);
      }, (c = u(this, x)) == null || c.addEventListener(
        "error",
        e
      );
      const l = this[__private__dont__use].ccall(
        "wasm_sapi_handle_request",
        NUMBER,
        [],
        [],
        { async: !0 }
      );
      return l instanceof Promise ? l.then(i, o) : i(l);
    });
  } catch (i) {
    for (const a in this)
      typeof this[a] == "function" && (this[a] = () => {
        throw new Error(
          "PHP runtime has crashed – see the earlier error for details."
        );
      });
    this.functionsMaybeMissingFromAsyncify = getFunctionsMaybeMissingFromAsyncify();
    const o = i, l = "betterMessage" in o ? o.betterMessage : o.message, c = new Error(l);
    throw c.cause = o, logger.error(c), c;
  } finally {
    (n = u(this, x)) == null || n.removeEventListener("error", e);
  }
  const { headers: r, httpStatusCode: s } = h(this, U, re).call(this);
  return new PHPResponse(
    t === 0 ? s : 500,
    r,
    this.readFileAsBuffer("/internal/stdout"),
    this.readFileAsText("/internal/stderr"),
    t
  );
};
function normalizeHeaders(t) {
  const e = {};
  for (const r in t)
    e[r.toLowerCase()] = t[r];
  return e;
}
function copyFS(t, e, r) {
  let s;
  try {
    s = t.lookupPath(r);
  } catch {
    return;
  }
  if (!("contents" in s.node))
    return;
  if (!t.isDir(s.node.mode)) {
    e.writeFile(r, t.readFile(r));
    return;
  }
  e.mkdirTree(r);
  const n = t.readdir(r).filter((i) => i !== "." && i !== "..");
  for (const i of n)
    copyFS(t, e, joinPaths(r, i));
}
const { hasOwnProperty } = Object.prototype, encode = (t, e = {}) => {
  typeof e == "string" && (e = { section: e }), e.align = e.align === !0, e.newline = e.newline === !0, e.sort = e.sort === !0, e.whitespace = e.whitespace === !0 || e.align === !0, e.platform = e.platform || typeof process < "u" && process.platform, e.bracketedArray = e.bracketedArray !== !1;
  const r = e.platform === "win32" ? `\r
` : `
`, s = e.whitespace ? " = " : "=", n = [], i = e.sort ? Object.keys(t).sort() : Object.keys(t);
  let o = 0;
  e.align && (o = safe(
    i.filter((a) => t[a] === null || Array.isArray(t[a]) || typeof t[a] != "object").map((a) => Array.isArray(t[a]) ? `${a}[]` : a).concat([""]).reduce((a, d) => safe(a).length >= safe(d).length ? a : d)
  ).length);
  let l = "";
  const c = e.bracketedArray ? "[]" : "";
  for (const a of i) {
    const d = t[a];
    if (d && Array.isArray(d))
      for (const m of d)
        l += safe(`${a}${c}`).padEnd(o, " ") + s + safe(m) + r;
    else
      d && typeof d == "object" ? n.push(a) : l += safe(a).padEnd(o, " ") + s + safe(d) + r;
  }
  e.section && l.length && (l = "[" + safe(e.section) + "]" + (e.newline ? r + r : r) + l);
  for (const a of n) {
    const d = splitSections(a, ".").join("\\."), m = (e.section ? e.section + "." : "") + d, y = encode(t[a], {
      ...e,
      section: m
    });
    l.length && y.length && (l += r), l += y;
  }
  return l;
};
function splitSections(t, e) {
  var r = 0, s = 0, n = 0, i = [];
  do
    if (n = t.indexOf(e, r), n !== -1) {
      if (r = n + e.length, n > 0 && t[n - 1] === "\\")
        continue;
      i.push(t.slice(s, n)), s = n + e.length;
    }
  while (n !== -1);
  return i.push(t.slice(s)), i;
}
const decode = (t, e = {}) => {
  e.bracketedArray = e.bracketedArray !== !1;
  const r = /* @__PURE__ */ Object.create(null);
  let s = r, n = null;
  const i = /^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i, o = t.split(/[\r\n]+/g), l = {};
  for (const a of o) {
    if (!a || a.match(/^\s*[;#]/) || a.match(/^\s*$/))
      continue;
    const d = a.match(i);
    if (!d)
      continue;
    if (d[1] !== void 0) {
      if (n = unsafe(d[1]), n === "__proto__") {
        s = /* @__PURE__ */ Object.create(null);
        continue;
      }
      s = r[n] = r[n] || /* @__PURE__ */ Object.create(null);
      continue;
    }
    const m = unsafe(d[2]);
    let y;
    e.bracketedArray ? y = m.length > 2 && m.slice(-2) === "[]" : (l[m] = ((l == null ? void 0 : l[m]) || 0) + 1, y = l[m] > 1);
    const _ = y ? m.slice(0, -2) : m;
    if (_ === "__proto__")
      continue;
    const A = d[3] ? unsafe(d[4]) : !0, X = A === "true" || A === "false" || A === "null" ? JSON.parse(A) : A;
    y && (hasOwnProperty.call(s, _) ? Array.isArray(s[_]) || (s[_] = [s[_]]) : s[_] = []), Array.isArray(s[_]) ? s[_].push(X) : s[_] = X;
  }
  const c = [];
  for (const a of Object.keys(r)) {
    if (!hasOwnProperty.call(r, a) || typeof r[a] != "object" || Array.isArray(r[a]))
      continue;
    const d = splitSections(a, ".");
    s = r;
    const m = d.pop(), y = m.replace(/\\\./g, ".");
    for (const _ of d)
      _ !== "__proto__" && ((!hasOwnProperty.call(s, _) || typeof s[_] != "object") && (s[_] = /* @__PURE__ */ Object.create(null)), s = s[_]);
    s === r && y === m || (s[y] = r[a], c.push(a));
  }
  for (const a of c)
    delete r[a];
  return r;
}, isQuoted = (t) => t.startsWith('"') && t.endsWith('"') || t.startsWith("'") && t.endsWith("'"), safe = (t) => typeof t != "string" || t.match(/[=\r\n]/) || t.match(/^\[/) || t.length > 1 && isQuoted(t) || t !== t.trim() ? JSON.stringify(t) : t.split(";").join("\\;").split("#").join("\\#"), unsafe = (t) => {
  if (t = (t || "").trim(), isQuoted(t)) {
    t.charAt(0) === "'" && (t = t.slice(1, -1));
    try {
      t = JSON.parse(t);
    } catch {
    }
  } else {
    let e = !1, r = "";
    for (let s = 0, n = t.length; s < n; s++) {
      const i = t.charAt(s);
      if (e)
        "\\;#".indexOf(i) !== -1 ? r += i : r += "\\" + i, e = !1;
      else {
        if (";#".indexOf(i) !== -1)
          break;
        i === "\\" ? e = !0 : r += i;
      }
    }
    return e && (r += "\\"), r.trim();
  }
  return t;
};
var ini = {
  parse: decode,
  decode,
  stringify: encode,
  encode,
  safe,
  unsafe
};
async function getPhpIniEntries(t, e) {
  const r = ini.parse(await t.readFileAsText(PHP_INI_PATH));
  if (e === void 0)
    return r;
  const s = {};
  for (const n of e)
    s[n] = r[n];
  return s;
}
async function setPhpIniEntries(t, e) {
  const r = ini.parse(await t.readFileAsText(PHP_INI_PATH));
  for (const [s, n] of Object.entries(e))
    n == null ? delete r[s] : r[s] = n;
  await t.writeFile(PHP_INI_PATH, ini.stringify(r));
}
async function withPHPIniValues(t, e, r) {
  const s = await t.readFileAsText(PHP_INI_PATH);
  try {
    return await setPhpIniEntries(t, e), await r();
  } finally {
    await t.writeFile(PHP_INI_PATH, s);
  }
}
class HttpCookieStore {
  constructor() {
    this.cookies = {};
  }
  rememberCookiesFromResponseHeaders(e) {
    if (e != null && e["set-cookie"])
      for (const r of e["set-cookie"])
        try {
          if (!r.includes("="))
            continue;
          const s = r.indexOf("="), n = r.substring(0, s), i = r.substring(s + 1).split(";")[0];
          this.cookies[n] = i;
        } catch (s) {
          logger.error(s);
        }
  }
  getCookieRequestHeader() {
    const e = [];
    for (const r in this.cookies)
      e.push(`${r}=${this.cookies[r]}`);
    return e.join("; ");
  }
}
function concatUint8Array(...t) {
  const e = new Uint8Array(
    t.reduce((s, n) => s + n.length, 0)
  );
  let r = 0;
  for (const s of t)
    e.set(s, r), r += s.length;
  return e;
}
function concatBytes(t) {
  if (t === void 0) {
    let e = new Uint8Array();
    return new TransformStream({
      transform(r) {
        e = concatUint8Array(e, r);
      },
      flush(r) {
        r.enqueue(e);
      }
    });
  } else {
    const e = new ArrayBuffer(t || 0);
    let r = 0;
    return new TransformStream({
      transform(s) {
        new Uint8Array(e).set(s, r), r += s.byteLength;
      },
      flush(s) {
        s.enqueue(new Uint8Array(e));
      }
    });
  }
}
function limitBytes(t, e) {
  if (e === 0)
    return new ReadableStream({
      start(n) {
        n.close();
      }
    });
  const r = t.getReader({ mode: "byob" });
  let s = 0;
  return new ReadableStream({
    async pull(n) {
      const { value: i, done: o } = await r.read(
        new Uint8Array(e - s)
      );
      if (o) {
        r.releaseLock(), n.close();
        return;
      }
      s += i.length, n.enqueue(i), s >= e && (r.releaseLock(), n.close());
    },
    cancel() {
      r.cancel();
    }
  });
}
async function collectBytes(t, e) {
  return e !== void 0 && (t = limitBytes(t, e)), await t.pipeThrough(concatBytes(e)).getReader().read().then(({ value: r }) => r);
}
class StreamedFile extends File {
  /**
   * Creates a new StreamedFile instance.
   *
   * @param readableStream The readable stream containing the file data.
   * @param name The name of the file.
   * @param type The MIME type of the file.
   */
  constructor(e, r, s) {
    super([], r, { type: s }), this.readableStream = e;
  }
  /**
   * Overrides the slice() method of the File class.
   *
   * @returns A Blob representing a portion of the file.
   */
  slice() {
    throw new Error("slice() is not possible on a StreamedFile");
  }
  /**
   * Returns the readable stream associated with the file.
   *
   * @returns The readable stream.
   */
  stream() {
    return this.readableStream;
  }
  /**
   * Loads the file data into memory and then returns it as a string.
   *
   * @returns File data as text.
   */
  async text() {
    return new TextDecoder().decode(await this.arrayBuffer());
  }
  /**
   * Loads the file data into memory and then returns it as an ArrayBuffer.
   *
   * @returns File data as an ArrayBuffer.
   */
  async arrayBuffer() {
    return await collectBytes(this.stream());
  }
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const t = this.getReader();
  try {
    for (; ; ) {
      const { done: e, value: r } = await t.read();
      if (e)
        return;
      yield r;
    }
  } finally {
    t.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
function streamReadFileFromPHP(t, e) {
  return new ReadableStream({
    async pull(r) {
      const s = await t.readFileAsBuffer(e);
      r.enqueue(s), r.close();
    }
  });
}
async function* iteratePhpFiles(t, e, {
  relativePaths: r = !0,
  pathPrefix: s,
  exceptPaths: n = []
} = {}) {
  e = normalizePath(e);
  const i = [e];
  for (; i.length; ) {
    const o = i.pop();
    if (!o)
      return;
    const l = await t.listFiles(o);
    for (const c of l) {
      const a = `${o}/${c}`;
      if (n.includes(a.substring(e.length + 1)))
        continue;
      await t.isDir(a) ? i.push(a) : yield new StreamedFile(
        streamReadFileFromPHP(t, a),
        r ? joinPaths(
          s || "",
          a.substring(e.length + 1)
        ) : a
      );
    }
  }
}
function writeFilesStreamToPhp(t, e) {
  return new WritableStream({
    async write(r) {
      const s = joinPaths(e, r.name);
      r.type === "directory" ? await t.mkdir(s) : (await t.mkdir(dirname(s)), await t.writeFile(
        s,
        new Uint8Array(await r.arrayBuffer())
      ));
    }
  });
}
class MaxPhpInstancesError extends Error {
  constructor(e) {
    super(
      `Requested more concurrent PHP instances than the limit (${e}).`
    ), this.name = this.constructor.name;
  }
}
class PHPProcessManager {
  constructor(e) {
    this.primaryIdle = !0, this.nextInstance = null, this.allInstances = [], this.maxPhpInstances = (e == null ? void 0 : e.maxPhpInstances) ?? 5, this.phpFactory = e == null ? void 0 : e.phpFactory, this.primaryPhp = e == null ? void 0 : e.primaryPhp, this.semaphore = new Semaphore({
      concurrency: this.maxPhpInstances,
      /**
       * Wait up to 5 seconds for resources to become available
       * before assuming that all the PHP instances are deadlocked.
       */
      timeout: (e == null ? void 0 : e.timeout) || 5e3
    });
  }
  /**
   * Get the primary PHP instance.
   *
   * If the primary PHP instance is not set, it will be spawned
   * using the provided phpFactory.
   *
   * @throws {Error} when called twice before the first call is resolved.
   */
  async getPrimaryPhp() {
    if (!this.phpFactory && !this.primaryPhp)
      throw new Error(
        "phpFactory or primaryPhp must be set before calling getPrimaryPhp()."
      );
    if (!this.primaryPhp) {
      const e = await this.spawn({ isPrimary: !0 });
      this.primaryPhp = e.php;
    }
    return this.primaryPhp;
  }
  /**
   * Get a PHP instance.
   *
   * It could be either the primary PHP instance, an idle disposable PHP instance,
   * or a newly spawned PHP instance – depending on the resource availability.
   *
   * @throws {MaxPhpInstancesError} when the maximum number of PHP instances is reached
   *                                and the waiting timeout is exceeded.
   */
  async acquirePHPInstance() {
    if (this.primaryIdle)
      return this.primaryIdle = !1, {
        php: await this.getPrimaryPhp(),
        reap: () => this.primaryIdle = !0
      };
    const e = this.nextInstance || this.spawn({ isPrimary: !1 });
    return this.semaphore.remaining > 0 ? this.nextInstance = this.spawn({ isPrimary: !1 }) : this.nextInstance = null, await e;
  }
  /**
   * Initiated spawning of a new PHP instance.
   * This function is synchronous on purpose – it needs to synchronously
   * add the spawn promise to the allInstances array without waiting
   * for PHP to spawn.
   */
  spawn(e) {
    if (e.isPrimary && this.allInstances.length > 0)
      throw new Error(
        "Requested spawning a primary PHP instance when another primary instance already started spawning."
      );
    const r = this.doSpawn(e);
    this.allInstances.push(r);
    const s = () => {
      this.allInstances = this.allInstances.filter(
        (n) => n !== r
      );
    };
    return r.catch((n) => {
      throw s(), n;
    }).then((n) => ({
      ...n,
      reap: () => {
        s(), n.reap();
      }
    }));
  }
  /**
   * Actually acquires the lock and spawns a new PHP instance.
   */
  async doSpawn(e) {
    let r;
    try {
      r = await this.semaphore.acquire();
    } catch (s) {
      throw s instanceof AcquireTimeoutError ? new MaxPhpInstancesError(this.maxPhpInstances) : s;
    }
    try {
      const s = await this.phpFactory(e);
      return {
        php: s,
        reap() {
          s.exit(), r();
        }
      };
    } catch (s) {
      throw r(), s;
    }
  }
  async [Symbol.asyncDispose]() {
    this.primaryPhp && this.primaryPhp.exit(), await Promise.all(
      this.allInstances.map(
        (e) => e.then(({ reap: r }) => r())
      )
    );
  }
}
const SupportedPHPVersions = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], LatestSupportedPHPVersion = SupportedPHPVersions[0], SupportedPHPVersionsList = SupportedPHPVersions, SupportedPHPExtensionsList = [
  "iconv",
  "mbstring",
  "xml-bundle",
  "gd"
], SupportedPHPExtensionBundles = {
  "kitchen-sink": SupportedPHPExtensionsList,
  light: []
}, DEFAULT_BASE_URL = "http://example.com";
function toRelativeUrl(t) {
  return t.toString().substring(t.origin.length);
}
function removePathPrefix(t, e) {
  return !e || !t.startsWith(e) ? t : t.substring(e.length);
}
function ensurePathPrefix(t, e) {
  return !e || t.startsWith(e) ? t : e + t;
}
async function encodeAsMultipart(t) {
  const e = `----${Math.random().toString(36).slice(2)}`, r = `multipart/form-data; boundary=${e}`, s = new TextEncoder(), n = [];
  for (const [c, a] of Object.entries(t))
    n.push(`--${e}\r
`), n.push(`Content-Disposition: form-data; name="${c}"`), a instanceof File && n.push(`; filename="${a.name}"`), n.push(`\r
`), a instanceof File && (n.push("Content-Type: application/octet-stream"), n.push(`\r
`)), n.push(`\r
`), a instanceof File ? n.push(await fileToUint8Array(a)) : n.push(a), n.push(`\r
`);
  n.push(`--${e}--\r
`);
  const i = n.reduce((c, a) => c + a.length, 0), o = new Uint8Array(i);
  let l = 0;
  for (const c of n)
    o.set(
      typeof c == "string" ? s.encode(c) : c,
      l
    ), l += c.length;
  return { bytes: o, contentType: r };
}
function fileToUint8Array(t) {
  return new Promise((e) => {
    const r = new FileReader();
    r.onload = () => {
      e(new Uint8Array(r.result));
    }, r.readAsArrayBuffer(t);
  });
}
const _default = "application/octet-stream", asx = "video/x-ms-asf", atom = "application/atom+xml", avi = "video/x-msvideo", avif = "image/avif", bin = "application/octet-stream", bmp = "image/x-ms-bmp", cco = "application/x-cocoa", css = "text/css", data = "application/octet-stream", deb = "application/octet-stream", der = "application/x-x509-ca-cert", dmg = "application/octet-stream", doc = "application/msword", docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document", eot = "application/vnd.ms-fontobject", flv = "video/x-flv", gif = "image/gif", gz = "application/gzip", hqx = "application/mac-binhex40", htc = "text/x-component", html = "text/html", ico = "image/x-icon", iso = "application/octet-stream", jad = "text/vnd.sun.j2me.app-descriptor", jar = "application/java-archive", jardiff = "application/x-java-archive-diff", jng = "image/x-jng", jnlp = "application/x-java-jnlp-file", jpg = "image/jpeg", jpeg = "image/jpeg", js = "application/javascript", json = "application/json", kml = "application/vnd.google-earth.kml+xml", kmz = "application/vnd.google-earth.kmz", m3u8 = "application/vnd.apple.mpegurl", m4a = "audio/x-m4a", m4v = "video/x-m4v", md = "text/plain", mid = "audio/midi", mml = "text/mathml", mng = "video/x-mng", mov = "video/quicktime", mp3 = "audio/mpeg", mp4 = "video/mp4", mpeg = "video/mpeg", msi = "application/octet-stream", odg = "application/vnd.oasis.opendocument.graphics", odp = "application/vnd.oasis.opendocument.presentation", ods = "application/vnd.oasis.opendocument.spreadsheet", odt = "application/vnd.oasis.opendocument.text", ogg = "audio/ogg", otf = "font/otf", pdf = "application/pdf", pl = "application/x-perl", png = "image/png", ppt = "application/vnd.ms-powerpoint", pptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation", prc = "application/x-pilot", ps = "application/postscript", ra = "audio/x-realaudio", rar = "application/x-rar-compressed", rpm = "application/x-redhat-package-manager", rss = "application/rss+xml", rtf = "application/rtf", run = "application/x-makeself", sea = "application/x-sea", sit = "application/x-stuffit", svg = "image/svg+xml", swf = "application/x-shockwave-flash", tcl = "application/x-tcl", tar = "application/x-tar", tif = "image/tiff", ts = "video/mp2t", ttf = "font/ttf", txt = "text/plain", wasm = "application/wasm", wbmp = "image/vnd.wap.wbmp", webm = "video/webm", webp = "image/webp", wml = "text/vnd.wap.wml", wmlc = "application/vnd.wap.wmlc", wmv = "video/x-ms-wmv", woff = "font/woff", woff2 = "font/woff2", xhtml = "application/xhtml+xml", xls = "application/vnd.ms-excel", xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", xml = "text/xml", xpi = "application/x-xpinstall", xspf = "application/xspf+xml", zip = "application/zip", mimeTypes = {
  _default,
  "3gpp": "video/3gpp",
  "7z": "application/x-7z-compressed",
  asx,
  atom,
  avi,
  avif,
  bin,
  bmp,
  cco,
  css,
  data,
  deb,
  der,
  dmg,
  doc,
  docx,
  eot,
  flv,
  gif,
  gz,
  hqx,
  htc,
  html,
  ico,
  iso,
  jad,
  jar,
  jardiff,
  jng,
  jnlp,
  jpg,
  jpeg,
  js,
  json,
  kml,
  kmz,
  m3u8,
  m4a,
  m4v,
  md,
  mid,
  mml,
  mng,
  mov,
  mp3,
  mp4,
  mpeg,
  msi,
  odg,
  odp,
  ods,
  odt,
  ogg,
  otf,
  pdf,
  pl,
  png,
  ppt,
  pptx,
  prc,
  ps,
  ra,
  rar,
  rpm,
  rss,
  rtf,
  run,
  sea,
  sit,
  svg,
  swf,
  tcl,
  tar,
  tif,
  ts,
  ttf,
  txt,
  wasm,
  wbmp,
  webm,
  webp,
  wml,
  wmlc,
  wmv,
  woff,
  woff2,
  xhtml,
  xls,
  xlsx,
  xml,
  xpi,
  xspf,
  zip
};
var w, F, C, b, H, P, T, k, V, he, J, fe, Q, me, Z, _e;
class PHPRequestHandler {
  /**
   * The request handler needs to decide whether to serve a static asset or
   * run the PHP interpreter. For static assets it should just reuse the primary
   * PHP even if there's 50 concurrent requests to serve. However, for
   * dynamic PHP requests, it needs to grab an available interpreter.
   * Therefore, it cannot just accept PHP as an argument as serving requests
   * requires access to ProcessManager.
   *
   * @param  php    - The PHP instance.
   * @param  config - Request Handler configuration.
   */
  constructor(e) {
    /**
     * Serves a static file from the PHP filesystem.
     *
     * @param  fsPath - Absolute path of the static file to serve.
     * @returns The response.
     */
    p(this, V);
    /**
     * Spawns a new PHP instance and dispatches a request to it.
     */
    p(this, J);
    /**
     * Runs the requested PHP file with all the request and $_SERVER
     * superglobals populated.
     *
     * @param  request - The request.
     * @returns The response.
     */
    p(this, Q);
    /**
     * Resolve the requested path to the filesystem path of the requested PHP file.
     *
     * Fall back to index.php as if there was a url rewriting rule in place.
     *
     * @param  requestedPath - The requested pathname.
     * @throws {Error} If the requested path doesn't exist.
     * @returns The resolved filesystem path.
     */
    p(this, Z);
    p(this, w, void 0);
    p(this, F, void 0);
    p(this, C, void 0);
    p(this, b, void 0);
    p(this, H, void 0);
    p(this, P, void 0);
    p(this, T, void 0);
    p(this, k, void 0);
    const {
      documentRoot: r = "/www/",
      absoluteUrl: s = typeof location == "object" ? location == null ? void 0 : location.href : "",
      rewriteRules: n = []
    } = e;
    "processManager" in e ? this.processManager = e.processManager : this.processManager = new PHPProcessManager({
      phpFactory: async (l) => {
        const c = await e.phpFactory({
          ...l,
          requestHandler: this
        });
        return c.requestHandler = this, c;
      },
      maxPhpInstances: e.maxPhpInstances
    }), f(this, k, new HttpCookieStore()), f(this, w, r);
    const i = new URL(s);
    f(this, C, i.hostname), f(this, b, i.port ? Number(i.port) : i.protocol === "https:" ? 443 : 80), f(this, F, (i.protocol || "").replace(":", ""));
    const o = u(this, b) !== 443 && u(this, b) !== 80;
    f(this, H, [
      u(this, C),
      o ? `:${u(this, b)}` : ""
    ].join("")), f(this, P, i.pathname.replace(/\/+$/, "")), f(this, T, [
      `${u(this, F)}://`,
      u(this, H),
      u(this, P)
    ].join("")), this.rewriteRules = n;
  }
  async getPrimaryPhp() {
    return await this.processManager.getPrimaryPhp();
  }
  /**
   * Converts a path to an absolute URL based at the PHPRequestHandler
   * root.
   *
   * @param  path The server path to convert to an absolute URL.
   * @returns The absolute URL.
   */
  pathToInternalUrl(e) {
    return `${this.absoluteUrl}${e}`;
  }
  /**
   * Converts an absolute URL based at the PHPRequestHandler to a relative path
   * without the server pathname and scope.
   *
   * @param  internalUrl An absolute URL based at the PHPRequestHandler root.
   * @returns The relative path.
   */
  internalUrlToPath(e) {
    const r = new URL(e);
    return r.pathname.startsWith(u(this, P)) && (r.pathname = r.pathname.slice(u(this, P).length)), toRelativeUrl(r);
  }
  /**
   * The absolute URL of this PHPRequestHandler instance.
   */
  get absoluteUrl() {
    return u(this, T);
  }
  /**
   * The directory in the PHP filesystem where the server will look
   * for the files to serve. Default: `/var/www`.
   */
  get documentRoot() {
    return u(this, w);
  }
  /**
   * Serves the request – either by serving a static file, or by
   * dispatching it to the PHP runtime.
   *
   * The request() method mode behaves like a web server and only works if
   * the PHP was initialized with a `requestHandler` option (which the online version
   * of WordPress Playground does by default).
   *
   * In the request mode, you pass an object containing the request information
   * (method, headers, body, etc.) and the path to the PHP file to run:
   *
   * ```ts
   * const php = PHP.load('7.4', {
   * 	requestHandler: {
   * 		documentRoot: "/www"
   * 	}
   * })
   * php.writeFile("/www/index.php", `<?php echo file_get_contents("php://input");`);
   * const result = await php.request({
   * 	method: "GET",
   * 	headers: {
   * 		"Content-Type": "text/plain"
   * 	},
   * 	body: "Hello world!",
   * 	path: "/www/index.php"
   * });
   * // result.text === "Hello world!"
   * ```
   *
   * The `request()` method cannot be used in conjunction with `cli()`.
   *
   * @example
   * ```js
   * const output = await php.request({
   * 	method: 'GET',
   * 	url: '/index.php',
   * 	headers: {
   * 		'X-foo': 'bar',
   * 	},
   * 	body: {
   * 		foo: 'bar',
   * 	},
   * });
   * console.log(output.stdout); // "Hello world!"
   * ```
   *
   * @param  request - PHP Request data.
   */
  async request(e) {
    const r = e.url.startsWith("http://") || e.url.startsWith("https://"), s = new URL(
      // Remove the hash part of the URL as it's not meant for the server.
      e.url.split("#")[0],
      r ? void 0 : DEFAULT_BASE_URL
    ), n = applyRewriteRules(
      removePathPrefix(
        decodeURIComponent(s.pathname),
        u(this, P)
      ),
      this.rewriteRules
    ), i = joinPaths(u(this, w), n);
    return seemsLikeAPHPRequestHandlerPath(i) ? h(this, J, fe).call(this, e, s) : h(this, V, he).call(this, await this.processManager.getPrimaryPhp(), i);
  }
}
w = new WeakMap(), F = new WeakMap(), C = new WeakMap(), b = new WeakMap(), H = new WeakMap(), P = new WeakMap(), T = new WeakMap(), k = new WeakMap(), V = new WeakSet(), he = function(e, r) {
  if (!e.fileExists(r))
    return new PHPResponse(
      404,
      // Let the service worker know that no static file was found
      // and that it's okay to issue a real fetch() to the server.
      {
        "x-file-type": ["static"]
      },
      new TextEncoder().encode("404 File not found")
    );
  const s = e.readFileAsBuffer(r);
  return new PHPResponse(
    200,
    {
      "content-length": [`${s.byteLength}`],
      // @TODO: Infer the content-type from the arrayBuffer instead of the file path.
      //        The code below won't return the correct mime-type if the extension
      //        was tampered with.
      "content-type": [inferMimeType(r)],
      "accept-ranges": ["bytes"],
      "cache-control": ["public, max-age=0"]
    },
    s
  );
}, J = new WeakSet(), fe = async function(e, r) {
  let s;
  try {
    s = await this.processManager.acquirePHPInstance();
  } catch (n) {
    return n instanceof MaxPhpInstancesError ? PHPResponse.forHttpCode(502) : PHPResponse.forHttpCode(500);
  }
  try {
    return await h(this, Q, me).call(this, s.php, e, r);
  } finally {
    s.reap();
  }
}, Q = new WeakSet(), me = async function(e, r, s) {
  let n = "GET";
  const i = {
    host: u(this, H),
    ...normalizeHeaders(r.headers || {}),
    cookie: u(this, k).getCookieRequestHeader()
  };
  let o = r.body;
  if (typeof o == "object" && !(o instanceof Uint8Array)) {
    n = "POST";
    const { bytes: c, contentType: a } = await encodeAsMultipart(o);
    o = c, i["content-type"] = a;
  }
  let l;
  try {
    l = h(this, Z, _e).call(this, e, decodeURIComponent(s.pathname));
  } catch {
    return PHPResponse.forHttpCode(404);
  }
  try {
    const c = await e.run({
      relativeUri: ensurePathPrefix(
        toRelativeUrl(s),
        u(this, P)
      ),
      protocol: u(this, F),
      method: r.method || n,
      $_SERVER: {
        REMOTE_ADDR: "127.0.0.1",
        DOCUMENT_ROOT: u(this, w),
        HTTPS: u(this, T).startsWith("https://") ? "on" : ""
      },
      body: o,
      scriptPath: l,
      headers: i
    });
    return u(this, k).rememberCookiesFromResponseHeaders(
      c.headers
    ), c;
  } catch (c) {
    const a = c;
    if (a != null && a.response)
      return a.response;
    throw c;
  }
}, Z = new WeakSet(), _e = function(e, r) {
  let s = removePathPrefix(r, u(this, P));
  s = applyRewriteRules(s, this.rewriteRules), s.includes(".php") ? s = s.split(".php")[0] + ".php" : e.isDir(`${u(this, w)}${s}`) ? (s.endsWith("/") || (s = `${s}/`), s = `${s}index.php`) : s = "/index.php";
  let n = `${u(this, w)}${s}`;
  if (e.fileExists(n) || (n = `${u(this, w)}/index.php`), e.fileExists(n))
    return n;
  throw new Error(`File not found: ${n}`);
};
function inferMimeType(t) {
  const e = t.split(".").pop();
  return mimeTypes[e] || mimeTypes._default;
}
function seemsLikeAPHPRequestHandlerPath(t) {
  return seemsLikeAPHPFile(t) || seemsLikeADirectoryRoot(t);
}
function seemsLikeAPHPFile(t) {
  return t.endsWith(".php") || t.includes(".php/");
}
function seemsLikeADirectoryRoot(t) {
  return !t.split("/").pop().includes(".");
}
function applyRewriteRules(t, e) {
  for (const r of e)
    if (new RegExp(r.match).test(t))
      return t.replace(r.match, r.replacement);
  return t;
}
function rotatePHPRuntime({
  php: t,
  cwd: e,
  recreateRuntime: r,
  /*
   * 400 is an arbitrary number that should trigger a rotation
   * way before the memory gets too fragmented. If it doesn't,
   * let's explore:
   * * Rotating based on an actual memory usage and
   *   fragmentation.
   * * Resetting HEAP to its initial value.
   */
  maxRequests: s = 400
}) {
  let n = 0;
  async function i() {
    if (++n < s)
      return;
    n = 0;
    const o = await t.semaphore.acquire();
    try {
      t.hotSwapPHPRuntime(await r(), e);
    } finally {
      o();
    }
  }
  return t.addEventListener("request.end", i), function() {
    t.removeEventListener("request.end", i);
  };
}
async function writeFiles(t, e, r, { rmRoot: s = !1 } = {}) {
  s && await t.isDir(e) && await t.rmdir(e, { recursive: !0 });
  for (const [n, i] of Object.entries(r)) {
    const o = joinPaths(e, n);
    await t.fileExists(dirname(o)) || await t.mkdir(dirname(o)), i instanceof Uint8Array || typeof i == "string" ? await t.writeFile(o, i) : await writeFiles(t, o, i);
  }
}
function proxyFileSystem(t, e, r) {
  const s = Object.getOwnPropertySymbols(t)[0];
  for (const n of r)
    e.fileExists(n) || e.mkdir(n), t.fileExists(n) || t.mkdir(n), e[s].FS.mount(
      // @ts-ignore
      e[s].PROXYFS,
      {
        root: n,
        // @ts-ignore
        fs: t[s].FS
      },
      n
    );
}
export {
  DEFAULT_BASE_URL,
  FSHelpers,
  HttpCookieStore,
  LatestSupportedPHPVersion,
  PHP,
  PHPProcessManager,
  PHPRequestHandler,
  PHPResponse,
  PHPWorker,
  SupportedPHPExtensionBundles,
  SupportedPHPExtensionsList,
  SupportedPHPVersions,
  SupportedPHPVersionsList,
  UnhandledRejectionsTarget,
  __private__dont__use,
  applyRewriteRules,
  ensurePathPrefix,
  getPhpIniEntries,
  isExitCodeZero,
  iteratePhpFiles as iterateFiles,
  loadPHPRuntime,
  proxyFileSystem,
  removePathPrefix,
  rotatePHPRuntime,
  setPhpIniEntries,
  toRelativeUrl,
  withPHPIniValues,
  writeFiles,
  writeFilesStreamToPhp
};
