var E = (s, e, t) => {
  if (!e.has(s))
    throw TypeError("Cannot " + t);
};
var a = (s, e, t) => (E(s, e, "read from private field"), t ? t.call(s) : e.get(s)), u = (s, e, t) => {
  if (e.has(s))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(s) : e.set(s, t);
}, y = (s, e, t, r) => (E(s, e, "write to private field"), r ? r.call(s, t) : e.set(s, t), t);
var w = (s, e, t, r) => ({
  set _(n) {
    y(s, e, n, t);
  },
  get _() {
    return a(s, e, r);
  }
}), v = (s, e, t) => (E(s, e, "access private method"), t);
const R = function() {
  var s;
  return typeof process < "u" && ((s = process.release) == null ? void 0 : s.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (R === "NODE") {
  let s = function(t) {
    return new Promise(function(r, n) {
      t.onload = t.onerror = function(i) {
        t.onload = t.onerror = null, i.type === "load" ? r(t.result) : n(new Error("Failed to read the blob/file"));
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
      constructor(n, i, l) {
        super(n);
        let o;
        l != null && l.lastModified && (o = /* @__PURE__ */ new Date()), (!o || isNaN(o.getFullYear())) && (o = /* @__PURE__ */ new Date()), this.lastModifiedDate = o, this.lastModified = o.getMilliseconds(), this.name = i || "";
      }
    }
    global.File = t;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const r = new FileReader();
    return r.readAsArrayBuffer(this), s(r);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const r = new FileReader();
    return r.readAsText(this), s(r);
  }), (typeof Blob.prototype.stream > "u" || !e()) && (Blob.prototype.stream = function() {
    let t = 0;
    const r = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(n) {
        const i = n.byobRequest.view, o = await r.slice(
          t,
          t + i.byteLength
        ).arrayBuffer(), d = new Uint8Array(o);
        new Uint8Array(i.buffer).set(d);
        const g = d.byteLength;
        n.byobRequest.respond(g), t += g, t >= r.size && n.close();
      }
    });
  });
}
if (R === "NODE" && typeof CustomEvent > "u") {
  class s extends Event {
    constructor(t, r = {}) {
      super(t, r), this.detail = r.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = s;
}
const O = "playground-log", I = (s, ...e) => {
  x.dispatchEvent(
    new CustomEvent(O, {
      detail: {
        log: s,
        args: e
      }
    })
  );
}, F = (s, ...e) => {
  switch (typeof s.message == "string" ? s.message = T(s.message) : s.message.message && typeof s.message.message == "string" && (s.message.message = T(s.message.message)), s.severity) {
    case "Debug":
      console.debug(s.message, ...e);
      break;
    case "Info":
      console.info(s.message, ...e);
      break;
    case "Warn":
      console.warn(s.message, ...e);
      break;
    case "Error":
      console.error(s.message, ...e);
      break;
    case "Fatal":
      console.error(s.message, ...e);
      break;
    default:
      console.log(s.message, ...e);
  }
}, S = (s) => s instanceof Error ? [s.message, s.stack].join(`
`) : JSON.stringify(s, null, 2), k = [], C = (s) => {
  k.push(s);
}, L = (s) => {
  if (s.raw === !0)
    C(s.message);
  else {
    const e = W(
      typeof s.message == "object" ? S(s.message) : s.message,
      s.severity ?? "Info",
      s.prefix ?? "JavaScript"
    );
    C(e);
  }
};
class N extends EventTarget {
  // constructor
  constructor(e = []) {
    super(), this.handlers = e, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(L) ? [...k] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
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
    for (const r of this.handlers)
      r(e, ...t);
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
const A = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [L, I];
  } catch {
  }
  return [L, F, I];
}, x = new N(A()), T = (s) => s.replace(/\t/g, ""), W = (s, e, t) => {
  const r = /* @__PURE__ */ new Date(), n = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(r).replace(/ /g, "-"), i = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(r), l = n + " " + i;
  return s = T(s), `[${l}] ${t} ${e}: ${s}`;
}, J = 5 * 1024 * 1024;
var f, h, b, B;
class G extends EventTarget {
  constructor() {
    super(...arguments);
    /**
     * Notifies about the download #progress of a file.
     *
     * @param  file   The file name.
     * @param  loaded The number of bytes of that file loaded so far.
     * @param  fileSize  The total number of bytes in the loaded file.
     */
    u(this, b);
    u(this, f, {});
    u(this, h, {});
  }
  expectAssets(t) {
    for (const [r, n] of Object.entries(t)) {
      const i = "http://example.com/", o = new URL(r, i).pathname.split("/").pop();
      o in a(this, f) || (a(this, f)[o] = n), o in a(this, h) || (a(this, h)[o] = 0);
    }
  }
  async monitorFetch(t) {
    const r = await t;
    return U(r, (i) => {
      v(this, b, B).call(this, r.url, i.detail.loaded, i.detail.total);
    });
  }
}
f = new WeakMap(), h = new WeakMap(), b = new WeakSet(), B = function(t, r, n) {
  const i = new URL(t, "http://example.com").pathname.split("/").pop();
  n ? i in a(this, f) || (a(this, f)[i] = n, a(this, h)[i] = r) : n = a(this, f)[i], i in a(this, h) || x.warn(
    `Registered a download #progress of an unregistered file "${i}". This may cause a sudden **decrease** in the #progress percentage as the total number of bytes increases during the download.`
  ), a(this, h)[i] = r, this.dispatchEvent(
    new CustomEvent("progress", {
      detail: {
        loaded: D(a(this, h)),
        total: D(a(this, f))
      }
    })
  );
};
function D(s) {
  return Object.values(s).reduce((e, t) => e + t, 0);
}
function U(s, e) {
  const t = s.headers.get("content-length") || "", r = parseInt(t, 10) || J;
  function n(i, l) {
    e(
      new CustomEvent("progress", {
        detail: {
          loaded: i,
          total: l
        }
      })
    );
  }
  return new Response(
    new ReadableStream({
      async start(i) {
        if (!s.body) {
          i.close();
          return;
        }
        const l = s.body.getReader();
        let o = 0;
        for (; ; )
          try {
            const { done: d, value: g } = await l.read();
            if (g && (o += g.byteLength), d) {
              n(o, o), i.close();
              break;
            } else
              n(o, r), i.enqueue(g);
          } catch (d) {
            x.error({ e: d }), i.error(d);
            break;
          }
      }
    }),
    {
      status: s.status,
      statusText: s.statusText,
      headers: s.headers
    }
  );
}
var c, p, m, P;
class Z extends EventTarget {
  constructor() {
    super(...arguments);
    u(this, m);
    u(this, c, void 0);
    u(this, p, void 0);
    y(this, c, {}), y(this, p, 0), this.progress = 0, this.mode = "REAL_TIME", this.caption = "";
  }
  partialObserver(t, r = "") {
    const n = ++w(this, p)._;
    return a(this, c)[n] = 0, (i) => {
      const { loaded: l, total: o } = (i == null ? void 0 : i.detail) || {};
      a(this, c)[n] = l / o * t, v(this, m, P).call(this, this.totalProgress, "REAL_TIME", r);
    };
  }
  slowlyIncrementBy(t) {
    const r = ++w(this, p)._;
    a(this, c)[r] = t, v(this, m, P).call(this, this.totalProgress, "SLOWLY_INCREMENT");
  }
  get totalProgress() {
    return Object.values(a(this, c)).reduce(
      (t, r) => t + r,
      0
    );
  }
}
c = new WeakMap(), p = new WeakMap(), m = new WeakSet(), P = function(t, r, n) {
  this.dispatchEvent(
    new CustomEvent("progress", {
      detail: {
        progress: t,
        mode: r,
        caption: n
      }
    })
  );
};
const _ = 1e-5;
class M extends EventTarget {
  constructor({
    weight: e = 1,
    caption: t = "",
    fillTime: r = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = !1, this._selfProgress = 0, this._selfCaption = "", this._isFilling = !1, this._subTrackers = [], this._weight = e, this._selfCaption = t, this._fillTime = r;
  }
  /**
   * Creates a new sub-tracker with a specific weight.
   *
   * The weight determines what percentage of the overall progress
   * the sub-tracker represents. For example, if the main tracker is
   * monitoring a process that has two stages, and the first stage
   * is expected to take twice as long as the second stage, you could
   * create the first sub-tracker with a weight of 0.67 and the second
   * sub-tracker with a weight of 0.33.
   *
   * The caption is an optional string that describes the current stage
   * of the operation. If provided, it will be used as the progress caption
   * for the sub-tracker. If not provided, the main tracker will look for
   * the next sub-tracker with a non-empty caption and use that as the progress
   * caption instead.
   *
   * Returns the newly-created sub-tracker.
   *
   * @throws {Error} If the weight of the new stage would cause the total weight of all stages to exceed 1.
   *
   * @param weight The weight of the new stage, as a decimal value between 0 and 1.
   * @param caption The caption for the new stage, which will be used as the progress caption for the sub-tracker.
   *
   * @example
   * ```ts
   * const tracker = new ProgressTracker();
   * const subTracker1 = tracker.stage(0.67, 'Slow stage');
   * const subTracker2 = tracker.stage(0.33, 'Fast stage');
   *
   * subTracker2.set(50);
   * subTracker1.set(75);
   * subTracker2.set(100);
   * subTracker1.set(100);
   * ```
   */
  stage(e, t = "") {
    if (e || (e = this._selfWeight), this._selfWeight - e < -_)
      throw new Error(
        `Cannot add a stage with weight ${e} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= e;
    const r = new M({
      caption: t,
      weight: e,
      fillTime: this._fillTime
    });
    return this._subTrackers.push(r), r.addEventListener("progress", () => this.notifyProgress()), r.addEventListener("done", () => {
      this.done && this.notifyDone();
    }), r;
  }
  /**
   * Fills the progress bar slowly over time, simulating progress.
   *
   * The progress bar is filled in a 100 steps, and each step, the progress
   * is increased by 1. If `stopBeforeFinishing` is true, the progress bar
   * will stop filling when it reaches 99% so that you can call `finish()`
   * explicitly.
   *
   * If the progress bar is filling or already filled, this method does nothing.
   *
   * @example
   * ```ts
   * const progress = new ProgressTracker({ caption: 'Processing...' });
   * progress.fillSlowly();
   * ```
   *
   * @param options Optional options.
   */
  fillSlowly({ stopBeforeFinishing: e = !0 } = {}) {
    if (this._isFilling)
      return;
    this._isFilling = !0;
    const t = 100, r = this._fillTime / t;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), e && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, r);
  }
  set(e) {
    this._selfProgress = Math.min(e, 100), this.notifyProgress(), this._selfProgress + _ >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = !0, this._selfProgress = 100, this._isFilling = !1, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let e = this._subTrackers.length - 1; e >= 0; e--)
      if (!this._subTrackers[e].done) {
        const t = this._subTrackers[e].caption;
        if (t)
          return t;
      }
    return this._selfCaption;
  }
  setCaption(e) {
    this._selfCaption = e, this.notifyProgress();
  }
  get done() {
    return this.progress + _ >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const e = this._subTrackers.reduce(
      (t, r) => t + r.progress * r.weight,
      this._selfProgress * this._selfWeight
    );
    return Math.round(e * 1e4) / 1e4;
  }
  get weight() {
    return this._weight;
  }
  get observer() {
    return this._progressObserver || (this._progressObserver = (e) => {
      this.set(e);
    }), this._progressObserver;
  }
  get loadingListener() {
    return this._loadingListener || (this._loadingListener = (e) => {
      this.set(e.detail.loaded / e.detail.total * 100);
    }), this._loadingListener;
  }
  pipe(e) {
    e.setProgress({
      progress: this.progress,
      caption: this.caption
    }), this.addEventListener("progress", (t) => {
      e.setProgress({
        progress: t.detail.progress,
        caption: t.detail.caption
      });
    }), this.addEventListener("done", () => {
      e.setLoaded();
    });
  }
  addEventListener(e, t) {
    super.addEventListener(e, t);
  }
  removeEventListener(e, t) {
    super.removeEventListener(e, t);
  }
  notifyProgress() {
    const e = this;
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: {
          get progress() {
            return e.progress;
          },
          get caption() {
            return e.caption;
          }
        }
      })
    );
  }
  notifyDone() {
    this.dispatchEvent(new CustomEvent("done"));
  }
}
export {
  G as EmscriptenDownloadMonitor,
  Z as ProgressObserver,
  M as ProgressTracker,
  U as cloneResponseMonitorProgress
};
