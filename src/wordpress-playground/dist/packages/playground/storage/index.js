const $r = Symbol("SleepFinished");
function sn(e) {
  return new Promise((t) => {
    setTimeout(() => t($r), e);
  });
}
class nn extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Ur {
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
        this.timeout !== void 0 ? await Promise.race([t, sn(this.timeout)]).then(
          (r) => {
            if (r === $r)
              throw new nn();
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
function on(...e) {
  let t = e.join("/");
  const r = t[0] === "/", n = t.substring(t.length - 1) === "/";
  return t = Dr(t), !t && !r && (t = "."), t && n && (t += "/"), t;
}
function Dr(e) {
  const t = e[0] === "/";
  return e = an(
    e.split("/").filter((r) => !!r),
    !t
  ).join("/"), (t ? "/" : "") + e.replace(/\/$/, "");
}
function an(e, t) {
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
var qe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function mt(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function ae(e) {
  if (e.__esModule)
    return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function n() {
      return this instanceof n ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else
    r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(n) {
    var s = Object.getOwnPropertyDescriptor(e, n);
    Object.defineProperty(r, n, s.get ? s : {
      enumerable: !0,
      get: function() {
        return e[n];
      }
    });
  }), r;
}
function A() {
  return typeof navigator == "object" && "userAgent" in navigator ? navigator.userAgent : typeof process == "object" && "version" in process ? `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})` : "<environment undetectable>";
}
const cn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getUserAgent: A
}, Symbol.toStringTag, { value: "Module" }));
var Oe = { exports: {} }, un = Fr;
function Fr(e, t, r, n) {
  if (typeof r != "function")
    throw new Error("method for before hook must be a function");
  return n || (n = {}), Array.isArray(t) ? t.reverse().reduce(function(s, o) {
    return Fr.bind(null, e, o, s, n);
  }, r)() : Promise.resolve().then(function() {
    return e.registry[t] ? e.registry[t].reduce(function(s, o) {
      return o.hook.bind(null, s, n);
    }, r)() : r(n);
  });
}
var ln = pn;
function pn(e, t, r, n) {
  var s = n;
  e.registry[r] || (e.registry[r] = []), t === "before" && (n = function(o, i) {
    return Promise.resolve().then(s.bind(null, i)).then(o.bind(null, i));
  }), t === "after" && (n = function(o, i) {
    var c;
    return Promise.resolve().then(o.bind(null, i)).then(function(l) {
      return c = l, s(c, i);
    }).then(function() {
      return c;
    });
  }), t === "error" && (n = function(o, i) {
    return Promise.resolve().then(o.bind(null, i)).catch(function(c) {
      return s(c, i);
    });
  }), e.registry[r].push({
    hook: n,
    orig: s
  });
}
var dn = hn;
function hn(e, t, r) {
  if (e.registry[t]) {
    var n = e.registry[t].map(function(s) {
      return s.orig;
    }).indexOf(r);
    n !== -1 && e.registry[t].splice(n, 1);
  }
}
var jr = un, gn = ln, fn = dn, Mt = Function.bind, Kt = Mt.bind(Mt);
function Cr(e, t, r) {
  var n = Kt(fn, null).apply(
    null,
    r ? [t, r] : [t]
  );
  e.api = { remove: n }, e.remove = n, ["before", "error", "after", "wrap"].forEach(function(s) {
    var o = r ? [t, s, r] : [t, s];
    e[s] = e.api[s] = Kt(gn, null).apply(null, o);
  });
}
function mn() {
  var e = "h", t = {
    registry: {}
  }, r = jr.bind(null, t, e);
  return Cr(r, t, e), r;
}
function Ir() {
  var e = {
    registry: {}
  }, t = jr.bind(null, e);
  return Cr(t, e), t;
}
var Jt = !1;
function ce() {
  return Jt || (console.warn(
    '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
  ), Jt = !0), Ir();
}
ce.Singular = mn.bind();
ce.Collection = Ir.bind();
Oe.exports = ce;
Oe.exports.Hook = ce;
Oe.exports.Singular = ce.Singular;
var qr = Oe.exports.Collection = ce.Collection;
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */
function Qt(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function G(e) {
  var t, r;
  return Qt(e) === !1 ? !1 : (t = e.constructor, t === void 0 ? !0 : (r = t.prototype, !(Qt(r) === !1 || r.hasOwnProperty("isPrototypeOf") === !1)));
}
var Tn = "9.0.2", En = `octokit-endpoint.js/${Tn} ${A()}`, wn = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": En
  },
  mediaType: {
    format: ""
  }
};
function yn(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function Lr(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = Lr(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function Xt(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function Ze(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = yn(r.headers), Xt(r), Xt(r.headers);
  const n = Lr(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function bn(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var _n = /\{[^}]+\}/g;
function vn(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function kn(e) {
  const t = e.match(_n);
  return t ? t.map(vn).reduce((r, n) => r.concat(n), []) : [];
}
function Yt(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function xr(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function Y(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function de(e, t, r) {
  return t = e === "+" || e === "#" ? xr(t) : Y(t), r ? Y(r) + "=" + t : t;
}
function H(e) {
  return e != null;
}
function Le(e) {
  return e === ";" || e === "&" || e === "?";
}
function An(e, t, r, n) {
  var s = e[r], o = [];
  if (H(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        de(t, s, Le(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(H).forEach(function(i) {
        o.push(
          de(t, i, Le(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        H(s[i]) && o.push(de(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(H).forEach(function(c) {
        i.push(de(t, c));
      }) : Object.keys(s).forEach(function(c) {
        H(s[c]) && (i.push(Y(c)), i.push(de(t, s[c].toString())));
      }), Le(t) ? o.push(Y(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? H(s) && o.push(Y(r)) : s === "" && (t === "&" || t === "?") ? o.push(Y(r) + "=") : s === "" && o.push("");
  return o;
}
function Sn(e) {
  return {
    expand: On.bind(null, e)
  };
}
function On(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(An(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return xr(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function Nr(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = Yt(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = kn(r);
  r = Sn(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = Yt(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = bn(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function Pn(e, t, r) {
  return Nr(Ze(e, t, r));
}
function Br(e, t) {
  const r = Ze(e, t), n = Pn.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: Br.bind(null, r),
    merge: Ze.bind(null, r),
    parse: Nr
  });
}
var Rn = Br(null, wn);
class R extends Error {
  constructor(t) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "Deprecation";
  }
}
var Tt = { exports: {} }, Gn = Wr;
function Wr(e, t) {
  if (e && t)
    return Wr(e)(t);
  if (typeof e != "function")
    throw new TypeError("need wrapper function");
  return Object.keys(e).forEach(function(n) {
    r[n] = e[n];
  }), r;
  function r() {
    for (var n = new Array(arguments.length), s = 0; s < n.length; s++)
      n[s] = arguments[s];
    var o = e.apply(this, n), i = n[n.length - 1];
    return typeof o == "function" && o !== i && Object.keys(i).forEach(function(c) {
      o[c] = i[c];
    }), o;
  }
}
var Hr = Gn;
Tt.exports = Hr(Se);
Tt.exports.strict = Hr(Vr);
Se.proto = Se(function() {
  Object.defineProperty(Function.prototype, "once", {
    value: function() {
      return Se(this);
    },
    configurable: !0
  }), Object.defineProperty(Function.prototype, "onceStrict", {
    value: function() {
      return Vr(this);
    },
    configurable: !0
  });
});
function Se(e) {
  var t = function() {
    return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
  };
  return t.called = !1, t;
}
function Vr(e) {
  var t = function() {
    if (t.called)
      throw new Error(t.onceError);
    return t.called = !0, t.value = e.apply(this, arguments);
  }, r = e.name || "Function wrapped with `once`";
  return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
}
var $n = Tt.exports;
const $ = /* @__PURE__ */ mt($n);
var Un = $((e) => console.warn(e)), Dn = $((e) => console.warn(e)), Q = class extends Error {
  constructor(t, r, n) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = r;
    let s;
    "headers" in n && typeof n.headers < "u" && (s = n.headers), "response" in n && (this.response = n.response, s = n.response.headers);
    const o = Object.assign({}, n.request);
    n.request.headers.authorization && (o.headers = Object.assign({}, n.request.headers, {
      authorization: n.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), o.url = o.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = o, Object.defineProperty(this, "code", {
      get() {
        return Un(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), r;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return Dn(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), s || {};
      }
    });
  }
}, Fn = "8.1.4";
function jn(e) {
  return e.arrayBuffer();
}
function Zt(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new Q(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new Q("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await xe(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await xe(u);
        throw new Q(Cn(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await xe(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof Q)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new Q(h, 500, {
      request: e
    });
  });
}
async function xe(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : jn(e);
}
function Cn(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function et(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return Zt(r.parse(i));
    const c = (l, m) => Zt(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: et.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: et.bind(null, r)
  });
}
var tt = et(Rn, {
  headers: {
    "user-agent": `octokit-request.js/${Fn} ${A()}`
  }
}), In = "7.0.2";
function qn(e) {
  return `Request failed due to following response errors:
` + e.errors.map((t) => ` - ${t.message}`).join(`
`);
}
var Ln = class extends Error {
  constructor(t, r, n) {
    super(qn(n)), this.request = t, this.headers = r, this.response = n, this.name = "GraphqlResponseError", this.errors = n.errors, this.data = n.data, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, xn = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
], Nn = ["query", "method", "url"], er = /\/api\/v3\/?$/;
function Bn(e, t, r) {
  if (r) {
    if (typeof t == "string" && "query" in r)
      return Promise.reject(
        new Error('[@octokit/graphql] "query" cannot be used as variable name')
      );
    for (const i in r)
      if (Nn.includes(i))
        return Promise.reject(
          new Error(
            `[@octokit/graphql] "${i}" cannot be used as variable name`
          )
        );
  }
  const n = typeof t == "string" ? Object.assign({ query: t }, r) : t, s = Object.keys(
    n
  ).reduce((i, c) => xn.includes(c) ? (i[c] = n[c], i) : (i.variables || (i.variables = {}), i.variables[c] = n[c], i), {}), o = n.baseUrl || e.endpoint.DEFAULTS.baseUrl;
  return er.test(o) && (s.url = o.replace(er, "/api/graphql")), e(s).then((i) => {
    if (i.data.errors) {
      const c = {};
      for (const l of Object.keys(i.headers))
        c[l] = i.headers[l];
      throw new Ln(
        s,
        c,
        i.data
      );
    }
    return i.data.data;
  });
}
function Et(e, t) {
  const r = e.defaults(t);
  return Object.assign((s, o) => Bn(r, s, o), {
    defaults: Et.bind(null, r),
    endpoint: r.endpoint
  });
}
Et(tt, {
  headers: {
    "user-agent": `octokit-graphql.js/${In} ${A()}`
  },
  method: "POST",
  url: "/graphql"
});
function Wn(e) {
  return Et(e, {
    method: "POST",
    url: "/graphql"
  });
}
var Hn = /^v1\./, Vn = /^ghs_/, zn = /^ghu_/;
async function Mn(e) {
  const t = e.split(/\./).length === 3, r = Hn.test(e) || Vn.test(e), n = zn.test(e);
  return {
    type: "token",
    token: e,
    tokenType: t ? "app" : r ? "installation" : n ? "user-to-server" : "oauth"
  };
}
function Kn(e) {
  return e.split(/\./).length === 3 ? `bearer ${e}` : `token ${e}`;
}
async function Jn(e, t, r, n) {
  const s = t.endpoint.merge(
    r,
    n
  );
  return s.headers.authorization = Kn(e), t(s);
}
var Qn = function(t) {
  if (!t)
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  if (typeof t != "string")
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  return t = t.replace(/^(token|bearer) +/i, ""), Object.assign(Mn.bind(null, t), {
    hook: Jn.bind(null, t)
  });
}, tr = "5.0.1", oe, Xn = (oe = class {
  static defaults(t) {
    return class extends this {
      constructor(...n) {
        const s = n[0] || {};
        if (typeof t == "function") {
          super(t(s));
          return;
        }
        super(
          Object.assign(
            {},
            t,
            s,
            s.userAgent && t.userAgent ? {
              userAgent: `${s.userAgent} ${t.userAgent}`
            } : null
          )
        );
      }
    };
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...t) {
    var s;
    const r = this.plugins;
    return s = class extends this {
    }, s.plugins = r.concat(
      t.filter((i) => !r.includes(i))
    ), s;
  }
  constructor(t = {}) {
    const r = new qr(), n = {
      baseUrl: tt.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, t.request, {
        // @ts-ignore internal usage only, no need to type
        hook: r.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    if (n.headers["user-agent"] = [
      t.userAgent,
      `octokit-core.js/${tr} ${A()}`
    ].filter(Boolean).join(" "), t.baseUrl && (n.baseUrl = t.baseUrl), t.previews && (n.mediaType.previews = t.previews), t.timeZone && (n.headers["time-zone"] = t.timeZone), this.request = tt.defaults(n), this.graphql = Wn(this.request).defaults(n), this.log = Object.assign(
      {
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      },
      t.log
    ), this.hook = r, t.authStrategy) {
      const { authStrategy: o, ...i } = t, c = o(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: i
          },
          t.auth
        )
      );
      r.wrap("request", c.hook), this.auth = c;
    } else if (!t.auth)
      this.auth = async () => ({
        type: "unauthenticated"
      });
    else {
      const o = Qn(t.auth);
      r.wrap("request", o.hook), this.auth = o;
    }
    this.constructor.plugins.forEach((o) => {
      Object.assign(this, o(this, t));
    });
  }
}, oe.VERSION = tr, oe.plugins = [], oe), Yn = "9.1.2";
function Zn(e) {
  if (!e.data)
    return {
      ...e,
      data: []
    };
  if (!("total_count" in e.data && !("url" in e.data)))
    return e;
  const r = e.data.incomplete_results, n = e.data.repository_selection, s = e.data.total_count;
  delete e.data.incomplete_results, delete e.data.repository_selection, delete e.data.total_count;
  const o = Object.keys(e.data)[0], i = e.data[o];
  return e.data = i, typeof r < "u" && (e.data.incomplete_results = r), typeof n < "u" && (e.data.repository_selection = n), e.data.total_count = s, e;
}
function wt(e, t, r) {
  const n = typeof t == "function" ? t.endpoint(r) : e.request.endpoint(t, r), s = typeof t == "function" ? t : e.request, o = n.method, i = n.headers;
  let c = n.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!c)
          return { done: !0 };
        try {
          const l = await s({ method: o, url: c, headers: i }), m = Zn(l);
          return c = ((m.headers.link || "").match(
            /<([^>]+)>;\s*rel="next"/
          ) || [])[1], { value: m };
        } catch (l) {
          if (l.status !== 409)
            throw l;
          return c = "", {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function zr(e, t, r, n) {
  return typeof r == "function" && (n = r, r = void 0), Mr(
    e,
    [],
    wt(e, t, r)[Symbol.asyncIterator](),
    n
  );
}
function Mr(e, t, r, n) {
  return r.next().then((s) => {
    if (s.done)
      return t;
    let o = !1;
    function i() {
      o = !0;
    }
    return t = t.concat(
      n ? n(s.value, i) : s.value.data
    ), o ? t : Mr(e, t, r, n);
  });
}
Object.assign(zr, {
  iterator: wt
});
function Kr(e) {
  return {
    paginate: Object.assign(zr.bind(null, e), {
      iterator: wt.bind(null, e)
    })
  };
}
Kr.VERSION = Yn;
var eo = (e, t) => `The cursor at "${e.join(
  ","
)}" did not change its value "${t}" after a page transition. Please make sure your that your query is set up correctly.`, to = class extends Error {
  constructor(e, t) {
    super(eo(e.pathInQuery, t)), this.pageInfo = e, this.cursorValue = t, this.name = "MissingCursorChangeError", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, ro = class extends Error {
  constructor(e) {
    super(
      `No pageInfo property found in response. Please make sure to specify the pageInfo in your query. Response-Data: ${JSON.stringify(
        e,
        null,
        2
      )}`
    ), this.response = e, this.name = "MissingPageInfo", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, so = (e) => Object.prototype.toString.call(e) === "[object Object]";
function Jr(e) {
  const t = Qr(
    e,
    "pageInfo"
  );
  if (t.length === 0)
    throw new ro(e);
  return t;
}
var Qr = (e, t, r = []) => {
  for (const n of Object.keys(e)) {
    const s = [...r, n], o = e[n];
    if (o.hasOwnProperty(t))
      return s;
    if (so(o)) {
      const i = Qr(
        o,
        t,
        s
      );
      if (i.length > 0)
        return i;
    }
  }
  return [];
}, _e = (e, t) => t.reduce((r, n) => r[n], e), Ne = (e, t, r) => {
  const n = t[t.length - 1], s = [...t].slice(0, -1), o = _e(e, s);
  typeof r == "function" ? o[n] = r(o[n]) : o[n] = r;
}, no = (e) => {
  const t = Jr(e);
  return {
    pathInQuery: t,
    pageInfo: _e(e, [...t, "pageInfo"])
  };
}, Xr = (e) => e.hasOwnProperty("hasNextPage"), oo = (e) => Xr(e) ? e.endCursor : e.startCursor, io = (e) => Xr(e) ? e.hasNextPage : e.hasPreviousPage, Yr = (e) => (t, r = {}) => {
  let n = !0, s = { ...r };
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!n)
          return { done: !0, value: {} };
        const o = await e.graphql(
          t,
          s
        ), i = no(o), c = oo(i.pageInfo);
        if (n = io(i.pageInfo), n && c === s.cursor)
          throw new to(i, c);
        return s = {
          ...s,
          cursor: c
        }, { done: !1, value: o };
      }
    })
  };
}, ao = (e, t) => {
  if (Object.keys(e).length === 0)
    return Object.assign(e, t);
  const r = Jr(e), n = [...r, "nodes"], s = _e(t, n);
  s && Ne(e, n, (l) => [...l, ...s]);
  const o = [...r, "edges"], i = _e(t, o);
  i && Ne(e, o, (l) => [...l, ...i]);
  const c = [...r, "pageInfo"];
  return Ne(e, c, _e(t, c)), e;
}, co = (e) => {
  const t = Yr(e);
  return async (r, n = {}) => {
    let s = {};
    for await (const o of t(
      r,
      n
    ))
      s = ao(s, o);
    return s;
  };
};
function uo(e) {
  return e.graphql, {
    graphql: Object.assign(e.graphql, {
      paginate: Object.assign(co(e), {
        iterator: Yr(e)
      })
    })
  };
}
var lo = "10.1.2", po = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repositories/{repository_id}/environments/{environment_name}/variables"
    ],
    createOrUpdateEnvironmentSecret: [
      "PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getEnvironmentPublicKey: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repositories/{repository_id}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repositories/{repository_id}/environments/{environment_name}/variables"
    ],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repositories/{repository_id}/environments/{environment_name}/variables/{name}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotForBusinessSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotForBusinessSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: [
      "DELETE /repos/{owner}/{repo}/import",
      {},
      {
        deprecated: "octokit.rest.migrations.cancelImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#cancel-an-import"
      }
    ],
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getCommitAuthors: [
      "GET /repos/{owner}/{repo}/import/authors",
      {},
      {
        deprecated: "octokit.rest.migrations.getCommitAuthors() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-commit-authors"
      }
    ],
    getImportStatus: [
      "GET /repos/{owner}/{repo}/import",
      {},
      {
        deprecated: "octokit.rest.migrations.getImportStatus() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-an-import-status"
      }
    ],
    getLargeFiles: [
      "GET /repos/{owner}/{repo}/import/large_files",
      {},
      {
        deprecated: "octokit.rest.migrations.getLargeFiles() is deprecated, see https://docs.github.com/rest/migrations/source-imports#get-large-files"
      }
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    mapCommitAuthor: [
      "PATCH /repos/{owner}/{repo}/import/authors/{author_id}",
      {},
      {
        deprecated: "octokit.rest.migrations.mapCommitAuthor() is deprecated, see https://docs.github.com/rest/migrations/source-imports#map-a-commit-author"
      }
    ],
    setLfsPreference: [
      "PATCH /repos/{owner}/{repo}/import/lfs",
      {},
      {
        deprecated: "octokit.rest.migrations.setLfsPreference() is deprecated, see https://docs.github.com/rest/migrations/source-imports#update-git-lfs-preference"
      }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: [
      "PUT /repos/{owner}/{repo}/import",
      {},
      {
        deprecated: "octokit.rest.migrations.startImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#start-an-import"
      }
    ],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    updateImport: [
      "PATCH /repos/{owner}/{repo}/import",
      {},
      {
        deprecated: "octokit.rest.migrations.updateImport() is deprecated, see https://docs.github.com/rest/migrations/source-imports#update-an-import"
      }
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
    createOrUpdateCustomPropertiesValuesForRepos: [
      "PATCH /orgs/{org}/properties/values"
    ],
    createOrUpdateCustomProperty: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}"
    ],
    get: ["GET /orgs/{org}"],
    getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
    getCustomProperty: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: ["GET /orgs/{org}/security-managers"],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeCustomProperty: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}"
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
    createCard: ["POST /projects/columns/{column_id}/cards"],
    createColumn: ["POST /projects/{project_id}/columns"],
    createForAuthenticatedUser: ["POST /user/projects"],
    createForOrg: ["POST /orgs/{org}/projects"],
    createForRepo: ["POST /repos/{owner}/{repo}/projects"],
    delete: ["DELETE /projects/{project_id}"],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
    deleteColumn: ["DELETE /projects/columns/{column_id}"],
    get: ["GET /projects/{project_id}"],
    getCard: ["GET /projects/columns/cards/{card_id}"],
    getColumn: ["GET /projects/columns/{column_id}"],
    getPermissionForUser: [
      "GET /projects/{project_id}/collaborators/{username}/permission"
    ],
    listCards: ["GET /projects/columns/{column_id}/cards"],
    listCollaborators: ["GET /projects/{project_id}/collaborators"],
    listColumns: ["GET /projects/{project_id}/columns"],
    listForOrg: ["GET /orgs/{org}/projects"],
    listForRepo: ["GET /repos/{owner}/{repo}/projects"],
    listForUser: ["GET /users/{username}/projects"],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
    moveColumn: ["POST /projects/columns/{column_id}/moves"],
    removeCollaborator: [
      "DELETE /projects/{project_id}/collaborators/{username}"
    ],
    update: ["PATCH /projects/{project_id}"],
    updateCard: ["PATCH /projects/columns/cards/{card_id}"],
    updateColumn: ["PATCH /projects/columns/{column_id}"]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployment"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createTagProtection: ["POST /repos/{owner}/{repo}/tags/protection"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteTagProtection: [
      "DELETE /repos/{owner}/{repo}/tags/protection/{tag_protection_id}"
    ],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTagProtection: ["GET /repos/{owner}/{repo}/tags/protection"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateProjectPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForProjectInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeProjectInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
}, ho = po, N = /* @__PURE__ */ new Map();
for (const [e, t] of Object.entries(ho))
  for (const [r, n] of Object.entries(t)) {
    const [s, o, i] = n, [c, l] = s.split(/ /), m = Object.assign(
      {
        method: c,
        url: l
      },
      o
    );
    N.has(e) || N.set(e, /* @__PURE__ */ new Map()), N.get(e).set(r, {
      scope: e,
      methodName: r,
      endpointDefaults: m,
      decorations: i
    });
  }
var go = {
  has({ scope: e }, t) {
    return N.get(e).has(t);
  },
  getOwnPropertyDescriptor(e, t) {
    return {
      value: this.get(e, t),
      // ensures method is in the cache
      configurable: !0,
      writable: !0,
      enumerable: !0
    };
  },
  defineProperty(e, t, r) {
    return Object.defineProperty(e.cache, t, r), !0;
  },
  deleteProperty(e, t) {
    return delete e.cache[t], !0;
  },
  ownKeys({ scope: e }) {
    return [...N.get(e).keys()];
  },
  set(e, t, r) {
    return e.cache[t] = r;
  },
  get({ octokit: e, scope: t, cache: r }, n) {
    if (r[n])
      return r[n];
    const s = N.get(t).get(n);
    if (!s)
      return;
    const { endpointDefaults: o, decorations: i } = s;
    return i ? r[n] = mo(
      e,
      t,
      n,
      o,
      i
    ) : r[n] = e.request.defaults(o), r[n];
  }
};
function fo(e) {
  const t = {};
  for (const r of N.keys())
    t[r] = new Proxy({ octokit: e, scope: r, cache: {} }, go);
  return t;
}
function mo(e, t, r, n, s) {
  const o = e.request.defaults(n);
  function i(...c) {
    let l = o.endpoint.merge(...c);
    if (s.mapToData)
      return l = Object.assign({}, l, {
        data: l[s.mapToData],
        [s.mapToData]: void 0
      }), o(l);
    if (s.renamed) {
      const [m, u] = s.renamed;
      e.log.warn(
        `octokit.${t}.${r}() has been renamed to octokit.${m}.${u}()`
      );
    }
    if (s.deprecated && e.log.warn(s.deprecated), s.renamedParameters) {
      const m = o.endpoint.merge(...c);
      for (const [u, h] of Object.entries(
        s.renamedParameters
      ))
        u in m && (e.log.warn(
          `"${u}" parameter is deprecated for "octokit.${t}.${r}()". Use "${h}" instead`
        ), h in m || (m[h] = m[u]), delete m[u]);
      return o(m);
    }
    return o(...c);
  }
  return Object.assign(i, o);
}
function Zr(e) {
  return {
    rest: fo(e)
  };
}
Zr.VERSION = lo;
var es = { exports: {} };
(function(e, t) {
  (function(r, n) {
    e.exports = n();
  })(qe, function() {
    var r = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof qe < "u" ? qe : typeof self < "u" ? self : {};
    function n(w) {
      return w && w.default || w;
    }
    var s = function(w, p, a = {}) {
      var d, g, f;
      for (d in p)
        f = p[d], a[d] = (g = w[d]) != null ? g : f;
      return a;
    }, o = function(w, p, a = {}) {
      var d, g;
      for (d in w)
        g = w[d], p[d] !== void 0 && (a[d] = g);
      return a;
    }, i = {
      load: s,
      overwrite: o
    }, c;
    c = class {
      constructor(p, a) {
        this.incr = p, this.decr = a, this._first = null, this._last = null, this.length = 0;
      }
      push(p) {
        var a;
        this.length++, typeof this.incr == "function" && this.incr(), a = {
          value: p,
          prev: this._last,
          next: null
        }, this._last != null ? (this._last.next = a, this._last = a) : this._first = this._last = a;
      }
      shift() {
        var p;
        if (this._first != null)
          return this.length--, typeof this.decr == "function" && this.decr(), p = this._first.value, (this._first = this._first.next) != null ? this._first.prev = null : this._last = null, p;
      }
      first() {
        if (this._first != null)
          return this._first.value;
      }
      getArray() {
        var p, a, d;
        for (p = this._first, d = []; p != null; )
          d.push((a = p, p = p.next, a.value));
        return d;
      }
      forEachShift(p) {
        var a;
        for (a = this.shift(); a != null; )
          p(a), a = this.shift();
      }
      debug() {
        var p, a, d, g, f;
        for (p = this._first, f = []; p != null; )
          f.push((a = p, p = p.next, {
            value: a.value,
            prev: (d = a.prev) != null ? d.value : void 0,
            next: (g = a.next) != null ? g.value : void 0
          }));
        return f;
      }
    };
    var l = c, m;
    m = class {
      constructor(p) {
        if (this.instance = p, this._events = {}, this.instance.on != null || this.instance.once != null || this.instance.removeAllListeners != null)
          throw new Error("An Emitter already exists for this object");
        this.instance.on = (a, d) => this._addListener(a, "many", d), this.instance.once = (a, d) => this._addListener(a, "once", d), this.instance.removeAllListeners = (a = null) => a != null ? delete this._events[a] : this._events = {};
      }
      _addListener(p, a, d) {
        var g;
        return (g = this._events)[p] == null && (g[p] = []), this._events[p].push({ cb: d, status: a }), this.instance;
      }
      listenerCount(p) {
        return this._events[p] != null ? this._events[p].length : 0;
      }
      async trigger(p, ...a) {
        var d, g;
        try {
          return p !== "debug" && this.trigger("debug", `Event triggered: ${p}`, a), this._events[p] == null ? void 0 : (this._events[p] = this._events[p].filter(function(f) {
            return f.status !== "none";
          }), g = this._events[p].map(async (f) => {
            var T, E;
            if (f.status !== "none") {
              f.status === "once" && (f.status = "none");
              try {
                return E = typeof f.cb == "function" ? f.cb(...a) : void 0, typeof (E != null ? E.then : void 0) == "function" ? await E : E;
              } catch (b) {
                return T = b, this.trigger("error", T), null;
              }
            }
          }), (await Promise.all(g)).find(function(f) {
            return f != null;
          }));
        } catch (f) {
          return d = f, this.trigger("error", d), null;
        }
      }
    };
    var u = m, h, y, v;
    h = l, y = u, v = class {
      constructor(p) {
        this.Events = new y(this), this._length = 0, this._lists = (function() {
          var a, d, g;
          for (g = [], a = 1, d = p; 1 <= d ? a <= d : a >= d; 1 <= d ? ++a : --a)
            g.push(new h(() => this.incr(), () => this.decr()));
          return g;
        }).call(this);
      }
      incr() {
        if (this._length++ === 0)
          return this.Events.trigger("leftzero");
      }
      decr() {
        if (--this._length === 0)
          return this.Events.trigger("zero");
      }
      push(p) {
        return this._lists[p.options.priority].push(p);
      }
      queued(p) {
        return p != null ? this._lists[p].length : this._length;
      }
      shiftAll(p) {
        return this._lists.forEach(function(a) {
          return a.forEachShift(p);
        });
      }
      getFirst(p = this._lists) {
        var a, d, g;
        for (a = 0, d = p.length; a < d; a++)
          if (g = p[a], g.length > 0)
            return g;
        return [];
      }
      shiftLastFrom(p) {
        return this.getFirst(this._lists.slice(p).reverse()).shift();
      }
    };
    var I = v, U;
    U = class extends Error {
    };
    var P = U, _, k, D, ue, le;
    ue = 10, k = 5, le = i, _ = P, D = class {
      constructor(p, a, d, g, f, T, E, b) {
        this.task = p, this.args = a, this.rejectOnDrop = f, this.Events = T, this._states = E, this.Promise = b, this.options = le.load(d, g), this.options.priority = this._sanitizePriority(this.options.priority), this.options.id === g.id && (this.options.id = `${this.options.id}-${this._randomIndex()}`), this.promise = new this.Promise((S, O) => {
          this._resolve = S, this._reject = O;
        }), this.retryCount = 0;
      }
      _sanitizePriority(p) {
        var a;
        return a = ~~p !== p ? k : p, a < 0 ? 0 : a > ue - 1 ? ue - 1 : a;
      }
      _randomIndex() {
        return Math.random().toString(36).slice(2);
      }
      doDrop({ error: p, message: a = "This job has been dropped by Bottleneck" } = {}) {
        return this._states.remove(this.options.id) ? (this.rejectOnDrop && this._reject(p ?? new _(a)), this.Events.trigger("dropped", { args: this.args, options: this.options, task: this.task, promise: this.promise }), !0) : !1;
      }
      _assertStatus(p) {
        var a;
        if (a = this._states.jobStatus(this.options.id), !(a === p || p === "DONE" && a === null))
          throw new _(`Invalid job status ${a}, expected ${p}. Please open an issue at https://github.com/SGrondin/bottleneck/issues`);
      }
      doReceive() {
        return this._states.start(this.options.id), this.Events.trigger("received", { args: this.args, options: this.options });
      }
      doQueue(p, a) {
        return this._assertStatus("RECEIVED"), this._states.next(this.options.id), this.Events.trigger("queued", { args: this.args, options: this.options, reachedHWM: p, blocked: a });
      }
      doRun() {
        return this.retryCount === 0 ? (this._assertStatus("QUEUED"), this._states.next(this.options.id)) : this._assertStatus("EXECUTING"), this.Events.trigger("scheduled", { args: this.args, options: this.options });
      }
      async doExecute(p, a, d, g) {
        var f, T, E;
        this.retryCount === 0 ? (this._assertStatus("RUNNING"), this._states.next(this.options.id)) : this._assertStatus("EXECUTING"), T = { args: this.args, options: this.options, retryCount: this.retryCount }, this.Events.trigger("executing", T);
        try {
          if (E = await (p != null ? p.schedule(this.options, this.task, ...this.args) : this.task(...this.args)), a())
            return this.doDone(T), await g(this.options, T), this._assertStatus("DONE"), this._resolve(E);
        } catch (b) {
          return f = b, this._onFailure(f, T, a, d, g);
        }
      }
      doExpire(p, a, d) {
        var g, f;
        return this._states.jobStatus(this.options.id === "RUNNING") && this._states.next(this.options.id), this._assertStatus("EXECUTING"), f = { args: this.args, options: this.options, retryCount: this.retryCount }, g = new _(`This job timed out after ${this.options.expiration} ms.`), this._onFailure(g, f, p, a, d);
      }
      async _onFailure(p, a, d, g, f) {
        var T, E;
        if (d())
          return T = await this.Events.trigger("failed", p, a), T != null ? (E = ~~T, this.Events.trigger("retry", `Retrying ${this.options.id} after ${E} ms`, a), this.retryCount++, g(E)) : (this.doDone(a), await f(this.options, a), this._assertStatus("DONE"), this._reject(p));
      }
      doDone(p) {
        return this._assertStatus("EXECUTING"), this._states.next(this.options.id), this.Events.trigger("done", p);
      }
    };
    var q = D, W, Ue, De;
    De = i, W = P, Ue = class {
      constructor(p, a, d) {
        this.instance = p, this.storeOptions = a, this.clientId = this.instance._randomIndex(), De.load(d, d, this), this._nextRequest = this._lastReservoirRefresh = this._lastReservoirIncrease = Date.now(), this._running = 0, this._done = 0, this._unblockTime = 0, this.ready = this.Promise.resolve(), this.clients = {}, this._startHeartbeat();
      }
      _startHeartbeat() {
        var p;
        return this.heartbeat == null && (this.storeOptions.reservoirRefreshInterval != null && this.storeOptions.reservoirRefreshAmount != null || this.storeOptions.reservoirIncreaseInterval != null && this.storeOptions.reservoirIncreaseAmount != null) ? typeof (p = this.heartbeat = setInterval(() => {
          var a, d, g, f, T;
          if (f = Date.now(), this.storeOptions.reservoirRefreshInterval != null && f >= this._lastReservoirRefresh + this.storeOptions.reservoirRefreshInterval && (this._lastReservoirRefresh = f, this.storeOptions.reservoir = this.storeOptions.reservoirRefreshAmount, this.instance._drainAll(this.computeCapacity())), this.storeOptions.reservoirIncreaseInterval != null && f >= this._lastReservoirIncrease + this.storeOptions.reservoirIncreaseInterval && ({
            reservoirIncreaseAmount: a,
            reservoirIncreaseMaximum: g,
            reservoir: T
          } = this.storeOptions, this._lastReservoirIncrease = f, d = g != null ? Math.min(a, g - T) : a, d > 0))
            return this.storeOptions.reservoir += d, this.instance._drainAll(this.computeCapacity());
        }, this.heartbeatInterval)).unref == "function" ? p.unref() : void 0 : clearInterval(this.heartbeat);
      }
      async __publish__(p) {
        return await this.yieldLoop(), this.instance.Events.trigger("message", p.toString());
      }
      async __disconnect__(p) {
        return await this.yieldLoop(), clearInterval(this.heartbeat), this.Promise.resolve();
      }
      yieldLoop(p = 0) {
        return new this.Promise(function(a, d) {
          return setTimeout(a, p);
        });
      }
      computePenalty() {
        var p;
        return (p = this.storeOptions.penalty) != null ? p : 15 * this.storeOptions.minTime || 5e3;
      }
      async __updateSettings__(p) {
        return await this.yieldLoop(), De.overwrite(p, p, this.storeOptions), this._startHeartbeat(), this.instance._drainAll(this.computeCapacity()), !0;
      }
      async __running__() {
        return await this.yieldLoop(), this._running;
      }
      async __queued__() {
        return await this.yieldLoop(), this.instance.queued();
      }
      async __done__() {
        return await this.yieldLoop(), this._done;
      }
      async __groupCheck__(p) {
        return await this.yieldLoop(), this._nextRequest + this.timeout < p;
      }
      computeCapacity() {
        var p, a;
        return { maxConcurrent: p, reservoir: a } = this.storeOptions, p != null && a != null ? Math.min(p - this._running, a) : p != null ? p - this._running : a ?? null;
      }
      conditionsCheck(p) {
        var a;
        return a = this.computeCapacity(), a == null || p <= a;
      }
      async __incrementReservoir__(p) {
        var a;
        return await this.yieldLoop(), a = this.storeOptions.reservoir += p, this.instance._drainAll(this.computeCapacity()), a;
      }
      async __currentReservoir__() {
        return await this.yieldLoop(), this.storeOptions.reservoir;
      }
      isBlocked(p) {
        return this._unblockTime >= p;
      }
      check(p, a) {
        return this.conditionsCheck(p) && this._nextRequest - a <= 0;
      }
      async __check__(p) {
        var a;
        return await this.yieldLoop(), a = Date.now(), this.check(p, a);
      }
      async __register__(p, a, d) {
        var g, f;
        return await this.yieldLoop(), g = Date.now(), this.conditionsCheck(a) ? (this._running += a, this.storeOptions.reservoir != null && (this.storeOptions.reservoir -= a), f = Math.max(this._nextRequest - g, 0), this._nextRequest = g + f + this.storeOptions.minTime, {
          success: !0,
          wait: f,
          reservoir: this.storeOptions.reservoir
        }) : {
          success: !1
        };
      }
      strategyIsBlock() {
        return this.storeOptions.strategy === 3;
      }
      async __submit__(p, a) {
        var d, g, f;
        if (await this.yieldLoop(), this.storeOptions.maxConcurrent != null && a > this.storeOptions.maxConcurrent)
          throw new W(`Impossible to add a job having a weight of ${a} to a limiter having a maxConcurrent setting of ${this.storeOptions.maxConcurrent}`);
        return g = Date.now(), f = this.storeOptions.highWater != null && p === this.storeOptions.highWater && !this.check(a, g), d = this.strategyIsBlock() && (f || this.isBlocked(g)), d && (this._unblockTime = g + this.computePenalty(), this._nextRequest = this._unblockTime + this.storeOptions.minTime, this.instance._dropAllQueued()), {
          reachedHWM: f,
          blocked: d,
          strategy: this.storeOptions.strategy
        };
      }
      async __free__(p, a) {
        return await this.yieldLoop(), this._running -= a, this._done += a, this.instance._drainAll(this.computeCapacity()), {
          running: this._running
        };
      }
    };
    var Vs = Ue, vt, kt;
    vt = P, kt = class {
      constructor(p) {
        this.status = p, this._jobs = {}, this.counts = this.status.map(function() {
          return 0;
        });
      }
      next(p) {
        var a, d;
        if (a = this._jobs[p], d = a + 1, a != null && d < this.status.length)
          return this.counts[a]--, this.counts[d]++, this._jobs[p]++;
        if (a != null)
          return this.counts[a]--, delete this._jobs[p];
      }
      start(p) {
        var a;
        return a = 0, this._jobs[p] = a, this.counts[a]++;
      }
      remove(p) {
        var a;
        return a = this._jobs[p], a != null && (this.counts[a]--, delete this._jobs[p]), a != null;
      }
      jobStatus(p) {
        var a;
        return (a = this.status[this._jobs[p]]) != null ? a : null;
      }
      statusJobs(p) {
        var a, d, g, f, T;
        if (p != null) {
          if (d = this.status.indexOf(p), d < 0)
            throw new vt(`status must be one of ${this.status.join(", ")}`);
          g = this._jobs, f = [];
          for (a in g)
            T = g[a], T === d && f.push(a);
          return f;
        } else
          return Object.keys(this._jobs);
      }
      statusCounts() {
        return this.counts.reduce((p, a, d) => (p[this.status[d]] = a, p), {});
      }
    };
    var zs = kt, At, St;
    At = l, St = class {
      constructor(p, a) {
        this.schedule = this.schedule.bind(this), this.name = p, this.Promise = a, this._running = 0, this._queue = new At();
      }
      isEmpty() {
        return this._queue.length === 0;
      }
      async _tryToRun() {
        var p, a, d, g, f, T, E;
        if (this._running < 1 && this._queue.length > 0)
          return this._running++, { task: E, args: p, resolve: f, reject: g } = this._queue.shift(), a = await async function() {
            try {
              return T = await E(...p), function() {
                return f(T);
              };
            } catch (b) {
              return d = b, function() {
                return g(d);
              };
            }
          }(), this._running--, this._tryToRun(), a();
      }
      schedule(p, ...a) {
        var d, g, f;
        return f = g = null, d = new this.Promise(function(T, E) {
          return f = T, g = E;
        }), this._queue.push({ task: p, args: a, resolve: f, reject: g }), this._tryToRun(), d;
      }
    };
    var Ms = St, Ot = "2.19.5", Ks = {
      version: Ot
    }, Js = /* @__PURE__ */ Object.freeze({
      version: Ot,
      default: Ks
    }), Pt = () => console.log("You must import the full version of Bottleneck in order to use this feature."), Rt = () => console.log("You must import the full version of Bottleneck in order to use this feature."), Qs = () => console.log("You must import the full version of Bottleneck in order to use this feature."), Gt, $t, Ut, Dt, Ft, Ae;
    Ae = i, Gt = u, Dt = Pt, Ut = Rt, Ft = Qs, $t = (function() {
      class w {
        constructor(a = {}) {
          this.deleteKey = this.deleteKey.bind(this), this.limiterOptions = a, Ae.load(this.limiterOptions, this.defaults, this), this.Events = new Gt(this), this.instances = {}, this.Bottleneck = Vt, this._startAutoCleanup(), this.sharedConnection = this.connection != null, this.connection == null && (this.limiterOptions.datastore === "redis" ? this.connection = new Dt(Object.assign({}, this.limiterOptions, { Events: this.Events })) : this.limiterOptions.datastore === "ioredis" && (this.connection = new Ut(Object.assign({}, this.limiterOptions, { Events: this.Events }))));
        }
        key(a = "") {
          var d;
          return (d = this.instances[a]) != null ? d : (() => {
            var g;
            return g = this.instances[a] = new this.Bottleneck(Object.assign(this.limiterOptions, {
              id: `${this.id}-${a}`,
              timeout: this.timeout,
              connection: this.connection
            })), this.Events.trigger("created", g, a), g;
          })();
        }
        async deleteKey(a = "") {
          var d, g;
          return g = this.instances[a], this.connection && (d = await this.connection.__runCommand__(["del", ...Ft.allKeys(`${this.id}-${a}`)])), g != null && (delete this.instances[a], await g.disconnect()), g != null || d > 0;
        }
        limiters() {
          var a, d, g, f;
          d = this.instances, g = [];
          for (a in d)
            f = d[a], g.push({
              key: a,
              limiter: f
            });
          return g;
        }
        keys() {
          return Object.keys(this.instances);
        }
        async clusterKeys() {
          var a, d, g, f, T, E, b, S, O;
          if (this.connection == null)
            return this.Promise.resolve(this.keys());
          for (E = [], a = null, O = `b_${this.id}-`.length, d = 9; a !== 0; )
            for ([S, g] = await this.connection.__runCommand__(["scan", a ?? 0, "match", `b_${this.id}-*_settings`, "count", 1e4]), a = ~~S, f = 0, b = g.length; f < b; f++)
              T = g[f], E.push(T.slice(O, -d));
          return E;
        }
        _startAutoCleanup() {
          var a;
          return clearInterval(this.interval), typeof (a = this.interval = setInterval(async () => {
            var d, g, f, T, E, b;
            E = Date.now(), f = this.instances, T = [];
            for (g in f) {
              b = f[g];
              try {
                await b._store.__groupCheck__(E) ? T.push(this.deleteKey(g)) : T.push(void 0);
              } catch (S) {
                d = S, T.push(b.Events.trigger("error", d));
              }
            }
            return T;
          }, this.timeout / 2)).unref == "function" ? a.unref() : void 0;
        }
        updateSettings(a = {}) {
          if (Ae.overwrite(a, this.defaults, this), Ae.overwrite(a, a, this.limiterOptions), a.timeout != null)
            return this._startAutoCleanup();
        }
        disconnect(a = !0) {
          var d;
          if (!this.sharedConnection)
            return (d = this.connection) != null ? d.disconnect(a) : void 0;
        }
      }
      return w.prototype.defaults = {
        timeout: 1e3 * 60 * 5,
        connection: null,
        Promise,
        id: "group-key"
      }, w;
    }).call(r);
    var Xs = $t, jt, Ct, It;
    It = i, Ct = u, jt = (function() {
      class w {
        constructor(a = {}) {
          this.options = a, It.load(this.options, this.defaults, this), this.Events = new Ct(this), this._arr = [], this._resetPromise(), this._lastFlush = Date.now();
        }
        _resetPromise() {
          return this._promise = new this.Promise((a, d) => this._resolve = a);
        }
        _flush() {
          return clearTimeout(this._timeout), this._lastFlush = Date.now(), this._resolve(), this.Events.trigger("batch", this._arr), this._arr = [], this._resetPromise();
        }
        add(a) {
          var d;
          return this._arr.push(a), d = this._promise, this._arr.length === this.maxSize ? this._flush() : this.maxTime != null && this._arr.length === 1 && (this._timeout = setTimeout(() => this._flush(), this.maxTime)), d;
        }
      }
      return w.prototype.defaults = {
        maxTime: null,
        maxSize: null,
        Promise
      }, w;
    }).call(r);
    var Ys = jt, Zs = () => console.log("You must import the full version of Bottleneck in order to use this feature."), en = n(Js), qt, Lt, Fe, je, xt, Ce, Nt, Bt, Wt, Ie, F, Ht = [].splice;
    Ce = 10, Lt = 5, F = i, Nt = I, je = q, xt = Vs, Bt = Zs, Fe = u, Wt = zs, Ie = Ms, qt = (function() {
      class w {
        constructor(a = {}, ...d) {
          var g, f;
          this._addToQueue = this._addToQueue.bind(this), this._validateOptions(a, d), F.load(a, this.instanceDefaults, this), this._queues = new Nt(Ce), this._scheduled = {}, this._states = new Wt(["RECEIVED", "QUEUED", "RUNNING", "EXECUTING"].concat(this.trackDoneStatus ? ["DONE"] : [])), this._limiter = null, this.Events = new Fe(this), this._submitLock = new Ie("submit", this.Promise), this._registerLock = new Ie("register", this.Promise), f = F.load(a, this.storeDefaults, {}), this._store = (function() {
            if (this.datastore === "redis" || this.datastore === "ioredis" || this.connection != null)
              return g = F.load(a, this.redisStoreDefaults, {}), new Bt(this, f, g);
            if (this.datastore === "local")
              return g = F.load(a, this.localStoreDefaults, {}), new xt(this, f, g);
            throw new w.prototype.BottleneckError(`Invalid datastore type: ${this.datastore}`);
          }).call(this), this._queues.on("leftzero", () => {
            var T;
            return (T = this._store.heartbeat) != null && typeof T.ref == "function" ? T.ref() : void 0;
          }), this._queues.on("zero", () => {
            var T;
            return (T = this._store.heartbeat) != null && typeof T.unref == "function" ? T.unref() : void 0;
          });
        }
        _validateOptions(a, d) {
          if (!(a != null && typeof a == "object" && d.length === 0))
            throw new w.prototype.BottleneckError("Bottleneck v2 takes a single object argument. Refer to https://github.com/SGrondin/bottleneck#upgrading-to-v2 if you're upgrading from Bottleneck v1.");
        }
        ready() {
          return this._store.ready;
        }
        clients() {
          return this._store.clients;
        }
        channel() {
          return `b_${this.id}`;
        }
        channel_client() {
          return `b_${this.id}_${this._store.clientId}`;
        }
        publish(a) {
          return this._store.__publish__(a);
        }
        disconnect(a = !0) {
          return this._store.__disconnect__(a);
        }
        chain(a) {
          return this._limiter = a, this;
        }
        queued(a) {
          return this._queues.queued(a);
        }
        clusterQueued() {
          return this._store.__queued__();
        }
        empty() {
          return this.queued() === 0 && this._submitLock.isEmpty();
        }
        running() {
          return this._store.__running__();
        }
        done() {
          return this._store.__done__();
        }
        jobStatus(a) {
          return this._states.jobStatus(a);
        }
        jobs(a) {
          return this._states.statusJobs(a);
        }
        counts() {
          return this._states.statusCounts();
        }
        _randomIndex() {
          return Math.random().toString(36).slice(2);
        }
        check(a = 1) {
          return this._store.__check__(a);
        }
        _clearGlobalState(a) {
          return this._scheduled[a] != null ? (clearTimeout(this._scheduled[a].expiration), delete this._scheduled[a], !0) : !1;
        }
        async _free(a, d, g, f) {
          var T, E;
          try {
            if ({ running: E } = await this._store.__free__(a, g.weight), this.Events.trigger("debug", `Freed ${g.id}`, f), E === 0 && this.empty())
              return this.Events.trigger("idle");
          } catch (b) {
            return T = b, this.Events.trigger("error", T);
          }
        }
        _run(a, d, g) {
          var f, T, E;
          return d.doRun(), f = this._clearGlobalState.bind(this, a), E = this._run.bind(this, a, d), T = this._free.bind(this, a, d), this._scheduled[a] = {
            timeout: setTimeout(() => d.doExecute(this._limiter, f, E, T), g),
            expiration: d.options.expiration != null ? setTimeout(function() {
              return d.doExpire(f, E, T);
            }, g + d.options.expiration) : void 0,
            job: d
          };
        }
        _drainOne(a) {
          return this._registerLock.schedule(() => {
            var d, g, f, T, E;
            return this.queued() === 0 ? this.Promise.resolve(null) : (E = this._queues.getFirst(), { options: T, args: d } = f = E.first(), a != null && T.weight > a ? this.Promise.resolve(null) : (this.Events.trigger("debug", `Draining ${T.id}`, { args: d, options: T }), g = this._randomIndex(), this._store.__register__(g, T.weight, T.expiration).then(({ success: b, wait: S, reservoir: O }) => {
              var pe;
              return this.Events.trigger("debug", `Drained ${T.id}`, { success: b, args: d, options: T }), b ? (E.shift(), pe = this.empty(), pe && this.Events.trigger("empty"), O === 0 && this.Events.trigger("depleted", pe), this._run(g, f, S), this.Promise.resolve(T.weight)) : this.Promise.resolve(null);
            })));
          });
        }
        _drainAll(a, d = 0) {
          return this._drainOne(a).then((g) => {
            var f;
            return g != null ? (f = a != null ? a - g : a, this._drainAll(f, d + g)) : this.Promise.resolve(d);
          }).catch((g) => this.Events.trigger("error", g));
        }
        _dropAllQueued(a) {
          return this._queues.shiftAll(function(d) {
            return d.doDrop({ message: a });
          });
        }
        stop(a = {}) {
          var d, g;
          return a = F.load(a, this.stopDefaults), g = (f) => {
            var T;
            return T = () => {
              var E;
              return E = this._states.counts, E[0] + E[1] + E[2] + E[3] === f;
            }, new this.Promise((E, b) => T() ? E() : this.on("done", () => {
              if (T())
                return this.removeAllListeners("done"), E();
            }));
          }, d = a.dropWaitingJobs ? (this._run = function(f, T) {
            return T.doDrop({
              message: a.dropErrorMessage
            });
          }, this._drainOne = () => this.Promise.resolve(null), this._registerLock.schedule(() => this._submitLock.schedule(() => {
            var f, T, E;
            T = this._scheduled;
            for (f in T)
              E = T[f], this.jobStatus(E.job.options.id) === "RUNNING" && (clearTimeout(E.timeout), clearTimeout(E.expiration), E.job.doDrop({
                message: a.dropErrorMessage
              }));
            return this._dropAllQueued(a.dropErrorMessage), g(0);
          }))) : this.schedule({
            priority: Ce - 1,
            weight: 0
          }, () => g(1)), this._receive = function(f) {
            return f._reject(new w.prototype.BottleneckError(a.enqueueErrorMessage));
          }, this.stop = () => this.Promise.reject(new w.prototype.BottleneckError("stop() has already been called")), d;
        }
        async _addToQueue(a) {
          var d, g, f, T, E, b, S;
          ({ args: d, options: T } = a);
          try {
            ({ reachedHWM: E, blocked: g, strategy: S } = await this._store.__submit__(this.queued(), T.weight));
          } catch (O) {
            return f = O, this.Events.trigger("debug", `Could not queue ${T.id}`, { args: d, options: T, error: f }), a.doDrop({ error: f }), !1;
          }
          return g ? (a.doDrop(), !0) : E && (b = S === w.prototype.strategy.LEAK ? this._queues.shiftLastFrom(T.priority) : S === w.prototype.strategy.OVERFLOW_PRIORITY ? this._queues.shiftLastFrom(T.priority + 1) : S === w.prototype.strategy.OVERFLOW ? a : void 0, b != null && b.doDrop(), b == null || S === w.prototype.strategy.OVERFLOW) ? (b == null && a.doDrop(), E) : (a.doQueue(E, g), this._queues.push(a), await this._drainAll(), E);
        }
        _receive(a) {
          return this._states.jobStatus(a.options.id) != null ? (a._reject(new w.prototype.BottleneckError(`A job with the same id already exists (id=${a.options.id})`)), !1) : (a.doReceive(), this._submitLock.schedule(this._addToQueue, a));
        }
        submit(...a) {
          var d, g, f, T, E, b, S;
          return typeof a[0] == "function" ? (E = a, [g, ...a] = E, [d] = Ht.call(a, -1), T = F.load({}, this.jobDefaults)) : (b = a, [T, g, ...a] = b, [d] = Ht.call(a, -1), T = F.load(T, this.jobDefaults)), S = (...O) => new this.Promise(function(pe, rn) {
            return g(...O, function(...zt) {
              return (zt[0] != null ? rn : pe)(zt);
            });
          }), f = new je(S, a, T, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise), f.promise.then(function(O) {
            return typeof d == "function" ? d(...O) : void 0;
          }).catch(function(O) {
            return Array.isArray(O) ? typeof d == "function" ? d(...O) : void 0 : typeof d == "function" ? d(O) : void 0;
          }), this._receive(f);
        }
        schedule(...a) {
          var d, g, f;
          return typeof a[0] == "function" ? ([f, ...a] = a, g = {}) : [g, f, ...a] = a, d = new je(f, a, g, this.jobDefaults, this.rejectOnDrop, this.Events, this._states, this.Promise), this._receive(d), d.promise;
        }
        wrap(a) {
          var d, g;
          return d = this.schedule.bind(this), g = function(...f) {
            return d(a.bind(this), ...f);
          }, g.withOptions = function(f, ...T) {
            return d(f, a, ...T);
          }, g;
        }
        async updateSettings(a = {}) {
          return await this._store.__updateSettings__(F.overwrite(a, this.storeDefaults)), F.overwrite(a, this.instanceDefaults, this), this;
        }
        currentReservoir() {
          return this._store.__currentReservoir__();
        }
        incrementReservoir(a = 0) {
          return this._store.__incrementReservoir__(a);
        }
      }
      return w.default = w, w.Events = Fe, w.version = w.prototype.version = en.version, w.strategy = w.prototype.strategy = {
        LEAK: 1,
        OVERFLOW: 2,
        OVERFLOW_PRIORITY: 4,
        BLOCK: 3
      }, w.BottleneckError = w.prototype.BottleneckError = P, w.Group = w.prototype.Group = Xs, w.RedisConnection = w.prototype.RedisConnection = Pt, w.IORedisConnection = w.prototype.IORedisConnection = Rt, w.Batcher = w.prototype.Batcher = Ys, w.prototype.jobDefaults = {
        priority: Lt,
        weight: 1,
        expiration: null,
        id: "<no-id>"
      }, w.prototype.storeDefaults = {
        maxConcurrent: null,
        minTime: 0,
        highWater: null,
        strategy: w.prototype.strategy.LEAK,
        penalty: null,
        reservoir: null,
        reservoirRefreshInterval: null,
        reservoirRefreshAmount: null,
        reservoirIncreaseInterval: null,
        reservoirIncreaseAmount: null,
        reservoirIncreaseMaximum: null
      }, w.prototype.localStoreDefaults = {
        Promise,
        timeout: null,
        heartbeatInterval: 250
      }, w.prototype.redisStoreDefaults = {
        Promise,
        timeout: null,
        heartbeatInterval: 5e3,
        clientTimeout: 1e4,
        Redis: null,
        clientOptions: {},
        clusterNodes: null,
        clearDatastore: !1,
        connection: null
      }, w.prototype.instanceDefaults = {
        datastore: "local",
        connection: null,
        id: "<no-id>",
        rejectOnDrop: !0,
        trackDoneStatus: !1,
        Promise
      }, w.prototype.stopDefaults = {
        enqueueErrorMessage: "This limiter has been stopped and cannot accept new jobs.",
        dropWaitingJobs: !0,
        dropErrorMessage: "This limiter has been stopped."
      }, w;
    }).call(r);
    var Vt = qt, tn = Vt;
    return tn;
  });
})(es);
var To = es.exports;
const ts = /* @__PURE__ */ mt(To);
async function rs(e, t, r, n) {
  if (!r.request || !r.request.request)
    throw r;
  if (r.status >= 400 && !e.doNotRetry.includes(r.status)) {
    const s = n.request.retries != null ? n.request.retries : e.retries, o = Math.pow((n.request.retryCount || 0) + 1, 2);
    throw t.retry.retryRequest(r, s, o);
  }
  throw r;
}
async function Eo(e, t, r, n) {
  const s = new ts();
  return s.on("failed", function(o, i) {
    const c = ~~o.request.request.retries, l = ~~o.request.request.retryAfter;
    if (n.request.retryCount = i.retryCount + 1, c > i.retryCount)
      return l * e.retryAfterBaseValue;
  }), s.schedule(
    wo.bind(null, e, t, r),
    n
  );
}
async function wo(e, t, r, n) {
  const s = await r(r, n);
  if (s.data && s.data.errors && /Something went wrong while executing your query/.test(
    s.data.errors[0].message
  )) {
    const o = new Q(s.data.errors[0].message, 500, {
      request: n,
      response: s
    });
    return rs(e, t, o, n);
  }
  return s;
}
var yo = "6.0.1";
function ss(e, t) {
  const r = Object.assign(
    {
      enabled: !0,
      retryAfterBaseValue: 1e3,
      doNotRetry: [400, 401, 403, 404, 422, 451],
      retries: 3
    },
    t.retry
  );
  return r.enabled && (e.hook.error("request", rs.bind(null, r, e)), e.hook.wrap("request", Eo.bind(null, r, e))), {
    retry: {
      retryRequest: (n, s, o) => (n.request.request = Object.assign({}, n.request.request, {
        retries: s,
        retryAfter: o
      }), n)
    }
  };
}
ss.VERSION = yo;
var bo = "8.1.2", Be = () => Promise.resolve();
function _o(e, t, r) {
  return e.retryLimiter.schedule(vo, e, t, r);
}
async function vo(e, t, r) {
  const n = r.method !== "GET" && r.method !== "HEAD", { pathname: s } = new URL(r.url, "http://github.test"), o = r.method === "GET" && s.startsWith("/search/"), i = s.startsWith("/graphql"), l = ~~t.retryCount > 0 ? { priority: 0, weight: 0 } : {};
  e.clustering && (l.expiration = 1e3 * 60), (n || i) && await e.write.key(e.id).schedule(l, Be), n && e.triggersNotification(s) && await e.notifications.key(e.id).schedule(l, Be), o && await e.search.key(e.id).schedule(l, Be);
  const m = e.global.key(e.id).schedule(l, t, r);
  if (i) {
    const u = await m;
    if (u.data.errors != null && // @ts-expect-error
    u.data.errors.some((h) => h.type === "RATE_LIMITED"))
      throw Object.assign(new Error("GraphQL Rate Limit Exceeded"), {
        response: u,
        data: u.data
      });
  }
  return m;
}
var ko = [
  "/orgs/{org}/invitations",
  "/orgs/{org}/invitations/{invitation_id}",
  "/orgs/{org}/teams/{team_slug}/discussions",
  "/orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "/repos/{owner}/{repo}/collaborators/{username}",
  "/repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "/repos/{owner}/{repo}/issues",
  "/repos/{owner}/{repo}/issues/{issue_number}/comments",
  "/repos/{owner}/{repo}/pulls",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "/repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies",
  "/repos/{owner}/{repo}/pulls/{pull_number}/merge",
  "/repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers",
  "/repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "/repos/{owner}/{repo}/releases",
  "/teams/{team_id}/discussions",
  "/teams/{team_id}/discussions/{discussion_number}/comments"
];
function Ao(e) {
  const r = `^(?:${e.map(
    (n) => n.split("/").map((s) => s.startsWith("{") ? "(?:.+?)" : s).join("/")
  ).map((n) => `(?:${n})`).join("|")})[^/]*$`;
  return new RegExp(r, "i");
}
var rr = Ao(ko), ns = rr.test.bind(rr), Z = {}, So = function(e, t) {
  Z.global = new e.Group({
    id: "octokit-global",
    maxConcurrent: 10,
    ...t
  }), Z.search = new e.Group({
    id: "octokit-search",
    maxConcurrent: 1,
    minTime: 2e3,
    ...t
  }), Z.write = new e.Group({
    id: "octokit-write",
    maxConcurrent: 1,
    minTime: 1e3,
    ...t
  }), Z.notifications = new e.Group({
    id: "octokit-notifications",
    maxConcurrent: 1,
    minTime: 3e3,
    ...t
  });
};
function yt(e, t) {
  const {
    enabled: r = !0,
    Bottleneck: n = ts,
    id: s = "no-id",
    timeout: o = 1e3 * 60 * 2,
    // Redis TTL: 2 minutes
    connection: i
  } = t.throttle || {};
  if (!r)
    return {};
  const c = { connection: i, timeout: o };
  Z.global == null && So(n, c);
  const l = Object.assign(
    {
      clustering: i != null,
      triggersNotification: ns,
      fallbackSecondaryRateRetryAfter: 60,
      retryAfterBaseValue: 1e3,
      retryLimiter: new n(),
      id: s,
      ...Z
    },
    t.throttle
  );
  if (typeof l.onSecondaryRateLimit != "function" || typeof l.onRateLimit != "function")
    throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://octokit.github.io/rest.js/#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
  const m = {}, u = new n.Events(m);
  return m.on("secondary-limit", l.onSecondaryRateLimit), m.on("rate-limit", l.onRateLimit), m.on(
    "error",
    (h) => e.log.warn("Error in throttling-plugin limit handler", h)
  ), l.retryLimiter.on("failed", async function(h, y) {
    const [v, I, U] = y.args, { pathname: P } = new URL(U.url, "http://github.test");
    if (!(P.startsWith("/graphql") && h.status !== 401 || h.status === 403))
      return;
    const k = ~~I.retryCount;
    I.retryCount = k, U.request.retryCount = k;
    const { wantRetry: D, retryAfter: ue = 0 } = await async function() {
      var le;
      if (/\bsecondary rate\b/i.test(h.message)) {
        const q = Number(h.response.headers["retry-after"]) || v.fallbackSecondaryRateRetryAfter;
        return { wantRetry: await u.trigger(
          "secondary-limit",
          q,
          U,
          e,
          k
        ), retryAfter: q };
      }
      if (h.response.headers != null && h.response.headers["x-ratelimit-remaining"] === "0" || (((le = h.response.data) == null ? void 0 : le.errors) ?? []).some(
        (q) => q.type === "RATE_LIMITED"
      )) {
        const q = new Date(
          ~~h.response.headers["x-ratelimit-reset"] * 1e3
        ).getTime(), W = Math.max(
          // Add one second so we retry _after_ the reset time
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api?apiVersion=2022-11-28#exceeding-the-rate-limit
          Math.ceil((q - Date.now()) / 1e3) + 1,
          0
        );
        return { wantRetry: await u.trigger(
          "rate-limit",
          W,
          U,
          e,
          k
        ), retryAfter: W };
      }
      return {};
    }();
    if (D)
      return I.retryCount++, ue * v.retryAfterBaseValue;
  }), e.hook.wrap("request", _o.bind(null, l)), {};
}
yt.VERSION = bo;
yt.triggersNotification = ns;
const Oo = /* @__PURE__ */ ae(cn);
var Po = "9.0.2", Ro = `octokit-endpoint.js/${Po} ${A()}`, Go = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": Ro
  },
  mediaType: {
    format: ""
  }
};
function $o(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function os(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = os(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function sr(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function rt(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = $o(r.headers), sr(r), sr(r.headers);
  const n = os(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function Uo(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var Do = /\{[^}]+\}/g;
function Fo(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function jo(e) {
  const t = e.match(Do);
  return t ? t.map(Fo).reduce((r, n) => r.concat(n), []) : [];
}
function nr(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function is(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function ee(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function he(e, t, r) {
  return t = e === "+" || e === "#" ? is(t) : ee(t), r ? ee(r) + "=" + t : t;
}
function V(e) {
  return e != null;
}
function We(e) {
  return e === ";" || e === "&" || e === "?";
}
function Co(e, t, r, n) {
  var s = e[r], o = [];
  if (V(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        he(t, s, We(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(V).forEach(function(i) {
        o.push(
          he(t, i, We(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        V(s[i]) && o.push(he(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(V).forEach(function(c) {
        i.push(he(t, c));
      }) : Object.keys(s).forEach(function(c) {
        V(s[c]) && (i.push(ee(c)), i.push(he(t, s[c].toString())));
      }), We(t) ? o.push(ee(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? V(s) && o.push(ee(r)) : s === "" && (t === "&" || t === "?") ? o.push(ee(r) + "=") : s === "" && o.push("");
  return o;
}
function Io(e) {
  return {
    expand: qo.bind(null, e)
  };
}
function qo(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(Co(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return is(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function as(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = nr(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = jo(r);
  r = Io(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = nr(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = Uo(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function Lo(e, t, r) {
  return as(rt(e, t, r));
}
function cs(e, t) {
  const r = rt(e, t), n = Lo.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: cs.bind(null, r),
    merge: rt.bind(null, r),
    parse: as
  });
}
var xo = cs(null, Go), No = $((e) => console.warn(e)), Bo = $((e) => console.warn(e)), ge = class extends Error {
  constructor(t, r, n) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = r;
    let s;
    "headers" in n && typeof n.headers < "u" && (s = n.headers), "response" in n && (this.response = n.response, s = n.response.headers);
    const o = Object.assign({}, n.request);
    n.request.headers.authorization && (o.headers = Object.assign({}, n.request.headers, {
      authorization: n.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), o.url = o.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = o, Object.defineProperty(this, "code", {
      get() {
        return No(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), r;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return Bo(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), s || {};
      }
    });
  }
}, Wo = "8.1.4";
function Ho(e) {
  return e.arrayBuffer();
}
function or(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new ge(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new ge("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await He(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await He(u);
        throw new ge(Vo(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await He(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof ge)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new ge(h, 500, {
      request: e
    });
  });
}
async function He(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : Ho(e);
}
function Vo(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function st(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return or(r.parse(i));
    const c = (l, m) => or(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: st.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: st.bind(null, r)
  });
}
var zo = st(xo, {
  headers: {
    "user-agent": `octokit-request.js/${Wo} ${A()}`
  }
}), Mo = function(t) {
  return btoa(t);
};
const L = /* @__PURE__ */ mt(Mo);
var Ko = "9.0.2", Jo = `octokit-endpoint.js/${Ko} ${A()}`, Qo = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": Jo
  },
  mediaType: {
    format: ""
  }
};
function Xo(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function us(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = us(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function ir(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function nt(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = Xo(r.headers), ir(r), ir(r.headers);
  const n = us(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function Yo(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var Zo = /\{[^}]+\}/g;
function ei(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function ti(e) {
  const t = e.match(Zo);
  return t ? t.map(ei).reduce((r, n) => r.concat(n), []) : [];
}
function ar(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function ls(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function te(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function fe(e, t, r) {
  return t = e === "+" || e === "#" ? ls(t) : te(t), r ? te(r) + "=" + t : t;
}
function z(e) {
  return e != null;
}
function Ve(e) {
  return e === ";" || e === "&" || e === "?";
}
function ri(e, t, r, n) {
  var s = e[r], o = [];
  if (z(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        fe(t, s, Ve(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(z).forEach(function(i) {
        o.push(
          fe(t, i, Ve(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        z(s[i]) && o.push(fe(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(z).forEach(function(c) {
        i.push(fe(t, c));
      }) : Object.keys(s).forEach(function(c) {
        z(s[c]) && (i.push(te(c)), i.push(fe(t, s[c].toString())));
      }), Ve(t) ? o.push(te(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? z(s) && o.push(te(r)) : s === "" && (t === "&" || t === "?") ? o.push(te(r) + "=") : s === "" && o.push("");
  return o;
}
function si(e) {
  return {
    expand: ni.bind(null, e)
  };
}
function ni(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(ri(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return ls(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function ps(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = ar(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = ti(r);
  r = si(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = ar(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = Yo(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function oi(e, t, r) {
  return ps(nt(e, t, r));
}
function ds(e, t) {
  const r = nt(e, t), n = oi.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: ds.bind(null, r),
    merge: nt.bind(null, r),
    parse: ps
  });
}
var ii = ds(null, Qo), ai = $((e) => console.warn(e)), ci = $((e) => console.warn(e)), me = class extends Error {
  constructor(t, r, n) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = r;
    let s;
    "headers" in n && typeof n.headers < "u" && (s = n.headers), "response" in n && (this.response = n.response, s = n.response.headers);
    const o = Object.assign({}, n.request);
    n.request.headers.authorization && (o.headers = Object.assign({}, n.request.headers, {
      authorization: n.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), o.url = o.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = o, Object.defineProperty(this, "code", {
      get() {
        return ai(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), r;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return ci(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), s || {};
      }
    });
  }
}, ui = "8.1.4";
function li(e) {
  return e.arrayBuffer();
}
function cr(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new me(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new me("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await ze(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await ze(u);
        throw new me(pi(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await ze(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof me)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new me(h, 500, {
      request: e
    });
  });
}
async function ze(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : li(e);
}
function pi(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function ot(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return cr(r.parse(i));
    const c = (l, m) => cr(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: ot.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: ot.bind(null, r)
  });
}
var di = ot(ii, {
  headers: {
    "user-agent": `octokit-request.js/${ui} ${A()}`
  }
}), hi = "9.0.2", gi = `octokit-endpoint.js/${hi} ${A()}`, fi = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": gi
  },
  mediaType: {
    format: ""
  }
};
function mi(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function hs(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = hs(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function ur(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function it(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = mi(r.headers), ur(r), ur(r.headers);
  const n = hs(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function Ti(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var Ei = /\{[^}]+\}/g;
function wi(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function yi(e) {
  const t = e.match(Ei);
  return t ? t.map(wi).reduce((r, n) => r.concat(n), []) : [];
}
function lr(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function gs(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function re(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function Te(e, t, r) {
  return t = e === "+" || e === "#" ? gs(t) : re(t), r ? re(r) + "=" + t : t;
}
function M(e) {
  return e != null;
}
function Me(e) {
  return e === ";" || e === "&" || e === "?";
}
function bi(e, t, r, n) {
  var s = e[r], o = [];
  if (M(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        Te(t, s, Me(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(M).forEach(function(i) {
        o.push(
          Te(t, i, Me(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        M(s[i]) && o.push(Te(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(M).forEach(function(c) {
        i.push(Te(t, c));
      }) : Object.keys(s).forEach(function(c) {
        M(s[c]) && (i.push(re(c)), i.push(Te(t, s[c].toString())));
      }), Me(t) ? o.push(re(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? M(s) && o.push(re(r)) : s === "" && (t === "&" || t === "?") ? o.push(re(r) + "=") : s === "" && o.push("");
  return o;
}
function _i(e) {
  return {
    expand: vi.bind(null, e)
  };
}
function vi(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(bi(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return gs(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function fs(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = lr(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = yi(r);
  r = _i(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = lr(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = Ti(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function ki(e, t, r) {
  return fs(it(e, t, r));
}
function ms(e, t) {
  const r = it(e, t), n = ki.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: ms.bind(null, r),
    merge: it.bind(null, r),
    parse: fs
  });
}
var Ai = ms(null, fi), Si = $((e) => console.warn(e)), Oi = $((e) => console.warn(e)), Ee = class extends Error {
  constructor(t, r, n) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = r;
    let s;
    "headers" in n && typeof n.headers < "u" && (s = n.headers), "response" in n && (this.response = n.response, s = n.response.headers);
    const o = Object.assign({}, n.request);
    n.request.headers.authorization && (o.headers = Object.assign({}, n.request.headers, {
      authorization: n.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), o.url = o.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = o, Object.defineProperty(this, "code", {
      get() {
        return Si(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), r;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return Oi(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), s || {};
      }
    });
  }
}, Pi = "8.1.4";
function Ri(e) {
  return e.arrayBuffer();
}
function pr(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new Ee(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new Ee("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await Ke(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await Ke(u);
        throw new Ee(Gi(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await Ke(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof Ee)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new Ee(h, 500, {
      request: e
    });
  });
}
async function Ke(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : Ri(e);
}
function Gi(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function at(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return pr(r.parse(i));
    const c = (l, m) => pr(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: at.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: at.bind(null, r)
  });
}
var $i = at(Ai, {
  headers: {
    "user-agent": `octokit-request.js/${Pi} ${A()}`
  }
});
const Ui = "4.0.0";
function Di(e) {
  const t = e.clientType || "oauth-app", r = e.baseUrl || "https://github.com", n = {
    clientType: t,
    allowSignup: e.allowSignup !== !1,
    clientId: e.clientId,
    login: e.login || null,
    redirectUrl: e.redirectUrl || null,
    state: e.state || Math.random().toString(36).substr(2),
    url: ""
  };
  if (t === "oauth-app") {
    const s = "scopes" in e ? e.scopes : [];
    n.scopes = typeof s == "string" ? s.split(/[,\s]+/).filter(Boolean) : s;
  }
  return n.url = Fi(`${r}/login/oauth/authorize`, n), n;
}
function Fi(e, t) {
  const r = {
    allowSignup: "allow_signup",
    clientId: "client_id",
    login: "login",
    redirectUrl: "redirect_uri",
    scopes: "scope",
    state: "state"
  };
  let n = e;
  return Object.keys(r).filter((s) => t[s] !== null).filter((s) => s !== "scopes" ? !0 : t.clientType === "github-app" ? !1 : !Array.isArray(t[s]) || t[s].length > 0).map((s) => [r[s], `${t[s]}`]).forEach(([s, o], i) => {
    n += i === 0 ? "?" : "&", n += `${s}=${encodeURIComponent(o)}`;
  }), n;
}
var ji = "9.0.2", Ci = `octokit-endpoint.js/${ji} ${A()}`, Ii = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": Ci
  },
  mediaType: {
    format: ""
  }
};
function qi(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function Ts(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = Ts(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function dr(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function ct(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = qi(r.headers), dr(r), dr(r.headers);
  const n = Ts(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function Li(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var xi = /\{[^}]+\}/g;
function Ni(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function Bi(e) {
  const t = e.match(xi);
  return t ? t.map(Ni).reduce((r, n) => r.concat(n), []) : [];
}
function hr(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function Es(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function se(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function we(e, t, r) {
  return t = e === "+" || e === "#" ? Es(t) : se(t), r ? se(r) + "=" + t : t;
}
function K(e) {
  return e != null;
}
function Je(e) {
  return e === ";" || e === "&" || e === "?";
}
function Wi(e, t, r, n) {
  var s = e[r], o = [];
  if (K(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        we(t, s, Je(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(K).forEach(function(i) {
        o.push(
          we(t, i, Je(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        K(s[i]) && o.push(we(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(K).forEach(function(c) {
        i.push(we(t, c));
      }) : Object.keys(s).forEach(function(c) {
        K(s[c]) && (i.push(se(c)), i.push(we(t, s[c].toString())));
      }), Je(t) ? o.push(se(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? K(s) && o.push(se(r)) : s === "" && (t === "&" || t === "?") ? o.push(se(r) + "=") : s === "" && o.push("");
  return o;
}
function Hi(e) {
  return {
    expand: Vi.bind(null, e)
  };
}
function Vi(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(Wi(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return Es(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function ws(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = hr(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = Bi(r);
  r = Hi(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = hr(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = Li(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function zi(e, t, r) {
  return ws(ct(e, t, r));
}
function ys(e, t) {
  const r = ct(e, t), n = zi.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: ys.bind(null, r),
    merge: ct.bind(null, r),
    parse: ws
  });
}
var Mi = ys(null, Ii), Ki = $((e) => console.warn(e)), Ji = $((e) => console.warn(e)), X = class extends Error {
  constructor(t, r, n) {
    super(t), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = r;
    let s;
    "headers" in n && typeof n.headers < "u" && (s = n.headers), "response" in n && (this.response = n.response, s = n.response.headers);
    const o = Object.assign({}, n.request);
    n.request.headers.authorization && (o.headers = Object.assign({}, n.request.headers, {
      authorization: n.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), o.url = o.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = o, Object.defineProperty(this, "code", {
      get() {
        return Ki(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), r;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return Ji(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), s || {};
      }
    });
  }
}, Qi = "8.1.4";
function Xi(e) {
  return e.arrayBuffer();
}
function gr(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new X(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new X("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await Qe(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await Qe(u);
        throw new X(Yi(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await Qe(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof X)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new X(h, 500, {
      request: e
    });
  });
}
async function Qe(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : Xi(e);
}
function Yi(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function ut(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return gr(r.parse(i));
    const c = (l, m) => gr(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: ut.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: ut.bind(null, r)
  });
}
var j = ut(Mi, {
  headers: {
    "user-agent": `octokit-request.js/${Qi} ${A()}`
  }
});
function bs(e) {
  const t = e.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(t.baseUrl) ? "https://github.com" : t.baseUrl.replace("/api/v3", "");
}
async function Pe(e, t, r) {
  const n = {
    baseUrl: bs(e),
    headers: {
      accept: "application/json"
    },
    ...r
  }, s = await e(t, n);
  if ("error" in s.data) {
    const o = new X(
      `${s.data.error_description} (${s.data.error}, ${s.data.error_uri})`,
      400,
      {
        request: e.endpoint.merge(
          t,
          n
        ),
        headers: s.headers
      }
    );
    throw o.response = s, o;
  }
  return s;
}
function Zi({
  request: e = j,
  ...t
}) {
  const r = bs(e);
  return Di({
    ...t,
    baseUrl: r
  });
}
async function _s(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = await Pe(
    t,
    "POST /login/oauth/access_token",
    {
      client_id: e.clientId,
      client_secret: e.clientSecret,
      code: e.code,
      redirect_uri: e.redirectUrl
    }
  ), n = {
    clientType: e.clientType,
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    token: r.data.access_token,
    scopes: r.data.scope.split(/\s+/).filter(Boolean)
  };
  if (e.clientType === "github-app") {
    if ("refresh_token" in r.data) {
      const s = new Date(r.headers.date).getTime();
      n.refreshToken = r.data.refresh_token, n.expiresAt = fr(
        s,
        r.data.expires_in
      ), n.refreshTokenExpiresAt = fr(
        s,
        r.data.refresh_token_expires_in
      );
    }
    delete n.scopes;
  }
  return { ...r, authentication: n };
}
function fr(e, t) {
  return new Date(e + t * 1e3).toISOString();
}
async function vs(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = {
    client_id: e.clientId
  };
  return "scopes" in e && Array.isArray(e.scopes) && (r.scope = e.scopes.join(" ")), Pe(t, "POST /login/device/code", r);
}
async function lt(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = await Pe(
    t,
    "POST /login/oauth/access_token",
    {
      client_id: e.clientId,
      device_code: e.code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    }
  ), n = {
    clientType: e.clientType,
    clientId: e.clientId,
    token: r.data.access_token,
    scopes: r.data.scope.split(/\s+/).filter(Boolean)
  };
  if ("clientSecret" in e && (n.clientSecret = e.clientSecret), e.clientType === "github-app") {
    if ("refresh_token" in r.data) {
      const s = new Date(r.headers.date).getTime();
      n.refreshToken = r.data.refresh_token, n.expiresAt = mr(
        s,
        r.data.expires_in
      ), n.refreshTokenExpiresAt = mr(
        s,
        r.data.refresh_token_expires_in
      );
    }
    delete n.scopes;
  }
  return { ...r, authentication: n };
}
function mr(e, t) {
  return new Date(e + t * 1e3).toISOString();
}
async function ks(e) {
  const r = await (e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j)("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${L(
        `${e.clientId}:${e.clientSecret}`
      )}`
    },
    client_id: e.clientId,
    access_token: e.token
  }), n = {
    clientType: e.clientType,
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    token: e.token,
    scopes: r.data.scopes
  };
  return r.data.expires_at && (n.expiresAt = r.data.expires_at), e.clientType === "github-app" && delete n.scopes, { ...r, authentication: n };
}
async function As(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = await Pe(
    t,
    "POST /login/oauth/access_token",
    {
      client_id: e.clientId,
      client_secret: e.clientSecret,
      grant_type: "refresh_token",
      refresh_token: e.refreshToken
    }
  ), n = new Date(r.headers.date).getTime(), s = {
    clientType: "github-app",
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    token: r.data.access_token,
    refreshToken: r.data.refresh_token,
    expiresAt: Tr(n, r.data.expires_in),
    refreshTokenExpiresAt: Tr(
      n,
      r.data.refresh_token_expires_in
    )
  };
  return { ...r, authentication: s };
}
function Tr(e, t) {
  return new Date(e + t * 1e3).toISOString();
}
async function ea(e) {
  const {
    request: t,
    clientType: r,
    clientId: n,
    clientSecret: s,
    token: o,
    ...i
  } = e, l = await (t || /* istanbul ignore next: we always pass a custom request in tests */
  j)(
    "POST /applications/{client_id}/token/scoped",
    {
      headers: {
        authorization: `basic ${L(`${n}:${s}`)}`
      },
      client_id: n,
      access_token: o,
      ...i
    }
  ), m = Object.assign(
    {
      clientType: r,
      clientId: n,
      clientSecret: s,
      token: l.data.token
    },
    l.data.expires_at ? { expiresAt: l.data.expires_at } : {}
  );
  return { ...l, authentication: m };
}
async function Ss(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = L(`${e.clientId}:${e.clientSecret}`), n = await t(
    "PATCH /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${r}`
      },
      client_id: e.clientId,
      access_token: e.token
    }
  ), s = {
    clientType: e.clientType,
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    token: n.data.token,
    scopes: n.data.scopes
  };
  return n.data.expires_at && (s.expiresAt = n.data.expires_at), e.clientType === "github-app" && delete s.scopes, { ...n, authentication: s };
}
async function Os(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = L(`${e.clientId}:${e.clientSecret}`);
  return t(
    "DELETE /applications/{client_id}/token",
    {
      headers: {
        authorization: `basic ${r}`
      },
      client_id: e.clientId,
      access_token: e.token
    }
  );
}
async function Ps(e) {
  const t = e.request || /* istanbul ignore next: we always pass a custom request in tests */
  j, r = L(`${e.clientId}:${e.clientSecret}`);
  return t(
    "DELETE /applications/{client_id}/grant",
    {
      headers: {
        authorization: `basic ${r}`
      },
      client_id: e.clientId,
      access_token: e.token
    }
  );
}
const ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VERSION: Ui,
  checkToken: ks,
  createDeviceCode: vs,
  deleteAuthorization: Ps,
  deleteToken: Os,
  exchangeDeviceCode: lt,
  exchangeWebFlowCode: _s,
  getWebFlowAuthorizationUrl: Zi,
  refreshToken: As,
  resetToken: Ss,
  scopeToken: ea
}, Symbol.toStringTag, { value: "Module" }));
async function Rs(e, t) {
  const r = ra(e, t.auth);
  if (r)
    return r;
  const { data: n } = await vs({
    clientType: e.clientType,
    clientId: e.clientId,
    request: t.request || e.request,
    // @ts-expect-error the extra code to make TS happy is not worth it
    scopes: t.auth.scopes || e.scopes
  });
  await e.onVerification(n);
  const s = await pt(
    t.request || e.request,
    e.clientId,
    e.clientType,
    n
  );
  return e.authentication = s, s;
}
function ra(e, t) {
  if (t.refresh === !0 || !e.authentication)
    return !1;
  if (e.clientType === "github-app")
    return e.authentication;
  const r = e.authentication, n = ("scopes" in t && t.scopes || e.scopes).join(
    " "
  ), s = r.scopes.join(" ");
  return n === s ? r : !1;
}
async function Er(e) {
  await new Promise((t) => setTimeout(t, e * 1e3));
}
async function pt(e, t, r, n) {
  try {
    const s = {
      clientId: t,
      request: e,
      code: n.device_code
    }, { authentication: o } = r === "oauth-app" ? await lt({
      ...s,
      clientType: "oauth-app"
    }) : await lt({
      ...s,
      clientType: "github-app"
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...o
    };
  } catch (s) {
    if (!s.response)
      throw s;
    const o = s.response.data.error;
    if (o === "authorization_pending")
      return await Er(n.interval), pt(e, t, r, n);
    if (o === "slow_down")
      return await Er(n.interval + 5), pt(e, t, r, n);
    throw s;
  }
}
async function sa(e, t) {
  return Rs(e, {
    auth: t
  });
}
async function na(e, t, r, n) {
  let s = t.endpoint.merge(
    r,
    n
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(s.url))
    return t(s);
  const { token: o } = await Rs(e, {
    request: t,
    auth: { type: "oauth" }
  });
  return s.headers.authorization = `token ${o}`, t(s);
}
var oa = "6.0.1";
function ia(e) {
  const t = e.request || $i.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-device.js/${oa} ${A()}`
    }
  }), { request: r = t, ...n } = e, s = e.clientType === "github-app" ? {
    ...n,
    clientType: "github-app",
    request: r
  } : {
    ...n,
    clientType: "oauth-app",
    request: r,
    scopes: e.scopes || []
  };
  if (!e.clientId)
    throw new Error(
      '[@octokit/auth-oauth-device] "clientId" option must be set (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  if (!e.onVerification)
    throw new Error(
      '[@octokit/auth-oauth-device] "onVerification" option must be a function (https://github.com/octokit/auth-oauth-device.js#usage)'
    );
  return Object.assign(sa.bind(null, s), {
    hook: na.bind(null, s)
  });
}
var Gs = "4.0.1";
async function wr(e) {
  if ("code" in e.strategyOptions) {
    const { authentication: t } = await _s({
      clientId: e.clientId,
      clientSecret: e.clientSecret,
      clientType: e.clientType,
      onTokenCreated: e.onTokenCreated,
      ...e.strategyOptions,
      request: e.request
    });
    return {
      type: "token",
      tokenType: "oauth",
      ...t
    };
  }
  if ("onVerification" in e.strategyOptions) {
    const r = await ia({
      clientType: e.clientType,
      clientId: e.clientId,
      onTokenCreated: e.onTokenCreated,
      ...e.strategyOptions,
      request: e.request
    })({
      type: "oauth"
    });
    return {
      clientSecret: e.clientSecret,
      ...r
    };
  }
  if ("token" in e.strategyOptions)
    return {
      type: "token",
      tokenType: "oauth",
      clientId: e.clientId,
      clientSecret: e.clientSecret,
      clientType: e.clientType,
      onTokenCreated: e.onTokenCreated,
      ...e.strategyOptions
    };
  throw new Error("[@octokit/auth-oauth-user] Invalid strategy options");
}
async function dt(e, t = {}) {
  var n, s;
  if (e.authentication || (e.authentication = e.clientType === "oauth-app" ? await wr(e) : await wr(e)), e.authentication.invalid)
    throw new Error("[@octokit/auth-oauth-user] Token is invalid");
  const r = e.authentication;
  if ("expiresAt" in r && (t.type === "refresh" || new Date(r.expiresAt) < /* @__PURE__ */ new Date())) {
    const { authentication: o } = await As({
      clientType: "github-app",
      clientId: e.clientId,
      clientSecret: e.clientSecret,
      refreshToken: r.refreshToken,
      request: e.request
    });
    e.authentication = {
      tokenType: "oauth",
      type: "token",
      ...o
    };
  }
  if (t.type === "refresh") {
    if (e.clientType === "oauth-app")
      throw new Error(
        "[@octokit/auth-oauth-user] OAuth Apps do not support expiring tokens"
      );
    if (!r.hasOwnProperty("expiresAt"))
      throw new Error("[@octokit/auth-oauth-user] Refresh token missing");
    await ((n = e.onTokenCreated) == null ? void 0 : n.call(e, e.authentication, {
      type: t.type
    }));
  }
  if (t.type === "check" || t.type === "reset") {
    const o = t.type === "check" ? ks : Ss;
    try {
      const { authentication: i } = await o({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: e.authentication.token,
        request: e.request
      });
      return e.authentication = {
        tokenType: "oauth",
        type: "token",
        // @ts-expect-error TBD
        ...i
      }, t.type === "reset" && await ((s = e.onTokenCreated) == null ? void 0 : s.call(e, e.authentication, {
        type: t.type
      })), e.authentication;
    } catch (i) {
      throw i.status === 404 && (i.message = "[@octokit/auth-oauth-user] Token is invalid", e.authentication.invalid = !0), i;
    }
  }
  if (t.type === "delete" || t.type === "deleteAuthorization") {
    const o = t.type === "delete" ? Os : Ps;
    try {
      await o({
        // @ts-expect-error making TS happy would require unnecessary code so no
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: e.authentication.token,
        request: e.request
      });
    } catch (i) {
      if (i.status !== 404)
        throw i;
    }
    return e.authentication.invalid = !0, e.authentication;
  }
  return e.authentication;
}
var aa = /\/applications\/[^/]+\/(token|grant)s?/;
function bt(e) {
  return e && aa.test(e);
}
async function ca(e, t, r, n = {}) {
  const s = t.endpoint.merge(
    r,
    n
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(s.url))
    return t(s);
  if (bt(s.url)) {
    const i = L(`${e.clientId}:${e.clientSecret}`);
    return s.headers.authorization = `basic ${i}`, t(s);
  }
  const { token: o } = e.clientType === "oauth-app" ? await dt({ ...e, request: t }) : await dt({ ...e, request: t });
  return s.headers.authorization = "token " + o, t(s);
}
function ve({
  clientId: e,
  clientSecret: t,
  clientType: r = "oauth-app",
  request: n = di.defaults({
    headers: {
      "user-agent": `octokit-auth-oauth-app.js/${Gs} ${A()}`
    }
  }),
  onTokenCreated: s,
  ...o
}) {
  const i = Object.assign({
    clientType: r,
    clientId: e,
    clientSecret: t,
    onTokenCreated: s,
    strategyOptions: o,
    request: n
  });
  return Object.assign(dt.bind(null, i), {
    // @ts-expect-error not worth the extra code needed to appease TS
    hook: ca.bind(null, i)
  });
}
ve.VERSION = Gs;
const ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createOAuthUserAuth: ve,
  requiresBasicAuth: bt
}, Symbol.toStringTag, { value: "Module" }));
async function la(e, t) {
  if (t.type === "oauth-app")
    return {
      type: "oauth-app",
      clientId: e.clientId,
      clientSecret: e.clientSecret,
      clientType: e.clientType,
      headers: {
        authorization: `basic ${L(
          `${e.clientId}:${e.clientSecret}`
        )}`
      }
    };
  if ("factory" in t) {
    const { type: s, ...o } = {
      ...t,
      ...e
    };
    return t.factory(o);
  }
  const r = {
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.request,
    ...t
  };
  return (e.clientType === "oauth-app" ? await ve({
    ...r,
    clientType: e.clientType
  }) : await ve({
    ...r,
    clientType: e.clientType
  }))();
}
async function pa(e, t, r, n) {
  let s = t.endpoint.merge(
    r,
    n
  );
  if (/\/login\/(oauth\/access_token|device\/code)$/.test(s.url))
    return t(s);
  if (e.clientType === "github-app" && !bt(s.url))
    throw new Error(
      `[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${s.method} ${s.url}" is not supported.`
    );
  const o = L(`${e.clientId}:${e.clientSecret}`);
  s.headers.authorization = `basic ${o}`;
  try {
    return await t(s);
  } catch (i) {
    throw i.status !== 401 || (i.message = `[@octokit/auth-oauth-app] "${s.method} ${s.url}" does not support clientId/clientSecret basic authentication.`), i;
  }
}
var da = "7.0.1";
function ha(e) {
  const t = Object.assign(
    {
      request: zo.defaults({
        headers: {
          "user-agent": `octokit-auth-oauth-app.js/${da} ${A()}`
        }
      }),
      clientType: "oauth-app"
    },
    e
  );
  return Object.assign(la.bind(null, t), {
    hook: pa.bind(null, t)
  });
}
const ga = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createOAuthAppAuth: ha,
  createOAuthUserAuth: ve
}, Symbol.toStringTag, { value: "Module" })), $s = /* @__PURE__ */ ae(ga), Re = /* @__PURE__ */ ae(ua);
var fa = "9.0.2", ma = `octokit-endpoint.js/${fa} ${A()}`, Ta = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": ma
  },
  mediaType: {
    format: ""
  }
};
function Ea(e) {
  return e ? Object.keys(e).reduce((t, r) => (t[r.toLowerCase()] = e[r], t), {}) : {};
}
function Us(e, t) {
  const r = Object.assign({}, e);
  return Object.keys(t).forEach((n) => {
    G(t[n]) ? n in e ? r[n] = Us(e[n], t[n]) : Object.assign(r, { [n]: t[n] }) : Object.assign(r, { [n]: t[n] });
  }), r;
}
function yr(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function ht(e, t, r) {
  var s;
  if (typeof t == "string") {
    let [o, i] = t.split(" ");
    r = Object.assign(i ? { method: o, url: i } : { url: o }, r);
  } else
    r = Object.assign({}, t);
  r.headers = Ea(r.headers), yr(r), yr(r.headers);
  const n = Us(e || {}, r);
  return r.url === "/graphql" && (e && ((s = e.mediaType.previews) != null && s.length) && (n.mediaType.previews = e.mediaType.previews.filter(
    (o) => !n.mediaType.previews.includes(o)
  ).concat(n.mediaType.previews)), n.mediaType.previews = (n.mediaType.previews || []).map((o) => o.replace(/-preview/, ""))), n;
}
function wa(e, t) {
  const r = /\?/.test(e) ? "&" : "?", n = Object.keys(t);
  return n.length === 0 ? e : e + r + n.map((s) => s === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${s}=${encodeURIComponent(t[s])}`).join("&");
}
var ya = /\{[^}]+\}/g;
function ba(e) {
  return e.replace(/^\W+|\W+$/g, "").split(/,/);
}
function _a(e) {
  const t = e.match(ya);
  return t ? t.map(ba).reduce((r, n) => r.concat(n), []) : [];
}
function br(e, t) {
  return Object.keys(e).filter((r) => !t.includes(r)).reduce((r, n) => (r[n] = e[n], r), {});
}
function Ds(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function ne(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function ye(e, t, r) {
  return t = e === "+" || e === "#" ? Ds(t) : ne(t), r ? ne(r) + "=" + t : t;
}
function J(e) {
  return e != null;
}
function Xe(e) {
  return e === ";" || e === "&" || e === "?";
}
function va(e, t, r, n) {
  var s = e[r], o = [];
  if (J(s) && s !== "")
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean")
      s = s.toString(), n && n !== "*" && (s = s.substring(0, parseInt(n, 10))), o.push(
        ye(t, s, Xe(t) ? r : "")
      );
    else if (n === "*")
      Array.isArray(s) ? s.filter(J).forEach(function(i) {
        o.push(
          ye(t, i, Xe(t) ? r : "")
        );
      }) : Object.keys(s).forEach(function(i) {
        J(s[i]) && o.push(ye(t, s[i], i));
      });
    else {
      const i = [];
      Array.isArray(s) ? s.filter(J).forEach(function(c) {
        i.push(ye(t, c));
      }) : Object.keys(s).forEach(function(c) {
        J(s[c]) && (i.push(ne(c)), i.push(ye(t, s[c].toString())));
      }), Xe(t) ? o.push(ne(r) + "=" + i.join(",")) : i.length !== 0 && o.push(i.join(","));
    }
  else
    t === ";" ? J(s) && o.push(ne(r)) : s === "" && (t === "&" || t === "?") ? o.push(ne(r) + "=") : s === "" && o.push("");
  return o;
}
function ka(e) {
  return {
    expand: Aa.bind(null, e)
  };
}
function Aa(e, t) {
  var r = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(n, s, o) {
      if (s) {
        let c = "";
        const l = [];
        if (r.indexOf(s.charAt(0)) !== -1 && (c = s.charAt(0), s = s.substr(1)), s.split(/,/g).forEach(function(m) {
          var u = /([^:\*]*)(?::(\d+)|(\*))?/.exec(m);
          l.push(va(t, c, u[1], u[2] || u[3]));
        }), c && c !== "+") {
          var i = ",";
          return c === "?" ? i = "&" : c !== "#" && (i = c), (l.length !== 0 ? c : "") + l.join(i);
        } else
          return l.join(",");
      } else
        return Ds(o);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function Fs(e) {
  var u;
  let t = e.method.toUpperCase(), r = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), n = Object.assign({}, e.headers), s, o = br(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const i = _a(r);
  r = ka(r).expand(o), /^http/.test(r) || (r = e.baseUrl + r);
  const c = Object.keys(e).filter((h) => i.includes(h)).concat("baseUrl"), l = br(o, c);
  if (!/application\/octet-stream/i.test(n.accept) && (e.mediaType.format && (n.accept = n.accept.split(/,/).map(
    (h) => h.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), r.endsWith("/graphql") && (u = e.mediaType.previews) != null && u.length)) {
    const h = n.accept.match(/[\w-]+(?=-preview)/g) || [];
    n.accept = h.concat(e.mediaType.previews).map((y) => {
      const v = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${y}-preview${v}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? r = wa(r, l) : "data" in l ? s = l.data : Object.keys(l).length && (s = l), !n["content-type"] && typeof s < "u" && (n["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof s > "u" && (s = ""), Object.assign(
    { method: t, url: r, headers: n },
    typeof s < "u" ? { body: s } : null,
    e.request ? { request: e.request } : null
  );
}
function Sa(e, t, r) {
  return Fs(ht(e, t, r));
}
function js(e, t) {
  const r = ht(e, t), n = Sa.bind(null, r);
  return Object.assign(n, {
    DEFAULTS: r,
    defaults: js.bind(null, r),
    merge: ht.bind(null, r),
    parse: Fs
  });
}
var Oa = js(null, Ta), Pa = $((e) => console.warn(e)), Ra = $((e) => console.warn(e)), be = class extends Error {
  constructor(e, t, r) {
    super(e), Error.captureStackTrace && Error.captureStackTrace(this, this.constructor), this.name = "HttpError", this.status = t;
    let n;
    "headers" in r && typeof r.headers < "u" && (n = r.headers), "response" in r && (this.response = r.response, n = r.response.headers);
    const s = Object.assign({}, r.request);
    r.request.headers.authorization && (s.headers = Object.assign({}, r.request.headers, {
      authorization: r.request.headers.authorization.replace(
        / .*$/,
        " [REDACTED]"
      )
    })), s.url = s.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = s, Object.defineProperty(this, "code", {
      get() {
        return Pa(
          new R(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        ), t;
      }
    }), Object.defineProperty(this, "headers", {
      get() {
        return Ra(
          new R(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        ), n || {};
      }
    });
  }
}, Ga = "8.1.4";
function $a(e) {
  return e.arrayBuffer();
}
function _r(e) {
  var c, l, m;
  const t = e.request && e.request.log ? e.request.log : console, r = ((c = e.request) == null ? void 0 : c.parseSuccessResponseBody) !== !1;
  (G(e.body) || Array.isArray(e.body)) && (e.body = JSON.stringify(e.body));
  let n = {}, s, o, { fetch: i } = globalThis;
  if ((l = e.request) != null && l.fetch && (i = e.request.fetch), !i)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  return i(e.url, {
    method: e.method,
    body: e.body,
    headers: e.headers,
    signal: (m = e.request) == null ? void 0 : m.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...e.body && { duplex: "half" }
  }).then(async (u) => {
    o = u.url, s = u.status;
    for (const h of u.headers)
      n[h[0]] = h[1];
    if ("deprecation" in n) {
      const h = n.link && n.link.match(/<([^>]+)>; rel="deprecation"/), y = h && h.pop();
      t.warn(
        `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${n.sunset}${y ? `. See ${y}` : ""}`
      );
    }
    if (!(s === 204 || s === 205)) {
      if (e.method === "HEAD") {
        if (s < 400)
          return;
        throw new be(u.statusText, s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: void 0
          },
          request: e
        });
      }
      if (s === 304)
        throw new be("Not modified", s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: await Ye(u)
          },
          request: e
        });
      if (s >= 400) {
        const h = await Ye(u);
        throw new be(Ua(h), s, {
          response: {
            url: o,
            status: s,
            headers: n,
            data: h
          },
          request: e
        });
      }
      return r ? await Ye(u) : u.body;
    }
  }).then((u) => ({
    status: s,
    url: o,
    headers: n,
    data: u
  })).catch((u) => {
    if (u instanceof be)
      throw u;
    if (u.name === "AbortError")
      throw u;
    let h = u.message;
    throw u.name === "TypeError" && "cause" in u && (u.cause instanceof Error ? h = u.cause.message : typeof u.cause == "string" && (h = u.cause)), new be(h, 500, {
      request: e
    });
  });
}
async function Ye(e) {
  const t = e.headers.get("content-type");
  return /application\/json/.test(t) ? e.json() : !t || /^text\/|charset=utf-8$/.test(t) ? e.text() : $a(e);
}
function Ua(e) {
  return typeof e == "string" ? e : "message" in e ? Array.isArray(e.errors) ? `${e.message}: ${e.errors.map(JSON.stringify).join(", ")}` : e.message : `Unknown error: ${JSON.stringify(e)}`;
}
function gt(e, t) {
  const r = e.defaults(t);
  return Object.assign(function(s, o) {
    const i = r.merge(s, o);
    if (!i.request || !i.request.hook)
      return _r(r.parse(i));
    const c = (l, m) => _r(
      r.parse(r.merge(l, m))
    );
    return Object.assign(c, {
      endpoint: r,
      defaults: gt.bind(null, r)
    }), i.request.hook(c, i);
  }, {
    endpoint: r,
    defaults: gt.bind(null, r)
  });
}
var ft = gt(Oa, {
  headers: {
    "user-agent": `octokit-request.js/${Ga} ${A()}`
  }
}), Da = "7.0.2";
function Fa(e) {
  return `Request failed due to following response errors:
` + e.errors.map((t) => ` - ${t.message}`).join(`
`);
}
var ja = class extends Error {
  constructor(e, t, r) {
    super(Fa(r)), this.request = e, this.headers = t, this.response = r, this.name = "GraphqlResponseError", this.errors = r.errors, this.data = r.data, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ca = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
], Ia = ["query", "method", "url"], vr = /\/api\/v3\/?$/;
function qa(e, t, r) {
  if (r) {
    if (typeof t == "string" && "query" in r)
      return Promise.reject(
        new Error('[@octokit/graphql] "query" cannot be used as variable name')
      );
    for (const i in r)
      if (Ia.includes(i))
        return Promise.reject(
          new Error(
            `[@octokit/graphql] "${i}" cannot be used as variable name`
          )
        );
  }
  const n = typeof t == "string" ? Object.assign({ query: t }, r) : t, s = Object.keys(
    n
  ).reduce((i, c) => Ca.includes(c) ? (i[c] = n[c], i) : (i.variables || (i.variables = {}), i.variables[c] = n[c], i), {}), o = n.baseUrl || e.endpoint.DEFAULTS.baseUrl;
  return vr.test(o) && (s.url = o.replace(vr, "/api/graphql")), e(s).then((i) => {
    if (i.data.errors) {
      const c = {};
      for (const l of Object.keys(i.headers))
        c[l] = i.headers[l];
      throw new ja(
        s,
        c,
        i.data
      );
    }
    return i.data.data;
  });
}
function _t(e, t) {
  const r = e.defaults(t);
  return Object.assign((s, o) => qa(r, s, o), {
    defaults: _t.bind(null, r),
    endpoint: r.endpoint
  });
}
_t(ft, {
  headers: {
    "user-agent": `octokit-graphql.js/${Da} ${A()}`
  },
  method: "POST",
  url: "/graphql"
});
function La(e) {
  return _t(e, {
    method: "POST",
    url: "/graphql"
  });
}
var xa = /^v1\./, Na = /^ghs_/, Ba = /^ghu_/;
async function Wa(e) {
  const t = e.split(/\./).length === 3, r = xa.test(e) || Na.test(e), n = Ba.test(e);
  return {
    type: "token",
    token: e,
    tokenType: t ? "app" : r ? "installation" : n ? "user-to-server" : "oauth"
  };
}
function Ha(e) {
  return e.split(/\./).length === 3 ? `bearer ${e}` : `token ${e}`;
}
async function Va(e, t, r, n) {
  const s = t.endpoint.merge(
    r,
    n
  );
  return s.headers.authorization = Ha(e), t(s);
}
var za = function(t) {
  if (!t)
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  if (typeof t != "string")
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  return t = t.replace(/^(token|bearer) +/i, ""), Object.assign(Wa.bind(null, t), {
    hook: Va.bind(null, t)
  });
}, kr = "5.0.1", ie, Ma = (ie = class {
  static defaults(t) {
    return class extends this {
      constructor(...n) {
        const s = n[0] || {};
        if (typeof t == "function") {
          super(t(s));
          return;
        }
        super(
          Object.assign(
            {},
            t,
            s,
            s.userAgent && t.userAgent ? {
              userAgent: `${s.userAgent} ${t.userAgent}`
            } : null
          )
        );
      }
    };
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...t) {
    var s;
    const r = this.plugins;
    return s = class extends this {
    }, s.plugins = r.concat(
      t.filter((i) => !r.includes(i))
    ), s;
  }
  constructor(t = {}) {
    const r = new qr(), n = {
      baseUrl: ft.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, t.request, {
        // @ts-ignore internal usage only, no need to type
        hook: r.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    if (n.headers["user-agent"] = [
      t.userAgent,
      `octokit-core.js/${kr} ${A()}`
    ].filter(Boolean).join(" "), t.baseUrl && (n.baseUrl = t.baseUrl), t.previews && (n.mediaType.previews = t.previews), t.timeZone && (n.headers["time-zone"] = t.timeZone), this.request = ft.defaults(n), this.graphql = La(this.request).defaults(n), this.log = Object.assign(
      {
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      },
      t.log
    ), this.hook = r, t.authStrategy) {
      const { authStrategy: o, ...i } = t, c = o(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: i
          },
          t.auth
        )
      );
      r.wrap("request", c.hook), this.auth = c;
    } else if (!t.auth)
      this.auth = async () => ({
        type: "unauthenticated"
      });
    else {
      const o = za(t.auth);
      r.wrap("request", o.hook), this.auth = o;
    }
    this.constructor.plugins.forEach((o) => {
      Object.assign(this, o(this, t));
    });
  }
}, ie.VERSION = kr, ie.plugins = [], ie);
const Ka = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Octokit: Ma
}, Symbol.toStringTag, { value: "Module" })), Ja = /* @__PURE__ */ ae(Ka), B = /* @__PURE__ */ ae(ta);
async function Qa(e) {
  return {
    type: "unauthenticated",
    reason: e
  };
}
function Xa(e) {
  return e.status !== 403 || !e.response ? !1 : e.response.headers["x-ratelimit-remaining"] === "0";
}
var Ya = /\babuse\b/i;
function Za(e) {
  return e.status !== 403 ? !1 : Ya.test(e.message);
}
async function ec(e, t, r, n) {
  const s = t.endpoint.merge(
    r,
    n
  );
  return t(s).catch((o) => {
    throw o.status === 404 ? (o.message = `Not found. May be due to lack of authentication. Reason: ${e}`, o) : Xa(o) ? (o.message = `API rate limit exceeded. This maybe caused by the lack of authentication. Reason: ${e}`, o) : Za(o) ? (o.message = `You have triggered an abuse detection mechanism. This maybe caused by the lack of authentication. Reason: ${e}`, o) : o.status === 401 ? (o.message = `Unauthorized. "${s.method} ${s.url}" failed most likely due to lack of authentication. Reason: ${e}`, o) : (o.status >= 400 && o.status < 500 && (o.message = o.message.replace(
      /\.?$/,
      `. May be caused by lack of authentication (${e}).`
    )), o);
  });
}
var tc = function(t) {
  if (!t || !t.reason)
    throw new Error(
      "[@octokit/auth-unauthenticated] No reason passed to createUnauthenticatedAuth"
    );
  return Object.assign(Qa.bind(null, t.reason), {
    hook: ec.bind(null, t.reason)
  });
};
const rc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createUnauthenticatedAuth: tc
}, Symbol.toStringTag, { value: "Module" })), Cs = /* @__PURE__ */ ae(rc);
var sc = Object.create, Ge = Object.defineProperty, nc = Object.getOwnPropertyDescriptor, oc = Object.getOwnPropertyNames, ic = Object.getPrototypeOf, ac = Object.prototype.hasOwnProperty, cc = (e, t) => {
  for (var r in t)
    Ge(e, r, { get: t[r], enumerable: !0 });
}, Is = (e, t, r, n) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of oc(t))
      !ac.call(e, s) && s !== r && Ge(e, s, { get: () => t[s], enumerable: !(n = nc(t, s)) || n.enumerable });
  return e;
}, x = (e, t, r) => (r = e != null ? sc(ic(e)) : {}, Is(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? Ge(r, "default", { value: e, enumerable: !0 }) : r,
  e
)), uc = (e) => Is(Ge({}, "__esModule", { value: !0 }), e), qs = {};
cc(qs, {
  OAuthApp: () => Nc,
  createAWSLambdaAPIGatewayV2Handler: () => xc,
  createNodeMiddleware: () => Fc,
  createWebWorkerHandler: () => Ic,
  handleRequest: () => $e,
  sendNodeResponse: () => Bs,
  unknownRouteResponse: () => Ns
});
var lc = uc(qs), pc = $s, Ls = "6.0.0";
function xs(e, t, r) {
  if (Array.isArray(t)) {
    for (const n of t)
      xs(e, n, r);
    return;
  }
  e.eventHandlers[t] || (e.eventHandlers[t] = []), e.eventHandlers[t].push(r);
}
var dc = Ja, hc = Oo, gc = dc.Octokit.defaults({
  userAgent: `octokit-oauth-app.js/${Ls} ${(0, hc.getUserAgent)()}`
}), fc = Re;
async function C(e, t) {
  const { name: r, action: n } = t;
  if (e.eventHandlers[`${r}.${n}`])
    for (const s of e.eventHandlers[`${r}.${n}`])
      await s(t);
  if (e.eventHandlers[r])
    for (const s of e.eventHandlers[r])
      await s(t);
}
async function mc(e, t) {
  return e.octokit.auth({
    type: "oauth-user",
    ...t,
    async factory(r) {
      const n = new e.Octokit({
        authStrategy: fc.createOAuthUserAuth,
        auth: r
      }), s = await n.auth({
        type: "get"
      });
      return await C(e, {
        name: "token",
        action: "created",
        token: s.token,
        scopes: s.scopes,
        authentication: s,
        octokit: n
      }), n;
    }
  });
}
var Tc = x(B);
function Ec(e, t) {
  const r = {
    clientId: e.clientId,
    request: e.octokit.request,
    ...t,
    allowSignup: e.allowSignup ?? t.allowSignup,
    redirectUrl: t.redirectUrl ?? e.redirectUrl,
    scopes: t.scopes ?? e.defaultScopes
  };
  return Tc.getWebFlowAuthorizationUrl({
    clientType: e.clientType,
    ...r
  });
}
var wc = x($s);
async function yc(e, t) {
  const r = await e.octokit.auth({
    type: "oauth-user",
    ...t
  });
  return await C(e, {
    name: "token",
    action: "created",
    token: r.token,
    scopes: r.scopes,
    authentication: r,
    octokit: new e.Octokit({
      authStrategy: wc.createOAuthUserAuth,
      auth: {
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: r.token,
        scopes: r.scopes,
        refreshToken: r.refreshToken,
        expiresAt: r.expiresAt,
        refreshTokenExpiresAt: r.refreshTokenExpiresAt
      }
    })
  }), { authentication: r };
}
var bc = x(B);
async function _c(e, t) {
  const r = await bc.checkToken({
    // @ts-expect-error not worth the extra code to appease TS
    clientType: e.clientType,
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    ...t
  });
  return Object.assign(r.authentication, { type: "token", tokenType: "oauth" }), r;
}
var Ar = x(B), Sr = Re;
async function vc(e, t) {
  const r = {
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    ...t
  };
  if (e.clientType === "oauth-app") {
    const o = await Ar.resetToken({
      clientType: "oauth-app",
      ...r
    }), i = Object.assign(o.authentication, {
      type: "token",
      tokenType: "oauth"
    });
    return await C(e, {
      name: "token",
      action: "reset",
      token: o.authentication.token,
      scopes: o.authentication.scopes || void 0,
      authentication: i,
      octokit: new e.Octokit({
        authStrategy: Sr.createOAuthUserAuth,
        auth: {
          clientType: e.clientType,
          clientId: e.clientId,
          clientSecret: e.clientSecret,
          token: o.authentication.token,
          scopes: o.authentication.scopes
        }
      })
    }), { ...o, authentication: i };
  }
  const n = await Ar.resetToken({
    clientType: "github-app",
    ...r
  }), s = Object.assign(n.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  return await C(e, {
    name: "token",
    action: "reset",
    token: n.authentication.token,
    authentication: s,
    octokit: new e.Octokit({
      authStrategy: Sr.createOAuthUserAuth,
      auth: {
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: n.authentication.token
      }
    })
  }), { ...n, authentication: s };
}
var kc = x(B), Ac = Re;
async function Sc(e, t) {
  if (e.clientType === "oauth-app")
    throw new Error(
      "[@octokit/oauth-app] app.refreshToken() is not supported for OAuth Apps"
    );
  const r = await kc.refreshToken({
    clientType: "github-app",
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    refreshToken: t.refreshToken
  }), n = Object.assign(r.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  return await C(e, {
    name: "token",
    action: "refreshed",
    token: r.authentication.token,
    authentication: n,
    octokit: new e.Octokit({
      authStrategy: Ac.createOAuthUserAuth,
      auth: {
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: r.authentication.token
      }
    })
  }), { ...r, authentication: n };
}
var Oc = x(B), Pc = Re;
async function Rc(e, t) {
  if (e.clientType === "oauth-app")
    throw new Error(
      "[@octokit/oauth-app] app.scopeToken() is not supported for OAuth Apps"
    );
  const r = await Oc.scopeToken({
    clientType: "github-app",
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    ...t
  }), n = Object.assign(r.authentication, {
    type: "token",
    tokenType: "oauth"
  });
  return await C(e, {
    name: "token",
    action: "scoped",
    token: r.authentication.token,
    authentication: n,
    octokit: new e.Octokit({
      authStrategy: Pc.createOAuthUserAuth,
      auth: {
        clientType: e.clientType,
        clientId: e.clientId,
        clientSecret: e.clientSecret,
        token: r.authentication.token
      }
    })
  }), { ...r, authentication: n };
}
var Or = x(B), Gc = Cs;
async function $c(e, t) {
  const r = {
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    ...t
  }, n = e.clientType === "oauth-app" ? await Or.deleteToken({
    clientType: "oauth-app",
    ...r
  }) : (
    // istanbul ignore next
    await Or.deleteToken({
      clientType: "github-app",
      ...r
    })
  );
  return await C(e, {
    name: "token",
    action: "deleted",
    token: t.token,
    octokit: new e.Octokit({
      authStrategy: Gc.createUnauthenticatedAuth,
      auth: {
        reason: 'Handling "token.deleted" event. The access for the token has been revoked.'
      }
    })
  }), n;
}
var Pr = x(B), Rr = Cs;
async function Uc(e, t) {
  const r = {
    clientId: e.clientId,
    clientSecret: e.clientSecret,
    request: e.octokit.request,
    ...t
  }, n = e.clientType === "oauth-app" ? await Pr.deleteAuthorization({
    clientType: "oauth-app",
    ...r
  }) : (
    // istanbul ignore next
    await Pr.deleteAuthorization({
      clientType: "github-app",
      ...r
    })
  );
  return await C(e, {
    name: "token",
    action: "deleted",
    token: t.token,
    octokit: new e.Octokit({
      authStrategy: Rr.createUnauthenticatedAuth,
      auth: {
        reason: 'Handling "token.deleted" event. The access for the token has been revoked.'
      }
    })
  }), await C(e, {
    name: "authorization",
    action: "deleted",
    token: t.token,
    octokit: new e.Octokit({
      authStrategy: Rr.createUnauthenticatedAuth,
      auth: {
        reason: 'Handling "authorization.deleted" event. The access for the app has been revoked.'
      }
    })
  }), n;
}
function Ns(e) {
  return {
    status: 404,
    headers: { "content-type": "application/json" },
    text: JSON.stringify({
      error: `Unknown route: ${e.method} ${e.url}`
    })
  };
}
async function $e(e, { pathPrefix: t = "/api/github/oauth" }, r) {
  var u, h, y, v, I, U;
  if (r.method === "OPTIONS")
    return {
      status: 200,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "*",
        "access-control-allow-headers": "Content-Type, User-Agent, Authorization"
      }
    };
  let { pathname: n } = new URL(r.url, "http://localhost");
  if (!n.startsWith(`${t}/`))
    return;
  n = n.slice(t.length + 1);
  const s = [r.method, n].join(" "), o = {
    getLogin: "GET login",
    getCallback: "GET callback",
    createToken: "POST token",
    getToken: "GET token",
    patchToken: "PATCH token",
    patchRefreshToken: "PATCH refresh-token",
    scopeToken: "POST token/scoped",
    deleteToken: "DELETE token",
    deleteGrant: "DELETE grant"
  };
  if (!Object.values(o).includes(s))
    return Ns(r);
  let i;
  try {
    const P = await r.text();
    i = P ? JSON.parse(P) : {};
  } catch {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({
        error: "[@octokit/oauth-app] request error"
      })
    };
  }
  const { searchParams: c } = new URL(r.url, "http://localhost"), l = Object.fromEntries(c), m = r.headers;
  try {
    if (s === o.getLogin) {
      const { url: _ } = e.getWebFlowAuthorizationUrl({
        state: l.state,
        scopes: l.scopes ? l.scopes.split(",") : void 0,
        allowSignup: l.allowSignup ? l.allowSignup === "true" : void 0,
        redirectUrl: l.redirectUrl
      });
      return { status: 302, headers: { location: _ } };
    }
    if (s === o.getCallback) {
      if (l.error)
        throw new Error(
          `[@octokit/oauth-app] ${l.error} ${l.error_description}`
        );
      if (!l.code)
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      const {
        authentication: { token: _ }
      } = await e.createToken({
        code: l.code
      });
      return {
        status: 200,
        headers: {
          "content-type": "text/html"
        },
        text: `<h1>Token created successfully</h1>

<p>Your token is: <strong>${_}</strong>. Copy it now as it cannot be shown again.</p>`
      };
    }
    if (s === o.createToken) {
      const { code: _, redirectUrl: k } = i;
      if (!_)
        throw new Error('[@octokit/oauth-app] "code" parameter is required');
      const D = await e.createToken({
        code: _,
        redirectUrl: k
      });
      return delete D.authentication.clientSecret, {
        status: 201,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(D)
      };
    }
    if (s === o.getToken) {
      const _ = (u = m.authorization) == null ? void 0 : u.substr(6);
      if (!_)
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      const k = await e.checkToken({
        token: _
      });
      return delete k.authentication.clientSecret, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(k)
      };
    }
    if (s === o.patchToken) {
      const _ = (h = m.authorization) == null ? void 0 : h.substr(6);
      if (!_)
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      const k = await e.resetToken({ token: _ });
      return delete k.authentication.clientSecret, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(k)
      };
    }
    if (s === o.patchRefreshToken) {
      if (!((y = m.authorization) == null ? void 0 : y.substr(6)))
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      const { refreshToken: k } = i;
      if (!k)
        throw new Error(
          "[@octokit/oauth-app] refreshToken must be sent in request body"
        );
      const D = await e.refreshToken({ refreshToken: k });
      return delete D.authentication.clientSecret, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(D)
      };
    }
    if (s === o.scopeToken) {
      const _ = (v = m.authorization) == null ? void 0 : v.substr(6);
      if (!_)
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      const k = await e.scopeToken({
        token: _,
        ...i
      });
      return delete k.authentication.clientSecret, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*"
        },
        text: JSON.stringify(k)
      };
    }
    if (s === o.deleteToken) {
      const _ = (I = m.authorization) == null ? void 0 : I.substr(6);
      if (!_)
        throw new Error(
          '[@octokit/oauth-app] "Authorization" header is required'
        );
      return await e.deleteToken({
        token: _
      }), {
        status: 204,
        headers: { "access-control-allow-origin": "*" }
      };
    }
    const P = (U = m.authorization) == null ? void 0 : U.substr(6);
    if (!P)
      throw new Error(
        '[@octokit/oauth-app] "Authorization" header is required'
      );
    return await e.deleteAuthorization({
      token: P
    }), {
      status: 204,
      headers: { "access-control-allow-origin": "*" }
    };
  } catch (P) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": "*"
      },
      text: JSON.stringify({ error: P.message })
    };
  }
}
function Dc(e) {
  const { method: t, url: r, headers: n } = e;
  async function s() {
    return await new Promise((i, c) => {
      let l = [];
      e.on("error", c).on("data", (m) => l.push(m)).on("end", () => i(Buffer.concat(l).toString()));
    });
  }
  return { method: t, url: r, headers: n, text: s };
}
function Bs(e, t) {
  t.writeHead(e.status, e.headers), t.end(e.text);
}
function Fc(e, t = {}) {
  return async function(r, n, s) {
    const o = await Dc(r), i = await $e(e, t, o);
    return i ? (Bs(i, n), !0) : (s == null || s(), !1);
  };
}
function jc(e) {
  const t = Object.fromEntries(e.headers.entries());
  return {
    method: e.method,
    url: e.url,
    headers: t,
    text: () => e.text()
  };
}
function Cc(e) {
  return new Response(e.text, {
    status: e.status,
    headers: e.headers
  });
}
function Ic(e, t = {}) {
  return async function(r) {
    const n = await jc(r), s = await $e(e, t, n);
    return s ? Cc(s) : void 0;
  };
}
function qc(e) {
  const { method: t } = e.requestContext.http;
  let r = e.rawPath;
  const { stage: n } = e.requestContext;
  r.startsWith("/" + n) && (r = r.substring(n.length + 1)), e.rawQueryString && (r += "?" + e.rawQueryString);
  const s = e.headers;
  return { method: t, url: r, headers: s, text: async () => e.body || "" };
}
function Lc(e) {
  return {
    statusCode: e.status,
    headers: e.headers,
    body: e.text
  };
}
function xc(e, t = {}) {
  return async function(r) {
    const n = qc(r), s = await $e(e, t, n);
    return s ? Lc(s) : void 0;
  };
}
var ke, Nc = (ke = class {
  static defaults(t) {
    return class extends this {
      constructor(...n) {
        super({
          ...t,
          ...n[0]
        });
      }
    };
  }
  constructor(t) {
    const r = t.Octokit || gc;
    this.type = t.clientType || "oauth-app";
    const n = new r({
      authStrategy: pc.createOAuthAppAuth,
      auth: {
        clientType: this.type,
        clientId: t.clientId,
        clientSecret: t.clientSecret
      }
    }), s = {
      clientType: this.type,
      clientId: t.clientId,
      clientSecret: t.clientSecret,
      // @ts-expect-error defaultScopes not permitted for GitHub Apps
      defaultScopes: t.defaultScopes || [],
      allowSignup: t.allowSignup,
      baseUrl: t.baseUrl,
      redirectUrl: t.redirectUrl,
      log: t.log,
      Octokit: r,
      octokit: n,
      eventHandlers: {}
    };
    this.on = xs.bind(null, s), this.octokit = n, this.getUserOctokit = mc.bind(null, s), this.getWebFlowAuthorizationUrl = Ec.bind(
      null,
      s
    ), this.createToken = yc.bind(
      null,
      s
    ), this.checkToken = _c.bind(
      null,
      s
    ), this.resetToken = vc.bind(
      null,
      s
    ), this.refreshToken = Sc.bind(
      null,
      s
    ), this.scopeToken = Rc.bind(
      null,
      s
    ), this.deleteToken = $c.bind(null, s), this.deleteAuthorization = Uc.bind(null, s);
  }
}, ke.VERSION = Ls, ke), Bc = "3.1.1", Ws = Xn.plugin(
  Zr,
  Kr,
  uo,
  ss,
  yt
).defaults({
  userAgent: `octokit.js/${Bc}`,
  throttle: {
    onRateLimit: Wc,
    onSecondaryRateLimit: Hc
  }
});
function Wc(e, t, r) {
  if (r.log.warn(
    `Request quota exhausted for request ${t.method} ${t.url}`
  ), t.request.retryCount === 0)
    return r.log.info(`Retrying after ${e} seconds!`), !0;
}
function Hc(e, t, r) {
  if (r.log.warn(
    `SecondaryRateLimit detected for request ${t.method} ${t.url}`
  ), t.request.retryCount === 0)
    return r.log.info(`Retrying after ${e} seconds!`), !0;
}
lc.OAuthApp.defaults({ Octokit: Ws });
function hu(e) {
  return new Ws({
    auth: e
  });
}
function gu(e, t = "") {
  t.length && !t.endsWith("/") && (t += "/");
  const r = {};
  for (const n of e)
    n.path.startsWith(t) && (r[n.path.substring(t.length)] = n.content);
  return r;
}
async function Vc(e, t, r, n, s, o = {}) {
  o.progress || (o.progress = {
    foundFiles: 0,
    downloadedFiles: 0
  });
  const { onProgress: i } = o, c = [], l = [], { data: m } = await e.rest.repos.getContent({
    owner: t,
    repo: r,
    path: s,
    ref: n
  });
  if (!Array.isArray(m))
    throw new Error(
      `Expected the list of files to be an array, but got ${typeof m}`
    );
  for (const y of m)
    y.type === "file" ? (++o.progress.foundFiles, i == null || i(o.progress), c.push(
      Mc(e, t, r, n, y).then((v) => (++o.progress.downloadedFiles, i == null || i(o.progress), v))
    )) : y.type === "dir" && l.push(
      Vc(
        e,
        t,
        r,
        n,
        y.path,
        o
      )
    );
  const u = await Promise.all(c), h = (await Promise.all(l)).flatMap(
    (y) => y
  );
  return [...u, ...h];
}
const zc = new Ur({ concurrency: 15 });
async function Mc(e, t, r, n, s) {
  const o = await zc.acquire();
  try {
    const { data: i } = await e.rest.repos.getContent({
      owner: t,
      repo: r,
      ref: n,
      path: s.path
    });
    if (!("content" in i))
      throw new Error(`No content found for ${s.path}`);
    return {
      name: s.name,
      path: s.path,
      content: Kc(i.content)
    };
  } finally {
    o();
  }
}
function Kc(e) {
  const t = window.atob(e), r = t.length, n = new Uint8Array(r);
  for (let s = 0; s < r; s++)
    n[s] = t.charCodeAt(s);
  return n;
}
async function fu(e, t, r, n, s) {
  var u;
  const { data: o } = await e.rest.pulls.get({
    owner: t,
    repo: r,
    pull_number: n
  }), c = (u = (await e.rest.actions.listWorkflowRuns({
    owner: t,
    repo: r,
    branch: o.head.ref,
    workflow_id: s
  })).data.workflow_runs[0]) == null ? void 0 : u.id, l = await e.rest.actions.listWorkflowRunArtifacts({
    owner: t,
    repo: r,
    run_id: c
  });
  return (await e.rest.actions.downloadArtifact({
    owner: t,
    repo: r,
    artifact_id: l.data.artifacts[0].id,
    archive_format: "zip"
  })).data;
}
async function mu(e, t, r) {
  var o;
  const { data: n, headers: s } = await e.request(
    "GET /repos/{owner}/{repo}",
    {
      owner: t,
      repo: r
    }
  );
  return !(!s["x-oauth-scopes"] || !((o = n.permissions) != null && o.push));
}
async function Tu(e, t, r, n, s) {
  await e.request("GET /repos/{owner}/{repo}/branches/{branch}", {
    owner: t,
    repo: r,
    branch: n
  }).then(
    () => !0,
    () => !1
  ) ? await e.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    owner: t,
    repo: r,
    sha: s,
    ref: `heads/${n}`
  }) : await e.request("POST /repos/{owner}/{repo}/git/refs", {
    owner: t,
    repo: r,
    sha: s,
    ref: `refs/heads/${n}`
  });
}
async function Eu(e, t, r) {
  const n = await e.request("GET /user");
  return (await e.request("GET /repos/{owner}/{repo}/forks", {
    owner: t,
    repo: r
  })).data.find(
    (i) => i.owner && i.owner.login === n.data.login
  ) || await e.request("POST /repos/{owner}/{repo}/forks", {
    owner: t,
    repo: r
  }), n.data.login;
}
async function wu(e, t, r, n, s, o) {
  const {
    data: { sha: i }
  } = await e.request("POST /repos/{owner}/{repo}/git/commits", {
    owner: t,
    repo: r,
    message: n,
    tree: o,
    parents: [s]
  });
  return i;
}
async function yu(e, t, r, n, s) {
  const o = await Jc(
    e,
    t,
    r,
    n,
    s
  );
  if (o.length === 0)
    return null;
  const {
    data: { sha: i }
  } = await e.request("POST /repos/{owner}/{repo}/git/trees", {
    owner: t,
    repo: r,
    base_tree: n,
    tree: o
  });
  return i;
}
async function Jc(e, t, r, n, s) {
  const o = [];
  for (const [i, c] of s.create)
    o.push(Gr(e, t, r, i, c));
  for (const [i, c] of s.update)
    o.push(Gr(e, t, r, i, c));
  for (const i of s.delete)
    o.push(Qc(e, t, r, n, i));
  return Promise.all(o).then(
    (i) => i.filter((c) => !!c)
  );
}
const Hs = new Ur({ concurrency: 10 });
async function Gr(e, t, r, n, s) {
  const o = await Hs.acquire();
  try {
    if (ArrayBuffer.isView(s))
      try {
        const i = new TextDecoder("utf-8", {
          fatal: !0
        }).decode(s);
        return {
          path: n,
          content: i,
          mode: "100644"
        };
      } catch {
        const {
          data: { sha: c }
        } = await e.rest.git.createBlob({
          owner: t,
          repo: r,
          encoding: "base64",
          content: Xc(s)
        });
        return {
          path: n,
          sha: c,
          mode: "100644"
        };
      }
    else
      return {
        path: n,
        content: s,
        mode: "100644"
      };
  } finally {
    o();
  }
}
async function Qc(e, t, r, n, s) {
  const o = await Hs.acquire();
  try {
    return await e.request("HEAD /repos/{owner}/{repo}/contents/:path", {
      owner: t,
      repo: r,
      ref: n,
      path: s
    }), {
      path: s,
      mode: "100644",
      sha: null
    };
  } catch {
    return;
  } finally {
    o();
  }
}
function Xc(e) {
  const t = [], r = e.byteLength;
  for (let n = 0; n < r; n++)
    t.push(String.fromCharCode(e[n]));
  return window.btoa(t.join(""));
}
async function* bu(e, t, { exceptPaths: r = [] } = {}) {
  if (t = Dr(t), !await e.isDir(t)) {
    await e.fileExists(t) && (yield {
      path: t,
      read: async () => await e.readFileAsBuffer(t)
    });
    return;
  }
  const n = [t];
  for (; n.length; ) {
    const s = n.pop();
    if (!s)
      return;
    const o = await e.listFiles(s);
    for (const i of o) {
      const c = on(s, i);
      r.includes(c.substring(t.length + 1)) || (await e.isDir(c) ? n.push(c) : yield {
        path: c,
        read: async () => await e.readFileAsBuffer(c)
      });
    }
  }
}
async function _u(e, t) {
  const r = {
    create: /* @__PURE__ */ new Map(),
    update: /* @__PURE__ */ new Map(),
    delete: /* @__PURE__ */ new Set()
  }, n = /* @__PURE__ */ new Set();
  for await (const s of t) {
    n.add(s.path);
    const o = e.get(s.path), i = await s.read();
    o ? Yc(o, i) || r.update.set(s.path, i) : r.create.set(s.path, i);
  }
  for (const s of e.keys())
    n.has(s) || r.delete.add(s);
  return r;
}
function Yc(e, t) {
  return e.length === t.length && e.every((r, n) => r === t[n]);
}
export {
  _u as changeset,
  hu as createClient,
  wu as createCommit,
  Tu as createOrUpdateBranch,
  yu as createTree,
  Gr as createTreeNode,
  Jc as createTreeNodes,
  Qc as deleteFile,
  gu as filesListToObject,
  Eu as fork,
  fu as getArtifact,
  Vc as getFilesFromDirectory,
  bu as iterateFiles,
  mu as mayPush
};
