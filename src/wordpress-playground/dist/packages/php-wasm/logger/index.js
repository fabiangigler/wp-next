const w = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (w === "NODE") {
  let e = function(t) {
    return new Promise(function(s, o) {
      t.onload = t.onerror = function(n) {
        t.onload = t.onerror = null, n.type === "load" ? s(t.result) : o(new Error("Failed to read the blob/file"));
      };
    });
  }, r = function() {
    const t = new Uint8Array([1, 2, 3, 4]), o = new File([t], "test").stream();
    try {
      return o.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class t extends Blob {
      constructor(o, n, i) {
        super(o);
        let a;
        i != null && i.lastModified && (a = /* @__PURE__ */ new Date()), (!a || isNaN(a.getFullYear())) && (a = /* @__PURE__ */ new Date()), this.lastModifiedDate = a, this.lastModified = a.getMilliseconds(), this.name = n || "";
      }
    }
    global.File = t;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const s = new FileReader();
    return s.readAsArrayBuffer(this), e(s);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const s = new FileReader();
    return s.readAsText(this), e(s);
  }), (typeof Blob.prototype.stream > "u" || !r()) && (Blob.prototype.stream = function() {
    let t = 0;
    const s = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(o) {
        const n = o.byobRequest.view, a = await s.slice(
          t,
          t + n.byteLength
        ).arrayBuffer(), u = new Uint8Array(a);
        new Uint8Array(n.buffer).set(u);
        const g = u.byteLength;
        o.byobRequest.respond(g), t += g, t >= s.size && o.close();
      }
    });
  });
}
if (w === "NODE" && typeof CustomEvent > "u") {
  class e extends Event {
    constructor(t, s = {}) {
      super(t, s), this.detail = s.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = e;
}
const v = "playground-log", m = (e, ...r) => {
  B.dispatchEvent(
    new CustomEvent(v, {
      detail: {
        log: e,
        args: r
      }
    })
  );
}, L = (e, ...r) => {
  switch (typeof e.message == "string" ? e.message = l(e.message) : e.message.message && typeof e.message.message == "string" && (e.message.message = l(e.message.message)), e.severity) {
    case "Debug":
      console.debug(e.message, ...r);
      break;
    case "Info":
      console.info(e.message, ...r);
      break;
    case "Warn":
      console.warn(e.message, ...r);
      break;
    case "Error":
      console.error(e.message, ...r);
      break;
    case "Fatal":
      console.error(e.message, ...r);
      break;
    default:
      console.log(e.message, ...r);
  }
}, T = (e) => e instanceof Error ? [e.message, e.stack].join(`
`) : JSON.stringify(e, null, 2), E = [], p = (e) => {
  E.push(e);
}, d = (e) => {
  if (e.raw === !0)
    p(e.message);
  else {
    const r = O(
      typeof e.message == "object" ? T(e.message) : e.message,
      e.severity ?? "Info",
      e.prefix ?? "JavaScript"
    );
    p(r);
  }
};
class M extends EventTarget {
  // constructor
  constructor(r = []) {
    super(), this.handlers = r, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(d) ? [...E] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
  logMessage(r, ...t) {
    for (const s of this.handlers)
      s(r, ...t);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(r, ...t) {
    this.logMessage(
      {
        message: r,
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
  debug(r, ...t) {
    this.logMessage(
      {
        message: r,
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
  info(r, ...t) {
    this.logMessage(
      {
        message: r,
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
  warn(r, ...t) {
    this.logMessage(
      {
        message: r,
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
  error(r, ...t) {
    this.logMessage(
      {
        message: r,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
}
const x = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [d, m];
  } catch {
  }
  return [d, L, m];
}, B = new M(x()), l = (e) => e.replace(/\t/g, ""), O = (e, r, t) => {
  const s = /* @__PURE__ */ new Date(), o = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(s).replace(/ /g, "-"), n = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(s), i = o + " " + n;
  return e = l(e), `[${i}] ${t} ${r}: ${e}`;
}, S = (e, r) => {
  e.addEventListener(e.fatalErrorEvent, r);
};
let f = 0;
const y = "/wordpress/wp-content/debug.log", k = async (e) => await e.fileExists(y) ? await e.readFileAsText(y) : "", C = (e, r) => {
  r.addEventListener("request.end", async () => {
    const t = await k(r);
    if (t.length > f) {
      const s = t.substring(f);
      e.logMessage({
        message: s,
        raw: !0
      }), f = t.length;
    }
  }), r.addEventListener("request.error", (t) => {
    t = t, t.error && (e.logMessage({
      message: `${t.error.message} ${t.error.stack}`,
      severity: "Fatal",
      prefix: t.source === "request" ? "PHP" : "WASM Crash"
    }), e.dispatchEvent(
      new CustomEvent(e.fatalErrorEvent, {
        detail: {
          logs: e.getLogs(),
          source: t.source
        }
      })
    ));
  });
}, P = (e, r) => {
  e.logMessage({
    message: `${r.message} in ${r.filename} on line ${r.lineno}:${r.colno}`,
    severity: "Error"
  });
}, h = (e, r) => {
  if (!(r != null && r.reason))
    return;
  const t = (r == null ? void 0 : r.reason.stack) ?? r.reason;
  e.logMessage({
    message: t,
    severity: "Error"
  });
};
let c = 0;
const D = (e) => {
  navigator.serviceWorker.addEventListener("message", (r) => {
    var t, s, o;
    ((t = r.data) == null ? void 0 : t.numberOfOpenPlaygroundTabs) !== void 0 && c !== ((s = r.data) == null ? void 0 : s.numberOfOpenPlaygroundTabs) && (c = (o = r.data) == null ? void 0 : o.numberOfOpenPlaygroundTabs, e.debug(
      `Number of open Playground tabs is: ${c}`
    ));
  });
};
let b = !1;
const F = (e) => {
  b || (D(e), !(typeof window > "u") && (window.addEventListener(
    "error",
    (r) => P(e, r)
  ), window.addEventListener(
    "unhandledrejection",
    (r) => h(e, r)
  ), window.addEventListener(
    "rejectionhandled",
    (r) => h(e, r)
  ), b = !0));
}, R = (e) => {
  e.addEventListener("activate", () => {
    e.clients.matchAll().then((r) => {
      const t = {
        numberOfOpenPlaygroundTabs: r.filter(
          // Only count top-level frames to get the number of tabs.
          (s) => s.frameType === "top-level"
        ).length
      };
      for (const s of r)
        s.postMessage(t);
    });
  });
};
export {
  M as Logger,
  S as addCrashListener,
  C as collectPhpLogs,
  F as collectWindowErrors,
  O as formatLogEntry,
  v as logEventType,
  B as logger,
  l as prepareLogMessage,
  R as reportServiceWorkerMetrics
};
