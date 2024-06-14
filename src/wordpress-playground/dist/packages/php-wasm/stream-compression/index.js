const S = function() {
  var t;
  return typeof process < "u" && ((t = process.release) == null ? void 0 : t.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (S === "NODE") {
  let t = function(e) {
    return new Promise(function(r, i) {
      e.onload = e.onerror = function(s) {
        e.onload = e.onerror = null, s.type === "load" ? r(e.result) : i(new Error("Failed to read the blob/file"));
      };
    });
  }, n = function() {
    const e = new Uint8Array([1, 2, 3, 4]), i = new File([e], "test").stream();
    try {
      return i.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class e extends Blob {
      constructor(i, s, o) {
        super(i);
        let a;
        o != null && o.lastModified && (a = /* @__PURE__ */ new Date()), (!a || isNaN(a.getFullYear())) && (a = /* @__PURE__ */ new Date()), this.lastModifiedDate = a, this.lastModified = a.getMilliseconds(), this.name = s || "";
      }
    }
    global.File = e;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const r = new FileReader();
    return r.readAsArrayBuffer(this), t(r);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const r = new FileReader();
    return r.readAsText(this), t(r);
  }), (typeof Blob.prototype.stream > "u" || !n()) && (Blob.prototype.stream = function() {
    let e = 0;
    const r = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(i) {
        const s = i.byobRequest.view, a = await r.slice(
          e,
          e + s.byteLength
        ).arrayBuffer(), c = new Uint8Array(a);
        new Uint8Array(s.buffer).set(c);
        const u = c.byteLength;
        i.byobRequest.respond(u), e += u, e >= r.size && i.close();
      }
    });
  });
}
if (S === "NODE" && typeof CustomEvent > "u") {
  class t extends Event {
    constructor(e, r = {}) {
      super(e, r), this.detail = r.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = t;
}
function b(...t) {
  const n = new Uint8Array(
    t.reduce((r, i) => r + i.length, 0)
  );
  let e = 0;
  for (const r of t)
    n.set(r, e), e += r.length;
  return n;
}
function E(t) {
  if (t === void 0) {
    let n = new Uint8Array();
    return new TransformStream({
      transform(e) {
        n = b(n, e);
      },
      flush(e) {
        e.enqueue(n);
      }
    });
  } else {
    const n = new ArrayBuffer(t || 0);
    let e = 0;
    return new TransformStream({
      transform(r) {
        new Uint8Array(n).set(r, e), e += r.byteLength;
      },
      flush(r) {
        r.enqueue(new Uint8Array(n));
      }
    });
  }
}
function A(t, n) {
  if (n === 0)
    return new ReadableStream({
      start(i) {
        i.close();
      }
    });
  const e = t.getReader({ mode: "byob" });
  let r = 0;
  return new ReadableStream({
    async pull(i) {
      const { value: s, done: o } = await e.read(
        new Uint8Array(n - r)
      );
      if (o) {
        e.releaseLock(), i.close();
        return;
      }
      r += s.length, i.enqueue(s), r >= n && (e.releaseLock(), i.close());
    },
    cancel() {
      e.cancel();
    }
  });
}
async function f(t, n) {
  return n !== void 0 && (t = A(t, n)), await t.pipeThrough(E(n)).getReader().read().then(({ value: e }) => e);
}
async function se(t, n) {
  return new File([await f(n)], t);
}
function F(t) {
  if (t instanceof ReadableStream)
    return t;
  let n;
  return Symbol.asyncIterator in t ? n = t[Symbol.asyncIterator]() : Symbol.iterator in t ? n = t[Symbol.iterator]() : n = t, new ReadableStream({
    async pull(e) {
      const { done: r, value: i } = await n.next();
      if (r) {
        e.close();
        return;
      }
      e.enqueue(i);
    }
  });
}
class ae extends File {
  /**
   * Creates a new StreamedFile instance.
   *
   * @param readableStream The readable stream containing the file data.
   * @param name The name of the file.
   * @param type The MIME type of the file.
   */
  constructor(n, e, r) {
    super([], e, { type: r }), this.readableStream = n;
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
    return await f(this.stream());
  }
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const t = this.getReader();
  try {
    for (; ; ) {
      const { done: n, value: e } = await t.read();
      if (n)
        return;
      yield e;
    }
  } finally {
    t.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const _ = 32, h = 67324752, w = 33639248, y = 101010256, x = 0, R = 8;
function U(t) {
  return new TransformStream({
    transform(n, e) {
      t(n) && e.enqueue(n);
    }
  });
}
function N(t) {
  let n = !1;
  return new TransformStream({
    async transform(e, r) {
      n || (n = !0, r.enqueue(t)), r.enqueue(e);
    }
  });
}
function k(t) {
  return new TransformStream({
    async transform(n, e) {
      e.enqueue(n);
    },
    async flush(n) {
      n.enqueue(t);
    }
  });
}
function p(t, n) {
  return M(t, n).pipeThrough(
    new TransformStream({
      async transform(e, r) {
        const i = new File(
          [e.bytes],
          new TextDecoder().decode(e.path),
          {
            type: e.isDirectory ? "directory" : void 0
          }
        );
        r.enqueue(i);
      }
    })
  );
}
const v = () => !0;
function M(t, n = v) {
  return new ReadableStream({
    async pull(r) {
      const i = await O(t);
      if (!i) {
        r.close();
        return;
      }
      r.enqueue(i);
    }
  }).pipeThrough(
    U(({ signature: r }) => r === h)
  ).pipeThrough(
    U(n)
  );
}
async function O(t) {
  const e = new DataView((await f(t, 4)).buffer).getUint32(0, !0);
  return e === h ? await T(t, !0) : e === w ? await L(t, !0) : e === y ? await P(t, !0) : null;
}
async function T(t, n = !1) {
  if (!n && new DataView((await f(t, 4)).buffer).getUint32(0, !0) !== h)
    return null;
  const e = new DataView((await f(t, 26)).buffer), r = e.getUint16(22, !0), i = e.getUint16(24, !0), s = {
    signature: h,
    version: e.getUint32(0, !0),
    generalPurpose: e.getUint16(2, !0),
    compressionMethod: e.getUint16(4, !0),
    lastModifiedTime: e.getUint16(6, !0),
    lastModifiedDate: e.getUint16(8, !0),
    crc: e.getUint32(10, !0),
    compressedSize: e.getUint32(14, !0),
    uncompressedSize: e.getUint32(18, !0)
  };
  s.path = await f(t, r), s.isDirectory = C(s.path), s.extra = await f(t, i);
  let o = A(t, s.compressedSize);
  if (s.compressionMethod === R) {
    const a = new Uint8Array(10);
    a.set([31, 139, 8]);
    const c = new Uint8Array(8), u = new DataView(c.buffer);
    u.setUint32(0, s.crc, !0), u.setUint32(4, s.uncompressedSize % 2 ** 32, !0), o = o.pipeThrough(N(a)).pipeThrough(k(c)).pipeThrough(new DecompressionStream("gzip"));
  }
  return s.bytes = await o.pipeThrough(E(s.uncompressedSize)).getReader().read().then(({ value: a }) => a), s;
}
async function L(t, n = !1) {
  if (!n && new DataView((await f(t, 4)).buffer).getUint32(0, !0) !== w)
    return null;
  const e = new DataView((await f(t, 42)).buffer), r = e.getUint16(24, !0), i = e.getUint16(26, !0), s = e.getUint16(28, !0), o = {
    signature: w,
    versionCreated: e.getUint16(0, !0),
    versionNeeded: e.getUint16(2, !0),
    generalPurpose: e.getUint16(4, !0),
    compressionMethod: e.getUint16(6, !0),
    lastModifiedTime: e.getUint16(8, !0),
    lastModifiedDate: e.getUint16(10, !0),
    crc: e.getUint32(12, !0),
    compressedSize: e.getUint32(16, !0),
    uncompressedSize: e.getUint32(20, !0),
    diskNumber: e.getUint16(30, !0),
    internalAttributes: e.getUint16(32, !0),
    externalAttributes: e.getUint32(34, !0),
    firstByteAt: e.getUint32(38, !0)
  };
  return o.lastByteAt = o.firstByteAt + _ + r + s + i + o.compressedSize - 1, o.path = await f(t, r), o.isDirectory = C(o.path), o.extra = await f(t, i), o.fileComment = await f(
    t,
    s
  ), o;
}
function C(t) {
  return t[t.byteLength - 1] == "/".charCodeAt(0);
}
async function P(t, n = !1) {
  if (!n && new DataView((await f(t, 4)).buffer).getUint32(0, !0) !== y)
    return null;
  const e = new DataView((await f(t, 18)).buffer), r = {
    signature: y,
    numberOfDisks: e.getUint16(0, !0),
    centralDirectoryStartDisk: e.getUint16(2, !0),
    numberCentralDirectoryRecordsOnThisDisk: e.getUint16(4, !0),
    numberCentralDirectoryRecords: e.getUint16(6, !0),
    centralDirectorySize: e.getUint32(8, !0),
    centralDirectoryOffset: e.getUint32(12, !0)
  }, i = e.getUint16(16, !0);
  return r.comment = await f(t, i), r;
}
const B = Symbol("SleepFinished");
function I(t) {
  return new Promise((n) => {
    setTimeout(() => n(B), t);
  });
}
class z extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class V {
  constructor({ concurrency: n, timeout: e }) {
    this._running = 0, this.concurrency = n, this.timeout = e, this.queue = [];
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
        const n = new Promise((e) => {
          this.queue.push(e);
        });
        this.timeout !== void 0 ? await Promise.race([n, I(this.timeout)]).then(
          (e) => {
            if (e === B)
              throw new z();
          }
        ) : await n;
      } else {
        this._running++;
        let n = !1;
        return () => {
          n || (n = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(n) {
    const e = await this.acquire();
    try {
      return await n();
    } finally {
      e();
    }
  }
}
const H = 110 * 1024, Z = 10 * 1024, W = 1024 * 1024 * 1, G = new V({ concurrency: 10 }), D = () => !0;
async function oe(t, n = D) {
  if (n === D) {
    const d = await fetch(t);
    return p(d.body);
  }
  const e = await q(t);
  if (e <= W) {
    const d = await fetch(t);
    return p(d.body);
  }
  const r = await fetch(t, {
    headers: {
      // 0-0 looks weird, doesn't it?
      // The Range header is inclusive so it's actually
      // a valid header asking for the first byte.
      Range: "bytes=0-0",
      "Accept-Encoding": "none"
    }
  }), [i, s] = r.body.tee(), o = i.getReader(), { value: a } = await o.read(), { done: c } = await o.read();
  if (o.releaseLock(), i.cancel(), !((a == null ? void 0 : a.length) === 1 && c))
    return p(s);
  s.cancel();
  const l = await X(t, e);
  return Y(l).pipeThrough(U(n)).pipeThrough(K()).pipeThrough(
    J(l)
  );
}
function Y(t) {
  let n;
  return new ReadableStream({
    async start() {
      n = await $(t);
    },
    async pull(e) {
      const r = await L(
        n
      );
      if (!r) {
        e.close();
        return;
      }
      e.enqueue(r);
    }
  });
}
async function $(t) {
  const n = H;
  let e = new Uint8Array(), r = t.length;
  do {
    r = Math.max(0, r - n);
    const i = Math.min(
      r + n - 1,
      t.length - 1
    ), s = await f(
      await t.streamBytes(r, i)
    );
    e = b(s, e);
    const o = new DataView(s.buffer);
    for (let a = o.byteLength - 4; a >= 0; a--) {
      if (o.getUint32(a, !0) !== y)
        continue;
      const u = a + 12 + 4;
      if (e.byteLength < u + 4)
        throw new Error("Central directory not found");
      const l = o.getUint32(u, !0);
      if (l < r) {
        const d = await f(
          await t.streamBytes(l, r - 1)
        );
        e = b(
          d,
          e
        );
      } else
        l > r && (e = e.slice(
          l - r
        ));
      return new Blob([e]).stream();
    }
  } while (r >= 0);
  throw new Error("Central directory not found");
}
function K() {
  let t = 0, n = [];
  return new TransformStream({
    transform(e, r) {
      e.firstByteAt > t + Z && (r.enqueue(n), n = []), t = e.lastByteAt, n.push(e);
    },
    flush(e) {
      e.enqueue(n);
    }
  });
}
function J(t) {
  let n = !1, e = 0, r;
  const i = [], s = new WritableStream({
    write(a, c) {
      a.length && (++e, Q(t, a).then((u) => {
        i.push([a, u]);
      }).catch((u) => {
        c.error(u);
      }).finally(() => {
        --e;
      }));
    },
    abort() {
      n = !0, r.close();
    },
    async close() {
      n = !0;
    }
  });
  return {
    readable: new ReadableStream({
      start(a) {
        r = a;
      },
      async pull(a) {
        for (; ; ) {
          if (n && !i.length && e === 0) {
            a.close();
            return;
          }
          if (!i.length) {
            await new Promise((m) => setTimeout(m, 50));
            continue;
          }
          const [l, d] = i[0], g = await T(d);
          if (!g) {
            i.shift();
            continue;
          }
          if (l.find(
            (m) => m.path === g.path
          )) {
            a.enqueue(g);
            break;
          }
        }
      }
    }),
    writable: s
  };
}
async function Q(t, n) {
  const e = await G.acquire();
  try {
    const r = n[n.length - 1];
    return await t.streamBytes(
      n[0].firstByteAt,
      r.lastByteAt
    );
  } finally {
    e();
  }
}
async function q(t) {
  return await fetch(t, { method: "HEAD" }).then((n) => n.headers.get("Content-Length")).then((n) => {
    if (!n)
      throw new Error("Content-Length header is missing");
    const e = parseInt(n, 10);
    if (isNaN(e) || e < 0)
      throw new Error("Content-Length header is invalid");
    return e;
  });
}
async function X(t, n) {
  return n === void 0 && (n = await q(t)), {
    length: n,
    streamBytes: async (e, r) => await fetch(t, {
      headers: {
        // The Range header is inclusive, so we need to subtract 1
        Range: `bytes=${e}-${r - 1}`,
        "Accept-Encoding": "none"
      }
    }).then((i) => i.body)
  };
}
function ue(t) {
  return F(t).pipeThrough(j());
}
function j() {
  const t = /* @__PURE__ */ new Map();
  let n = 0;
  return new TransformStream({
    async transform(e, r) {
      const i = new Uint8Array(await e.arrayBuffer());
      let s = await f(
        new Blob([i]).stream().pipeThrough(new CompressionStream("gzip"))
      );
      const o = new DataView(s.buffer).getUint32(
        s.byteLength - 8,
        !0
      );
      s = s.slice(10, s.byteLength - 8);
      const a = new TextEncoder().encode(e.name), c = {
        signature: h,
        version: 2,
        generalPurpose: 0,
        compressionMethod: e.type === "directory" || s.byteLength === 0 ? x : R,
        lastModifiedTime: 0,
        lastModifiedDate: 0,
        crc: o,
        compressedSize: s.byteLength,
        uncompressedSize: i.byteLength,
        path: a,
        extra: new Uint8Array(0)
      };
      t.set(n, c);
      const u = ee(c);
      r.enqueue(u), n += u.byteLength, r.enqueue(s), n += s.byteLength;
    },
    flush(e) {
      const r = n;
      let i = 0;
      for (const [
        a,
        c
      ] of t.entries()) {
        const u = {
          ...c,
          signature: w,
          fileComment: new Uint8Array(0),
          diskNumber: 1,
          internalAttributes: 0,
          externalAttributes: 0,
          firstByteAt: a
        }, l = te(
          u,
          a
        );
        e.enqueue(l), i += l.byteLength;
      }
      const s = {
        signature: y,
        numberOfDisks: 1,
        centralDirectoryOffset: r,
        centralDirectorySize: i,
        centralDirectoryStartDisk: 1,
        numberCentralDirectoryRecordsOnThisDisk: t.size,
        numberCentralDirectoryRecords: t.size,
        comment: new Uint8Array(0)
      }, o = ne(s);
      e.enqueue(o), t.clear();
    }
  });
}
function ee(t) {
  const n = new ArrayBuffer(
    30 + t.path.byteLength + t.extra.byteLength
  ), e = new DataView(n);
  e.setUint32(0, t.signature, !0), e.setUint16(4, t.version, !0), e.setUint16(6, t.generalPurpose, !0), e.setUint16(8, t.compressionMethod, !0), e.setUint16(10, t.lastModifiedDate, !0), e.setUint16(12, t.lastModifiedTime, !0), e.setUint32(14, t.crc, !0), e.setUint32(18, t.compressedSize, !0), e.setUint32(22, t.uncompressedSize, !0), e.setUint16(26, t.path.byteLength, !0), e.setUint16(28, t.extra.byteLength, !0);
  const r = new Uint8Array(n);
  return r.set(t.path, 30), r.set(t.extra, 30 + t.path.byteLength), r;
}
function te(t, n) {
  const e = new ArrayBuffer(
    46 + t.path.byteLength + t.extra.byteLength
  ), r = new DataView(e);
  r.setUint32(0, t.signature, !0), r.setUint16(4, t.versionCreated, !0), r.setUint16(6, t.versionNeeded, !0), r.setUint16(8, t.generalPurpose, !0), r.setUint16(10, t.compressionMethod, !0), r.setUint16(12, t.lastModifiedDate, !0), r.setUint16(14, t.lastModifiedTime, !0), r.setUint32(16, t.crc, !0), r.setUint32(20, t.compressedSize, !0), r.setUint32(24, t.uncompressedSize, !0), r.setUint16(28, t.path.byteLength, !0), r.setUint16(30, t.extra.byteLength, !0), r.setUint16(32, t.fileComment.byteLength, !0), r.setUint16(34, t.diskNumber, !0), r.setUint16(36, t.internalAttributes, !0), r.setUint32(38, t.externalAttributes, !0), r.setUint32(42, n, !0);
  const i = new Uint8Array(e);
  return i.set(t.path, 46), i.set(t.extra, 46 + t.path.byteLength), i;
}
function ne(t) {
  const n = new ArrayBuffer(22 + t.comment.byteLength), e = new DataView(n);
  e.setUint32(0, t.signature, !0), e.setUint16(4, t.numberOfDisks, !0), e.setUint16(6, t.centralDirectoryStartDisk, !0), e.setUint16(8, t.numberCentralDirectoryRecordsOnThisDisk, !0), e.setUint16(10, t.numberCentralDirectoryRecords, !0), e.setUint32(12, t.centralDirectorySize, !0), e.setUint32(16, t.centralDirectoryOffset, !0), e.setUint16(20, t.comment.byteLength, !0);
  const r = new Uint8Array(n);
  return r.set(t.comment, 22), r;
}
export {
  ae as StreamedFile,
  f as collectBytes,
  se as collectFile,
  oe as decodeRemoteZip,
  p as decodeZip,
  ue as encodeZip,
  F as iteratorToStream
};
