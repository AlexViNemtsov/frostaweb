var uv = Object.defineProperty,
  dv = Object.defineProperties;
var fv = Object.getOwnPropertyDescriptors;
var Qd = Object.getOwnPropertySymbols;
var pv = Object.prototype.hasOwnProperty,
  hv = Object.prototype.propertyIsEnumerable;
var Xd = (e, n, t) =>
    n in e
      ? uv(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (e[n] = t),
  b = (e, n) => {
    for (var t in (n ||= {})) pv.call(n, t) && Xd(e, t, n[t]);
    if (Qd) for (var t of Qd(n)) hv.call(n, t) && Xd(e, t, n[t]);
    return e;
  },
  K = (e, n) => dv(e, fv(n));
var xt = (e, n, t) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(t.next(c));
        } catch (l) {
          o(l);
        }
      },
      s = (c) => {
        try {
          a(t.throw(c));
        } catch (l) {
          o(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((t = t.apply(e, n)).next());
  });
var Qa;
function si() {
  return Qa;
}
function mt(e) {
  let n = Qa;
  return (Qa = e), n;
}
var Kd = Symbol("NotFound");
function Yn(e) {
  return e === Kd || e?.name === "\u0275NotFound";
}
function Jd(e, n) {
  return Object.is(e, n);
}
var be = null,
  ai = !1,
  Ka = 1,
  gv = null,
  Ot = Symbol("SIGNAL");
function F(e) {
  let n = be;
  return (be = e), n;
}
function ci() {
  return be;
}
var li = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producers: void 0,
  producersTail: void 0,
  consumers: void 0,
  consumersTail: void 0,
  recomputing: !1,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function ui(e) {
  if (ai) throw new Error("");
  if (be === null) return;
  be.consumerOnSignalRead(e);
  let n = be.producersTail;
  if (n !== void 0 && n.producer === e) return;
  let t,
    r = be.recomputing;
  if (
    r &&
    ((t = n !== void 0 ? n.nextProducer : be.producers),
    t !== void 0 && t.producer === e)
  ) {
    (be.producersTail = t), (t.lastReadVersion = e.version);
    return;
  }
  let o = e.consumersTail;
  if (o !== void 0 && o.consumer === be && (!r || vv(o, be))) return;
  let i = Zn(be),
    s = {
      producer: e,
      consumer: be,
      nextProducer: t,
      prevConsumer: o,
      lastReadVersion: e.version,
      nextConsumer: void 0,
    };
  (be.producersTail = s),
    n !== void 0 ? (n.nextProducer = s) : (be.producers = s),
    i && nf(e, s);
}
function ef() {
  Ka++;
}
function tf(e) {
  if (!(Zn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Ka)) {
    if (!e.producerMustRecompute(e) && !fi(e)) {
      Xa(e);
      return;
    }
    e.producerRecomputeValue(e), Xa(e);
  }
}
function Ja(e) {
  if (e.consumers === void 0) return;
  let n = ai;
  ai = !0;
  try {
    for (let t = e.consumers; t !== void 0; t = t.nextConsumer) {
      let r = t.consumer;
      r.dirty || mv(r);
    }
  } finally {
    ai = n;
  }
}
function ec() {
  return be?.consumerAllowSignalWrites !== !1;
}
function mv(e) {
  (e.dirty = !0), Ja(e), e.consumerMarkedDirty?.(e);
}
function Xa(e) {
  (e.dirty = !1), (e.lastCleanEpoch = Ka);
}
function di(e) {
  return e && ((e.producersTail = void 0), (e.recomputing = !0)), F(e);
}
function tc(e, n) {
  if ((F(n), !e)) return;
  e.recomputing = !1;
  let t = e.producersTail,
    r = t !== void 0 ? t.nextProducer : e.producers;
  if (r !== void 0) {
    if (Zn(e))
      do r = rc(r);
      while (r !== void 0);
    t !== void 0 ? (t.nextProducer = void 0) : (e.producers = void 0);
  }
}
function fi(e) {
  for (let n = e.producers; n !== void 0; n = n.nextProducer) {
    let t = n.producer,
      r = n.lastReadVersion;
    if (r !== t.version || (tf(t), r !== t.version)) return !0;
  }
  return !1;
}
function nc(e) {
  if (Zn(e)) {
    let n = e.producers;
    for (; n !== void 0; ) n = rc(n);
  }
  (e.producers = void 0),
    (e.producersTail = void 0),
    (e.consumers = void 0),
    (e.consumersTail = void 0);
}
function nf(e, n) {
  let t = e.consumersTail,
    r = Zn(e);
  if (
    (t !== void 0
      ? ((n.nextConsumer = t.nextConsumer), (t.nextConsumer = n))
      : ((n.nextConsumer = void 0), (e.consumers = n)),
    (n.prevConsumer = t),
    (e.consumersTail = n),
    !r)
  )
    for (let o = e.producers; o !== void 0; o = o.nextProducer)
      nf(o.producer, o);
}
function rc(e) {
  let n = e.producer,
    t = e.nextProducer,
    r = e.nextConsumer,
    o = e.prevConsumer;
  if (
    ((e.nextConsumer = void 0),
    (e.prevConsumer = void 0),
    r !== void 0 ? (r.prevConsumer = o) : (n.consumersTail = o),
    o !== void 0)
  )
    o.nextConsumer = r;
  else if (((n.consumers = r), !Zn(n))) {
    let i = n.producers;
    for (; i !== void 0; ) i = rc(i);
  }
  return t;
}
function Zn(e) {
  return e.consumerIsAlwaysLive || e.consumers !== void 0;
}
function rf(e) {
  gv?.(e);
}
function vv(e, n) {
  let t = n.producersTail;
  if (t !== void 0) {
    let r = n.producers;
    do {
      if (r === e) return !0;
      if (r === t) break;
      r = r.nextProducer;
    } while (r !== void 0);
  }
  return !1;
}
function yv() {
  throw new Error();
}
var of = yv;
function sf(e) {
  of(e);
}
function oc(e) {
  of = e;
}
var Cv = null;
function ic(e, n) {
  let t = Object.create(pi);
  (t.value = e), n !== void 0 && (t.equal = n);
  let r = () => af(t);
  return (r[Ot] = t), rf(t), [r, (s) => $r(t, s), (s) => cf(t, s)];
}
function af(e) {
  return ui(e), e.value;
}
function $r(e, n) {
  ec() || sf(e), e.equal(e.value, n) || ((e.value = n), Dv(e));
}
function cf(e, n) {
  ec() || sf(e), $r(e, n(e.value));
}
var pi = K(b({}, li), { equal: Jd, value: void 0, kind: "signal" });
function Dv(e) {
  e.version++, ef(), Ja(e), Cv?.(e);
}
function A(e) {
  return typeof e == "function";
}
function Qn(e) {
  let t = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (t.prototype = Object.create(Error.prototype)),
    (t.prototype.constructor = t),
    t
  );
}
var hi = Qn(
  (e) =>
    function (t) {
      e(this),
        (this.message = t
          ? `${t.length} errors occurred during unsubscription:
${t.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = t);
    }
);
function gn(e, n) {
  if (e) {
    let t = e.indexOf(n);
    0 <= t && e.splice(t, 1);
  }
}
var ne = class e {
  constructor(n) {
    (this.initialTeardown = n),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let n;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: t } = this;
      if (t)
        if (((this._parentage = null), Array.isArray(t)))
          for (let i of t) i.remove(this);
        else t.remove(this);
      let { initialTeardown: r } = this;
      if (A(r))
        try {
          r();
        } catch (i) {
          n = i instanceof hi ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            lf(i);
          } catch (s) {
            (n = n ?? []),
              s instanceof hi ? (n = [...n, ...s.errors]) : n.push(s);
          }
      }
      if (n) throw new hi(n);
    }
  }
  add(n) {
    var t;
    if (n && n !== this)
      if (this.closed) lf(n);
      else {
        if (n instanceof e) {
          if (n.closed || n._hasParent(this)) return;
          n._addParent(this);
        }
        (this._finalizers =
          (t = this._finalizers) !== null && t !== void 0 ? t : []).push(n);
      }
  }
  _hasParent(n) {
    let { _parentage: t } = this;
    return t === n || (Array.isArray(t) && t.includes(n));
  }
  _addParent(n) {
    let { _parentage: t } = this;
    this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
  }
  _removeParent(n) {
    let { _parentage: t } = this;
    t === n ? (this._parentage = null) : Array.isArray(t) && gn(t, n);
  }
  remove(n) {
    let { _finalizers: t } = this;
    t && gn(t, n), n instanceof e && n._removeParent(this);
  }
};
ne.EMPTY = (() => {
  let e = new ne();
  return (e.closed = !0), e;
})();
var sc = ne.EMPTY;
function gi(e) {
  return (
    e instanceof ne ||
    (e && "closed" in e && A(e.remove) && A(e.add) && A(e.unsubscribe))
  );
}
function lf(e) {
  A(e) ? e() : e.unsubscribe();
}
var it = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Xn = {
  setTimeout(e, n, ...t) {
    let { delegate: r } = Xn;
    return r?.setTimeout ? r.setTimeout(e, n, ...t) : setTimeout(e, n, ...t);
  },
  clearTimeout(e) {
    let { delegate: n } = Xn;
    return (n?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function mi(e) {
  Xn.setTimeout(() => {
    let { onUnhandledError: n } = it;
    if (n) n(e);
    else throw e;
  });
}
function mn() {}
var uf = ac("C", void 0, void 0);
function df(e) {
  return ac("E", void 0, e);
}
function ff(e) {
  return ac("N", e, void 0);
}
function ac(e, n, t) {
  return { kind: e, value: n, error: t };
}
var vn = null;
function Kn(e) {
  if (it.useDeprecatedSynchronousErrorHandling) {
    let n = !vn;
    if ((n && (vn = { errorThrown: !1, error: null }), e(), n)) {
      let { errorThrown: t, error: r } = vn;
      if (((vn = null), t)) throw r;
    }
  } else e();
}
function pf(e) {
  it.useDeprecatedSynchronousErrorHandling &&
    vn &&
    ((vn.errorThrown = !0), (vn.error = e));
}
var yn = class extends ne {
    constructor(n) {
      super(),
        (this.isStopped = !1),
        n
          ? ((this.destination = n), gi(n) && n.add(this))
          : (this.destination = wv);
    }
    static create(n, t, r) {
      return new Jn(n, t, r);
    }
    next(n) {
      this.isStopped ? lc(ff(n), this) : this._next(n);
    }
    error(n) {
      this.isStopped
        ? lc(df(n), this)
        : ((this.isStopped = !0), this._error(n));
    }
    complete() {
      this.isStopped ? lc(uf, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(n) {
      this.destination.next(n);
    }
    _error(n) {
      try {
        this.destination.error(n);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ev = Function.prototype.bind;
function cc(e, n) {
  return Ev.call(e, n);
}
var uc = class {
    constructor(n) {
      this.partialObserver = n;
    }
    next(n) {
      let { partialObserver: t } = this;
      if (t.next)
        try {
          t.next(n);
        } catch (r) {
          vi(r);
        }
    }
    error(n) {
      let { partialObserver: t } = this;
      if (t.error)
        try {
          t.error(n);
        } catch (r) {
          vi(r);
        }
      else vi(n);
    }
    complete() {
      let { partialObserver: n } = this;
      if (n.complete)
        try {
          n.complete();
        } catch (t) {
          vi(t);
        }
    }
  },
  Jn = class extends yn {
    constructor(n, t, r) {
      super();
      let o;
      if (A(n) || !n)
        o = { next: n ?? void 0, error: t ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && it.useDeprecatedNextContext
          ? ((i = Object.create(n)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: n.next && cc(n.next, i),
              error: n.error && cc(n.error, i),
              complete: n.complete && cc(n.complete, i),
            }))
          : (o = n);
      }
      this.destination = new uc(o);
    }
  };
function vi(e) {
  it.useDeprecatedSynchronousErrorHandling ? pf(e) : mi(e);
}
function bv(e) {
  throw e;
}
function lc(e, n) {
  let { onStoppedNotification: t } = it;
  t && Xn.setTimeout(() => t(e, n));
}
var wv = { closed: !0, next: mn, error: bv, complete: mn };
var er = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function Be(e) {
  return e;
}
function dc(...e) {
  return fc(e);
}
function fc(e) {
  return e.length === 0
    ? Be
    : e.length === 1
    ? e[0]
    : function (t) {
        return e.reduce((r, o) => o(r), t);
      };
}
var G = (() => {
  class e {
    constructor(t) {
      t && (this._subscribe = t);
    }
    lift(t) {
      let r = new e();
      return (r.source = this), (r.operator = t), r;
    }
    subscribe(t, r, o) {
      let i = Iv(t) ? t : new Jn(t, r, o);
      return (
        Kn(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(t) {
      try {
        return this._subscribe(t);
      } catch (r) {
        t.error(r);
      }
    }
    forEach(t, r) {
      return (
        (r = hf(r)),
        new r((o, i) => {
          let s = new Jn({
            next: (a) => {
              try {
                t(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(t) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(t);
    }
    [er]() {
      return this;
    }
    pipe(...t) {
      return fc(t)(this);
    }
    toPromise(t) {
      return (
        (t = hf(t)),
        new t((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (n) => new e(n)), e;
})();
function hf(e) {
  var n;
  return (n = e ?? it.Promise) !== null && n !== void 0 ? n : Promise;
}
function _v(e) {
  return e && A(e.next) && A(e.error) && A(e.complete);
}
function Iv(e) {
  return (e && e instanceof yn) || (_v(e) && gi(e));
}
function pc(e) {
  return A(e?.lift);
}
function j(e) {
  return (n) => {
    if (pc(n))
      return n.lift(function (t) {
        try {
          return e(t, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function H(e, n, t, r, o) {
  return new hc(e, n, t, r, o);
}
var hc = class extends yn {
  constructor(n, t, r, o, i, s) {
    super(n),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = t
        ? function (a) {
            try {
              t(a);
            } catch (c) {
              n.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              n.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              n.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var n;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: t } = this;
      super.unsubscribe(),
        !t && ((n = this.onFinalize) === null || n === void 0 || n.call(this));
    }
  }
};
function tr() {
  return j((e, n) => {
    let t = null;
    e._refCount++;
    let r = H(n, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        t = null;
        return;
      }
      let o = e._connection,
        i = t;
      (t = null), o && (!i || o === i) && o.unsubscribe(), n.unsubscribe();
    });
    e.subscribe(r), r.closed || (t = e.connect());
  });
}
var nr = class extends G {
  constructor(n, t) {
    super(),
      (this.source = n),
      (this.subjectFactory = t),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      pc(n) && (this.lift = n.lift);
  }
  _subscribe(n) {
    return this.getSubject().subscribe(n);
  }
  getSubject() {
    let n = this._subject;
    return (
      (!n || n.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: n } = this;
    (this._subject = this._connection = null), n?.unsubscribe();
  }
  connect() {
    let n = this._connection;
    if (!n) {
      n = this._connection = new ne();
      let t = this.getSubject();
      n.add(
        this.source.subscribe(
          H(
            t,
            void 0,
            () => {
              this._teardown(), t.complete();
            },
            (r) => {
              this._teardown(), t.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        n.closed && ((this._connection = null), (n = ne.EMPTY));
    }
    return n;
  }
  refCount() {
    return tr()(this);
  }
};
var gf = Qn(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var ce = (() => {
    class e extends G {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(t) {
        let r = new yi(this, this);
        return (r.operator = t), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new gf();
      }
      next(t) {
        Kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(t);
          }
        });
      }
      error(t) {
        Kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = t);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(t);
          }
        });
      }
      complete() {
        Kn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: t } = this;
            for (; t.length; ) t.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var t;
        return (
          ((t = this.observers) === null || t === void 0 ? void 0 : t.length) >
          0
        );
      }
      _trySubscribe(t) {
        return this._throwIfClosed(), super._trySubscribe(t);
      }
      _subscribe(t) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(t),
          this._innerSubscribe(t)
        );
      }
      _innerSubscribe(t) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? sc
          : ((this.currentObservers = null),
            i.push(t),
            new ne(() => {
              (this.currentObservers = null), gn(i, t);
            }));
      }
      _checkFinalizedStatuses(t) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? t.error(o) : i && t.complete();
      }
      asObservable() {
        let t = new G();
        return (t.source = this), t;
      }
    }
    return (e.create = (n, t) => new yi(n, t)), e;
  })(),
  yi = class extends ce {
    constructor(n, t) {
      super(), (this.destination = n), (this.source = t);
    }
    next(n) {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0 ? void 0 : t.next) ===
        null ||
        r === void 0 ||
        r.call(t, n);
    }
    error(n) {
      var t, r;
      (r =
        (t = this.destination) === null || t === void 0 ? void 0 : t.error) ===
        null ||
        r === void 0 ||
        r.call(t, n);
    }
    complete() {
      var n, t;
      (t =
        (n = this.destination) === null || n === void 0
          ? void 0
          : n.complete) === null ||
        t === void 0 ||
        t.call(n);
    }
    _subscribe(n) {
      var t, r;
      return (r =
        (t = this.source) === null || t === void 0
          ? void 0
          : t.subscribe(n)) !== null && r !== void 0
        ? r
        : sc;
    }
  };
var re = class extends ce {
  constructor(n) {
    super(), (this._value = n);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(n) {
    let t = super._subscribe(n);
    return !t.closed && n.next(this._value), t;
  }
  getValue() {
    let { hasError: n, thrownError: t, _value: r } = this;
    if (n) throw t;
    return this._throwIfClosed(), r;
  }
  next(n) {
    super.next((this._value = n));
  }
};
var gc = {
  now() {
    return (gc.delegate || Date).now();
  },
  delegate: void 0,
};
var Ci = class extends ne {
  constructor(n, t) {
    super();
  }
  schedule(n, t = 0) {
    return this;
  }
};
var Ur = {
  setInterval(e, n, ...t) {
    let { delegate: r } = Ur;
    return r?.setInterval ? r.setInterval(e, n, ...t) : setInterval(e, n, ...t);
  },
  clearInterval(e) {
    let { delegate: n } = Ur;
    return (n?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var Di = class extends Ci {
  constructor(n, t) {
    super(n, t), (this.scheduler = n), (this.work = t), (this.pending = !1);
  }
  schedule(n, t = 0) {
    var r;
    if (this.closed) return this;
    this.state = n;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, t)),
      (this.pending = !0),
      (this.delay = t),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(i, this.id, t)),
      this
    );
  }
  requestAsyncId(n, t, r = 0) {
    return Ur.setInterval(n.flush.bind(n, this), r);
  }
  recycleAsyncId(n, t, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return t;
    t != null && Ur.clearInterval(t);
  }
  execute(n, t) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let r = this._execute(n, t);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(n, t) {
    let r = !1,
      o;
    try {
      this.work(n);
    } catch (i) {
      (r = !0), (o = i || new Error("Scheduled action threw falsy error"));
    }
    if (r) return this.unsubscribe(), o;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: n, scheduler: t } = this,
        { actions: r } = t;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        gn(r, this),
        n != null && (this.id = this.recycleAsyncId(t, n, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var rr = class e {
  constructor(n, t = e.now) {
    (this.schedulerActionCtor = n), (this.now = t);
  }
  schedule(n, t = 0, r) {
    return new this.schedulerActionCtor(this, n).schedule(r, t);
  }
};
rr.now = gc.now;
var Ei = class extends rr {
  constructor(n, t = rr.now) {
    super(n, t), (this.actions = []), (this._active = !1);
  }
  flush(n) {
    let { actions: t } = this;
    if (this._active) {
      t.push(n);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = n.execute(n.state, n.delay))) break;
    while ((n = t.shift()));
    if (((this._active = !1), r)) {
      for (; (n = t.shift()); ) n.unsubscribe();
      throw r;
    }
  }
};
var zr = new Ei(Di),
  mf = zr;
var Pe = new G((e) => e.complete());
function bi(e) {
  return e && A(e.schedule);
}
function vf(e) {
  return e[e.length - 1];
}
function yf(e) {
  return A(vf(e)) ? e.pop() : void 0;
}
function Gt(e) {
  return bi(vf(e)) ? e.pop() : void 0;
}
function Df(e, n, t, r) {
  function o(i) {
    return i instanceof t
      ? i
      : new t(function (s) {
          s(i);
        });
  }
  return new (t || (t = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, n || [])).next());
  });
}
function Cf(e) {
  var n = typeof Symbol == "function" && Symbol.iterator,
    t = n && e[n],
    r = 0;
  if (t) return t.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    n ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Cn(e) {
  return this instanceof Cn ? ((this.v = e), this) : new Cn(e);
}
function Ef(e, n, t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = t.apply(e, n || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (D) {
      return Promise.resolve(D).then(f, d);
    };
  }
  function a(f, D) {
    r[f] &&
      ((o[f] = function (M) {
        return new Promise(function (U, z) {
          i.push([f, M, U, z]) > 1 || c(f, M);
        });
      }),
      D && (o[f] = D(o[f])));
  }
  function c(f, D) {
    try {
      l(r[f](D));
    } catch (M) {
      p(i[0][3], M);
    }
  }
  function l(f) {
    f.value instanceof Cn
      ? Promise.resolve(f.value.v).then(u, d)
      : p(i[0][2], f);
  }
  function u(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function p(f, D) {
    f(D), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function bf(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = e[Symbol.asyncIterator],
    t;
  return n
    ? n.call(e)
    : ((e = typeof Cf == "function" ? Cf(e) : e[Symbol.iterator]()),
      (t = {}),
      r("next"),
      r("throw"),
      r("return"),
      (t[Symbol.asyncIterator] = function () {
        return this;
      }),
      t);
  function r(i) {
    t[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var wi = (e) => e && typeof e.length == "number" && typeof e != "function";
function _i(e) {
  return A(e?.then);
}
function Ii(e) {
  return A(e[er]);
}
function Si(e) {
  return Symbol.asyncIterator && A(e?.[Symbol.asyncIterator]);
}
function Mi(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function Sv() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Ti = Sv();
function xi(e) {
  return A(e?.[Ti]);
}
function Oi(e) {
  return Ef(this, arguments, function* () {
    let t = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Cn(t.read());
        if (o) return yield Cn(void 0);
        yield yield Cn(r);
      }
    } finally {
      t.releaseLock();
    }
  });
}
function Ri(e) {
  return A(e?.getReader);
}
function le(e) {
  if (e instanceof G) return e;
  if (e != null) {
    if (Ii(e)) return Mv(e);
    if (wi(e)) return Tv(e);
    if (_i(e)) return xv(e);
    if (Si(e)) return wf(e);
    if (xi(e)) return Ov(e);
    if (Ri(e)) return Rv(e);
  }
  throw Mi(e);
}
function Mv(e) {
  return new G((n) => {
    let t = e[er]();
    if (A(t.subscribe)) return t.subscribe(n);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Tv(e) {
  return new G((n) => {
    for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
    n.complete();
  });
}
function xv(e) {
  return new G((n) => {
    e.then(
      (t) => {
        n.closed || (n.next(t), n.complete());
      },
      (t) => n.error(t)
    ).then(null, mi);
  });
}
function Ov(e) {
  return new G((n) => {
    for (let t of e) if ((n.next(t), n.closed)) return;
    n.complete();
  });
}
function wf(e) {
  return new G((n) => {
    Nv(e, n).catch((t) => n.error(t));
  });
}
function Rv(e) {
  return wf(Oi(e));
}
function Nv(e, n) {
  var t, r, o, i;
  return Df(this, void 0, void 0, function* () {
    try {
      for (t = bf(e); (r = yield t.next()), !r.done; ) {
        let s = r.value;
        if ((n.next(s), n.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = t.return) && (yield i.call(t));
      } finally {
        if (o) throw o.error;
      }
    }
    n.complete();
  });
}
function ke(e, n, t, r = 0, o = !1) {
  let i = n.schedule(function () {
    t(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function Ni(e, n = 0) {
  return j((t, r) => {
    t.subscribe(
      H(
        r,
        (o) => ke(r, e, () => r.next(o), n),
        () => ke(r, e, () => r.complete(), n),
        (o) => ke(r, e, () => r.error(o), n)
      )
    );
  });
}
function Ai(e, n = 0) {
  return j((t, r) => {
    r.add(e.schedule(() => t.subscribe(r), n));
  });
}
function _f(e, n) {
  return le(e).pipe(Ai(n), Ni(n));
}
function If(e, n) {
  return le(e).pipe(Ai(n), Ni(n));
}
function Sf(e, n) {
  return new G((t) => {
    let r = 0;
    return n.schedule(function () {
      r === e.length
        ? t.complete()
        : (t.next(e[r++]), t.closed || this.schedule());
    });
  });
}
function Mf(e, n) {
  return new G((t) => {
    let r;
    return (
      ke(t, n, () => {
        (r = e[Ti]()),
          ke(
            t,
            n,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                t.error(s);
                return;
              }
              i ? t.complete() : t.next(o);
            },
            0,
            !0
          );
      }),
      () => A(r?.return) && r.return()
    );
  });
}
function Pi(e, n) {
  if (!e) throw new Error("Iterable cannot be null");
  return new G((t) => {
    ke(t, n, () => {
      let r = e[Symbol.asyncIterator]();
      ke(
        t,
        n,
        () => {
          r.next().then((o) => {
            o.done ? t.complete() : t.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Tf(e, n) {
  return Pi(Oi(e), n);
}
function xf(e, n) {
  if (e != null) {
    if (Ii(e)) return _f(e, n);
    if (wi(e)) return Sf(e, n);
    if (_i(e)) return If(e, n);
    if (Si(e)) return Pi(e, n);
    if (xi(e)) return Mf(e, n);
    if (Ri(e)) return Tf(e, n);
  }
  throw Mi(e);
}
function ue(e, n) {
  return n ? xf(e, n) : le(e);
}
function T(...e) {
  let n = Gt(e);
  return ue(e, n);
}
function or(e, n) {
  let t = A(e) ? e : () => e,
    r = (o) => o.error(t());
  return new G(n ? (o) => n.schedule(r, 0, o) : r);
}
function mc(e) {
  return !!e && (e instanceof G || (A(e.lift) && A(e.subscribe)));
}
var Rt = Qn(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Of(e) {
  return e instanceof Date && !isNaN(e);
}
function B(e, n) {
  return j((t, r) => {
    let o = 0;
    t.subscribe(
      H(r, (i) => {
        r.next(e.call(n, i, o++));
      })
    );
  });
}
var { isArray: Av } = Array;
function Pv(e, n) {
  return Av(n) ? e(...n) : e(n);
}
function Rf(e) {
  return B((n) => Pv(e, n));
}
var { isArray: kv } = Array,
  { getPrototypeOf: Fv, prototype: Lv, keys: jv } = Object;
function Nf(e) {
  if (e.length === 1) {
    let n = e[0];
    if (kv(n)) return { args: n, keys: null };
    if (Hv(n)) {
      let t = jv(n);
      return { args: t.map((r) => n[r]), keys: t };
    }
  }
  return { args: e, keys: null };
}
function Hv(e) {
  return e && typeof e == "object" && Fv(e) === Lv;
}
function Af(e, n) {
  return e.reduce((t, r, o) => ((t[r] = n[o]), t), {});
}
function ki(...e) {
  let n = Gt(e),
    t = yf(e),
    { args: r, keys: o } = Nf(e);
  if (r.length === 0) return ue([], n);
  let i = new G(Bv(r, n, o ? (s) => Af(o, s) : Be));
  return t ? i.pipe(Rf(t)) : i;
}
function Bv(e, n, t = Be) {
  return (r) => {
    Pf(
      n,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          Pf(
            n,
            () => {
              let l = ue(e[c], n),
                u = !1;
              l.subscribe(
                H(
                  r,
                  (d) => {
                    (i[c] = d), u || ((u = !0), a--), a || r.next(t(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function Pf(e, n, t) {
  e ? ke(t, e, n) : n();
}
function kf(e, n, t, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !c.length && !l && n.complete();
    },
    f = (M) => (l < r ? D(M) : c.push(M)),
    D = (M) => {
      i && n.next(M), l++;
      let U = !1;
      le(t(M, u++)).subscribe(
        H(
          n,
          (z) => {
            o?.(z), i ? f(z) : n.next(z);
          },
          () => {
            U = !0;
          },
          void 0,
          () => {
            if (U)
              try {
                for (l--; c.length && l < r; ) {
                  let z = c.shift();
                  s ? ke(n, s, () => D(z)) : D(z);
                }
                p();
              } catch (z) {
                n.error(z);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      H(n, f, () => {
        (d = !0), p();
      })
    ),
    () => {
      a?.();
    }
  );
}
function oe(e, n, t = 1 / 0) {
  return A(n)
    ? oe((r, o) => B((i, s) => n(r, i, o, s))(le(e(r, o))), t)
    : (typeof n == "number" && (t = n), j((r, o) => kf(r, o, e, t)));
}
function Ff(e = 1 / 0) {
  return oe(Be, e);
}
function Lf() {
  return Ff(1);
}
function Wt(...e) {
  return Lf()(ue(e, Gt(e)));
}
function Gr(e) {
  return new G((n) => {
    le(e()).subscribe(n);
  });
}
function Dn(e = 0, n, t = mf) {
  let r = -1;
  return (
    n != null && (bi(n) ? (t = n) : (r = n)),
    new G((o) => {
      let i = Of(e) ? +e - t.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return t.schedule(function () {
        o.closed ||
          (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function vc(e = 0, n = zr) {
  return e < 0 && (e = 0), Dn(e, e, n);
}
function Ye(e, n) {
  return j((t, r) => {
    let o = 0;
    t.subscribe(H(r, (i) => e.call(n, i, o++) && r.next(i)));
  });
}
function qt(e) {
  return j((n, t) => {
    let r = null,
      o = !1,
      i;
    (r = n.subscribe(
      H(t, void 0, void 0, (s) => {
        (i = le(e(s, qt(e)(n)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(t)) : (o = !0);
      })
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(t));
  });
}
function jf(e, n, t, r, o) {
  return (i, s) => {
    let a = t,
      c = n,
      l = 0;
    i.subscribe(
      H(
        s,
        (u) => {
          let d = l++;
          (c = a ? e(c, u, d) : ((a = !0), u)), r && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function ir(e, n) {
  return A(n) ? oe(e, n, 1) : oe(e, 1);
}
function Yt(e) {
  return j((n, t) => {
    let r = !1;
    n.subscribe(
      H(
        t,
        (o) => {
          (r = !0), t.next(o);
        },
        () => {
          r || t.next(e), t.complete();
        }
      )
    );
  });
}
function Me(e) {
  return e <= 0
    ? () => Pe
    : j((n, t) => {
        let r = 0;
        n.subscribe(
          H(t, (o) => {
            ++r <= e && (t.next(o), e <= r && t.complete());
          })
        );
      });
}
function Hf() {
  return j((e, n) => {
    e.subscribe(H(n, mn));
  });
}
function Bf(e) {
  return B(() => e);
}
function yc(e, n) {
  return n
    ? (t) => Wt(n.pipe(Me(1), Hf()), t.pipe(yc(e)))
    : oe((t, r) => le(e(t, r)).pipe(Me(1), Bf(t)));
}
function Cc(e, n = zr) {
  let t = Dn(e, n);
  return yc(() => t);
}
function Fi(e = Vv) {
  return j((n, t) => {
    let r = !1;
    n.subscribe(
      H(
        t,
        (o) => {
          (r = !0), t.next(o);
        },
        () => (r ? t.complete() : t.error(e()))
      )
    );
  });
}
function Vv() {
  return new Rt();
}
function Wr(e) {
  return j((n, t) => {
    try {
      n.subscribe(t);
    } finally {
      t.add(e);
    }
  });
}
function Nt(e, n) {
  let t = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ye((o, i) => e(o, i, r)) : Be,
      Me(1),
      t ? Yt(n) : Fi(() => new Rt())
    );
}
function sr(e) {
  return e <= 0
    ? () => Pe
    : j((n, t) => {
        let r = [];
        n.subscribe(
          H(
            t,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) t.next(o);
              t.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function Dc(e, n) {
  let t = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Ye((o, i) => e(o, i, r)) : Be,
      sr(1),
      t ? Yt(n) : Fi(() => new Rt())
    );
}
function Ec(e, n) {
  return j(jf(e, n, arguments.length >= 2, !0));
}
function bc(...e) {
  let n = Gt(e);
  return j((t, r) => {
    (n ? Wt(e, t, n) : Wt(e, t)).subscribe(r);
  });
}
function Ze(e, n) {
  return j((t, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    t.subscribe(
      H(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          le(e(c, u)).subscribe(
            (o = H(
              r,
              (d) => r.next(n ? n(c, d, u, l++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Li(e) {
  return j((n, t) => {
    le(e).subscribe(H(t, () => t.complete(), mn)), !t.closed && n.subscribe(t);
  });
}
function ge(e, n, t) {
  let r = A(e) || n || t ? { next: e, error: n, complete: t } : e;
  return r
    ? j((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          H(
            i,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                i.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : Be;
}
var Ui =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  w = class extends Error {
    code;
    constructor(n, t) {
      super(Xr(n, t)), (this.code = n);
    }
  };
function Uv(e) {
  return `NG0${Math.abs(e)}`;
}
function Xr(e, n) {
  return `${Uv(e)}${n ? ": " + n : ""}`;
}
function q(e) {
  for (let n in e) if (e[n] === q) return n;
  throw Error("");
}
function Pt(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(Pt).join(", ")}]`;
  if (e == null) return "" + e;
  let n = e.overriddenName || e.name;
  if (n) return `${n}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let r = t.indexOf(`
`);
  return r >= 0 ? t.slice(0, r) : t;
}
function kc(e, n) {
  return e ? (n ? `${e} ${n}` : e) : n || "";
}
var zv = q({ __forward_ref__: q });
function zi(e) {
  return (
    (e.__forward_ref__ = zi),
    (e.toString = function () {
      return Pt(this());
    }),
    e
  );
}
function Fe(e) {
  return Fc(e) ? e() : e;
}
function Fc(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(zv) && e.__forward_ref__ === zi
  );
}
function Uf(e, n) {
  e == null && Lc(n, e, null, "!=");
}
function Lc(e, n, t, r) {
  throw new Error(
    `ASSERTION ERROR: ${e}` +
      (r == null ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)
  );
}
function _(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function cr(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Kr(e) {
  return Gv(e, Gi);
}
function jc(e) {
  return Kr(e) !== null;
}
function Gv(e, n) {
  return (e.hasOwnProperty(n) && e[n]) || null;
}
function Wv(e) {
  let n = e?.[Gi] ?? null;
  return n || null;
}
function _c(e) {
  return e && e.hasOwnProperty(Hi) ? e[Hi] : null;
}
var Gi = q({ ɵprov: q }),
  Hi = q({ ɵinj: q }),
  S = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(n, t) {
      (this._desc = n),
        (this.ɵprov = void 0),
        typeof t == "number"
          ? (this.__NG_ELEMENT_ID__ = t)
          : t !== void 0 &&
            (this.ɵprov = _({
              token: this,
              providedIn: t.providedIn || "root",
              factory: t.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Hc(e) {
  return e && !!e.ɵproviders;
}
var Bc = q({ ɵcmp: q }),
  Vc = q({ ɵdir: q }),
  $c = q({ ɵpipe: q }),
  Uc = q({ ɵmod: q }),
  Zr = q({ ɵfac: q }),
  Sn = q({ __NG_ELEMENT_ID__: q }),
  Vf = q({ __NG_ENV_ID__: q });
function Wi(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Bi(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Wi(e);
}
var zc = q({ ngErrorCode: q }),
  zf = q({ ngErrorMessage: q }),
  Yr = q({ ngTokenPath: q });
function Gc(e, n) {
  return Gf("", -200, n);
}
function qi(e, n) {
  throw new w(-201, !1);
}
function qv(e, n) {
  e[Yr] ??= [];
  let t = e[Yr],
    r;
  typeof n == "object" && "multi" in n && n?.multi === !0
    ? (Uf(n.provide, "Token with multi: true should have a provide property"),
      (r = Bi(n.provide)))
    : (r = Bi(n)),
    t[0] !== r && e[Yr].unshift(r);
}
function Yv(e, n) {
  let t = e[Yr],
    r = e[zc],
    o = e[zf] || e.message;
  return (e.message = Qv(o, r, t, n)), e;
}
function Gf(e, n, t) {
  let r = new w(n, e);
  return (r[zc] = n), (r[zf] = e), t && (r[Yr] = t), r;
}
function Zv(e) {
  return e[zc];
}
function Qv(e, n, t = [], r = null) {
  let o = "";
  t && t.length > 1 && (o = ` Path: ${t.join(" -> ")}.`);
  let i = r ? ` Source: ${r}.` : "";
  return Xr(n, `${e}${i}${o}`);
}
var Ic;
function Wf() {
  return Ic;
}
function Ve(e) {
  let n = Ic;
  return (Ic = e), n;
}
function Wc(e, n, t) {
  let r = Kr(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (t & 8) return null;
  if (n !== void 0) return n;
  qi(e, "Injector");
}
var Xv = {},
  En = Xv,
  Sc = "__NG_DI_FLAG__",
  Mc = class {
    injector;
    constructor(n) {
      this.injector = n;
    }
    retrieve(n, t) {
      let r = bn(t) || 0;
      try {
        return this.injector.get(n, r & 8 ? null : En, r);
      } catch (o) {
        if (Yn(o)) return o;
        throw o;
      }
    }
  };
function Kv(e, n = 0) {
  let t = si();
  if (t === void 0) throw new w(-203, !1);
  if (t === null) return Wc(e, void 0, n);
  {
    let r = Jv(n),
      o = t.retrieve(e, r);
    if (Yn(o)) {
      if (r.optional) return null;
      throw o;
    }
    return o;
  }
}
function R(e, n = 0) {
  return (Wf() || Kv)(Fe(e), n);
}
function v(e, n) {
  return R(e, bn(n));
}
function bn(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function Jv(e) {
  return {
    optional: !!(e & 8),
    host: !!(e & 1),
    self: !!(e & 2),
    skipSelf: !!(e & 4),
  };
}
function Tc(e) {
  let n = [];
  for (let t = 0; t < e.length; t++) {
    let r = Fe(e[t]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new w(900, !1);
      let o,
        i = 0;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = ey(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      n.push(R(o, i));
    } else n.push(R(r));
  }
  return n;
}
function qc(e, n) {
  return (e[Sc] = n), (e.prototype[Sc] = n), e;
}
function ey(e) {
  return e[Sc];
}
function wn(e, n) {
  let t = e.hasOwnProperty(Zr);
  return t ? e[Zr] : null;
}
function qf(e, n, t) {
  if (e.length !== n.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = n[r];
    if ((t && ((o = t(o)), (i = t(i))), i !== o)) return !1;
  }
  return !0;
}
function Yf(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function Yi(e, n) {
  e.forEach((t) => (Array.isArray(t) ? Yi(t, n) : n(t)));
}
function Yc(e, n, t) {
  n >= e.length ? e.push(t) : e.splice(n, 0, t);
}
function Jr(e, n) {
  return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
}
function Zf(e, n, t, r) {
  let o = e.length;
  if (o == n) e.push(t, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = t);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > n; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[n] = t), (e[n + 1] = r);
  }
}
function Qf(e, n, t) {
  let r = lr(e, n);
  return r >= 0 ? (e[r | 1] = t) : ((r = ~r), Zf(e, r, n, t)), r;
}
function Zi(e, n) {
  let t = lr(e, n);
  if (t >= 0) return e[t | 1];
}
function lr(e, n) {
  return ty(e, n, 1);
}
function ty(e, n, t) {
  let r = 0,
    o = e.length >> t;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << t];
    if (n === s) return i << t;
    s > n ? (o = i) : (r = i + 1);
  }
  return ~(o << t);
}
var Mn = {},
  Qe = [],
  kt = new S(""),
  Zc = new S("", -1),
  Qc = new S(""),
  Qr = class {
    get(n, t = En) {
      if (t === En) {
        let o = Gf("", -201);
        throw ((o.name = "\u0275NotFound"), o);
      }
      return t;
    }
  };
function Xc(e) {
  return e[Uc] || null;
}
function Qt(e) {
  return e[Bc] || null;
}
function Kc(e) {
  return e[Vc] || null;
}
function Xf(e) {
  return e[$c] || null;
}
function Tn(e) {
  return { ɵproviders: e };
}
function Kf(e) {
  return Tn([{ provide: kt, multi: !0, useValue: e }]);
}
function Jf(...e) {
  return { ɵproviders: Jc(!0, e), ɵfromNgModule: !0 };
}
function Jc(e, ...n) {
  let t = [],
    r = new Set(),
    o,
    i = (s) => {
      t.push(s);
    };
  return (
    Yi(n, (s) => {
      let a = s;
      Vi(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && ep(o, i),
    t
  );
}
function ep(e, n) {
  for (let t = 0; t < e.length; t++) {
    let { ngModule: r, providers: o } = e[t];
    el(o, (i) => {
      n(i, r);
    });
  }
}
function Vi(e, n, t, r) {
  if (((e = Fe(e)), !e)) return !1;
  let o = null,
    i = _c(e),
    s = !i && Qt(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = _c(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) Vi(l, n, t, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        Yi(i.imports, (u) => {
          Vi(u, n, t, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && ep(l, n);
    }
    if (!a) {
      let l = wn(o) || (() => new o());
      n({ provide: o, useFactory: l, deps: Qe }, o),
        n({ provide: Qc, useValue: o, multi: !0 }, o),
        n({ provide: kt, useValue: () => R(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      el(c, (u) => {
        n(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function el(e, n) {
  for (let t of e)
    Hc(t) && (t = t.ɵproviders), Array.isArray(t) ? el(t, n) : n(t);
}
var ny = q({ provide: String, useValue: q });
function tp(e) {
  return e !== null && typeof e == "object" && ny in e;
}
function ry(e) {
  return !!(e && e.useExisting);
}
function oy(e) {
  return !!(e && e.useFactory);
}
function $i(e) {
  return typeof e == "function";
}
var eo = new S(""),
  ji = {},
  $f = {},
  wc;
function to() {
  return wc === void 0 && (wc = new Qr()), wc;
}
var De = class {},
  _n = class extends De {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(n, t, r, o) {
      super(),
        (this.parent = t),
        (this.source = r),
        (this.scopes = o),
        Oc(n, (s) => this.processProvider(s)),
        this.records.set(Zc, ar(void 0, this)),
        o.has("environment") && this.records.set(De, ar(void 0, this));
      let i = this.records.get(eo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Qc, Qe, { self: !0 })));
    }
    retrieve(n, t) {
      let r = bn(t) || 0;
      try {
        return this.get(n, En, r);
      } catch (o) {
        if (Yn(o)) return o;
        throw o;
      }
    }
    destroy() {
      qr(this), (this._destroyed = !0);
      let n = F(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let t = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of t) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          F(n);
      }
    }
    onDestroy(n) {
      return (
        qr(this), this._onDestroyHooks.push(n), () => this.removeOnDestroy(n)
      );
    }
    runInContext(n) {
      qr(this);
      let t = mt(this),
        r = Ve(void 0),
        o;
      try {
        return n();
      } finally {
        mt(t), Ve(r);
      }
    }
    get(n, t = En, r) {
      if ((qr(this), n.hasOwnProperty(Vf))) return n[Vf](this);
      let o = bn(r),
        i,
        s = mt(this),
        a = Ve(void 0);
      try {
        if (!(o & 4)) {
          let l = this.records.get(n);
          if (l === void 0) {
            let u = ly(n) && Kr(n);
            u && this.injectableDefInScope(u)
              ? (l = ar(xc(n), ji))
              : (l = null),
              this.records.set(n, l);
          }
          if (l != null) return this.hydrate(n, l, o);
        }
        let c = o & 2 ? to() : this.parent;
        return (t = o & 8 && t === En ? null : t), c.get(n, t);
      } catch (c) {
        let l = Zv(c);
        throw l === -200 || l === -201 ? new w(l, null) : c;
      } finally {
        Ve(a), mt(s);
      }
    }
    resolveInjectorInitializers() {
      let n = F(null),
        t = mt(this),
        r = Ve(void 0),
        o;
      try {
        let i = this.get(kt, Qe, { self: !0 });
        for (let s of i) s();
      } finally {
        mt(t), Ve(r), F(n);
      }
    }
    toString() {
      let n = [],
        t = this.records;
      for (let r of t.keys()) n.push(Pt(r));
      return `R3Injector[${n.join(", ")}]`;
    }
    processProvider(n) {
      n = Fe(n);
      let t = $i(n) ? n : Fe(n && n.provide),
        r = sy(n);
      if (!$i(n) && n.multi === !0) {
        let o = this.records.get(t);
        o ||
          ((o = ar(void 0, ji, !0)),
          (o.factory = () => Tc(o.multi)),
          this.records.set(t, o)),
          (t = n),
          o.multi.push(n);
      }
      this.records.set(t, r);
    }
    hydrate(n, t, r) {
      let o = F(null);
      try {
        if (t.value === $f) throw Gc(Pt(n));
        return (
          t.value === ji && ((t.value = $f), (t.value = t.factory(void 0, r))),
          typeof t.value == "object" &&
            t.value &&
            cy(t.value) &&
            this._ngOnDestroyHooks.add(t.value),
          t.value
        );
      } finally {
        F(o);
      }
    }
    injectableDefInScope(n) {
      if (!n.providedIn) return !1;
      let t = Fe(n.providedIn);
      return typeof t == "string"
        ? t === "any" || this.scopes.has(t)
        : this.injectorDefTypes.has(t);
    }
    removeOnDestroy(n) {
      let t = this._onDestroyHooks.indexOf(n);
      t !== -1 && this._onDestroyHooks.splice(t, 1);
    }
  };
function xc(e) {
  let n = Kr(e),
    t = n !== null ? n.factory : wn(e);
  if (t !== null) return t;
  if (e instanceof S) throw new w(204, !1);
  if (e instanceof Function) return iy(e);
  throw new w(204, !1);
}
function iy(e) {
  if (e.length > 0) throw new w(204, !1);
  let t = Wv(e);
  return t !== null ? () => t.factory(e) : () => new e();
}
function sy(e) {
  if (tp(e)) return ar(void 0, e.useValue);
  {
    let n = np(e);
    return ar(n, ji);
  }
}
function np(e, n, t) {
  let r;
  if ($i(e)) {
    let o = Fe(e);
    return wn(o) || xc(o);
  } else if (tp(e)) r = () => Fe(e.useValue);
  else if (oy(e)) r = () => e.useFactory(...Tc(e.deps || []));
  else if (ry(e))
    r = (o, i) => R(Fe(e.useExisting), i !== void 0 && i & 8 ? 8 : void 0);
  else {
    let o = Fe(e && (e.useClass || e.provide));
    if (ay(e)) r = () => new o(...Tc(e.deps));
    else return wn(o) || xc(o);
  }
  return r;
}
function qr(e) {
  if (e.destroyed) throw new w(205, !1);
}
function ar(e, n, t = !1) {
  return { factory: e, value: n, multi: t ? [] : void 0 };
}
function ay(e) {
  return !!e.deps;
}
function cy(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function ly(e) {
  return (
    typeof e == "function" ||
    (typeof e == "object" && e.ngMetadataName === "InjectionToken")
  );
}
function Oc(e, n) {
  for (let t of e)
    Array.isArray(t) ? Oc(t, n) : t && Hc(t) ? Oc(t.ɵproviders, n) : n(t);
}
function Te(e, n) {
  let t;
  e instanceof _n ? (qr(e), (t = e)) : (t = new Mc(e));
  let r,
    o = mt(t),
    i = Ve(void 0);
  try {
    return n();
  } finally {
    mt(o), Ve(i);
  }
}
function rp() {
  return Wf() !== void 0 || si() != null;
}
var st = 0,
  I = 1,
  N = 2,
  he = 3,
  Xe = 4,
  Ke = 5,
  ur = 6,
  dr = 7,
  ie = 8,
  xn = 9,
  Ct = 10,
  se = 11,
  fr = 12,
  tl = 13,
  On = 14,
  $e = 15,
  Xt = 16,
  Rn = 17,
  Dt = 18,
  no = 19,
  nl = 20,
  At = 21,
  Qi = 22,
  ro = 23,
  Ue = 24,
  Xi = 25,
  de = 26,
  op = 1,
  rl = 6,
  Kt = 7,
  oo = 8,
  Nn = 9,
  me = 10;
function Et(e) {
  return Array.isArray(e) && typeof e[op] == "object";
}
function at(e) {
  return Array.isArray(e) && e[op] === !0;
}
function ol(e) {
  return (e.flags & 4) !== 0;
}
function Jt(e) {
  return e.componentOffset > -1;
}
function pr(e) {
  return (e.flags & 1) === 1;
}
function An(e) {
  return !!e.template;
}
function hr(e) {
  return (e[N] & 512) !== 0;
}
function Pn(e) {
  return (e[N] & 256) === 256;
}
var ip = "svg",
  sp = "math";
function Je(e) {
  for (; Array.isArray(e); ) e = e[st];
  return e;
}
function il(e, n) {
  return Je(n[e]);
}
function bt(e, n) {
  return Je(n[e.index]);
}
function io(e, n) {
  return e.data[n];
}
function ap(e, n) {
  return e[n];
}
function et(e, n) {
  let t = n[e];
  return Et(t) ? t : t[st];
}
function cp(e) {
  return (e[N] & 4) === 4;
}
function Ki(e) {
  return (e[N] & 128) === 128;
}
function lp(e) {
  return at(e[he]);
}
function tt(e, n) {
  return n == null ? null : e[n];
}
function sl(e) {
  e[Rn] = 0;
}
function al(e) {
  e[N] & 1024 || ((e[N] |= 1024), Ki(e) && ao(e));
}
function up(e, n) {
  for (; e > 0; ) (n = n[On]), e--;
  return n;
}
function so(e) {
  return !!(e[N] & 9216 || e[Ue]?.dirty);
}
function Ji(e) {
  e[Ct].changeDetectionScheduler?.notify(8),
    e[N] & 64 && (e[N] |= 1024),
    so(e) && ao(e);
}
function ao(e) {
  e[Ct].changeDetectionScheduler?.notify(0);
  let n = Zt(e);
  for (; n !== null && !(n[N] & 8192 || ((n[N] |= 8192), !Ki(n))); ) n = Zt(n);
}
function cl(e, n) {
  if (Pn(e)) throw new w(911, !1);
  e[At] === null && (e[At] = []), e[At].push(n);
}
function dp(e, n) {
  if (e[At] === null) return;
  let t = e[At].indexOf(n);
  t !== -1 && e[At].splice(t, 1);
}
function Zt(e) {
  let n = e[he];
  return at(n) ? n[he] : n;
}
function ll(e) {
  return (e[dr] ??= []);
}
function ul(e) {
  return (e.cleanup ??= []);
}
function fp(e, n, t, r) {
  let o = ll(n);
  o.push(t), e.firstCreatePass && ul(e).push(r, o.length - 1);
}
var L = { lFrame: Sp(null), bindingsEnabled: !0, skipHydrationRootTNode: null },
  co = (function (e) {
    return (
      (e[(e.Off = 0)] = "Off"),
      (e[(e.Exhaustive = 1)] = "Exhaustive"),
      (e[(e.OnlyDirtyViews = 2)] = "OnlyDirtyViews"),
      e
    );
  })(co || {}),
  uy = 0,
  Rc = !1;
function pp() {
  return L.lFrame.elementDepthCount;
}
function hp() {
  L.lFrame.elementDepthCount++;
}
function dl() {
  L.lFrame.elementDepthCount--;
}
function es() {
  return L.bindingsEnabled;
}
function gp() {
  return L.skipHydrationRootTNode !== null;
}
function fl(e) {
  return L.skipHydrationRootTNode === e;
}
function pl() {
  L.skipHydrationRootTNode = null;
}
function V() {
  return L.lFrame.lView;
}
function Le() {
  return L.lFrame.tView;
}
function J(e) {
  return (L.lFrame.contextLView = e), e[ie];
}
function ee(e) {
  return (L.lFrame.contextLView = null), e;
}
function je() {
  let e = hl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function hl() {
  return L.lFrame.currentTNode;
}
function mp() {
  let e = L.lFrame,
    n = e.currentTNode;
  return e.isParent ? n : n.parent;
}
function gr(e, n) {
  let t = L.lFrame;
  (t.currentTNode = e), (t.isParent = n);
}
function gl() {
  return L.lFrame.isParent;
}
function vp() {
  L.lFrame.isParent = !1;
}
function yp() {
  return L.lFrame.contextLView;
}
function ml(e) {
  Lc("Must never be called in production mode"), (uy = e);
}
function vl() {
  return Rc;
}
function yl(e) {
  let n = Rc;
  return (Rc = e), n;
}
function ts() {
  let e = L.lFrame,
    n = e.bindingRootIndex;
  return n === -1 && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n;
}
function Cp(e) {
  return (L.lFrame.bindingIndex = e);
}
function lo() {
  return L.lFrame.bindingIndex++;
}
function Dp(e) {
  let n = L.lFrame,
    t = n.bindingIndex;
  return (n.bindingIndex = n.bindingIndex + e), t;
}
function Ep() {
  return L.lFrame.inI18n;
}
function bp(e, n) {
  let t = L.lFrame;
  (t.bindingIndex = t.bindingRootIndex = e), ns(n);
}
function wp() {
  return L.lFrame.currentDirectiveIndex;
}
function ns(e) {
  L.lFrame.currentDirectiveIndex = e;
}
function _p(e) {
  let n = L.lFrame.currentDirectiveIndex;
  return n === -1 ? null : e[n];
}
function Cl() {
  return L.lFrame.currentQueryIndex;
}
function rs(e) {
  L.lFrame.currentQueryIndex = e;
}
function dy(e) {
  let n = e[I];
  return n.type === 2 ? n.declTNode : n.type === 1 ? e[Ke] : null;
}
function Dl(e, n, t) {
  if (t & 4) {
    let o = n,
      i = e;
    for (; (o = o.parent), o === null && !(t & 1); )
      if (((o = dy(i)), o === null || ((i = i[On]), o.type & 10))) break;
    if (o === null) return !1;
    (n = o), (e = i);
  }
  let r = (L.lFrame = Ip());
  return (r.currentTNode = n), (r.lView = e), !0;
}
function os(e) {
  let n = Ip(),
    t = e[I];
  (L.lFrame = n),
    (n.currentTNode = t.firstChild),
    (n.lView = e),
    (n.tView = t),
    (n.contextLView = e),
    (n.bindingIndex = t.bindingStartIndex),
    (n.inI18n = !1);
}
function Ip() {
  let e = L.lFrame,
    n = e === null ? null : e.child;
  return n === null ? Sp(e) : n;
}
function Sp(e) {
  let n = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = n), n;
}
function Mp() {
  let e = L.lFrame;
  return (L.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var El = Mp;
function is() {
  let e = Mp();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Tp(e) {
  return (L.lFrame.contextLView = up(e, L.lFrame.contextLView))[ie];
}
function en() {
  return L.lFrame.selectedIndex;
}
function tn(e) {
  L.lFrame.selectedIndex = e;
}
function xp() {
  let e = L.lFrame;
  return io(e.tView, e.selectedIndex);
}
function Op() {
  return L.lFrame.currentNamespace;
}
var Rp = !0;
function ss() {
  return Rp;
}
function uo(e) {
  Rp = e;
}
function Nc(e, n = null, t = null, r) {
  let o = bl(e, n, t, r);
  return o.resolveInjectorInitializers(), o;
}
function bl(e, n = null, t = null, r, o = new Set()) {
  let i = [t || Qe, Jf(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : Pt(e))),
    new _n(i, n || to(), r || null, o)
  );
}
var vt = class e {
    static THROW_IF_NOT_FOUND = En;
    static NULL = new Qr();
    static create(n, t) {
      if (Array.isArray(n)) return Nc({ name: "" }, t, n, "");
      {
        let r = n.name ?? "";
        return Nc({ name: r }, n.parent, n.providers, r);
      }
    }
    static ɵprov = _({ token: e, providedIn: "any", factory: () => R(Zc) });
    static __NG_ELEMENT_ID__ = -1;
  },
  ve = new S(""),
  kn = (() => {
    class e {
      static __NG_ELEMENT_ID__ = fy;
      static __NG_ENV_ID__ = (t) => t;
    }
    return e;
  })(),
  Ac = class extends kn {
    _lView;
    constructor(n) {
      super(), (this._lView = n);
    }
    get destroyed() {
      return Pn(this._lView);
    }
    onDestroy(n) {
      let t = this._lView;
      return cl(t, n), () => dp(t, n);
    }
  };
function fy() {
  return new Ac(V());
}
var yt = class {
    _console = console;
    handleError(n) {
      this._console.error("ERROR", n);
    }
  },
  ze = new S("", {
    providedIn: "root",
    factory: () => {
      let e = v(De),
        n;
      return (t) => {
        e.destroyed && !n
          ? setTimeout(() => {
              throw t;
            })
          : ((n ??= e.get(yt)), n.handleError(t));
      };
    },
  }),
  Np = { provide: kt, useValue: () => void v(yt), multi: !0 },
  py = new S("", {
    providedIn: "root",
    factory: () => {
      let e = v(ve).defaultView;
      if (!e) return;
      let n = v(ze),
        t = (i) => {
          n(i.reason), i.preventDefault();
        },
        r = (i) => {
          i.error ? n(i.error) : n(new Error(i.message, { cause: i })),
            i.preventDefault();
        },
        o = () => {
          e.addEventListener("unhandledrejection", t),
            e.addEventListener("error", r);
        };
      typeof Zone < "u" ? Zone.root.run(o) : o(),
        v(kn).onDestroy(() => {
          e.removeEventListener("error", r),
            e.removeEventListener("unhandledrejection", t);
        });
    },
  });
function wl() {
  return Tn([Kf(() => void v(py))]);
}
function fo(e, n) {
  let [t, r, o] = ic(e, n?.equal),
    i = t,
    s = i[Ot];
  return (i.set = r), (i.update = o), (i.asReadonly = Ap.bind(i)), i;
}
function Ap() {
  let e = this[Ot];
  if (e.readonlyFn === void 0) {
    let n = () => this();
    (n[Ot] = e), (e.readonlyFn = n);
  }
  return e.readonlyFn;
}
var In = class {},
  po = new S("", { providedIn: "root", factory: () => !1 });
var _l = new S(""),
  Il = new S("");
var Ft = (() => {
  class e {
    taskId = 0;
    pendingTasks = new Set();
    destroyed = !1;
    pendingTask = new re(!1);
    get hasPendingTasks() {
      return this.destroyed ? !1 : this.pendingTask.value;
    }
    get hasPendingTasksObservable() {
      return this.destroyed
        ? new G((t) => {
            t.next(!1), t.complete();
          })
        : this.pendingTask;
    }
    add() {
      !this.hasPendingTasks && !this.destroyed && this.pendingTask.next(!0);
      let t = this.taskId++;
      return this.pendingTasks.add(t), t;
    }
    has(t) {
      return this.pendingTasks.has(t);
    }
    remove(t) {
      this.pendingTasks.delete(t),
        this.pendingTasks.size === 0 &&
          this.hasPendingTasks &&
          this.pendingTask.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this.hasPendingTasks && this.pendingTask.next(!1),
        (this.destroyed = !0),
        this.pendingTask.unsubscribe();
    }
    static ɵprov = _({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
function ho(...e) {}
var Sl = (() => {
    class e {
      static ɵprov = _({
        token: e,
        providedIn: "root",
        factory: () => new Pc(),
      });
    }
    return e;
  })(),
  Pc = class {
    dirtyEffectCount = 0;
    queues = new Map();
    add(n) {
      this.enqueue(n), this.schedule(n);
    }
    schedule(n) {
      n.dirty && this.dirtyEffectCount++;
    }
    remove(n) {
      let t = n.zone,
        r = this.queues.get(t);
      r.has(n) && (r.delete(n), n.dirty && this.dirtyEffectCount--);
    }
    enqueue(n) {
      let t = n.zone;
      this.queues.has(t) || this.queues.set(t, new Set());
      let r = this.queues.get(t);
      r.has(n) || r.add(n);
    }
    flush() {
      for (; this.dirtyEffectCount > 0; ) {
        let n = !1;
        for (let [t, r] of this.queues)
          t === null
            ? (n ||= this.flushQueue(r))
            : (n ||= t.run(() => this.flushQueue(r)));
        n || (this.dirtyEffectCount = 0);
      }
    }
    flushQueue(n) {
      let t = !1;
      for (let r of n) r.dirty && (this.dirtyEffectCount--, (t = !0), r.run());
      return t;
    }
  };
function Er(e) {
  return { toString: e }.toString();
}
var as = "__parameters__";
function Iy(e) {
  return function (...t) {
    if (e) {
      let r = e(...t);
      for (let o in r) this[o] = r[o];
    }
  };
}
function uh(e, n, t) {
  return Er(() => {
    let r = Iy(n);
    function o(...i) {
      if (this instanceof o) return r.apply(this, i), this;
      let s = new o(...i);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(as)
          ? c[as]
          : Object.defineProperty(c, as, { value: [] })[as];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), c;
      }
    }
    return (o.prototype.ngMetadataName = e), (o.annotationCls = o), o;
  });
}
var lu = qc(uh("Optional"), 8);
var uu = qc(uh("SkipSelf"), 4);
function Sy(e) {
  return typeof e == "function";
}
var ps = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(n, t, r) {
    (this.previousValue = n), (this.currentValue = t), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function dh(e, n, t, r) {
  n !== null ? n.applyValueToInputSignal(n, r) : (e[t] = r);
}
var sn = (() => {
  let e = () => fh;
  return (e.ngInherit = !0), e;
})();
function fh(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Ty), My;
}
function My() {
  let e = hh(this),
    n = e?.current;
  if (n) {
    let t = e.previous;
    if (t === Mn) e.previous = n;
    else for (let r in n) t[r] = n[r];
    (e.current = null), this.ngOnChanges(n);
  }
}
function Ty(e, n, t, r, o) {
  let i = this.declaredInputs[r],
    s = hh(e) || xy(e, { previous: Mn, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  (a[i] = new ps(l && l.currentValue, t, c === Mn)), dh(e, n, o, t);
}
var ph = "__ngSimpleChanges__";
function hh(e) {
  return e[ph] || null;
}
function xy(e, n) {
  return (e[ph] = n);
}
var Pp = [];
var X = function (e, n = null, t) {
  for (let r = 0; r < Pp.length; r++) {
    let o = Pp[r];
    o(e, n, t);
  }
};
function Oy(e, n, t) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = n.type.prototype;
  if (r) {
    let s = fh(n);
    (t.preOrderHooks ??= []).push(e, s),
      (t.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (t.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((t.preOrderHooks ??= []).push(e, i),
      (t.preOrderCheckHooks ??= []).push(e, i));
}
function gh(e, n) {
  for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
    let i = e.data[t].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    s && (e.contentHooks ??= []).push(-t, s),
      a &&
        ((e.contentHooks ??= []).push(t, a),
        (e.contentCheckHooks ??= []).push(t, a)),
      c && (e.viewHooks ??= []).push(-t, c),
      l &&
        ((e.viewHooks ??= []).push(t, l), (e.viewCheckHooks ??= []).push(t, l)),
      u != null && (e.destroyHooks ??= []).push(t, u);
  }
}
function ls(e, n, t) {
  mh(e, n, 3, t);
}
function us(e, n, t, r) {
  (e[N] & 3) === t && mh(e, n, t, r);
}
function Ml(e, n) {
  let t = e[N];
  (t & 3) === n && ((t &= 16383), (t += 1), (e[N] = t));
}
function mh(e, n, t, r) {
  let o = r !== void 0 ? e[Rn] & 65535 : 0,
    i = r ?? -1,
    s = n.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof n[c + 1] == "number") {
      if (((a = n[c]), r != null && a >= r)) break;
    } else
      n[c] < 0 && (e[Rn] += 65536),
        (a < i || i == -1) &&
          (Ry(e, t, n, c), (e[Rn] = (e[Rn] & 4294901760) + c + 2)),
        c++;
}
function kp(e, n) {
  X(4, e, n);
  let t = F(null);
  try {
    n.call(e);
  } finally {
    F(t), X(5, e, n);
  }
}
function Ry(e, n, t, r) {
  let o = t[r] < 0,
    i = t[r + 1],
    s = o ? -t[r] : t[r],
    a = e[s];
  o
    ? e[N] >> 14 < e[Rn] >> 16 &&
      (e[N] & 3) === n &&
      ((e[N] += 16384), kp(a, i))
    : kp(a, i);
}
var vr = -1,
  vo = class {
    factory;
    name;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(n, t, r, o) {
      (this.factory = n),
        (this.name = o),
        (this.canSeeViewProviders = t),
        (this.injectImpl = r);
    }
  };
function Ny(e) {
  return (e.flags & 8) !== 0;
}
function Ay(e) {
  return (e.flags & 16) !== 0;
}
function Py(e, n, t) {
  let r = 0;
  for (; r < t.length; ) {
    let o = t[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = t[r++],
        s = t[r++],
        a = t[r++];
      e.setAttribute(n, s, a, i);
    } else {
      let i = o,
        s = t[++r];
      Fy(i) ? e.setProperty(n, i, s) : e.setAttribute(n, i, s), r++;
    }
  }
  return r;
}
function ky(e) {
  return e === 3 || e === 4 || e === 6;
}
function Fy(e) {
  return e.charCodeAt(0) === 64;
}
function Ns(e, n) {
  if (!(n === null || n.length === 0))
    if (e === null || e.length === 0) e = n.slice();
    else {
      let t = -1;
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        typeof o == "number"
          ? (t = o)
          : t === 0 ||
            (t === -1 || t === 2
              ? Fp(e, t, o, null, n[++r])
              : Fp(e, t, o, null, null));
      }
    }
  return e;
}
function Fp(e, n, t, r, o) {
  let i = 0,
    s = e.length;
  if (n === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === n) {
          s = -1;
          break;
        } else if (a > n) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === t) {
      o !== null && (e[i + 1] = o);
      return;
    }
    i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, n), (i = s + 1)),
    e.splice(i++, 0, t),
    o !== null && e.splice(i++, 0, o);
}
function vh(e) {
  return e !== vr;
}
function hs(e) {
  return e & 32767;
}
function Ly(e) {
  return e >> 16;
}
function gs(e, n) {
  let t = Ly(e),
    r = n;
  for (; t > 0; ) (r = r[On]), t--;
  return r;
}
var kl = !0;
function Lp(e) {
  let n = kl;
  return (kl = e), n;
}
var jy = 256,
  yh = jy - 1,
  Ch = 5,
  Hy = 0,
  wt = {};
function By(e, n, t) {
  let r;
  typeof t == "string"
    ? (r = t.charCodeAt(0) || 0)
    : t.hasOwnProperty(Sn) && (r = t[Sn]),
    r == null && (r = t[Sn] = Hy++);
  let o = r & yh,
    i = 1 << o;
  n.data[e + (o >> Ch)] |= i;
}
function Dh(e, n) {
  let t = Eh(e, n);
  if (t !== -1) return t;
  let r = n[I];
  r.firstCreatePass &&
    ((e.injectorIndex = n.length),
    Tl(r.data, e),
    Tl(n, null),
    Tl(r.blueprint, null));
  let o = du(e, n),
    i = e.injectorIndex;
  if (vh(o)) {
    let s = hs(o),
      a = gs(o, n),
      c = a[I].data;
    for (let l = 0; l < 8; l++) n[i + l] = a[s + l] | c[s + l];
  }
  return (n[i + 8] = o), i;
}
function Tl(e, n) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
}
function Eh(e, n) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    n[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function du(e, n) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let t = 0,
    r = null,
    o = n;
  for (; o !== null; ) {
    if (((r = Sh(o)), r === null)) return vr;
    if ((t++, (o = o[On]), r.injectorIndex !== -1))
      return r.injectorIndex | (t << 16);
  }
  return vr;
}
function Vy(e, n, t) {
  By(e, n, t);
}
function bh(e, n, t) {
  if (t & 8 || e !== void 0) return e;
  qi(n, "NodeInjector");
}
function wh(e, n, t, r) {
  if ((t & 8 && r === void 0 && (r = null), (t & 3) === 0)) {
    let o = e[xn],
      i = Ve(void 0);
    try {
      return o ? o.get(n, r, t & 8) : Wc(n, r, t & 8);
    } finally {
      Ve(i);
    }
  }
  return bh(r, n, t);
}
function _h(e, n, t, r = 0, o) {
  if (e !== null) {
    if (n[N] & 2048 && !(r & 2)) {
      let s = Gy(e, n, t, r, wt);
      if (s !== wt) return s;
    }
    let i = Ih(e, n, t, r, wt);
    if (i !== wt) return i;
  }
  return wh(n, t, r, o);
}
function Ih(e, n, t, r, o) {
  let i = Uy(t);
  if (typeof i == "function") {
    if (!Dl(n, e, r)) return r & 1 ? bh(o, t, r) : wh(n, t, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & 8))) qi(t);
      else return s;
    } finally {
      El();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Eh(e, n),
      c = vr,
      l = r & 1 ? n[$e][Ke] : null;
    for (
      (a === -1 || r & 4) &&
      ((c = a === -1 ? du(e, n) : n[a + 8]),
      c === vr || !Hp(r, !1)
        ? (a = -1)
        : ((s = n[I]), (a = hs(c)), (n = gs(c, n))));
      a !== -1;

    ) {
      let u = n[I];
      if (jp(i, a, u.data)) {
        let d = $y(a, n, t, s, r, l);
        if (d !== wt) return d;
      }
      (c = n[a + 8]),
        c !== vr && Hp(r, n[I].data[a + 8] === l) && jp(i, a, n)
          ? ((s = u), (a = hs(c)), (n = gs(c, n)))
          : (a = -1);
    }
  }
  return o;
}
function $y(e, n, t, r, o, i) {
  let s = n[I],
    a = s.data[e + 8],
    c = r == null ? Jt(a) && kl : r != s && (a.type & 3) !== 0,
    l = o & 1 && i === a,
    u = ds(a, s, t, c, l);
  return u !== null ? ms(n, s, u, a, o) : wt;
}
function ds(e, n, t, r, o) {
  let i = e.providerIndexes,
    s = n.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    p = o ? a + u : l;
  for (let f = d; f < p; f++) {
    let D = s[f];
    if ((f < c && t === D) || (f >= c && D.type === t)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && An(f) && f.type === t) return c;
  }
  return null;
}
function ms(e, n, t, r, o) {
  let i = e[t],
    s = n.data;
  if (i instanceof vo) {
    let a = i;
    if (a.resolving) {
      let f = Bi(s[t]);
      throw Gc(f);
    }
    let c = Lp(a.canSeeViewProviders);
    a.resolving = !0;
    let l = s[t].type || s[t],
      u,
      d = a.injectImpl ? Ve(a.injectImpl) : null,
      p = Dl(e, r, 0);
    try {
      (i = e[t] = a.factory(void 0, o, s, e, r)),
        n.firstCreatePass && t >= r.directiveStart && Oy(t, s[t], n);
    } finally {
      d !== null && Ve(d), Lp(c), (a.resolving = !1), El();
    }
  }
  return i;
}
function Uy(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let n = e.hasOwnProperty(Sn) ? e[Sn] : void 0;
  return typeof n == "number" ? (n >= 0 ? n & yh : zy) : n;
}
function jp(e, n, t) {
  let r = 1 << e;
  return !!(t[n + (e >> Ch)] & r);
}
function Hp(e, n) {
  return !(e & 2) && !(e & 1 && n);
}
var Fn = class {
  _tNode;
  _lView;
  constructor(n, t) {
    (this._tNode = n), (this._lView = t);
  }
  get(n, t, r) {
    return _h(this._tNode, this._lView, n, bn(r), t);
  }
};
function zy() {
  return new Fn(je(), V());
}
function As(e) {
  return Er(() => {
    let n = e.prototype.constructor,
      t = n[Zr] || Fl(n),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[Zr] || Fl(o);
      if (i && i !== t) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function Fl(e) {
  return Fc(e)
    ? () => {
        let n = Fl(Fe(e));
        return n && n();
      }
    : wn(e);
}
function Gy(e, n, t, r, o) {
  let i = e,
    s = n;
  for (; i !== null && s !== null && s[N] & 2048 && !hr(s); ) {
    let a = Ih(i, s, t, r | 2, wt);
    if (a !== wt) return a;
    let c = i.parent;
    if (!c) {
      let l = s[nl];
      if (l) {
        let u = l.get(t, wt, r);
        if (u !== wt) return u;
      }
      (c = Sh(s)), (s = s[On]);
    }
    i = c;
  }
  return o;
}
function Sh(e) {
  let n = e[I],
    t = n.type;
  return t === 2 ? n.declTNode : t === 1 ? e[Ke] : null;
}
function Wy() {
  return br(je(), V());
}
function br(e, n) {
  return new an(bt(e, n));
}
var an = (() => {
  class e {
    nativeElement;
    constructor(t) {
      this.nativeElement = t;
    }
    static __NG_ELEMENT_ID__ = Wy;
  }
  return e;
})();
function qy(e) {
  return e instanceof an ? e.nativeElement : e;
}
function Yy() {
  return this._results[Symbol.iterator]();
}
var vs = class {
  _emitDistinctChangesOnly;
  dirty = !0;
  _onDirty = void 0;
  _results = [];
  _changesDetected = !1;
  _changes = void 0;
  length = 0;
  first = void 0;
  last = void 0;
  get changes() {
    return (this._changes ??= new ce());
  }
  constructor(n = !1) {
    this._emitDistinctChangesOnly = n;
  }
  get(n) {
    return this._results[n];
  }
  map(n) {
    return this._results.map(n);
  }
  filter(n) {
    return this._results.filter(n);
  }
  find(n) {
    return this._results.find(n);
  }
  reduce(n, t) {
    return this._results.reduce(n, t);
  }
  forEach(n) {
    this._results.forEach(n);
  }
  some(n) {
    return this._results.some(n);
  }
  toArray() {
    return this._results.slice();
  }
  toString() {
    return this._results.toString();
  }
  reset(n, t) {
    this.dirty = !1;
    let r = Yf(n);
    (this._changesDetected = !qf(this._results, r, t)) &&
      ((this._results = r),
      (this.length = r.length),
      (this.last = r[this.length - 1]),
      (this.first = r[0]));
  }
  notifyOnChanges() {
    this._changes !== void 0 &&
      (this._changesDetected || !this._emitDistinctChangesOnly) &&
      this._changes.next(this);
  }
  onDirty(n) {
    this._onDirty = n;
  }
  setDirty() {
    (this.dirty = !0), this._onDirty?.();
  }
  destroy() {
    this._changes !== void 0 &&
      (this._changes.complete(), this._changes.unsubscribe());
  }
  [Symbol.iterator] = Yy;
};
function Mh(e) {
  return (e.flags & 128) === 128;
}
var fu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(fu || {}),
  Th = new Map(),
  Zy = 0;
function Qy() {
  return Zy++;
}
function Xy(e) {
  Th.set(e[no], e);
}
function Ll(e) {
  Th.delete(e[no]);
}
var Bp = "__ngContext__";
function yr(e, n) {
  Et(n) ? ((e[Bp] = n[no]), Xy(n)) : (e[Bp] = n);
}
function xh(e) {
  return Rh(e[fr]);
}
function Oh(e) {
  return Rh(e[Xe]);
}
function Rh(e) {
  for (; e !== null && !at(e); ) e = e[Xe];
  return e;
}
var jl;
function pu(e) {
  jl = e;
}
function Nh() {
  if (jl !== void 0) return jl;
  if (typeof document < "u") return document;
  throw new w(210, !1);
}
var Ps = new S("", { providedIn: "root", factory: () => Ky }),
  Ky = "ng",
  ks = new S(""),
  wr = new S("", { providedIn: "platform", factory: () => "unknown" });
var Fs = new S("", {
  providedIn: "root",
  factory: () =>
    Nh().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Jy = "h",
  e0 = "b";
var Ah = "r";
var Ph = "di";
var kh = !1,
  Fh = new S("", { providedIn: "root", factory: () => kh });
var t0 = (e, n, t, r) => {};
function n0(e, n, t, r) {
  t0(e, n, t, r);
}
function hu(e) {
  return (e.flags & 32) === 32;
}
var r0 = () => null;
function Lh(e, n, t = !1) {
  return r0(e, n, t);
}
function jh(e, n) {
  let t = e.contentQueries;
  if (t !== null) {
    let r = F(null);
    try {
      for (let o = 0; o < t.length; o += 2) {
        let i = t[o],
          s = t[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          rs(i), a.contentQueries(2, n[s], s);
        }
      }
    } finally {
      F(r);
    }
  }
}
function Hl(e, n, t) {
  rs(0);
  let r = F(null);
  try {
    n(e, t);
  } finally {
    F(r);
  }
}
function gu(e, n, t) {
  if (ol(n)) {
    let r = F(null);
    try {
      let o = n.directiveStart,
        i = n.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = t[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      F(r);
    }
  }
}
var Lt = (function (e) {
  return (
    (e[(e.Emulated = 0)] = "Emulated"),
    (e[(e.None = 2)] = "None"),
    (e[(e.ShadowDom = 3)] = "ShadowDom"),
    e
  );
})(Lt || {});
var ys = class {
  changingThisBreaksApplicationSecurity;
  constructor(n) {
    this.changingThisBreaksApplicationSecurity = n;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ui})`;
  }
};
function mu(e) {
  return e instanceof ys ? e.changingThisBreaksApplicationSecurity : e;
}
function Hh(e, n) {
  let t = Bh(e);
  if (t != null && t !== n) {
    if (t === "ResourceURL" && n === "URL") return !0;
    throw new Error(`Required a safe ${n}, got a ${t} (see ${Ui})`);
  }
  return t === n;
}
function Bh(e) {
  return (e instanceof ys && e.getTypeName()) || null;
}
var o0 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Vh(e) {
  return (e = String(e)), e.match(o0) ? e : "unsafe:" + e;
}
var vu = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(vu || {});
function nt(e) {
  let n = i0();
  return n ? n.sanitize(vu.URL, e) || "" : Hh(e, "URL") ? mu(e) : Vh(Wi(e));
}
function i0() {
  let e = V();
  return e && e[Ct].sanitizer;
}
var s0 = /^>|^->|<!--|-->|--!>|<!-$/g,
  a0 = /(<|>)/g,
  c0 = "\u200B$1\u200B";
function l0(e) {
  return e.replace(s0, (n) => n.replace(a0, c0));
}
function we(e) {
  return e.ownerDocument.defaultView;
}
function ut(e) {
  return e.ownerDocument;
}
function $h(e) {
  return e instanceof Function ? e() : e;
}
function u0(e, n, t) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(n, t);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = n.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    t = o + 1;
  }
}
var Uh = "ng-template";
function d0(e, n, t, r) {
  let o = 0;
  if (r) {
    for (; o < n.length && typeof n[o] == "string"; o += 2)
      if (n[o] === "class" && u0(n[o + 1].toLowerCase(), t, 0) !== -1)
        return !0;
  } else if (yu(e)) return !1;
  if (((o = n.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < n.length && typeof (i = n[o]) == "string"; )
      if (i.toLowerCase() === t) return !0;
  }
  return !1;
}
function yu(e) {
  return e.type === 4 && e.value !== Uh;
}
function f0(e, n, t) {
  let r = e.type === 4 && !t ? Uh : e.value;
  return n === r;
}
function p0(e, n, t) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? m0(o) : 0,
    s = !1;
  for (let a = 0; a < n.length; a++) {
    let c = n[a];
    if (typeof c == "number") {
      if (!s && !ct(r) && !ct(c)) return !1;
      if (s && ct(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !f0(e, c, t)) || (c === "" && n.length === 1))
        ) {
          if (ct(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !d0(e, o, c, t)) {
          if (ct(r)) return !1;
          s = !0;
        }
      } else {
        let l = n[++a],
          u = h0(c, o, yu(e), t);
        if (u === -1) {
          if (ct(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (ct(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return ct(r) || s;
}
function ct(e) {
  return (e & 1) === 0;
}
function h0(e, n, t, r) {
  if (n === null) return -1;
  let o = 0;
  if (r || !t) {
    let i = !1;
    for (; o < n.length; ) {
      let s = n[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = n[++o];
        for (; typeof a == "string"; ) a = n[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return v0(n, e);
}
function g0(e, n, t = !1) {
  for (let r = 0; r < n.length; r++) if (p0(e, n[r], t)) return !0;
  return !1;
}
function m0(e) {
  for (let n = 0; n < e.length; n++) {
    let t = e[n];
    if (ky(t)) return n;
  }
  return e.length;
}
function v0(e, n) {
  let t = e.indexOf(4);
  if (t > -1)
    for (t++; t < e.length; ) {
      let r = e[t];
      if (typeof r == "number") return -1;
      if (r === n) return t;
      t++;
    }
  return -1;
}
function Vp(e, n) {
  return e ? ":not(" + n.trim() + ")" : n;
}
function y0(e) {
  let n = e[0],
    t = 1,
    r = 2,
    o = "",
    i = !1;
  for (; t < e.length; ) {
    let s = e[t];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++t];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !ct(s) && ((n += Vp(i, o)), (o = "")),
        (r = s),
        (i = i || !ct(r));
    t++;
  }
  return o !== "" && (n += Vp(i, o)), n;
}
function C0(e) {
  return e.map(y0).join(",");
}
function D0(e) {
  let n = [],
    t = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && n.push(i, e[++r]) : o === 8 && t.push(i);
    else {
      if (!ct(o)) break;
      o = i;
    }
    r++;
  }
  return t.length && n.push(1, ...t), n;
}
var dt = {};
function E0(e, n) {
  return e.createText(n);
}
function b0(e, n, t) {
  e.setValue(n, t);
}
function w0(e, n) {
  return e.createComment(l0(n));
}
function zh(e, n, t) {
  return e.createElement(n, t);
}
function Cs(e, n, t, r, o) {
  e.insertBefore(n, t, r, o);
}
function Gh(e, n, t) {
  e.appendChild(n, t);
}
function $p(e, n, t, r, o) {
  r !== null ? Cs(e, n, t, r, o) : Gh(e, n, t);
}
function Wh(e, n, t) {
  e.removeChild(null, n, t);
}
function _0(e, n, t) {
  e.setAttribute(n, "style", t);
}
function I0(e, n, t) {
  t === "" ? e.removeAttribute(n, "class") : e.setAttribute(n, "class", t);
}
function qh(e, n, t) {
  let { mergedAttrs: r, classes: o, styles: i } = t;
  r !== null && Py(e, n, r),
    o !== null && I0(e, n, o),
    i !== null && _0(e, n, i);
}
function Cu(e, n, t, r, o, i, s, a, c, l, u) {
  let d = de + r,
    p = d + o,
    f = S0(d, p),
    D = typeof l == "function" ? l() : l;
  return (f[I] = {
    type: e,
    blueprint: f,
    template: t,
    queries: null,
    viewQuery: a,
    declTNode: n,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: D,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function S0(e, n) {
  let t = [];
  for (let r = 0; r < n; r++) t.push(r < e ? null : dt);
  return t;
}
function M0(e) {
  let n = e.tView;
  return n === null || n.incompleteFirstPass
    ? (e.tView = Cu(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : n;
}
function Du(e, n, t, r, o, i, s, a, c, l, u) {
  let d = n.blueprint.slice();
  return (
    (d[st] = o),
    (d[N] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[N] & 2048)) && (d[N] |= 2048),
    sl(d),
    (d[he] = d[On] = e),
    (d[ie] = t),
    (d[Ct] = s || (e && e[Ct])),
    (d[se] = a || (e && e[se])),
    (d[xn] = c || (e && e[xn]) || null),
    (d[Ke] = i),
    (d[no] = Qy()),
    (d[ur] = u),
    (d[nl] = l),
    (d[$e] = n.type == 2 ? e[$e] : d),
    d
  );
}
function T0(e, n, t) {
  let r = bt(n, e),
    o = M0(t),
    i = e[Ct].rendererFactory,
    s = Eu(
      e,
      Du(
        e,
        o,
        null,
        Yh(t),
        r,
        n,
        null,
        i.createRenderer(r, t),
        null,
        null,
        null
      )
    );
  return (e[n.index] = s);
}
function Yh(e) {
  let n = 16;
  return e.signals ? (n = 4096) : e.onPush && (n = 64), n;
}
function Zh(e, n, t, r) {
  if (t === 0) return -1;
  let o = n.length;
  for (let i = 0; i < t; i++) n.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Eu(e, n) {
  return e[fr] ? (e[tl][Xe] = n) : (e[fr] = n), (e[tl] = n), n;
}
function m(e = 1) {
  Qh(Le(), V(), en() + e, !1);
}
function Qh(e, n, t, r) {
  if (!r)
    if ((n[N] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && ls(n, i, t);
    } else {
      let i = e.preOrderHooks;
      i !== null && us(n, i, 0, t);
    }
  tn(t);
}
var Ls = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(Ls || {});
function Bl(e, n, t, r) {
  let o = F(null);
  try {
    let [i, s, a] = e.inputs[t],
      c = null;
    (s & Ls.SignalBased) !== 0 && (c = n[i][Ot]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(n, r)),
      e.setInput !== null ? e.setInput(n, c, r, t, i) : dh(n, c, i, r);
  } finally {
    F(o);
  }
}
var lt = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(lt || {}),
  x0;
function bu(e, n) {
  return x0(e, n);
}
function mr(e, n, t, r, o) {
  if (r != null) {
    let i,
      s = !1;
    at(r) ? (i = r) : Et(r) && ((s = !0), (r = r[st]));
    let a = Je(r);
    e === 0 && t !== null
      ? o == null
        ? Gh(n, t, a)
        : Cs(n, t, a, o || null, !0)
      : e === 1 && t !== null
      ? Cs(n, t, a, o || null, !0)
      : e === 2
      ? Wh(n, a, s)
      : e === 3 && n.destroyNode(a),
      i != null && V0(n, e, i, t, o);
  }
}
function O0(e, n) {
  Xh(e, n), (n[st] = null), (n[Ke] = null);
}
function R0(e, n, t, r, o, i) {
  (r[st] = o), (r[Ke] = n), Hs(e, r, t, 1, o, i);
}
function Xh(e, n) {
  n[Ct].changeDetectionScheduler?.notify(9), Hs(e, n, n[se], 2, null, null);
}
function N0(e) {
  let n = e[fr];
  if (!n) return xl(e[I], e);
  for (; n; ) {
    let t = null;
    if (Et(n)) t = n[fr];
    else {
      let r = n[me];
      r && (t = r);
    }
    if (!t) {
      for (; n && !n[Xe] && n !== e; ) Et(n) && xl(n[I], n), (n = n[he]);
      n === null && (n = e), Et(n) && xl(n[I], n), (t = n && n[Xe]);
    }
    n = t;
  }
}
function wu(e, n) {
  let t = e[Nn],
    r = t.indexOf(n);
  t.splice(r, 1);
}
function js(e, n) {
  if (Pn(n)) return;
  let t = n[se];
  t.destroyNode && Hs(e, n, t, 3, null, null), N0(n);
}
function xl(e, n) {
  if (Pn(n)) return;
  let t = F(null);
  try {
    (n[N] &= -129),
      (n[N] |= 256),
      n[Ue] && nc(n[Ue]),
      P0(e, n),
      A0(e, n),
      n[I].type === 1 && n[se].destroy();
    let r = n[Xt];
    if (r !== null && at(n[he])) {
      r !== n[he] && wu(r, n);
      let o = n[Dt];
      o !== null && o.detachView(e);
    }
    Ll(n);
  } finally {
    F(t);
  }
}
function A0(e, n) {
  let t = e.cleanup,
    r = n[dr];
  if (t !== null)
    for (let s = 0; s < t.length - 1; s += 2)
      if (typeof t[s] == "string") {
        let a = t[s + 3];
        a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2);
      } else {
        let a = r[t[s + 1]];
        t[s].call(a);
      }
  r !== null && (n[dr] = null);
  let o = n[At];
  if (o !== null) {
    n[At] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = n[ro];
  if (i !== null) {
    n[ro] = null;
    for (let s of i) s.destroy();
  }
}
function P0(e, n) {
  let t;
  if (e != null && (t = e.destroyHooks) != null)
    for (let r = 0; r < t.length; r += 2) {
      let o = n[t[r]];
      if (!(o instanceof vo)) {
        let i = t[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            X(4, a, c);
            try {
              c.call(a);
            } finally {
              X(5, a, c);
            }
          }
        else {
          X(4, o, i);
          try {
            i.call(o);
          } finally {
            X(5, o, i);
          }
        }
      }
    }
}
function k0(e, n, t) {
  return F0(e, n.parent, t);
}
function F0(e, n, t) {
  let r = n;
  for (; r !== null && r.type & 168; ) (n = r), (r = n.parent);
  if (r === null) return t[st];
  if (Jt(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === Lt.None || o === Lt.Emulated) return null;
  }
  return bt(r, t);
}
function L0(e, n, t) {
  return H0(e, n, t);
}
function j0(e, n, t) {
  return e.type & 40 ? bt(e, t) : null;
}
var H0 = j0,
  Up;
function _u(e, n, t, r) {
  let o = k0(e, r, n),
    i = n[se],
    s = r.parent || n[Ke],
    a = L0(s, r, n);
  if (o != null)
    if (Array.isArray(t))
      for (let c = 0; c < t.length; c++) $p(i, o, t[c], a, !1);
    else $p(i, o, t, a, !1);
  Up !== void 0 && Up(i, r, n, t, o);
}
function go(e, n) {
  if (n !== null) {
    let t = n.type;
    if (t & 3) return bt(n, e);
    if (t & 4) return Vl(-1, e[n.index]);
    if (t & 8) {
      let r = n.child;
      if (r !== null) return go(e, r);
      {
        let o = e[n.index];
        return at(o) ? Vl(-1, o) : Je(o);
      }
    } else {
      if (t & 128) return go(e, n.next);
      if (t & 32) return bu(n, e)() || Je(e[n.index]);
      {
        let r = Kh(e, n);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = Zt(e[$e]);
          return go(o, r);
        } else return go(e, n.next);
      }
    }
  }
  return null;
}
function Kh(e, n) {
  if (n !== null) {
    let r = e[$e][Ke],
      o = n.projection;
    return r.projection[o];
  }
  return null;
}
function Vl(e, n) {
  let t = me + e + 1;
  if (t < n.length) {
    let r = n[t],
      o = r[I].firstChild;
    if (o !== null) return go(r, o);
  }
  return n[Kt];
}
function Iu(e, n, t, r, o, i, s) {
  for (; t != null; ) {
    if (t.type === 128) {
      t = t.next;
      continue;
    }
    let a = r[t.index],
      c = t.type;
    if ((s && n === 0 && (a && yr(Je(a), r), (t.flags |= 2)), !hu(t)))
      if (c & 8) Iu(e, n, t.child, r, o, i, !1), mr(n, e, o, a, i);
      else if (c & 32) {
        let l = bu(t, r),
          u;
        for (; (u = l()); ) mr(n, e, o, u, i);
        mr(n, e, o, a, i);
      } else c & 16 ? B0(e, n, r, t, o, i) : mr(n, e, o, a, i);
    t = s ? t.projectionNext : t.next;
  }
}
function Hs(e, n, t, r, o, i) {
  Iu(t, r, e.firstChild, n, o, i, !1);
}
function B0(e, n, t, r, o, i) {
  let s = t[$e],
    c = s[Ke].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      mr(n, e, o, u, i);
    }
  else {
    let l = c,
      u = s[he];
    Mh(r) && (l.flags |= 128), Iu(e, n, l, u, o, i, !0);
  }
}
function V0(e, n, t, r, o) {
  let i = t[Kt],
    s = Je(t);
  i !== s && mr(n, e, r, i, o);
  for (let a = me; a < t.length; a++) {
    let c = t[a];
    Hs(c[I], c, e, n, r, i);
  }
}
function $0(e, n, t, r, o) {
  if (n) o ? e.addClass(t, r) : e.removeClass(t, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : lt.DashCase;
    o == null
      ? e.removeStyle(t, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= lt.Important)),
        e.setStyle(t, r, o, i));
  }
}
function Jh(e, n, t, r, o) {
  let i = en(),
    s = r & 2;
  try {
    tn(-1), s && n.length > de && Qh(e, n, de, !1), X(s ? 2 : 0, o, t), t(r, o);
  } finally {
    tn(i), X(s ? 3 : 1, o, t);
  }
}
function Bs(e, n, t) {
  Q0(e, n, t), (t.flags & 64) === 64 && X0(e, n, t);
}
function wo(e, n, t = bt) {
  let r = n.localNames;
  if (r !== null) {
    let o = n.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? t(n, e) : e[s];
      e[o++] = a;
    }
  }
}
function U0(e, n, t, r) {
  let i = r.get(Fh, kh) || t === Lt.ShadowDom,
    s = e.selectRootElement(n, i);
  return z0(s), s;
}
function z0(e) {
  G0(e);
}
var G0 = () => null;
function W0(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function q0(e, n, t, r, o, i) {
  let s = n[I];
  if (xu(e, s, n, t, r)) {
    Jt(e) && Z0(n, e.index);
    return;
  }
  e.type & 3 && (t = W0(t)), Y0(e, n, t, r, o, i);
}
function Y0(e, n, t, r, o, i) {
  if (e.type & 3) {
    let s = bt(e, n);
    (r = i != null ? i(r, e.value || "", t) : r), o.setProperty(s, t, r);
  } else e.type & 12;
}
function Z0(e, n) {
  let t = et(n, e);
  t[N] & 16 || (t[N] |= 64);
}
function Q0(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd;
  Jt(t) && T0(n, t, e.data[r + t.componentOffset]),
    e.firstCreatePass || Dh(t, n);
  let i = t.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = ms(n, e, s, t);
    if ((yr(c, n), i !== null && J0(n, s - r, c, a, t, i), An(a))) {
      let l = et(t.index, n);
      l[ie] = ms(n, e, s, t);
    }
  }
}
function X0(e, n, t) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = t.index,
    s = wp();
  try {
    tn(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = n[a];
      ns(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          K0(c, l);
    }
  } finally {
    tn(-1), ns(s);
  }
}
function K0(e, n) {
  e.hostBindings !== null && e.hostBindings(1, n);
}
function Su(e, n) {
  let t = e.directiveRegistry,
    r = null;
  if (t)
    for (let o = 0; o < t.length; o++) {
      let i = t[o];
      g0(n, i.selectors, !1) && ((r ??= []), An(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function J0(e, n, t, r, o, i) {
  let s = i[n];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Bl(r, t, c, l);
    }
}
function Mu(e, n, t, r, o) {
  let i = de + t,
    s = n[I],
    a = o(s, n, e, r, t);
  (n[i] = a), gr(e, !0);
  let c = e.type === 2;
  return (
    c ? (qh(n[se], a, e), (pp() === 0 || pr(e)) && yr(a, n), hp()) : yr(a, n),
    ss() && (!c || !hu(e)) && _u(s, n, a, e),
    e
  );
}
function Tu(e) {
  let n = e;
  return gl() ? vp() : ((n = n.parent), gr(n, !1)), n;
}
function eC(e, n) {
  let t = e[xn];
  if (!t) return;
  t.get(ze, null)?.(n);
}
function xu(e, n, t, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = n.data[l];
      Bl(d, t[l], u, o), (a = !0);
    }
  if (i)
    for (let c of i) {
      let l = t[c],
        u = n.data[c];
      Bl(u, l, r, o), (a = !0);
    }
  return a;
}
function tC(e, n) {
  let t = et(n, e),
    r = t[I];
  nC(r, t);
  let o = t[st];
  o !== null && t[ur] === null && (t[ur] = Lh(o, t[xn])),
    X(18),
    Ou(r, t, t[ie]),
    X(19, t[ie]);
}
function nC(e, n) {
  for (let t = n.length; t < e.blueprint.length; t++) n.push(e.blueprint[t]);
}
function Ou(e, n, t) {
  os(n);
  try {
    let r = e.viewQuery;
    r !== null && Hl(1, r, t);
    let o = e.template;
    o !== null && Jh(e, n, o, 1, t),
      e.firstCreatePass && (e.firstCreatePass = !1),
      n[Dt]?.finishViewCreation(e),
      e.staticContentQueries && jh(e, n),
      e.staticViewQueries && Hl(2, e.viewQuery, t);
    let i = e.components;
    i !== null && rC(n, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (n[N] &= -5), is();
  }
}
function rC(e, n) {
  for (let t = 0; t < n.length; t++) tC(e, n[t]);
}
function Vs(e, n, t, r) {
  let o = F(null);
  try {
    let i = n.tView,
      a = e[N] & 4096 ? 4096 : 16,
      c = Du(
        e,
        i,
        t,
        a,
        null,
        n,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      l = e[n.index];
    c[Xt] = l;
    let u = e[Dt];
    return u !== null && (c[Dt] = u.createEmbeddedView(i)), Ou(i, c, t), c;
  } finally {
    F(o);
  }
}
function yo(e, n) {
  return !n || n.firstChild === null || Mh(e);
}
var zp = !1,
  oC = new S("");
function Co(e, n, t, r, o = !1) {
  for (; t !== null; ) {
    if (t.type === 128) {
      t = o ? t.projectionNext : t.next;
      continue;
    }
    let i = n[t.index];
    i !== null && r.push(Je(i)), at(i) && eg(i, r);
    let s = t.type;
    if (s & 8) Co(e, n, t.child, r);
    else if (s & 32) {
      let a = bu(t, n),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Kh(n, t);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Zt(n[$e]);
        Co(c[I], c, a, r, !0);
      }
    }
    t = o ? t.projectionNext : t.next;
  }
  return r;
}
function eg(e, n) {
  for (let t = me; t < e.length; t++) {
    let r = e[t],
      o = r[I].firstChild;
    o !== null && Co(r[I], r, o, n);
  }
  e[Kt] !== e[st] && n.push(e[Kt]);
}
function tg(e) {
  if (e[Xi] !== null) {
    for (let n of e[Xi]) n.impl.addSequence(n);
    e[Xi].length = 0;
  }
}
var ng = [];
function iC(e) {
  return e[Ue] ?? sC(e);
}
function sC(e) {
  let n = ng.pop() ?? Object.create(cC);
  return (n.lView = e), n;
}
function aC(e) {
  e.lView[Ue] !== e && ((e.lView = null), ng.push(e));
}
var cC = K(b({}, li), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    ao(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[Ue] = this;
  },
});
function lC(e) {
  let n = e[Ue] ?? Object.create(uC);
  return (n.lView = e), n;
}
var uC = K(b({}, li), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let n = Zt(e.lView);
    for (; n && !rg(n[I]); ) n = Zt(n);
    n && al(n);
  },
  consumerOnSignalRead() {
    this.lView[Ue] = this;
  },
});
function rg(e) {
  return e.type !== 2;
}
function og(e) {
  if (e[ro] === null) return;
  let n = !0;
  for (; n; ) {
    let t = !1;
    for (let r of e[ro])
      r.dirty &&
        ((t = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    n = t && !!(e[N] & 8192);
  }
}
var dC = 100;
function Ru(e, n = 0) {
  let r = e[Ct].rendererFactory,
    o = !1;
  o || r.begin?.();
  try {
    fC(e, n);
  } finally {
    o || r.end?.();
  }
}
function fC(e, n) {
  let t = vl();
  try {
    yl(!0), $l(e, n);
    let r = 0;
    for (; so(e); ) {
      if (r === dC) throw new w(103, !1);
      r++, $l(e, 1);
    }
  } finally {
    yl(t);
  }
}
function ig(e, n) {
  ml(n ? co.Exhaustive : co.OnlyDirtyViews);
  try {
    Ru(e);
  } finally {
    ml(co.Off);
  }
}
function pC(e, n, t, r) {
  if (Pn(n)) return;
  let o = n[N],
    i = !1,
    s = !1;
  os(n);
  let a = !0,
    c = null,
    l = null;
  i ||
    (rg(e)
      ? ((l = iC(n)), (c = di(l)))
      : ci() === null
      ? ((a = !1), (l = lC(n)), (c = di(l)))
      : n[Ue] && (nc(n[Ue]), (n[Ue] = null)));
  try {
    sl(n), Cp(e.bindingStartIndex), t !== null && Jh(e, n, t, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && ls(n, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && us(n, f, 0, null), Ml(n, 0);
      }
    if (
      (s || hC(n), og(n), sg(n, 0), e.contentQueries !== null && jh(e, n), !i)
    )
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && ls(n, f);
      } else {
        let f = e.contentHooks;
        f !== null && us(n, f, 1), Ml(n, 1);
      }
    mC(e, n);
    let d = e.components;
    d !== null && cg(n, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Hl(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && ls(n, f);
      } else {
        let f = e.viewHooks;
        f !== null && us(n, f, 2), Ml(n, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), n[Qi])) {
      for (let f of n[Qi]) f();
      n[Qi] = null;
    }
    i || (tg(n), (n[N] &= -73));
  } catch (u) {
    throw (i || ao(n), u);
  } finally {
    l !== null && (tc(l, c), a && aC(l)), is();
  }
}
function sg(e, n) {
  for (let t = xh(e); t !== null; t = Oh(t))
    for (let r = me; r < t.length; r++) {
      let o = t[r];
      ag(o, n);
    }
}
function hC(e) {
  for (let n = xh(e); n !== null; n = Oh(n)) {
    if (!(n[N] & 2)) continue;
    let t = n[Nn];
    for (let r = 0; r < t.length; r++) {
      let o = t[r];
      al(o);
    }
  }
}
function gC(e, n, t) {
  X(18);
  let r = et(n, e);
  ag(r, t), X(19, r[ie]);
}
function ag(e, n) {
  Ki(e) && $l(e, n);
}
function $l(e, n) {
  let r = e[I],
    o = e[N],
    i = e[Ue],
    s = !!(n === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && n === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && fi(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[N] &= -9217),
    s)
  )
    pC(r, e, r.template, e[ie]);
  else if (o & 8192) {
    let a = F(null);
    try {
      og(e), sg(e, 1);
      let c = r.components;
      c !== null && cg(e, c, 1), tg(e);
    } finally {
      F(a);
    }
  }
}
function cg(e, n, t) {
  for (let r = 0; r < n.length; r++) gC(e, n[r], t);
}
function mC(e, n) {
  let t = e.hostBindingOpCodes;
  if (t !== null)
    try {
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        if (o < 0) tn(~o);
        else {
          let i = o,
            s = t[++r],
            a = t[++r];
          bp(s, i);
          let c = n[i];
          X(24, c), a(2, c), X(25, c);
        }
      }
    } finally {
      tn(-1);
    }
}
function Nu(e, n) {
  let t = vl() ? 64 : 1088;
  for (e[Ct].changeDetectionScheduler?.notify(n); e; ) {
    e[N] |= t;
    let r = Zt(e);
    if (hr(e) && !r) return e;
    e = r;
  }
  return null;
}
function lg(e, n, t, r) {
  return [e, !0, 0, n, null, r, null, t, null, null];
}
function ug(e, n) {
  let t = me + n;
  if (t < e.length) return e[t];
}
function $s(e, n, t, r = !0) {
  let o = n[I];
  if ((vC(o, n, e, t), r)) {
    let s = Vl(t, e),
      a = n[se],
      c = a.parentNode(e[Kt]);
    c !== null && R0(o, e[Ke], a, n, c, s);
  }
  let i = n[ur];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function dg(e, n) {
  let t = Do(e, n);
  return t !== void 0 && js(t[I], t), t;
}
function Do(e, n) {
  if (e.length <= me) return;
  let t = me + n,
    r = e[t];
  if (r) {
    let o = r[Xt];
    o !== null && o !== e && wu(o, r), n > 0 && (e[t - 1][Xe] = r[Xe]);
    let i = Jr(e, me + n);
    O0(r[I], r);
    let s = i[Dt];
    s !== null && s.detachView(i[I]),
      (r[he] = null),
      (r[Xe] = null),
      (r[N] &= -129);
  }
  return r;
}
function vC(e, n, t, r) {
  let o = me + r,
    i = t.length;
  r > 0 && (t[o - 1][Xe] = n),
    r < i - me
      ? ((n[Xe] = t[o]), Yc(t, me + r, n))
      : (t.push(n), (n[Xe] = null)),
    (n[he] = t);
  let s = n[Xt];
  s !== null && t !== s && fg(s, n);
  let a = n[Dt];
  a !== null && a.insertView(e), Ji(n), (n[N] |= 128);
}
function fg(e, n) {
  let t = e[Nn],
    r = n[he];
  if (Et(r)) e[N] |= 2;
  else {
    let o = r[he][$e];
    n[$e] !== o && (e[N] |= 2);
  }
  t === null ? (e[Nn] = [n]) : t.push(n);
}
var nn = class {
  _lView;
  _cdRefInjectingView;
  _appRef = null;
  _attachedToViewContainer = !1;
  exhaustive;
  get rootNodes() {
    let n = this._lView,
      t = n[I];
    return Co(t, n, t.firstChild, []);
  }
  constructor(n, t) {
    (this._lView = n), (this._cdRefInjectingView = t);
  }
  get context() {
    return this._lView[ie];
  }
  set context(n) {
    this._lView[ie] = n;
  }
  get destroyed() {
    return Pn(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let n = this._lView[he];
      if (at(n)) {
        let t = n[oo],
          r = t ? t.indexOf(this) : -1;
        r > -1 && (Do(n, r), Jr(t, r));
      }
      this._attachedToViewContainer = !1;
    }
    js(this._lView[I], this._lView);
  }
  onDestroy(n) {
    cl(this._lView, n);
  }
  markForCheck() {
    Nu(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[N] &= -129;
  }
  reattach() {
    Ji(this._lView), (this._lView[N] |= 128);
  }
  detectChanges() {
    (this._lView[N] |= 1024), Ru(this._lView);
  }
  checkNoChanges() {
    return;
    try {
      this.exhaustive ??= this._lView[xn].get(oC, zp);
    } catch {
      this.exhaustive = zp;
    }
  }
  attachToViewContainerRef() {
    if (this._appRef) throw new w(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let n = hr(this._lView),
      t = this._lView[Xt];
    t !== null && !n && wu(t, this._lView), Xh(this._lView[I], this._lView);
  }
  attachToAppRef(n) {
    if (this._attachedToViewContainer) throw new w(902, !1);
    this._appRef = n;
    let t = hr(this._lView),
      r = this._lView[Xt];
    r !== null && !t && fg(r, this._lView), Ji(this._lView);
  }
};
var rn = (() => {
  class e {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    static __NG_ELEMENT_ID__ = yC;
    constructor(t, r, o) {
      (this._declarationLView = t),
        (this._declarationTContainer = r),
        (this.elementRef = o);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(t, r) {
      return this.createEmbeddedViewImpl(t, r);
    }
    createEmbeddedViewImpl(t, r, o) {
      let i = Vs(this._declarationLView, this._declarationTContainer, t, {
        embeddedViewInjector: r,
        dehydratedView: o,
      });
      return new nn(i);
    }
  }
  return e;
})();
function yC() {
  return Au(je(), V());
}
function Au(e, n) {
  return e.type & 4 ? new rn(n, e, br(e, n)) : null;
}
function _o(e, n, t, r, o) {
  let i = e.data[n];
  if (i === null) (i = CC(e, n, t, r, o)), Ep() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = t), (i.value = r), (i.attrs = o);
    let s = mp();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return gr(i, !0), i;
}
function CC(e, n, t, r, o) {
  let i = hl(),
    s = gl(),
    a = s ? i : i && i.parent,
    c = (e.data[n] = EC(e, a, t, n, r, o));
  return DC(e, c, i, s), c;
}
function DC(e, n, t, r) {
  e.firstChild === null && (e.firstChild = n),
    t !== null &&
      (r
        ? t.child == null && n.parent !== null && (t.child = n)
        : t.next === null && ((t.next = n), (n.prev = t)));
}
function EC(e, n, t, r, o, i) {
  let s = n ? n.injectorIndex : -1,
    a = 0;
  return (
    gp() && (a |= 128),
    {
      type: t,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: n,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var TN = new RegExp(`^(\\d+)*(${e0}|${Jy})*(.*)`);
function bC(e) {
  let n = e[rl] ?? [],
    r = e[he][se],
    o = [];
  for (let i of n) i.data[Ph] !== void 0 ? o.push(i) : wC(i, r);
  e[rl] = o;
}
function wC(e, n) {
  let t = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[Ah];
    for (; t < o; ) {
      let i = r.nextSibling;
      Wh(n, r, !1), (r = i), t++;
    }
  }
}
var _C = () => null,
  IC = () => null;
function Ul(e, n) {
  return _C(e, n);
}
function pg(e, n, t) {
  return IC(e, n, t);
}
var hg = class {},
  Us = class {},
  zl = class {
    resolveComponentFactory(n) {
      throw new w(917, !1);
    }
  },
  Io = class {
    static NULL = new zl();
  },
  Ln = class {},
  zs = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => SC();
    }
    return e;
  })();
function SC() {
  let e = V(),
    n = je(),
    t = et(n.index, e);
  return (Et(t) ? t : e)[se];
}
var gg = (() => {
  class e {
    static ɵprov = _({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var fs = {},
  Gl = class {
    injector;
    parentInjector;
    constructor(n, t) {
      (this.injector = n), (this.parentInjector = t);
    }
    get(n, t, r) {
      let o = this.injector.get(n, fs, r);
      return o !== fs || t === fs ? o : this.parentInjector.get(n, t, r);
    }
  };
function Ds(e, n, t) {
  let r = t ? e.styles : null,
    o = t ? e.classes : null,
    i = 0;
  if (n !== null)
    for (let s = 0; s < n.length; s++) {
      let a = n[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = kc(o, a);
      else if (i == 2) {
        let c = a,
          l = n[++s];
        r = kc(r, c + ": " + l + ";");
      }
    }
  t ? (e.styles = r) : (e.stylesWithoutHost = r),
    t ? (e.classes = o) : (e.classesWithoutHost = o);
}
function x(e, n = 0) {
  let t = V();
  if (t === null) return R(e, n);
  let r = je();
  return _h(r, t, Fe(e), n);
}
function mg(e, n, t, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, t);
  if (s !== null) {
    let a = s,
      c = null,
      l = null;
    for (let u of s)
      if (u.resolveHostDirectives !== null) {
        [a, c, l] = u.resolveHostDirectives(s);
        break;
      }
    xC(e, n, t, a, i, c, l);
  }
  i !== null && r !== null && MC(t, r, i);
}
function MC(e, n, t) {
  let r = (e.localNames = []);
  for (let o = 0; o < n.length; o += 2) {
    let i = t[n[o + 1]];
    if (i == null) throw new w(-301, !1);
    r.push(n[o], i);
  }
}
function TC(e, n, t) {
  (n.componentOffset = t), (e.components ??= []).push(n.index);
}
function xC(e, n, t, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    !c && An(f) && ((c = !0), TC(e, t, p)), Vy(Dh(t, n), e, f.type);
  }
  kC(t, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = Zh(e, n, a, null);
  a > 0 && (t.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((t.mergedAttrs = Ns(t.mergedAttrs, f.hostAttrs)),
      RC(e, t, n, d, f),
      PC(d, f, o),
      s !== null && s.has(f))
    ) {
      let [M, U] = s.get(f);
      t.directiveToIndex.set(f.type, [
        d,
        M + t.directiveStart,
        U + t.directiveStart,
      ]);
    } else (i === null || !i.has(f)) && t.directiveToIndex.set(f.type, d);
    f.contentQueries !== null && (t.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (t.flags |= 64);
    let D = f.type.prototype;
    !l &&
      (D.ngOnChanges || D.ngOnInit || D.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(t.index), (l = !0)),
      !u &&
        (D.ngOnChanges || D.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(t.index), (u = !0)),
      d++;
  }
  OC(e, t, i);
}
function OC(e, n, t) {
  for (let r = n.directiveStart; r < n.directiveEnd; r++) {
    let o = e.data[r];
    if (t === null || !t.has(o)) Gp(0, n, o, r), Gp(1, n, o, r), qp(n, r, !1);
    else {
      let i = t.get(o);
      Wp(0, n, i, r), Wp(1, n, i, r), qp(n, r, !0);
    }
  }
}
function Gp(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? (s = n.inputs ??= {}) : (s = n.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        vg(n, i);
    }
}
function Wp(e, n, t, r) {
  let o = e === 0 ? t.inputs : t.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      e === 0
        ? (a = n.hostDirectiveInputs ??= {})
        : (a = n.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        vg(n, s);
    }
}
function vg(e, n) {
  n === "class" ? (e.flags |= 8) : n === "style" && (e.flags |= 16);
}
function qp(e, n, t) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!t && o === null) || (t && i === null) || yu(e)) {
    (e.initialInputs ??= []), e.initialInputs.push(null);
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == "number") break;
    if (!t && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === n) {
          (s ??= []), s.push(c, r[a + 1]);
          break;
        }
    } else if (t && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === n) {
          (s ??= []), s.push(l[u + 1], r[a + 1]);
          break;
        }
    }
    a += 2;
  }
  (e.initialInputs ??= []), e.initialInputs.push(s);
}
function RC(e, n, t, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = wn(o.type, !0)),
    s = new vo(i, An(o), x, null);
  (e.blueprint[r] = s), (t[r] = s), NC(e, n, r, Zh(e, t, o.hostVars, dt), o);
}
function NC(e, n, t, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~n.index;
    AC(s) != a && s.push(a), s.push(t, r, i);
  }
}
function AC(e) {
  let n = e.length;
  for (; n > 0; ) {
    let t = e[--n];
    if (typeof t == "number" && t < 0) return t;
  }
  return 0;
}
function PC(e, n, t) {
  if (t) {
    if (n.exportAs)
      for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
    An(n) && (t[""] = e);
  }
}
function kC(e, n, t) {
  (e.flags |= 1),
    (e.directiveStart = n),
    (e.directiveEnd = n + t),
    (e.providerIndexes = n);
}
function Pu(e, n, t, r, o, i, s, a) {
  let c = n[I],
    l = c.consts,
    u = tt(l, s),
    d = _o(c, e, t, r, u);
  return (
    i && mg(c, n, d, tt(l, a), o),
    (d.mergedAttrs = Ns(d.mergedAttrs, d.attrs)),
    d.attrs !== null && Ds(d, d.attrs, !1),
    d.mergedAttrs !== null && Ds(d, d.mergedAttrs, !0),
    c.queries !== null && c.queries.elementStart(c, d),
    d
  );
}
function ku(e, n) {
  gh(e, n), ol(n) && e.queries.elementEnd(n);
}
function FC(e, n, t, r, o, i) {
  let s = n.consts,
    a = tt(s, o),
    c = _o(n, e, t, r, a);
  if (((c.mergedAttrs = Ns(c.mergedAttrs, c.attrs)), i != null)) {
    let l = tt(s, i);
    c.localNames = [];
    for (let u = 0; u < l.length; u += 2) c.localNames.push(l[u], -1);
  }
  return (
    c.attrs !== null && Ds(c, c.attrs, !1),
    c.mergedAttrs !== null && Ds(c, c.mergedAttrs, !0),
    n.queries !== null && n.queries.elementStart(n, c),
    c
  );
}
function Fu(e) {
  return Gs(e)
    ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
    : !1;
}
function yg(e, n) {
  if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e[t]);
  else {
    let t = e[Symbol.iterator](),
      r;
    for (; !(r = t.next()).done; ) n(r.value);
  }
}
function Gs(e) {
  return e !== null && (typeof e == "function" || typeof e == "object");
}
function Lu(e, n, t) {
  return (e[n] = t);
}
function LC(e, n) {
  return e[n];
}
function on(e, n, t) {
  if (t === dt) return !1;
  let r = e[n];
  return Object.is(r, t) ? !1 : ((e[n] = t), !0);
}
function jC(e, n, t, r) {
  let o = on(e, n, t);
  return on(e, n + 1, r) || o;
}
function Ol(e, n, t) {
  return function r(o) {
    let i = Jt(e) ? et(e.index, n) : n;
    Nu(i, 5);
    let s = n[ie],
      a = Yp(n, s, t, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) (a = Yp(n, s, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function Yp(e, n, t, r) {
  let o = F(null);
  try {
    return X(6, n, t), t(r) !== !1;
  } catch (i) {
    return eC(e, i), !1;
  } finally {
    X(7, n, t), F(o);
  }
}
function HC(e, n, t, r, o, i, s, a) {
  let c = pr(e),
    l = !1,
    u = null;
  if ((!r && c && (u = BC(n, t, i, e.index)), u !== null)) {
    let d = u.__ngLastListenerFn__ || u;
    (d.__ngNextListenerFn__ = s), (u.__ngLastListenerFn__ = s), (l = !0);
  } else {
    let d = bt(e, t),
      p = r ? r(d) : d;
    n0(t, p, i, a);
    let f = o.listen(p, i, a),
      D = r ? (M) => r(Je(M[e.index])) : e.index;
    Cg(D, n, t, i, a, f, !1);
  }
  return l;
}
function BC(e, n, t, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === t && o[i + 1] === r) {
        let a = n[dr],
          c = o[i + 2];
        return a && a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Cg(e, n, t, r, o, i, s) {
  let a = n.firstCreatePass ? ul(n) : null,
    c = ll(t),
    l = c.length;
  c.push(o, i), a && a.push(r, e, l, (l + 1) * (s ? -1 : 1));
}
function Zp(e, n, t, r, o, i) {
  let s = n[t],
    a = n[I],
    l = a.data[t].outputs[r],
    d = s[l].subscribe(i);
  Cg(e.index, a, n, o, i, d, !0);
}
var Wl = Symbol("BINDING");
var Es = class extends Io {
  ngModule;
  constructor(n) {
    super(), (this.ngModule = n);
  }
  resolveComponentFactory(n) {
    let t = Qt(n);
    return new Cr(t, this.ngModule);
  }
};
function VC(e) {
  return Object.keys(e).map((n) => {
    let [t, r, o] = e[n],
      i = {
        propName: t,
        templateName: n,
        isSignal: (r & Ls.SignalBased) !== 0,
      };
    return o && (i.transform = o), i;
  });
}
function $C(e) {
  return Object.keys(e).map((n) => ({ propName: e[n], templateName: n }));
}
function UC(e, n, t) {
  let r = n instanceof De ? n : n?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new Gl(t, r) : t
  );
}
function zC(e) {
  let n = e.get(Ln, null);
  if (n === null) throw new w(407, !1);
  let t = e.get(gg, null),
    r = e.get(In, null);
  return {
    rendererFactory: n,
    sanitizer: t,
    changeDetectionScheduler: r,
    ngReflect: !1,
  };
}
function GC(e, n) {
  let t = (e.selectors[0][0] || "div").toLowerCase();
  return zh(n, t, t === "svg" ? ip : t === "math" ? sp : null);
}
var Cr = class extends Us {
  componentDef;
  ngModule;
  selector;
  componentType;
  ngContentSelectors;
  isBoundToModule;
  cachedInputs = null;
  cachedOutputs = null;
  get inputs() {
    return (
      (this.cachedInputs ??= VC(this.componentDef.inputs)), this.cachedInputs
    );
  }
  get outputs() {
    return (
      (this.cachedOutputs ??= $C(this.componentDef.outputs)), this.cachedOutputs
    );
  }
  constructor(n, t) {
    super(),
      (this.componentDef = n),
      (this.ngModule = t),
      (this.componentType = n.type),
      (this.selector = C0(n.selectors)),
      (this.ngContentSelectors = n.ngContentSelectors ?? []),
      (this.isBoundToModule = !!t);
  }
  create(n, t, r, o, i, s) {
    X(22);
    let a = F(null);
    try {
      let c = this.componentDef,
        l = WC(r, c, s, i),
        u = UC(c, o || this.ngModule, n),
        d = zC(u),
        p = d.rendererFactory.createRenderer(null, c),
        f = r ? U0(p, r, c.encapsulation, u) : GC(c, p),
        D =
          s?.some(Qp) ||
          i?.some((z) => typeof z != "function" && z.bindings.some(Qp)),
        M = Du(
          null,
          l,
          null,
          512 | Yh(c),
          null,
          null,
          d,
          p,
          u,
          null,
          Lh(f, u, !0)
        );
      (M[de] = f), os(M);
      let U = null;
      try {
        let z = Pu(de, M, 2, "#host", () => l.directiveRegistry, !0, 0);
        f && (qh(p, f, z), yr(f, M)),
          Bs(l, M, z),
          gu(l, z, M),
          ku(l, z),
          t !== void 0 && YC(z, this.ngContentSelectors, t),
          (U = et(z.index, M)),
          (M[ie] = U[ie]),
          Ou(l, M, null);
      } catch (z) {
        throw (U !== null && Ll(U), Ll(M), z);
      } finally {
        X(23), is();
      }
      return new bs(this.componentType, M, !!D);
    } finally {
      F(a);
    }
  }
};
function WC(e, n, t, r) {
  let o = e ? ["ng-version", "20.1.6"] : D0(n.selectors[0]),
    i = null,
    s = null,
    a = 0;
  if (t)
    for (let u of t)
      (a += u[Wl].requiredVars),
        u.create && ((u.targetIdx = 0), (i ??= []).push(u)),
        u.update && ((u.targetIdx = 0), (s ??= []).push(u));
  if (r)
    for (let u = 0; u < r.length; u++) {
      let d = r[u];
      if (typeof d != "function")
        for (let p of d.bindings) {
          a += p[Wl].requiredVars;
          let f = u + 1;
          p.create && ((p.targetIdx = f), (i ??= []).push(p)),
            p.update && ((p.targetIdx = f), (s ??= []).push(p));
        }
    }
  let c = [n];
  if (r)
    for (let u of r) {
      let d = typeof u == "function" ? u : u.type,
        p = Kc(d);
      c.push(p);
    }
  return Cu(0, null, qC(i, s), 1, a, c, null, null, null, [o], null);
}
function qC(e, n) {
  return !e && !n
    ? null
    : (t) => {
        if (t & 1 && e) for (let r of e) r.create();
        if (t & 2 && n) for (let r of n) r.update();
      };
}
function Qp(e) {
  let n = e[Wl].kind;
  return n === "input" || n === "twoWay";
}
var bs = class extends hg {
  _rootLView;
  _hasInputBindings;
  instance;
  hostView;
  changeDetectorRef;
  componentType;
  location;
  previousInputValues = null;
  _tNode;
  constructor(n, t, r) {
    super(),
      (this._rootLView = t),
      (this._hasInputBindings = r),
      (this._tNode = io(t[I], de)),
      (this.location = br(this._tNode, t)),
      (this.instance = et(this._tNode.index, t)[ie]),
      (this.hostView = this.changeDetectorRef = new nn(t, void 0)),
      (this.componentType = n);
  }
  setInput(n, t) {
    this._hasInputBindings;
    let r = this._tNode;
    if (
      ((this.previousInputValues ??= new Map()),
      this.previousInputValues.has(n) &&
        Object.is(this.previousInputValues.get(n), t))
    )
      return;
    let o = this._rootLView,
      i = xu(r, o[I], o, n, t);
    this.previousInputValues.set(n, t);
    let s = et(r.index, o);
    Nu(s, 1);
  }
  get injector() {
    return new Fn(this._tNode, this._rootLView);
  }
  destroy() {
    this.hostView.destroy();
  }
  onDestroy(n) {
    this.hostView.onDestroy(n);
  }
};
function YC(e, n, t) {
  let r = (e.projection = []);
  for (let o = 0; o < n.length; o++) {
    let i = t[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var jt = (() => {
  class e {
    static __NG_ELEMENT_ID__ = ZC;
  }
  return e;
})();
function ZC() {
  let e = je();
  return Eg(e, V());
}
var QC = jt,
  Dg = class extends QC {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(n, t, r) {
      super(),
        (this._lContainer = n),
        (this._hostTNode = t),
        (this._hostLView = r);
    }
    get element() {
      return br(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Fn(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let n = du(this._hostTNode, this._hostLView);
      if (vh(n)) {
        let t = gs(n, this._hostLView),
          r = hs(n),
          o = t[I].data[r + 8];
        return new Fn(o, t);
      } else return new Fn(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(n) {
      let t = Xp(this._lContainer);
      return (t !== null && t[n]) || null;
    }
    get length() {
      return this._lContainer.length - me;
    }
    createEmbeddedView(n, t, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Ul(this._lContainer, n.ssrId),
        a = n.createEmbeddedViewImpl(t || {}, i, s);
      return this.insertImpl(a, o, yo(this._hostTNode, s)), a;
    }
    createComponent(n, t, r, o, i, s, a) {
      let c = n && !Sy(n),
        l;
      if (c) l = t;
      else {
        let U = t || {};
        (l = U.index),
          (r = U.injector),
          (o = U.projectableNodes),
          (i = U.environmentInjector || U.ngModuleRef),
          (s = U.directives),
          (a = U.bindings);
      }
      let u = c ? n : new Cr(Qt(n)),
        d = r || this.parentInjector;
      if (!i && u.ngModule == null) {
        let z = (c ? d : this.parentInjector).get(De, null);
        z && (i = z);
      }
      let p = Qt(u.componentType ?? {}),
        f = Ul(this._lContainer, p?.id ?? null),
        D = f?.firstChild ?? null,
        M = u.create(d, o, D, i, s, a);
      return this.insertImpl(M.hostView, l, yo(this._hostTNode, f)), M;
    }
    insert(n, t) {
      return this.insertImpl(n, t, !0);
    }
    insertImpl(n, t, r) {
      let o = n._lView;
      if (lp(o)) {
        let a = this.indexOf(n);
        if (a !== -1) this.detach(a);
        else {
          let c = o[he],
            l = new Dg(c, c[Ke], c[he]);
          l.detach(l.indexOf(n));
        }
      }
      let i = this._adjustIndex(t),
        s = this._lContainer;
      return $s(s, o, i, r), n.attachToViewContainerRef(), Yc(Rl(s), i, n), n;
    }
    move(n, t) {
      return this.insert(n, t);
    }
    indexOf(n) {
      let t = Xp(this._lContainer);
      return t !== null ? t.indexOf(n) : -1;
    }
    remove(n) {
      let t = this._adjustIndex(n, -1),
        r = Do(this._lContainer, t);
      r && (Jr(Rl(this._lContainer), t), js(r[I], r));
    }
    detach(n) {
      let t = this._adjustIndex(n, -1),
        r = Do(this._lContainer, t);
      return r && Jr(Rl(this._lContainer), t) != null ? new nn(r) : null;
    }
    _adjustIndex(n, t = 0) {
      return n ?? this.length + t;
    }
  };
function Xp(e) {
  return e[oo];
}
function Rl(e) {
  return e[oo] || (e[oo] = []);
}
function Eg(e, n) {
  let t,
    r = n[e.index];
  return (
    at(r) ? (t = r) : ((t = lg(r, n, null, e)), (n[e.index] = t), Eu(n, t)),
    KC(t, n, e, r),
    new Dg(t, e, n)
  );
}
function XC(e, n) {
  let t = e[se],
    r = t.createComment(""),
    o = bt(n, e),
    i = t.parentNode(o);
  return Cs(t, i, r, t.nextSibling(o), !1), r;
}
var KC = tD,
  JC = () => !1;
function eD(e, n, t) {
  return JC(e, n, t);
}
function tD(e, n, t, r) {
  if (e[Kt]) return;
  let o;
  t.type & 8 ? (o = Je(r)) : (o = XC(n, t)), (e[Kt] = o);
}
var ql = class e {
    queryList;
    matches = null;
    constructor(n) {
      this.queryList = n;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Yl = class e {
    queries;
    constructor(n = []) {
      this.queries = n;
    }
    createEmbeddedView(n) {
      let t = n.queries;
      if (t !== null) {
        let r = n.contentQueries !== null ? n.contentQueries[0] : t.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = t.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    detachView(n) {
      this.dirtyQueriesWithMatches(n);
    }
    finishViewCreation(n) {
      this.dirtyQueriesWithMatches(n);
    }
    dirtyQueriesWithMatches(n) {
      for (let t = 0; t < this.queries.length; t++)
        ju(n, t).matches !== null && this.queries[t].setDirty();
    }
  },
  Zl = class {
    flags;
    read;
    predicate;
    constructor(n, t, r = null) {
      (this.flags = t),
        (this.read = r),
        typeof n == "string" ? (this.predicate = lD(n)) : (this.predicate = n);
    }
  },
  Ql = class e {
    queries;
    constructor(n = []) {
      this.queries = n;
    }
    elementStart(n, t) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(n, t);
    }
    elementEnd(n) {
      for (let t = 0; t < this.queries.length; t++)
        this.queries[t].elementEnd(n);
    }
    embeddedTView(n) {
      let t = null;
      for (let r = 0; r < this.length; r++) {
        let o = t !== null ? t.length : 0,
          i = this.getByIndex(r).embeddedTView(n, o);
        i &&
          ((i.indexInDeclarationView = r), t !== null ? t.push(i) : (t = [i]));
      }
      return t !== null ? new e(t) : null;
    }
    template(n, t) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(n, t);
    }
    getByIndex(n) {
      return this.queries[n];
    }
    get length() {
      return this.queries.length;
    }
    track(n) {
      this.queries.push(n);
    }
  },
  Xl = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(n, t = -1) {
      (this.metadata = n), (this._declarationNodeIndex = t);
    }
    elementStart(n, t) {
      this.isApplyingToNode(t) && this.matchTNode(n, t);
    }
    elementEnd(n) {
      this._declarationNodeIndex === n.index && (this._appliesToNextNode = !1);
    }
    template(n, t) {
      this.elementStart(n, t);
    }
    embeddedTView(n, t) {
      return this.isApplyingToNode(n)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-n.index, t),
          new e(this.metadata))
        : null;
    }
    isApplyingToNode(n) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let t = this._declarationNodeIndex,
          r = n.parent;
        for (; r !== null && r.type & 8 && r.index !== t; ) r = r.parent;
        return t === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(n, t) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          this.matchTNodeWithReadOption(n, t, nD(t, i)),
            this.matchTNodeWithReadOption(n, t, ds(t, n, i, !1, !1));
        }
      else
        r === rn
          ? t.type & 4 && this.matchTNodeWithReadOption(n, t, -1)
          : this.matchTNodeWithReadOption(n, t, ds(t, n, r, !1, !1));
    }
    matchTNodeWithReadOption(n, t, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === an || o === jt || (o === rn && t.type & 4))
            this.addMatch(t.index, -2);
          else {
            let i = ds(t, n, o, !1, !1);
            i !== null && this.addMatch(t.index, i);
          }
        else this.addMatch(t.index, r);
      }
    }
    addMatch(n, t) {
      this.matches === null ? (this.matches = [n, t]) : this.matches.push(n, t);
    }
  };
function nD(e, n) {
  let t = e.localNames;
  if (t !== null) {
    for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
  }
  return null;
}
function rD(e, n) {
  return e.type & 11 ? br(e, n) : e.type & 4 ? Au(e, n) : null;
}
function oD(e, n, t, r) {
  return t === -1 ? rD(n, e) : t === -2 ? iD(e, n, r) : ms(e, e[I], t, n);
}
function iD(e, n, t) {
  if (t === an) return br(n, e);
  if (t === rn) return Au(n, e);
  if (t === jt) return Eg(n, e);
}
function bg(e, n, t, r) {
  let o = n[Dt].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = t.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(oD(n, u, s[c + 1], t.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Kl(e, n, t, r) {
  let o = e.queries.getByIndex(t),
    i = o.matches;
  if (i !== null) {
    let s = bg(e, n, o, t);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = n[-c];
        for (let d = me; d < u.length; d++) {
          let p = u[d];
          p[Xt] === p[he] && Kl(p[I], p, l, r);
        }
        if (u[Nn] !== null) {
          let d = u[Nn];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            Kl(f[I], f, l, r);
          }
        }
      }
    }
  }
  return r;
}
function sD(e, n) {
  return e[Dt].queries[n].queryList;
}
function aD(e, n, t) {
  let r = new vs((t & 4) === 4);
  return (
    fp(e, n, r, r.destroy), (n[Dt] ??= new Yl()).queries.push(new ql(r)) - 1
  );
}
function cD(e, n, t) {
  let r = Le();
  return (
    r.firstCreatePass &&
      (uD(r, new Zl(e, n, t), -1), (n & 2) === 2 && (r.staticViewQueries = !0)),
    aD(r, V(), n)
  );
}
function lD(e) {
  return e.split(",").map((n) => n.trim());
}
function uD(e, n, t) {
  e.queries === null && (e.queries = new Ql()), e.queries.track(new Xl(n, t));
}
function ju(e, n) {
  return e.queries.getByIndex(n);
}
function dD(e, n) {
  let t = e[I],
    r = ju(t, n);
  return r.crossesNgTemplate ? Kl(t, e, n, []) : bg(t, e, r, n);
}
var Kp = new Set();
function cn(e) {
  Kp.has(e) ||
    (Kp.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var jn = class {},
  Ws = class {};
var ws = class extends jn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new Es(this);
    constructor(n, t, r, o = !0) {
      super(), (this.ngModuleType = n), (this._parent = t);
      let i = Xc(n);
      (this._bootstrapComponents = $h(i.bootstrap)),
        (this._r3Injector = bl(
          n,
          t,
          [
            { provide: jn, useValue: this },
            { provide: Io, useValue: this.componentFactoryResolver },
            ...r,
          ],
          Pt(n),
          new Set(["environment"])
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let n = this._r3Injector;
      !n.destroyed && n.destroy(),
        this.destroyCbs.forEach((t) => t()),
        (this.destroyCbs = null);
    }
    onDestroy(n) {
      this.destroyCbs.push(n);
    }
  },
  _s = class extends Ws {
    moduleType;
    constructor(n) {
      super(), (this.moduleType = n);
    }
    create(n) {
      return new ws(this.moduleType, n, []);
    }
  };
var Eo = class extends jn {
  injector;
  componentFactoryResolver = new Es(this);
  instance = null;
  constructor(n) {
    super();
    let t = new _n(
      [
        ...n.providers,
        { provide: jn, useValue: this },
        { provide: Io, useValue: this.componentFactoryResolver },
      ],
      n.parent || to(),
      n.debugName,
      new Set(["environment"])
    );
    (this.injector = t),
      n.runEnvironmentInitializers && t.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(n) {
    this.injector.onDestroy(n);
  }
};
function So(e, n, t = null) {
  return new Eo({
    providers: e,
    parent: n,
    debugName: t,
    runEnvironmentInitializers: !0,
  }).injector;
}
var fD = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(t) {
      this._injector = t;
    }
    getOrCreateStandaloneInjector(t) {
      if (!t.standalone) return null;
      if (!this.cachedInjectors.has(t)) {
        let r = Jc(!1, t.type),
          o =
            r.length > 0
              ? So([r], this._injector, `Standalone[${t.type.name}]`)
              : null;
        this.cachedInjectors.set(t, o);
      }
      return this.cachedInjectors.get(t);
    }
    ngOnDestroy() {
      try {
        for (let t of this.cachedInjectors.values()) t !== null && t.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = _({
      token: e,
      providedIn: "environment",
      factory: () => new e(R(De)),
    });
  }
  return e;
})();
function k(e) {
  return Er(() => {
    let n = wg(e),
      t = K(b({}, n), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === fu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (n.standalone && e.dependencies) || null,
        getStandaloneInjector: n.standalone
          ? (o) => o.get(fD).getOrCreateStandaloneInjector(t)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Lt.Emulated,
        styles: e.styles || Qe,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    n.standalone && cn("NgStandalone"), _g(t);
    let r = e.dependencies;
    return (
      (t.directiveDefs = Jp(r, pD)), (t.pipeDefs = Jp(r, Xf)), (t.id = mD(t)), t
    );
  });
}
function pD(e) {
  return Qt(e) || Kc(e);
}
function Mo(e) {
  return Er(() => ({
    type: e.type,
    bootstrap: e.bootstrap || Qe,
    declarations: e.declarations || Qe,
    imports: e.imports || Qe,
    exports: e.exports || Qe,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function hD(e, n) {
  if (e == null) return Mn;
  let t = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = Ls.None), (c = null)),
        (t[i] = [r, a, c]),
        (n[i] = s);
    }
  return t;
}
function gD(e) {
  if (e == null) return Mn;
  let n = {};
  for (let t in e) e.hasOwnProperty(t) && (n[e[t]] = t);
  return n;
}
function ln(e) {
  return Er(() => {
    let n = wg(e);
    return _g(n), n;
  });
}
function wg(e) {
  let n = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: n,
    inputConfig: e.inputs || Mn,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || Qe,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    resolveHostDirectives: null,
    hostDirectives: null,
    inputs: hD(e.inputs, n),
    outputs: gD(e.outputs),
    debugInfo: null,
  };
}
function _g(e) {
  e.features?.forEach((n) => n(e));
}
function Jp(e, n) {
  return e
    ? () => {
        let t = typeof e == "function" ? e() : e,
          r = [];
        for (let o of t) {
          let i = n(o);
          i !== null && r.push(i);
        }
        return r;
      }
    : null;
}
function mD(e) {
  let n = 0,
    t = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      t,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) n = (Math.imul(31, n) + i.charCodeAt(0)) << 0;
  return (n += 2147483648), "c" + n;
}
function Ig(e, n, t, r, o, i, s, a) {
  if (t.firstCreatePass) {
    e.mergedAttrs = Ns(e.mergedAttrs, e.attrs);
    let u = (e.tView = Cu(
      2,
      e,
      o,
      i,
      s,
      t.directiveRegistry,
      t.pipeRegistry,
      null,
      t.schemas,
      t.consts,
      null
    ));
    t.queries !== null &&
      (t.queries.template(t, e), (u.queries = t.queries.embeddedTView(e)));
  }
  a && (e.flags |= a), gr(e, !1);
  let c = yD(t, n, e, r);
  ss() && _u(t, n, c, e), yr(c, n);
  let l = lg(c, n, c, e);
  (n[r + de] = l), Eu(n, l), eD(l, e, n);
}
function vD(e, n, t, r, o, i, s, a, c, l, u) {
  let d = t + de,
    p;
  return (
    n.firstCreatePass
      ? ((p = _o(n, d, 4, s || null, a || null)),
        es() && mg(n, e, p, tt(n.consts, l), Su),
        gh(n, p))
      : (p = n.data[d]),
    Ig(p, e, n, t, r, o, i, c),
    pr(p) && Bs(n, e, p),
    l != null && wo(e, p, u),
    p
  );
}
function Is(e, n, t, r, o, i, s, a, c, l, u) {
  let d = t + de,
    p;
  if (n.firstCreatePass) {
    if (((p = _o(n, d, 4, s || null, a || null)), l != null)) {
      let f = tt(n.consts, l);
      p.localNames = [];
      for (let D = 0; D < f.length; D += 2) p.localNames.push(f[D], -1);
    }
  } else p = n.data[d];
  return Ig(p, e, n, t, r, o, i, c), l != null && wo(e, p, u), p;
}
function To(e, n, t, r, o, i, s, a) {
  let c = V(),
    l = Le(),
    u = tt(l.consts, i);
  return vD(c, l, e, n, t, r, o, u, void 0, s, a), To;
}
var yD = CD;
function CD(e, n, t, r) {
  return uo(!0), n[se].createComment("");
}
var Hu = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(Hu || {}),
  xo = new S(""),
  Sg = !1,
  Jl = class extends ce {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(n = !1) {
      super(),
        (this.__isAsync = n),
        rp() &&
          ((this.destroyRef = v(kn, { optional: !0 }) ?? void 0),
          (this.pendingTasks = v(Ft, { optional: !0 }) ?? void 0));
    }
    emit(n) {
      let t = F(null);
      try {
        super.next(n);
      } finally {
        F(t);
      }
    }
    subscribe(n, t, r) {
      let o = n,
        i = t || (() => null),
        s = r;
      if (n && typeof n == "object") {
        let c = n;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return n instanceof ne && n.add(a), a;
    }
    wrapInTimeout(n) {
      return (t) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          try {
            n(t);
          } finally {
            r !== void 0 && this.pendingTasks?.remove(r);
          }
        });
      };
    }
  },
  xe = Jl;
function Mg(e) {
  let n, t;
  function r() {
    e = ho;
    try {
      t !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(t),
        n !== void 0 && clearTimeout(n);
    } catch {}
  }
  return (
    (n = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (t = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function eh(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = ho;
    }
  );
}
var Bu = "isAngularZone",
  Ss = Bu + "_ID",
  DD = 0,
  te = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new xe(!1);
    onMicrotaskEmpty = new xe(!1);
    onStable = new xe(!1);
    onError = new xe(!1);
    constructor(n) {
      let {
        enableLongStackTrace: t = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Sg,
      } = n;
      if (typeof Zone > "u") throw new w(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        wD(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Bu) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new w(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new w(909, !1);
    }
    run(n, t, r) {
      return this._inner.run(n, t, r);
    }
    runTask(n, t, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, n, ED, ho, ho);
      try {
        return i.runTask(s, t, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(n, t, r) {
      return this._inner.runGuarded(n, t, r);
    }
    runOutsideAngular(n) {
      return this._outer.run(n);
    }
  },
  ED = {};
function Vu(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function bD(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function n() {
    Mg(() => {
      (e.callbackScheduled = !1),
        eu(e),
        (e.isCheckStableRunning = !0),
        Vu(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        n();
      })
    : e._outer.run(() => {
        n();
      }),
    eu(e);
}
function wD(e) {
  let n = () => {
      bD(e);
    },
    t = DD++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Bu]: !0, [Ss]: t, [Ss + t]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (_D(c)) return r.invokeTask(i, s, a, c);
      try {
        return th(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          n(),
          nh(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return th(e), r.invoke(i, s, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !ID(c) &&
          n(),
          nh(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), eu(e), Vu(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function eu(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function th(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function nh(e) {
  e._nesting--, Vu(e);
}
var Ms = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new xe();
  onMicrotaskEmpty = new xe();
  onStable = new xe();
  onError = new xe();
  run(n, t, r) {
    return n.apply(t, r);
  }
  runGuarded(n, t, r) {
    return n.apply(t, r);
  }
  runOutsideAngular(n) {
    return n();
  }
  runTask(n, t, r, o) {
    return n.apply(t, r);
  }
};
function _D(e) {
  return Tg(e, "__ignore_ng_zone__");
}
function ID(e) {
  return Tg(e, "__scheduler_tick__");
}
function Tg(e, n) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[n] === !0;
}
var xg = (() => {
  class e {
    impl = null;
    execute() {
      this.impl?.execute();
    }
    static ɵprov = _({ token: e, providedIn: "root", factory: () => new e() });
  }
  return e;
})();
var $u = (() => {
  class e {
    log(t) {
      console.log(t);
    }
    warn(t) {
      console.warn(t);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "platform" });
  }
  return e;
})();
var Uu = new S("");
function _r(e) {
  return !!e && typeof e.then == "function";
}
function zu(e) {
  return !!e && typeof e.subscribe == "function";
}
var Og = new S("");
var Gu = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((t, r) => {
        (this.resolve = t), (this.reject = r);
      });
      appInits = v(Og, { optional: !0 }) ?? [];
      injector = v(vt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let t = [];
        for (let o of this.appInits) {
          let i = Te(this.injector, o);
          if (_r(i)) t.push(i);
          else if (zu(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            t.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(t)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          t.length === 0 && r(),
          (this.initialized = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  qs = new S("");
function Rg() {
  oc(() => {
    let e = "";
    throw new w(600, e);
  });
}
function Ng(e) {
  return e.isBoundToModule;
}
var SD = 10;
var Bn = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = v(ze);
    afterRenderManager = v(xg);
    zonelessEnabled = v(po);
    rootEffectScheduler = v(Sl);
    dirtyFlags = 0;
    tracingSnapshot = null;
    allTestViews = new Set();
    autoDetectTestViews = new Set();
    includeAllTestViews = !1;
    afterTick = new ce();
    get allViews() {
      return [
        ...(this.includeAllTestViews
          ? this.allTestViews
          : this.autoDetectTestViews
        ).keys(),
        ...this._views,
      ];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    internalPendingTask = v(Ft);
    get isStable() {
      return this.internalPendingTask.hasPendingTasksObservable.pipe(
        B((t) => !t)
      );
    }
    constructor() {
      v(xo, { optional: !0 });
    }
    whenStable() {
      let t;
      return new Promise((r) => {
        t = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        t.unsubscribe();
      });
    }
    _injector = v(De);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(t, r) {
      return this.bootstrapImpl(t, r);
    }
    bootstrapImpl(t, r, o = vt.NULL) {
      return this._injector.get(te).run(() => {
        X(10);
        let s = t instanceof Us;
        if (!this._injector.get(Gu).done) {
          let D = "";
          throw new w(405, D);
        }
        let c;
        s ? (c = t) : (c = this._injector.get(Io).resolveComponentFactory(t)),
          this.componentTypes.push(c.componentType);
        let l = Ng(c) ? void 0 : this._injector.get(jn),
          u = r || c.selector,
          d = c.create(o, [], u, l),
          p = d.location.nativeElement,
          f = d.injector.get(Uu, null);
        return (
          f?.registerApplication(p),
          d.onDestroy(() => {
            this.detachView(d.hostView),
              mo(this.components, d),
              f?.unregisterApplication(p);
          }),
          this._loadComponent(d),
          X(11, d),
          d
        );
      });
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      X(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Hu.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl();
    }
    tickImpl = () => {
      if (this._runningTick) throw new w(101, !1);
      let t = F(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } finally {
        (this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          F(t),
          this.afterTick.next(),
          X(13);
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(Ln, null, {
          optional: !0,
        }));
      let t = 0;
      for (; this.dirtyFlags !== 0 && t++ < SD; )
        X(14), this.synchronizeOnce(), X(15);
    }
    synchronizeOnce() {
      this.dirtyFlags & 16 &&
        ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush());
      let t = !1;
      if (this.dirtyFlags & 7) {
        let r = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: o } of this.allViews) {
          if (!r && !so(o)) continue;
          let i = r && !this.zonelessEnabled ? 0 : 1;
          Ru(o, i), (t = !0);
        }
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      }
      t || (this._rendererFactory?.begin?.(), this._rendererFactory?.end?.()),
        this.dirtyFlags & 8 &&
          ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: t }) => so(t))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(t) {
      let r = t;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(t) {
      let r = t;
      mo(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(t) {
      this.attachView(t.hostView);
      try {
        this.tick();
      } catch (o) {
        this.internalErrorHandler(o);
      }
      this.components.push(t), this._injector.get(qs, []).forEach((o) => o(t));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((t) => t()),
            this._views.slice().forEach((t) => t.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(t) {
      return (
        this._destroyListeners.push(t), () => mo(this._destroyListeners, t)
      );
    }
    destroy() {
      if (this._destroyed) throw new w(406, !1);
      let t = this._injector;
      t.destroy && !t.destroyed && t.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function mo(e, n) {
  let t = e.indexOf(n);
  t > -1 && e.splice(t, 1);
}
var tu = class {
  destroy(n) {}
  updateValue(n, t) {}
  swap(n, t) {
    let r = Math.min(n, t),
      o = Math.max(n, t),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(n, t) {
    this.attach(t, this.detach(n));
  }
};
function Nl(e, n, t, r, o) {
  return e === t && Object.is(n, r) ? 1 : Object.is(o(e, n), o(t, r)) ? -1 : 0;
}
function MD(e, n, t) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(n)) {
    let c = n.length - 1;
    for (; i <= s && i <= c; ) {
      let l = e.at(i),
        u = n[i],
        d = Nl(i, l, i, u, t);
      if (d !== 0) {
        d < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let p = e.at(s),
        f = n[c],
        D = Nl(s, p, c, f, t);
      if (D !== 0) {
        D < 0 && e.updateValue(s, f), s--, c--;
        continue;
      }
      let M = t(i, l),
        U = t(s, p),
        z = t(i, u);
      if (Object.is(z, U)) {
        let hn = t(c, f);
        Object.is(hn, M)
          ? (e.swap(i, s), e.updateValue(s, f), c--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++;
        continue;
      }
      if (((r ??= new Ts()), (o ??= oh(e, i, s, t)), nu(e, r, i, z)))
        e.updateValue(i, u), i++, s++;
      else if (o.has(z)) r.set(M, e.detach(i)), s--;
      else {
        let hn = e.create(i, n[i]);
        e.attach(i, hn), i++, s++;
      }
    }
    for (; i <= c; ) rh(e, r, t, i, n[i]), i++;
  } else if (n != null) {
    let c = n[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        p = Nl(i, u, i, d, t);
      if (p !== 0) p < 0 && e.updateValue(i, d), i++, (l = c.next());
      else {
        (r ??= new Ts()), (o ??= oh(e, i, s, t));
        let f = t(i, d);
        if (nu(e, r, i, f)) e.updateValue(i, d), i++, s++, (l = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (l = c.next());
        else {
          let D = t(i, u);
          r.set(D, e.detach(i)), s--;
        }
      }
    }
    for (; !l.done; ) rh(e, r, t, e.length, l.value), (l = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function nu(e, n, t, r) {
  return n !== void 0 && n.has(r)
    ? (e.attach(t, n.get(r)), n.delete(r), !0)
    : !1;
}
function rh(e, n, t, r, o) {
  if (nu(e, n, r, t(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function oh(e, n, t, r) {
  let o = new Set();
  for (let i = n; i <= t; i++) o.add(r(i, e.at(i)));
  return o;
}
var Ts = class {
  kvMap = new Map();
  _vMap = void 0;
  has(n) {
    return this.kvMap.has(n);
  }
  delete(n) {
    if (!this.has(n)) return !1;
    let t = this.kvMap.get(n);
    return (
      this._vMap !== void 0 && this._vMap.has(t)
        ? (this.kvMap.set(n, this._vMap.get(t)), this._vMap.delete(t))
        : this.kvMap.delete(n),
      !0
    );
  }
  get(n) {
    return this.kvMap.get(n);
  }
  set(n, t) {
    if (this.kvMap.has(n)) {
      let r = this.kvMap.get(n);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, t);
    } else this.kvMap.set(n, t);
  }
  forEach(n) {
    for (let [t, r] of this.kvMap)
      if ((n(r, t), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), n(r, t);
      }
  }
};
function fe(e, n, t, r, o, i, s, a) {
  cn("NgControlFlow");
  let c = V(),
    l = Le(),
    u = tt(l.consts, i);
  return Is(c, l, e, n, t, r, o, u, 256, s, a), Wu;
}
function Wu(e, n, t, r, o, i, s, a) {
  cn("NgControlFlow");
  let c = V(),
    l = Le(),
    u = tt(l.consts, i);
  return Is(c, l, e, n, t, r, o, u, 512, s, a), Wu;
}
function pe(e, n) {
  cn("NgControlFlow");
  let t = V(),
    r = lo(),
    o = t[r] !== dt ? t[r] : -1,
    i = o !== -1 ? xs(t, de + o) : void 0,
    s = 0;
  if (on(t, r, e)) {
    let a = F(null);
    try {
      if ((i !== void 0 && dg(i, s), e !== -1)) {
        let c = de + e,
          l = xs(t, c),
          u = su(t[I], c),
          d = pg(l, u, t),
          p = Vs(t, u, n, { dehydratedView: d });
        $s(l, p, s, yo(u, d));
      }
    } finally {
      F(a);
    }
  } else if (i !== void 0) {
    let a = ug(i, s);
    a !== void 0 && (a[ie] = n);
  }
}
var ru = class {
  lContainer;
  $implicit;
  $index;
  constructor(n, t, r) {
    (this.lContainer = n), (this.$implicit = t), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - me;
  }
};
function rt(e) {
  return e;
}
function qu(e, n) {
  return n;
}
var ou = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(n, t, r) {
    (this.hasEmptyBlock = n), (this.trackByFn = t), (this.liveCollection = r);
  }
};
function _e(e, n, t, r, o, i, s, a, c, l, u, d, p) {
  cn("NgControlFlow");
  let f = V(),
    D = Le(),
    M = c !== void 0,
    U = V(),
    z = a ? s.bind(U[$e][ie]) : s,
    hn = new ou(M, z);
  (U[de + e] = hn),
    Is(f, D, e + 1, n, t, r, o, tt(D.consts, i), 256),
    M && Is(f, D, e + 2, c, l, u, d, tt(D.consts, p), 512);
}
var iu = class extends tu {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(n, t, r) {
    super(),
      (this.lContainer = n),
      (this.hostLView = t),
      (this.templateTNode = r);
  }
  get length() {
    return this.lContainer.length - me;
  }
  at(n) {
    return this.getLView(n)[ie].$implicit;
  }
  attach(n, t) {
    let r = t[ur];
    (this.needsIndexUpdate ||= n !== this.length),
      $s(this.lContainer, t, n, yo(this.templateTNode, r));
  }
  detach(n) {
    return (
      (this.needsIndexUpdate ||= n !== this.length - 1), TD(this.lContainer, n)
    );
  }
  create(n, t) {
    let r = Ul(this.lContainer, this.templateTNode.tView.ssrId),
      o = Vs(
        this.hostLView,
        this.templateTNode,
        new ru(this.lContainer, t, n),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(n) {
    js(n[I], n), this.operationsCounter?.recordDestroy();
  }
  updateValue(n, t) {
    this.getLView(n)[ie].$implicit = t;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let n = 0; n < this.length; n++) this.getLView(n)[ie].$index = n;
  }
  getLView(n) {
    return xD(this.lContainer, n);
  }
};
function Ie(e) {
  let n = F(null),
    t = en();
  try {
    let r = V(),
      o = r[I],
      i = r[t],
      s = t + 1,
      a = xs(r, s);
    if (i.liveCollection === void 0) {
      let l = su(o, s);
      i.liveCollection = new iu(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((MD(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = lo(),
        u = c.length === 0;
      if (on(r, l, u)) {
        let d = t + 2,
          p = xs(r, d);
        if (u) {
          let f = su(o, d),
            D = pg(p, f, r),
            M = Vs(r, f, void 0, { dehydratedView: D });
          $s(p, M, 0, yo(f, D));
        } else o.firstUpdatePass && bC(p), dg(p, 0);
      }
    }
  } finally {
    F(n);
  }
}
function xs(e, n) {
  return e[n];
}
function TD(e, n) {
  return Do(e, n);
}
function xD(e, n) {
  return ug(e, n);
}
function su(e, n) {
  return io(e, n);
}
function C(e, n, t) {
  let r = V(),
    o = lo();
  if (on(r, o, n)) {
    let i = Le(),
      s = xp();
    q0(s, r, e, n, r[se], t);
  }
  return C;
}
function ih(e, n, t, r, o) {
  xu(n, e, t, o ? "class" : "style", r);
}
function h(e, n, t, r) {
  let o = V(),
    i = o[I],
    s = e + de,
    a = i.firstCreatePass ? Pu(s, o, 2, n, Su, es(), t, r) : i.data[s];
  if ((Mu(a, o, e, n, Ag), pr(a))) {
    let c = o[I];
    Bs(c, o, a), gu(c, a, o);
  }
  return r != null && wo(o, a), h;
}
function g() {
  let e = Le(),
    n = je(),
    t = Tu(n);
  return (
    e.firstCreatePass && ku(e, t),
    fl(t) && pl(),
    dl(),
    t.classesWithoutHost != null &&
      Ny(t) &&
      ih(e, t, V(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Ay(t) &&
      ih(e, t, V(), t.stylesWithoutHost, !1),
    g
  );
}
function y(e, n, t, r) {
  return h(e, n, t, r), g(), y;
}
function ft(e, n, t, r) {
  let o = V(),
    i = o[I],
    s = e + de,
    a = i.firstCreatePass ? FC(s, i, 2, n, t, r) : i.data[s];
  return Mu(a, o, e, n, Ag), r != null && wo(o, a), ft;
}
function pt() {
  let e = je(),
    n = Tu(e);
  return fl(n) && pl(), dl(), pt;
}
function Ht(e, n, t, r) {
  return ft(e, n, t, r), pt(), Ht;
}
var Ag = (e, n, t, r, o) => (uo(!0), zh(n[se], r, Op()));
function Ys(e, n, t) {
  let r = V(),
    o = r[I],
    i = e + de,
    s = o.firstCreatePass
      ? Pu(i, r, 8, "ng-container", Su, es(), n, t)
      : o.data[i];
  if ((Mu(s, r, e, "ng-container", OD), pr(s))) {
    let a = r[I];
    Bs(a, r, s), gu(a, s, r);
  }
  return t != null && wo(r, s), Ys;
}
function Zs() {
  let e = Le(),
    n = je(),
    t = Tu(n);
  return e.firstCreatePass && ku(e, t), Zs;
}
var OD = (e, n, t, r, o) => (uo(!0), w0(n[se], ""));
function Ee() {
  return V();
}
var Oo = "en-US";
var RD = Oo;
function Pg(e) {
  typeof e == "string" && (RD = e.toLowerCase().replace(/_/g, "-"));
}
function O(e, n, t) {
  let r = V(),
    o = Le(),
    i = je();
  return ND(o, r, r[se], i, e, n, t), O;
}
function ND(e, n, t, r, o, i, s) {
  let a = !0,
    c = null;
  if (
    ((r.type & 3 || s) &&
      ((c ??= Ol(r, n, i)), HC(r, e, n, s, t, o, i, c) && (a = !1)),
    a)
  ) {
    let l = r.outputs?.[o],
      u = r.hostDirectiveOutputs?.[o];
    if (u && u.length)
      for (let d = 0; d < u.length; d += 2) {
        let p = u[d],
          f = u[d + 1];
        (c ??= Ol(r, n, i)), Zp(r, n, p, f, o, c);
      }
    if (l && l.length)
      for (let d of l) (c ??= Ol(r, n, i)), Zp(r, n, d, o, o, c);
  }
}
function $(e = 1) {
  return Tp(e);
}
function Oe(e, n, t) {
  cD(e, n, t);
}
function Re(e) {
  let n = V(),
    t = Le(),
    r = Cl();
  rs(r + 1);
  let o = ju(t, r);
  if (e.dirty && cp(n) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = dD(n, r);
      e.reset(i, qy), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function Ne() {
  return sD(V(), Cl());
}
function Yu(e) {
  let n = yp();
  return ap(n, de + e);
}
function cs(e, n) {
  return (e << 17) | (n << 2);
}
function Hn(e) {
  return (e >> 17) & 32767;
}
function AD(e) {
  return (e & 2) == 2;
}
function PD(e, n) {
  return (e & 131071) | (n << 17);
}
function au(e) {
  return e | 2;
}
function Dr(e) {
  return (e & 131068) >> 2;
}
function Al(e, n) {
  return (e & -131069) | (n << 2);
}
function kD(e) {
  return (e & 1) === 1;
}
function cu(e) {
  return e | 1;
}
function FD(e, n, t, r, o, i) {
  let s = i ? n.classBindings : n.styleBindings,
    a = Hn(s),
    c = Dr(s);
  e[r] = t;
  let l = !1,
    u;
  if (Array.isArray(t)) {
    let d = t;
    (u = d[1]), (u === null || lr(d, u) > 0) && (l = !0);
  } else u = t;
  if (o)
    if (c !== 0) {
      let p = Hn(e[a + 1]);
      (e[r + 1] = cs(p, a)),
        p !== 0 && (e[p + 1] = Al(e[p + 1], r)),
        (e[a + 1] = PD(e[a + 1], r));
    } else
      (e[r + 1] = cs(a, 0)), a !== 0 && (e[a + 1] = Al(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = cs(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = Al(e[c + 1], r)),
      (c = r);
  l && (e[r + 1] = au(e[r + 1])),
    sh(e, u, r, !0),
    sh(e, u, r, !1),
    LD(n, u, e, r, i),
    (s = cs(a, c)),
    i ? (n.classBindings = s) : (n.styleBindings = s);
}
function LD(e, n, t, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof n == "string" &&
    lr(i, n) >= 0 &&
    (t[r + 1] = cu(t[r + 1]));
}
function sh(e, n, t, r) {
  let o = e[t + 1],
    i = n === null,
    s = r ? Hn(o) : Dr(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    jD(c, n) && ((a = !0), (e[s + 1] = r ? cu(l) : au(l))),
      (s = r ? Hn(l) : Dr(l));
  }
  a && (e[t + 1] = r ? au(o) : cu(o));
}
function jD(e, n) {
  return e === null || n == null || (Array.isArray(e) ? e[1] : e) === n
    ? !0
    : Array.isArray(e) && typeof n == "string"
    ? lr(e, n) >= 0
    : !1;
}
function Vn(e, n) {
  return HD(e, n, null, !0), Vn;
}
function HD(e, n, t, r) {
  let o = V(),
    i = Le(),
    s = Dp(2);
  if ((i.firstUpdatePass && VD(i, e, s, r), n !== dt && on(o, s, n))) {
    let a = i.data[en()];
    WD(i, a, o, o[se], e, (o[s + 1] = qD(n, t)), r, s);
  }
}
function BD(e, n) {
  return n >= e.expandoStartIndex;
}
function VD(e, n, t, r) {
  let o = e.data;
  if (o[t + 1] === null) {
    let i = o[en()],
      s = BD(e, t);
    YD(i, r) && n === null && !s && (n = !1),
      (n = $D(o, i, n, r)),
      FD(o, i, n, t, s, r);
  }
}
function $D(e, n, t, r) {
  let o = _p(e),
    i = r ? n.residualClasses : n.residualStyles;
  if (o === null)
    (r ? n.classBindings : n.styleBindings) === 0 &&
      ((t = Pl(null, e, n, t, r)), (t = bo(t, n.attrs, r)), (i = null));
  else {
    let s = n.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((t = Pl(o, e, n, t, r)), i === null)) {
        let c = UD(e, n, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Pl(null, e, n, c[1], r)),
          (c = bo(c, n.attrs, r)),
          zD(e, n, r, c));
      } else i = GD(e, n, r);
  }
  return (
    i !== void 0 && (r ? (n.residualClasses = i) : (n.residualStyles = i)), t
  );
}
function UD(e, n, t) {
  let r = t ? n.classBindings : n.styleBindings;
  if (Dr(r) !== 0) return e[Hn(r)];
}
function zD(e, n, t, r) {
  let o = t ? n.classBindings : n.styleBindings;
  e[Hn(o)] = r;
}
function GD(e, n, t) {
  let r,
    o = n.directiveEnd;
  for (let i = 1 + n.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = bo(r, s, t);
  }
  return bo(r, n.attrs, t);
}
function Pl(e, n, t, r, o) {
  let i = null,
    s = t.directiveEnd,
    a = t.directiveStylingLast;
  for (
    a === -1 ? (a = t.directiveStart) : a++;
    a < s && ((i = n[a]), (r = bo(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (t.directiveStylingLast = a), r;
}
function bo(e, n, t) {
  let r = t ? 1 : 2,
    o = -1;
  if (n !== null)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          Qf(e, s, t ? !0 : n[++i]));
    }
  return e === void 0 ? null : e;
}
function WD(e, n, t, r, o, i, s, a) {
  if (!(n.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = kD(l) ? ah(c, n, t, o, Dr(l), s) : void 0;
  if (!Os(u)) {
    Os(i) || (AD(l) && (i = ah(c, null, t, o, a, s)));
    let d = il(en(), t);
    $0(r, s, d, o, i);
  }
}
function ah(e, n, t, r, o, i) {
  let s = n === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = t[o + 1];
    p === dt && (p = d ? Qe : void 0);
    let f = d ? Zi(p, r) : u === r ? p : void 0;
    if ((l && !Os(f) && (f = Zi(c, r)), Os(f) && ((a = f), s))) return a;
    let D = e[o + 1];
    o = s ? Hn(D) : Dr(D);
  }
  if (n !== null) {
    let c = i ? n.residualClasses : n.residualStyles;
    c != null && (a = Zi(c, r));
  }
  return a;
}
function Os(e) {
  return e !== void 0;
}
function qD(e, n) {
  return (
    e == null ||
      e === "" ||
      (typeof n == "string"
        ? (e = e + n)
        : typeof e == "object" && (e = Pt(mu(e)))),
    e
  );
}
function YD(e, n) {
  return (e.flags & (n ? 8 : 16)) !== 0;
}
function E(e, n = "") {
  let t = V(),
    r = Le(),
    o = e + de,
    i = r.firstCreatePass ? _o(r, o, 1, n, null) : r.data[o],
    s = ZD(r, t, i, n, e);
  (t[o] = s), ss() && _u(r, t, s, i), gr(i, !1);
}
var ZD = (e, n, t, r, o) => (uo(!0), E0(n[se], r));
function QD(e, n, t, r = "") {
  return on(e, lo(), t) ? n + Wi(t) + r : dt;
}
function ht(e) {
  return He("", e), ht;
}
function He(e, n, t) {
  let r = V(),
    o = QD(r, e, n, t);
  return o !== dt && XD(r, en(), o), He;
}
function XD(e, n, t) {
  let r = il(n, e);
  b0(e[se], r, t);
}
function Zu(e, n, t) {
  let r = ts() + e,
    o = V();
  return o[r] === dt ? Lu(o, r, t ? n.call(t) : n()) : LC(o, r);
}
function Y(e, n, t, r) {
  return KD(V(), ts(), e, n, t, r);
}
function $n(e, n, t, r, o) {
  return JD(V(), ts(), e, n, t, r, o);
}
function kg(e, n) {
  let t = e[n];
  return t === dt ? void 0 : t;
}
function KD(e, n, t, r, o, i) {
  let s = n + t;
  return on(e, s, o) ? Lu(e, s + 1, i ? r.call(i, o) : r(o)) : kg(e, s + 1);
}
function JD(e, n, t, r, o, i, s) {
  let a = n + t;
  return jC(e, a, o, i)
    ? Lu(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : kg(e, a + 2);
}
var Rs = class {
    ngModuleFactory;
    componentFactories;
    constructor(n, t) {
      (this.ngModuleFactory = n), (this.componentFactories = t);
    }
  },
  Qu = (() => {
    class e {
      compileModuleSync(t) {
        return new _s(t);
      }
      compileModuleAsync(t) {
        return Promise.resolve(this.compileModuleSync(t));
      }
      compileModuleAndAllComponentsSync(t) {
        let r = this.compileModuleSync(t),
          o = Xc(t),
          i = $h(o.declarations).reduce((s, a) => {
            let c = Qt(a);
            return c && s.push(new Cr(c)), s;
          }, []);
        return new Rs(r, i);
      }
      compileModuleAndAllComponentsAsync(t) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
      }
      clearCache() {}
      clearCacheFor(t) {}
      getModuleId(t) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var eE = (() => {
    class e {
      zone = v(te);
      changeDetectionScheduler = v(In);
      applicationRef = v(Bn);
      applicationErrorHandler = v(ze);
      _onMicrotaskEmptySubscription;
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    try {
                      (this.applicationRef.dirtyFlags |= 1),
                        this.applicationRef._tick();
                    } catch (t) {
                      this.applicationErrorHandler(t);
                    }
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Fg = new S("", { factory: () => !1 });
function Xu({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: n,
  scheduleInRootZone: t,
}) {
  return (
    (e ??= () => new te(K(b({}, Ju()), { scheduleInRootZone: t }))),
    [
      { provide: te, useFactory: e },
      {
        provide: kt,
        multi: !0,
        useFactory: () => {
          let r = v(eE, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: kt,
        multi: !0,
        useFactory: () => {
          let r = v(tE);
          return () => {
            r.initialize();
          };
        },
      },
      n === !0 ? { provide: _l, useValue: !0 } : [],
      { provide: Il, useValue: t ?? Sg },
      {
        provide: ze,
        useFactory: () => {
          let r = v(te),
            o = v(De),
            i;
          return (s) => {
            r.runOutsideAngular(() => {
              o.destroyed && !i
                ? setTimeout(() => {
                    throw s;
                  })
                : ((i ??= o.get(yt)), i.handleError(s));
            });
          };
        },
      },
    ]
  );
}
function Ku(e) {
  let n = e?.ignoreChangesOutsideZone,
    t = e?.scheduleInRootZone,
    r = Xu({
      ngZoneFactory: () => {
        let o = Ju(e);
        return (
          (o.scheduleInRootZone = t),
          o.shouldCoalesceEventChangeDetection && cn("NgZone_CoalesceEvent"),
          new te(o)
        );
      },
      ignoreChangesOutsideZone: n,
      scheduleInRootZone: t,
    });
  return Tn([{ provide: Fg, useValue: !0 }, { provide: po, useValue: !1 }, r]);
}
function Ju(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var tE = (() => {
  class e {
    subscription = new ne();
    initialized = !1;
    zone = v(te);
    pendingTasks = v(Ft);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let t = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (t = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              te.assertNotInAngularZone(),
                queueMicrotask(() => {
                  t !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(t), (t = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            te.assertInAngularZone(), (t ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var Lg = (() => {
  class e {
    applicationErrorHandler = v(ze);
    appRef = v(Bn);
    taskService = v(Ft);
    ngZone = v(te);
    zonelessEnabled = v(po);
    tracing = v(xo, { optional: !0 });
    disableScheduling = v(_l, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new ne();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(Ss) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (v(Il, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Ms || !this.zoneIsDefined));
    }
    notify(t) {
      if (!this.zonelessEnabled && t === 5) return;
      let r = !1;
      switch (t) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 12: {
          (this.appRef.dirtyFlags |= 16), (r = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? eh : Mg;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick())
            ));
    }
    shouldScheduleTick(t) {
      return !(
        (this.disableScheduling && !t) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(Ss + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let t = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        this.taskService.remove(t), this.applicationErrorHandler(r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        eh(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(t);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let t = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(t);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function nE() {
  return (typeof $localize < "u" && $localize.locale) || Oo;
}
var Qs = new S("", {
  providedIn: "root",
  factory: () => v(Qs, { optional: !0, skipSelf: !0 }) || nE(),
});
var $g = Symbol("InputSignalNode#UNSET"),
  CE = K(b({}, pi), {
    transformFn: void 0,
    applyValueToInputSignal(e, n) {
      $r(e, n);
    },
  });
function Ug(e, n) {
  let t = Object.create(CE);
  (t.value = e), (t.transformFn = n?.transform);
  function r() {
    if ((ui(t), t.value === $g)) {
      let o = null;
      throw new w(-950, o);
    }
    return t.value;
  }
  return (r[Ot] = t), r;
}
var DE = new S("");
DE.__NG_ELEMENT_ID__ = (e) => {
  let n = je();
  if (n === null) throw new w(204, !1);
  if (n.type & 2) return n.value;
  if (e & 8) return null;
  throw new w(204, !1);
};
function jg(e, n) {
  return Ug(e, n);
}
function EE(e) {
  return Ug($g, e);
}
var zg = ((jg.required = EE), jg);
var ed = new S(""),
  bE = new S("");
function Ro(e) {
  return !e.moduleRef;
}
function wE(e) {
  let n = Ro(e) ? e.r3Injector : e.moduleRef.injector,
    t = n.get(te);
  return t.run(() => {
    Ro(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = n.get(ze),
      o;
    if (
      (t.runOutsideAngular(() => {
        o = t.onError.subscribe({ next: r });
      }),
      Ro(e))
    ) {
      let i = () => n.destroy(),
        s = e.platformInjector.get(ed);
      s.add(i),
        n.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(ed);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          mo(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return IE(r, t, () => {
      let i = n.get(Ft),
        s = i.add(),
        a = n.get(Gu);
      return (
        a.runInitializers(),
        a.donePromise
          .then(() => {
            let c = n.get(Qs, Oo);
            if ((Pg(c || Oo), !n.get(bE, !0)))
              return Ro(e)
                ? n.get(Bn)
                : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
            if (Ro(e)) {
              let u = n.get(Bn);
              return (
                e.rootComponent !== void 0 && u.bootstrap(e.rootComponent), u
              );
            } else return _E?.(e.moduleRef, e.allPlatformModules), e.moduleRef;
          })
          .finally(() => void i.remove(s))
      );
    });
  });
}
var _E;
function IE(e, n, t) {
  try {
    let r = t();
    return _r(r)
      ? r.catch((o) => {
          throw (n.runOutsideAngular(() => e(o)), o);
        })
      : r;
  } catch (r) {
    throw (n.runOutsideAngular(() => e(r)), r);
  }
}
var Xs = null;
function SE(e = [], n) {
  return vt.create({
    name: n,
    providers: [
      { provide: eo, useValue: "platform" },
      { provide: ed, useValue: new Set([() => (Xs = null)]) },
      ...e,
    ],
  });
}
function ME(e = []) {
  if (Xs) return Xs;
  let n = SE(e);
  return (Xs = n), Rg(), TE(n), n;
}
function TE(e) {
  let n = e.get(ks, null);
  Te(e, () => {
    n?.forEach((t) => t());
  });
}
var Un = (() => {
  class e {
    static __NG_ELEMENT_ID__ = xE;
  }
  return e;
})();
function xE(e) {
  return OE(je(), V(), (e & 16) === 16);
}
function OE(e, n, t) {
  if (Jt(e) && !t) {
    let r = et(e.index, n);
    return new nn(r, r);
  } else if (e.type & 175) {
    let r = n[$e];
    return new nn(r, n);
  }
  return null;
}
var td = class {
    constructor() {}
    supports(n) {
      return Fu(n);
    }
    create(n) {
      return new nd(n);
    }
  },
  RE = (e, n) => n,
  nd = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(n) {
      this._trackByFn = n || RE;
    }
    forEachItem(n) {
      let t;
      for (t = this._itHead; t !== null; t = t._next) n(t);
    }
    forEachOperation(n) {
      let t = this._itHead,
        r = this._removalsHead,
        o = 0,
        i = null;
      for (; t || r; ) {
        let s = !r || (t && t.currentIndex < Hg(r, o, i)) ? t : r,
          a = Hg(s, o, i),
          c = s.currentIndex;
        if (s === r) o--, (r = r._nextRemoved);
        else if (((t = t._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let l = a - o,
            u = c - o;
          if (l != u) {
            for (let p = 0; p < l; p++) {
              let f = p < i.length ? i[p] : (i[p] = 0),
                D = f + p;
              u <= D && D < l && (i[p] = f + 1);
            }
            let d = s.previousIndex;
            i[d] = u - l;
          }
        }
        a !== c && n(s, a, c);
      }
    }
    forEachPreviousItem(n) {
      let t;
      for (t = this._previousItHead; t !== null; t = t._nextPrevious) n(t);
    }
    forEachAddedItem(n) {
      let t;
      for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
    }
    forEachMovedItem(n) {
      let t;
      for (t = this._movesHead; t !== null; t = t._nextMoved) n(t);
    }
    forEachRemovedItem(n) {
      let t;
      for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
    }
    forEachIdentityChange(n) {
      let t;
      for (t = this._identityChangesHead; t !== null; t = t._nextIdentityChange)
        n(t);
    }
    diff(n) {
      if ((n == null && (n = []), !Fu(n))) throw new w(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let t = this._itHead,
        r = !1,
        o,
        i,
        s;
      if (Array.isArray(n)) {
        this.length = n.length;
        for (let a = 0; a < this.length; a++)
          (i = n[a]),
            (s = this._trackByFn(a, i)),
            t === null || !Object.is(t.trackById, s)
              ? ((t = this._mismatch(t, i, s, a)), (r = !0))
              : (r && (t = this._verifyReinsertion(t, i, s, a)),
                Object.is(t.item, i) || this._addIdentityChange(t, i)),
            (t = t._next);
      } else
        (o = 0),
          yg(n, (a) => {
            (s = this._trackByFn(o, a)),
              t === null || !Object.is(t.trackById, s)
                ? ((t = this._mismatch(t, a, s, o)), (r = !0))
                : (r && (t = this._verifyReinsertion(t, a, s, o)),
                  Object.is(t.item, a) || this._addIdentityChange(t, a)),
              (t = t._next),
              o++;
          }),
          (this.length = o);
      return this._truncate(t), (this.collection = n), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let n;
        for (n = this._previousItHead = this._itHead; n !== null; n = n._next)
          n._nextPrevious = n._next;
        for (n = this._additionsHead; n !== null; n = n._nextAdded)
          n.previousIndex = n.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, n = this._movesHead;
          n !== null;
          n = n._nextMoved
        )
          n.previousIndex = n.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(n, t, r, o) {
      let i;
      return (
        n === null ? (i = this._itTail) : ((i = n._prev), this._remove(n)),
        (n =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        n !== null
          ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
            this._reinsertAfter(n, i, o))
          : ((n =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, o)),
            n !== null
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._moveAfter(n, i, o))
              : (n = this._addAfter(new rd(t, r), i, o))),
        n
      );
    }
    _verifyReinsertion(n, t, r, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        i !== null
          ? (n = this._reinsertAfter(i, n._prev, o))
          : n.currentIndex != o &&
            ((n.currentIndex = o), this._addToMoves(n, o)),
        n
      );
    }
    _truncate(n) {
      for (; n !== null; ) {
        let t = n._next;
        this._addToRemovals(this._unlink(n)), (n = t);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(n, t, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(n);
      let o = n._prevRemoved,
        i = n._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(n, t, r),
        this._addToMoves(n, r),
        n
      );
    }
    _moveAfter(n, t, r) {
      return (
        this._unlink(n), this._insertAfter(n, t, r), this._addToMoves(n, r), n
      );
    }
    _addAfter(n, t, r) {
      return (
        this._insertAfter(n, t, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = n)
          : (this._additionsTail = this._additionsTail._nextAdded = n),
        n
      );
    }
    _insertAfter(n, t, r) {
      let o = t === null ? this._itHead : t._next;
      return (
        (n._next = o),
        (n._prev = t),
        o === null ? (this._itTail = n) : (o._prev = n),
        t === null ? (this._itHead = n) : (t._next = n),
        this._linkedRecords === null && (this._linkedRecords = new Ks()),
        this._linkedRecords.put(n),
        (n.currentIndex = r),
        n
      );
    }
    _remove(n) {
      return this._addToRemovals(this._unlink(n));
    }
    _unlink(n) {
      this._linkedRecords !== null && this._linkedRecords.remove(n);
      let t = n._prev,
        r = n._next;
      return (
        t === null ? (this._itHead = r) : (t._next = r),
        r === null ? (this._itTail = t) : (r._prev = t),
        n
      );
    }
    _addToMoves(n, t) {
      return (
        n.previousIndex === t ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = n)
            : (this._movesTail = this._movesTail._nextMoved = n)),
        n
      );
    }
    _addToRemovals(n) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Ks()),
        this._unlinkedRecords.put(n),
        (n.currentIndex = null),
        (n._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = n),
            (n._prevRemoved = null))
          : ((n._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = n)),
        n
      );
    }
    _addIdentityChange(n, t) {
      return (
        (n.item = t),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = n)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                n),
        n
      );
    }
  },
  rd = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(n, t) {
      (this.item = n), (this.trackById = t);
    }
  },
  od = class {
    _head = null;
    _tail = null;
    add(n) {
      this._head === null
        ? ((this._head = this._tail = n),
          (n._nextDup = null),
          (n._prevDup = null))
        : ((this._tail._nextDup = n),
          (n._prevDup = this._tail),
          (n._nextDup = null),
          (this._tail = n));
    }
    get(n, t) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((t === null || t <= r.currentIndex) && Object.is(r.trackById, n))
          return r;
      return null;
    }
    remove(n) {
      let t = n._prevDup,
        r = n._nextDup;
      return (
        t === null ? (this._head = r) : (t._nextDup = r),
        r === null ? (this._tail = t) : (r._prevDup = t),
        this._head === null
      );
    }
  },
  Ks = class {
    map = new Map();
    put(n) {
      let t = n.trackById,
        r = this.map.get(t);
      r || ((r = new od()), this.map.set(t, r)), r.add(n);
    }
    get(n, t) {
      let r = n,
        o = this.map.get(r);
      return o ? o.get(n, t) : null;
    }
    remove(n) {
      let t = n.trackById;
      return this.map.get(t).remove(n) && this.map.delete(t), n;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Hg(e, n, t) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return t && r < t.length && (o = t[r]), r + n + o;
}
var id = class {
    constructor() {}
    supports(n) {
      return n instanceof Map || Gs(n);
    }
    create() {
      return new sd();
    }
  },
  sd = class {
    _records = new Map();
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    _removalsTail = null;
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(n) {
      let t;
      for (t = this._mapHead; t !== null; t = t._next) n(t);
    }
    forEachPreviousItem(n) {
      let t;
      for (t = this._previousMapHead; t !== null; t = t._nextPrevious) n(t);
    }
    forEachChangedItem(n) {
      let t;
      for (t = this._changesHead; t !== null; t = t._nextChanged) n(t);
    }
    forEachAddedItem(n) {
      let t;
      for (t = this._additionsHead; t !== null; t = t._nextAdded) n(t);
    }
    forEachRemovedItem(n) {
      let t;
      for (t = this._removalsHead; t !== null; t = t._nextRemoved) n(t);
    }
    diff(n) {
      if (!n) n = new Map();
      else if (!(n instanceof Map || Gs(n))) throw new w(900, !1);
      return this.check(n) ? this : null;
    }
    onDestroy() {}
    check(n) {
      this._reset();
      let t = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(n, (r, o) => {
          if (t && t.key === o)
            this._maybeAddToChanges(t, r),
              (this._appendAfter = t),
              (t = t._next);
          else {
            let i = this._getOrCreateRecordForKey(o, r);
            t = this._insertBeforeOrAppend(t, i);
          }
        }),
        t)
      ) {
        t._prev && (t._prev._next = null), (this._removalsHead = t);
        for (let r = t; r !== null; r = r._nextRemoved)
          r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(n, t) {
      if (n) {
        let r = n._prev;
        return (
          (t._next = n),
          (t._prev = r),
          (n._prev = t),
          r && (r._next = t),
          n === this._mapHead && (this._mapHead = t),
          (this._appendAfter = n),
          n
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = t), (t._prev = this._appendAfter))
          : (this._mapHead = t),
        (this._appendAfter = t),
        null
      );
    }
    _getOrCreateRecordForKey(n, t) {
      if (this._records.has(n)) {
        let o = this._records.get(n);
        this._maybeAddToChanges(o, t);
        let i = o._prev,
          s = o._next;
        return (
          i && (i._next = s),
          s && (s._prev = i),
          (o._next = null),
          (o._prev = null),
          o
        );
      }
      let r = new ad(n);
      return (
        this._records.set(n, r),
        (r.currentValue = t),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let n;
        for (
          this._previousMapHead = this._mapHead, n = this._previousMapHead;
          n !== null;
          n = n._next
        )
          n._nextPrevious = n._next;
        for (n = this._changesHead; n !== null; n = n._nextChanged)
          n.previousValue = n.currentValue;
        for (n = this._additionsHead; n != null; n = n._nextAdded)
          n.previousValue = n.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(n, t) {
      Object.is(t, n.currentValue) ||
        ((n.previousValue = n.currentValue),
        (n.currentValue = t),
        this._addToChanges(n));
    }
    _addToAdditions(n) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = n)
        : ((this._additionsTail._nextAdded = n), (this._additionsTail = n));
    }
    _addToChanges(n) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = n)
        : ((this._changesTail._nextChanged = n), (this._changesTail = n));
    }
    _forEach(n, t) {
      n instanceof Map
        ? n.forEach(t)
        : Object.keys(n).forEach((r) => t(n[r], r));
    }
  },
  ad = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(n) {
      this.key = n;
    }
  };
function Bg() {
  return new cd([new td()]);
}
var cd = (() => {
  class e {
    factories;
    static ɵprov = _({ token: e, providedIn: "root", factory: Bg });
    constructor(t) {
      this.factories = t;
    }
    static create(t, r) {
      if (r != null) {
        let o = r.factories.slice();
        t = t.concat(o);
      }
      return new e(t);
    }
    static extend(t) {
      return {
        provide: e,
        useFactory: (r) => e.create(t, r || Bg()),
        deps: [[e, new uu(), new lu()]],
      };
    }
    find(t) {
      let r = this.factories.find((o) => o.supports(t));
      if (r != null) return r;
      throw new w(901, !1);
    }
  }
  return e;
})();
function Vg() {
  return new ld([new id()]);
}
var ld = (() => {
  class e {
    static ɵprov = _({ token: e, providedIn: "root", factory: Vg });
    factories;
    constructor(t) {
      this.factories = t;
    }
    static create(t, r) {
      if (r) {
        let o = r.factories.slice();
        t = t.concat(o);
      }
      return new e(t);
    }
    static extend(t) {
      return {
        provide: e,
        useFactory: (r) => e.create(t, r || Vg()),
        deps: [[e, new uu(), new lu()]],
      };
    }
    find(t) {
      let r = this.factories.find((o) => o.supports(t));
      if (r) return r;
      throw new w(901, !1);
    }
  }
  return e;
})();
function Gg(e) {
  X(8);
  try {
    let { rootComponent: n, appProviders: t, platformProviders: r } = e,
      o = ME(r),
      i = [Xu({}), { provide: In, useExisting: Lg }, Np, ...(t || [])],
      s = new Eo({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return wE({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: n,
    });
  } catch (n) {
    return Promise.reject(n);
  } finally {
    X(9);
  }
}
var Yg = null;
function Bt() {
  return Yg;
}
function ud(e) {
  Yg ??= e;
}
var No = class {},
  dd = (() => {
    class e {
      historyGo(t) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({
        token: e,
        factory: () => v(Zg),
        providedIn: "platform",
      });
    }
    return e;
  })();
var Zg = (() => {
  class e extends dd {
    _location;
    _history;
    _doc = v(ve);
    constructor() {
      super(),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return Bt().getBaseHref(this._doc);
    }
    onPopState(t) {
      let r = Bt().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("popstate", t, !1),
        () => r.removeEventListener("popstate", t)
      );
    }
    onHashChange(t) {
      let r = Bt().getGlobalEventTarget(this._doc, "window");
      return (
        r.addEventListener("hashchange", t, !1),
        () => r.removeEventListener("hashchange", t)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(t) {
      this._location.pathname = t;
    }
    pushState(t, r, o) {
      this._history.pushState(t, r, o);
    }
    replaceState(t, r, o) {
      this._history.replaceState(t, r, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(t = 0) {
      this._history.go(t);
    }
    getState() {
      return this._history.state;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = _({
      token: e,
      factory: () => new e(),
      providedIn: "platform",
    });
  }
  return e;
})();
function Qg(e, n) {
  return e
    ? n
      ? e.endsWith("/")
        ? n.startsWith("/")
          ? e + n.slice(1)
          : e + n
        : n.startsWith("/")
        ? e + n
        : `${e}/${n}`
      : e
    : n;
}
function Wg(e) {
  let n = e.search(/#|\?|$/);
  return e[n - 1] === "/" ? e.slice(0, n - 1) + e.slice(n) : e;
}
function un(e) {
  return e && e[0] !== "?" ? `?${e}` : e;
}
var Js = (() => {
    class e {
      historyGo(t) {
        throw new Error("");
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: () => v(Kg), providedIn: "root" });
    }
    return e;
  })(),
  Xg = new S(""),
  Kg = (() => {
    class e extends Js {
      _platformLocation;
      _baseHref;
      _removeListenerFns = [];
      constructor(t, r) {
        super(),
          (this._platformLocation = t),
          (this._baseHref =
            r ??
            this._platformLocation.getBaseHrefFromDOM() ??
            v(ve).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(t) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(t),
          this._platformLocation.onHashChange(t)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(t) {
        return Qg(this._baseHref, t);
      }
      path(t = !1) {
        let r =
            this._platformLocation.pathname + un(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && t ? `${r}${o}` : r;
      }
      pushState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + un(i));
        this._platformLocation.pushState(t, r, s);
      }
      replaceState(t, r, o, i) {
        let s = this.prepareExternalUrl(o + un(i));
        this._platformLocation.replaceState(t, r, s);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(t = 0) {
        this._platformLocation.historyGo?.(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(R(dd), R(Xg, 8));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  dn = (() => {
    class e {
      _subject = new ce();
      _basePath;
      _locationStrategy;
      _urlChangeListeners = [];
      _urlChangeSubscription = null;
      constructor(t) {
        this._locationStrategy = t;
        let r = this._locationStrategy.getBaseHref();
        (this._basePath = PE(Wg(qg(r)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.next({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(t = !1) {
        return this.normalize(this._locationStrategy.path(t));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(t, r = "") {
        return this.path() == this.normalize(t + un(r));
      }
      normalize(t) {
        return e.stripTrailingSlash(AE(this._basePath, qg(t)));
      }
      prepareExternalUrl(t) {
        return (
          t && t[0] !== "/" && (t = "/" + t),
          this._locationStrategy.prepareExternalUrl(t)
        );
      }
      go(t, r = "", o = null) {
        this._locationStrategy.pushState(o, "", t, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(t + un(r)), o);
      }
      replaceState(t, r = "", o = null) {
        this._locationStrategy.replaceState(o, "", t, r),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(t + un(r)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(t = 0) {
        this._locationStrategy.historyGo?.(t);
      }
      onUrlChange(t) {
        return (
          this._urlChangeListeners.push(t),
          (this._urlChangeSubscription ??= this.subscribe((r) => {
            this._notifyUrlChangeListeners(r.url, r.state);
          })),
          () => {
            let r = this._urlChangeListeners.indexOf(t);
            this._urlChangeListeners.splice(r, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(t = "", r) {
        this._urlChangeListeners.forEach((o) => o(t, r));
      }
      subscribe(t, r, o) {
        return this._subject.subscribe({
          next: t,
          error: r ?? void 0,
          complete: o ?? void 0,
        });
      }
      static normalizeQueryParams = un;
      static joinWithSlash = Qg;
      static stripTrailingSlash = Wg;
      static ɵfac = function (r) {
        return new (r || e)(R(Js));
      };
      static ɵprov = _({ token: e, factory: () => NE(), providedIn: "root" });
    }
    return e;
  })();
function NE() {
  return new dn(R(Js));
}
function AE(e, n) {
  if (!e || !n.startsWith(e)) return n;
  let t = n.substring(e.length);
  return t === "" || ["/", ";", "?", "#"].includes(t[0]) ? t : n;
}
function qg(e) {
  return e.replace(/\/index.html$/, "");
}
function PE(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, t] = e.split(/\/\/[^\/]+/);
    return t;
  }
  return e;
}
var fd = /\s+/,
  Jg = [],
  Vt = (() => {
    class e {
      _ngEl;
      _renderer;
      initialClasses = Jg;
      rawClass;
      stateMap = new Map();
      constructor(t, r) {
        (this._ngEl = t), (this._renderer = r);
      }
      set klass(t) {
        this.initialClasses = t != null ? t.trim().split(fd) : Jg;
      }
      set ngClass(t) {
        this.rawClass = typeof t == "string" ? t.trim().split(fd) : t;
      }
      ngDoCheck() {
        for (let r of this.initialClasses) this._updateState(r, !0);
        let t = this.rawClass;
        if (Array.isArray(t) || t instanceof Set)
          for (let r of t) this._updateState(r, !0);
        else if (t != null)
          for (let r of Object.keys(t)) this._updateState(r, !!t[r]);
        this._applyStateDiff();
      }
      _updateState(t, r) {
        let o = this.stateMap.get(t);
        o !== void 0
          ? (o.enabled !== r && ((o.changed = !0), (o.enabled = r)),
            (o.touched = !0))
          : this.stateMap.set(t, { enabled: r, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let t of this.stateMap) {
          let r = t[0],
            o = t[1];
          o.changed
            ? (this._toggleClass(r, o.enabled), (o.changed = !1))
            : o.touched ||
              (o.enabled && this._toggleClass(r, !1), this.stateMap.delete(r)),
            (o.touched = !1);
        }
      }
      _toggleClass(t, r) {
        (t = t.trim()),
          t.length > 0 &&
            t.split(fd).forEach((o) => {
              r
                ? this._renderer.addClass(this._ngEl.nativeElement, o)
                : this._renderer.removeClass(this._ngEl.nativeElement, o);
            });
      }
      static ɵfac = function (r) {
        return new (r || e)(x(an), x(zs));
      };
      static ɵdir = ln({
        type: e,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
      });
    }
    return e;
  })();
var ea = class {
    $implicit;
    ngForOf;
    index;
    count;
    constructor(n, t, r, o) {
      (this.$implicit = n),
        (this.ngForOf = t),
        (this.index = r),
        (this.count = o);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  na = (() => {
    class e {
      _viewContainer;
      _template;
      _differs;
      set ngForOf(t) {
        (this._ngForOf = t), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(t) {
        this._trackByFn = t;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      _ngForOf = null;
      _ngForOfDirty = !0;
      _differ = null;
      _trackByFn;
      constructor(t, r, o) {
        (this._viewContainer = t), (this._template = r), (this._differs = o);
      }
      set ngForTemplate(t) {
        t && (this._template = t);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let t = this._ngForOf;
          !this._differ &&
            t &&
            (this._differ = this._differs.find(t).create(this.ngForTrackBy));
        }
        if (this._differ) {
          let t = this._differ.diff(this._ngForOf);
          t && this._applyChanges(t);
        }
      }
      _applyChanges(t) {
        let r = this._viewContainer;
        t.forEachOperation((o, i, s) => {
          if (o.previousIndex == null)
            r.createEmbeddedView(
              this._template,
              new ea(o.item, this._ngForOf, -1, -1),
              s === null ? void 0 : s
            );
          else if (s == null) r.remove(i === null ? void 0 : i);
          else if (i !== null) {
            let a = r.get(i);
            r.move(a, s), em(a, o);
          }
        });
        for (let o = 0, i = r.length; o < i; o++) {
          let a = r.get(o).context;
          (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
        }
        t.forEachIdentityChange((o) => {
          let i = r.get(o.currentIndex);
          em(i, o);
        });
      }
      static ngTemplateContextGuard(t, r) {
        return !0;
      }
      static ɵfac = function (r) {
        return new (r || e)(x(jt), x(rn), x(cd));
      };
      static ɵdir = ln({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
      });
    }
    return e;
  })();
function em(e, n) {
  e.context.$implicit = n.item;
}
var pd = (() => {
    class e {
      _viewContainer;
      _context = new ta();
      _thenTemplateRef = null;
      _elseTemplateRef = null;
      _thenViewRef = null;
      _elseViewRef = null;
      constructor(t, r) {
        (this._viewContainer = t), (this._thenTemplateRef = r);
      }
      set ngIf(t) {
        (this._context.$implicit = this._context.ngIf = t), this._updateView();
      }
      set ngIfThen(t) {
        tm(t, !1),
          (this._thenTemplateRef = t),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(t) {
        tm(t, !1),
          (this._elseTemplateRef = t),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )));
      }
      static ngIfUseIfTypeGuard;
      static ngTemplateGuard_ngIf;
      static ngTemplateContextGuard(t, r) {
        return !0;
      }
      static ɵfac = function (r) {
        return new (r || e)(x(jt), x(rn));
      };
      static ɵdir = ln({
        type: e,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
      });
    }
    return e;
  })(),
  ta = class {
    $implicit = null;
    ngIf = null;
  };
function tm(e, n) {
  if (e && !e.createEmbeddedView) throw new w(2020, !1);
}
var ae = (() => {
  class e {
    _ngEl;
    _differs;
    _renderer;
    _ngStyle = null;
    _differ = null;
    constructor(t, r, o) {
      (this._ngEl = t), (this._differs = r), (this._renderer = o);
    }
    set ngStyle(t) {
      (this._ngStyle = t),
        !this._differ && t && (this._differ = this._differs.find(t).create());
    }
    ngDoCheck() {
      if (this._differ) {
        let t = this._differ.diff(this._ngStyle);
        t && this._applyChanges(t);
      }
    }
    _setStyle(t, r) {
      let [o, i] = t.split("."),
        s = o.indexOf("-") === -1 ? void 0 : lt.DashCase;
      r != null
        ? this._renderer.setStyle(
            this._ngEl.nativeElement,
            o,
            i ? `${r}${i}` : r,
            s
          )
        : this._renderer.removeStyle(this._ngEl.nativeElement, o, s);
    }
    _applyChanges(t) {
      t.forEachRemovedItem((r) => this._setStyle(r.key, null)),
        t.forEachAddedItem((r) => this._setStyle(r.key, r.currentValue)),
        t.forEachChangedItem((r) => this._setStyle(r.key, r.currentValue));
    }
    static ɵfac = function (r) {
      return new (r || e)(x(an), x(ld), x(zs));
    };
    static ɵdir = ln({
      type: e,
      selectors: [["", "ngStyle", ""]],
      inputs: { ngStyle: "ngStyle" },
    });
  }
  return e;
})();
var Q = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Mo({ type: e });
    static ɵinj = cr({});
  }
  return e;
})();
function hd(e, n) {
  n = encodeURIComponent(n);
  for (let t of e.split(";")) {
    let r = t.indexOf("="),
      [o, i] = r == -1 ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
    if (o.trim() === n) return decodeURIComponent(i);
  }
  return null;
}
var Ao = class {};
var nm = "browser";
var oa = new S(""),
  Cd = (() => {
    class e {
      _zone;
      _plugins;
      _eventNameToPlugin = new Map();
      constructor(t, r) {
        (this._zone = r),
          t.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = t.slice().reverse());
      }
      addEventListener(t, r, o, i) {
        return this._findPluginFor(r).addEventListener(t, r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(t) {
        let r = this._eventNameToPlugin.get(t);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(t))), !r))
          throw new w(5101, !1);
        return this._eventNameToPlugin.set(t, r), r;
      }
      static ɵfac = function (r) {
        return new (r || e)(R(oa), R(te));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Po = class {
    _doc;
    constructor(n) {
      this._doc = n;
    }
    manager;
  },
  gd = "ng-app-id";
function rm(e) {
  for (let n of e) n.remove();
}
function om(e, n) {
  let t = n.createElement("style");
  return (t.textContent = e), t;
}
function FE(e, n, t, r) {
  let o = e.head?.querySelectorAll(`style[${gd}="${n}"],link[${gd}="${n}"]`);
  if (o)
    for (let i of o)
      i.removeAttribute(gd),
        i instanceof HTMLLinkElement
          ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), {
              usage: 0,
              elements: [i],
            })
          : i.textContent && t.set(i.textContent, { usage: 0, elements: [i] });
}
function vd(e, n) {
  let t = n.createElement("link");
  return t.setAttribute("rel", "stylesheet"), t.setAttribute("href", e), t;
}
var Dd = (() => {
    class e {
      doc;
      appId;
      nonce;
      inline = new Map();
      external = new Map();
      hosts = new Set();
      constructor(t, r, o, i = {}) {
        (this.doc = t),
          (this.appId = r),
          (this.nonce = o),
          FE(t, r, this.inline, this.external),
          this.hosts.add(t.head);
      }
      addStyles(t, r) {
        for (let o of t) this.addUsage(o, this.inline, om);
        r?.forEach((o) => this.addUsage(o, this.external, vd));
      }
      removeStyles(t, r) {
        for (let o of t) this.removeUsage(o, this.inline);
        r?.forEach((o) => this.removeUsage(o, this.external));
      }
      addUsage(t, r, o) {
        let i = r.get(t);
        i
          ? i.usage++
          : r.set(t, {
              usage: 1,
              elements: [...this.hosts].map((s) =>
                this.addElement(s, o(t, this.doc))
              ),
            });
      }
      removeUsage(t, r) {
        let o = r.get(t);
        o && (o.usage--, o.usage <= 0 && (rm(o.elements), r.delete(t)));
      }
      ngOnDestroy() {
        for (let [, { elements: t }] of [...this.inline, ...this.external])
          rm(t);
        this.hosts.clear();
      }
      addHost(t) {
        this.hosts.add(t);
        for (let [r, { elements: o }] of this.inline)
          o.push(this.addElement(t, om(r, this.doc)));
        for (let [r, { elements: o }] of this.external)
          o.push(this.addElement(t, vd(r, this.doc)));
      }
      removeHost(t) {
        this.hosts.delete(t);
      }
      addElement(t, r) {
        return (
          this.nonce && r.setAttribute("nonce", this.nonce), t.appendChild(r)
        );
      }
      static ɵfac = function (r) {
        return new (r || e)(R(ve), R(Ps), R(Fs, 8), R(wr));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  md = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Ed = /%COMP%/g;
var sm = "%COMP%",
  LE = `_nghost-${sm}`,
  jE = `_ngcontent-${sm}`,
  HE = !0,
  BE = new S("", { providedIn: "root", factory: () => HE });
function VE(e) {
  return jE.replace(Ed, e);
}
function $E(e) {
  return LE.replace(Ed, e);
}
function am(e, n) {
  return n.map((t) => t.replace(Ed, e));
}
var bd = (() => {
    class e {
      eventManager;
      sharedStylesHost;
      appId;
      removeStylesOnCompDestroy;
      doc;
      platformId;
      ngZone;
      nonce;
      tracingService;
      rendererByCompId = new Map();
      defaultRenderer;
      platformIsServer;
      constructor(t, r, o, i, s, a, c, l = null, u = null) {
        (this.eventManager = t),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = l),
          (this.tracingService = u),
          (this.platformIsServer = !1),
          (this.defaultRenderer = new ko(
            t,
            s,
            c,
            this.platformIsServer,
            this.tracingService
          ));
      }
      createRenderer(t, r) {
        if (!t || !r) return this.defaultRenderer;
        let o = this.getOrCreateRenderer(t, r);
        return (
          o instanceof ra
            ? o.applyToHost(t)
            : o instanceof Fo && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(t, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            u = this.removeStylesOnCompDestroy,
            d = this.platformIsServer,
            p = this.tracingService;
          switch (r.encapsulation) {
            case Lt.Emulated:
              i = new ra(c, l, r, this.appId, u, s, a, d, p);
              break;
            case Lt.ShadowDom:
              return new yd(c, l, t, r, s, a, this.nonce, d, p);
            default:
              i = new Fo(c, l, r, u, s, a, d, p);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      componentReplaced(t) {
        this.rendererByCompId.delete(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(
          R(Cd),
          R(Dd),
          R(Ps),
          R(BE),
          R(ve),
          R(wr),
          R(te),
          R(Fs),
          R(xo, 8)
        );
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  ko = class {
    eventManager;
    doc;
    ngZone;
    platformIsServer;
    tracingService;
    data = Object.create(null);
    throwOnSyntheticProps = !0;
    constructor(n, t, r, o, i) {
      (this.eventManager = n),
        (this.doc = t),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.tracingService = i);
    }
    destroy() {}
    destroyNode = null;
    createElement(n, t) {
      return t
        ? this.doc.createElementNS(md[t] || t, n)
        : this.doc.createElement(n);
    }
    createComment(n) {
      return this.doc.createComment(n);
    }
    createText(n) {
      return this.doc.createTextNode(n);
    }
    appendChild(n, t) {
      (im(n) ? n.content : n).appendChild(t);
    }
    insertBefore(n, t, r) {
      n && (im(n) ? n.content : n).insertBefore(t, r);
    }
    removeChild(n, t) {
      t.remove();
    }
    selectRootElement(n, t) {
      let r = typeof n == "string" ? this.doc.querySelector(n) : n;
      if (!r) throw new w(-5104, !1);
      return t || (r.textContent = ""), r;
    }
    parentNode(n) {
      return n.parentNode;
    }
    nextSibling(n) {
      return n.nextSibling;
    }
    setAttribute(n, t, r, o) {
      if (o) {
        t = o + ":" + t;
        let i = md[o];
        i ? n.setAttributeNS(i, t, r) : n.setAttribute(t, r);
      } else n.setAttribute(t, r);
    }
    removeAttribute(n, t, r) {
      if (r) {
        let o = md[r];
        o ? n.removeAttributeNS(o, t) : n.removeAttribute(`${r}:${t}`);
      } else n.removeAttribute(t);
    }
    addClass(n, t) {
      n.classList.add(t);
    }
    removeClass(n, t) {
      n.classList.remove(t);
    }
    setStyle(n, t, r, o) {
      o & (lt.DashCase | lt.Important)
        ? n.style.setProperty(t, r, o & lt.Important ? "important" : "")
        : (n.style[t] = r);
    }
    removeStyle(n, t, r) {
      r & lt.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
    }
    setProperty(n, t, r) {
      n != null && (n[t] = r);
    }
    setValue(n, t) {
      n.nodeValue = t;
    }
    listen(n, t, r, o) {
      if (
        typeof n == "string" &&
        ((n = Bt().getGlobalEventTarget(this.doc, n)), !n)
      )
        throw new w(5102, !1);
      let i = this.decoratePreventDefault(r);
      return (
        this.tracingService?.wrapEventListener &&
          (i = this.tracingService.wrapEventListener(n, t, i)),
        this.eventManager.addEventListener(n, t, i, o)
      );
    }
    decoratePreventDefault(n) {
      return (t) => {
        if (t === "__ngUnwrap__") return n;
        n(t) === !1 && t.preventDefault();
      };
    }
  };
function im(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var yd = class extends ko {
    sharedStylesHost;
    hostEl;
    shadowRoot;
    constructor(n, t, r, o, i, s, a, c, l) {
      super(n, i, s, c, l),
        (this.sharedStylesHost = t),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = o.styles;
      u = am(o.id, u);
      for (let p of u) {
        let f = document.createElement("style");
        a && f.setAttribute("nonce", a),
          (f.textContent = p),
          this.shadowRoot.appendChild(f);
      }
      let d = o.getExternalStyles?.();
      if (d)
        for (let p of d) {
          let f = vd(p, i);
          a && f.setAttribute("nonce", a), this.shadowRoot.appendChild(f);
        }
    }
    nodeOrShadowRoot(n) {
      return n === this.hostEl ? this.shadowRoot : n;
    }
    appendChild(n, t) {
      return super.appendChild(this.nodeOrShadowRoot(n), t);
    }
    insertBefore(n, t, r) {
      return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
    }
    removeChild(n, t) {
      return super.removeChild(null, t);
    }
    parentNode(n) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Fo = class extends ko {
    sharedStylesHost;
    removeStylesOnCompDestroy;
    styles;
    styleUrls;
    constructor(n, t, r, o, i, s, a, c, l) {
      super(n, i, s, a, c),
        (this.sharedStylesHost = t),
        (this.removeStylesOnCompDestroy = o);
      let u = r.styles;
      (this.styles = l ? am(l, u) : u),
        (this.styleUrls = r.getExternalStyles?.(l));
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
    }
  },
  ra = class extends Fo {
    contentAttr;
    hostAttr;
    constructor(n, t, r, o, i, s, a, c, l) {
      let u = o + "-" + r.id;
      super(n, t, r, i, s, a, c, l, u),
        (this.contentAttr = VE(u)),
        (this.hostAttr = $E(u));
    }
    applyToHost(n) {
      this.applyStyles(), this.setAttribute(n, this.hostAttr, "");
    }
    createElement(n, t) {
      let r = super.createElement(n, t);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  };
var ia = class e extends No {
    supportsDOMEvents = !0;
    static makeCurrent() {
      ud(new e());
    }
    onAndCancel(n, t, r, o) {
      return (
        n.addEventListener(t, r, o),
        () => {
          n.removeEventListener(t, r, o);
        }
      );
    }
    dispatchEvent(n, t) {
      n.dispatchEvent(t);
    }
    remove(n) {
      n.remove();
    }
    createElement(n, t) {
      return (t = t || this.getDefaultDocument()), t.createElement(n);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(n) {
      return n.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(n) {
      return n instanceof DocumentFragment;
    }
    getGlobalEventTarget(n, t) {
      return t === "window"
        ? window
        : t === "document"
        ? n
        : t === "body"
        ? n.body
        : null;
    }
    getBaseHref(n) {
      let t = UE();
      return t == null ? null : zE(t);
    }
    resetBaseElement() {
      Lo = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(n) {
      return hd(document.cookie, n);
    }
  },
  Lo = null;
function UE() {
  return (
    (Lo = Lo || document.head.querySelector("base")),
    Lo ? Lo.getAttribute("href") : null
  );
}
function zE(e) {
  return new URL(e, document.baseURI).pathname;
}
var GE = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  lm = (() => {
    class e extends Po {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return !0;
      }
      addEventListener(t, r, o, i) {
        return (
          t.addEventListener(r, o, i),
          () => this.removeEventListener(t, r, o, i)
        );
      }
      removeEventListener(t, r, o, i) {
        return t.removeEventListener(r, o, i);
      }
      static ɵfac = function (r) {
        return new (r || e)(R(ve));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  cm = ["alt", "control", "meta", "shift"],
  WE = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  qE = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  um = (() => {
    class e extends Po {
      constructor(t) {
        super(t);
      }
      supports(t) {
        return e.parseEventName(t) != null;
      }
      addEventListener(t, r, o, i) {
        let s = e.parseEventName(r),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => Bt().onAndCancel(t, s.domEventName, a, i));
      }
      static parseEventName(t) {
        let r = t.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          cm.forEach((l) => {
            let u = r.indexOf(l);
            u > -1 && (r.splice(u, 1), (s += l + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = s), c;
      }
      static matchEventFullKeyCode(t, r) {
        let o = WE[t.key] || t.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = t.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              cm.forEach((s) => {
                if (s !== o) {
                  let a = qE[s];
                  a(t) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(t, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, t) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(t) {
        return t === "esc" ? "escape" : t;
      }
      static ɵfac = function (r) {
        return new (r || e)(R(ve));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function wd(e, n) {
  let t = b({ rootComponent: e }, YE(n));
  return Gg(t);
}
function YE(e) {
  return {
    appProviders: [...JE, ...(e?.providers ?? [])],
    platformProviders: KE,
  };
}
function ZE() {
  ia.makeCurrent();
}
function QE() {
  return new yt();
}
function XE() {
  return pu(document), document;
}
var KE = [
  { provide: wr, useValue: nm },
  { provide: ks, useValue: ZE, multi: !0 },
  { provide: ve, useFactory: XE },
];
var JE = [
  { provide: eo, useValue: "root" },
  { provide: yt, useFactory: QE },
  { provide: oa, useClass: lm, multi: !0, deps: [ve] },
  { provide: oa, useClass: um, multi: !0, deps: [ve] },
  bd,
  Dd,
  Cd,
  { provide: Ln, useExisting: bd },
  { provide: Ao, useClass: GE },
  [],
];
var dm = (() => {
  class e {
    _doc;
    constructor(t) {
      this._doc = t;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(t) {
      this._doc.title = t || "";
    }
    static ɵfac = function (r) {
      return new (r || e)(R(ve));
    };
    static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var P = "primary",
  Ko = Symbol("RouteTitle"),
  Td = class {
    params;
    constructor(n) {
      this.params = n || {};
    }
    has(n) {
      return Object.prototype.hasOwnProperty.call(this.params, n);
    }
    get(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t[0] : t;
      }
      return null;
    }
    getAll(n) {
      if (this.has(n)) {
        let t = this.params[n];
        return Array.isArray(t) ? t : [t];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function Wn(e) {
  return new Td(e);
}
function Cm(e, n, t) {
  let r = t.path.split("/");
  if (
    r.length > e.length ||
    (t.pathMatch === "full" && (n.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ":") o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function tb(e, n) {
  if (e.length !== n.length) return !1;
  for (let t = 0; t < e.length; ++t) if (!_t(e[t], n[t])) return !1;
  return !0;
}
function _t(e, n) {
  let t = e ? xd(e) : void 0,
    r = n ? xd(n) : void 0;
  if (!t || !r || t.length != r.length) return !1;
  let o;
  for (let i = 0; i < t.length; i++)
    if (((o = t[i]), !Dm(e[o], n[o]))) return !1;
  return !0;
}
function xd(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function Dm(e, n) {
  if (Array.isArray(e) && Array.isArray(n)) {
    if (e.length !== n.length) return !1;
    let t = [...e].sort(),
      r = [...n].sort();
    return t.every((o, i) => r[i] === o);
  } else return e === n;
}
function Em(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function zt(e) {
  return mc(e) ? e : _r(e) ? ue(Promise.resolve(e)) : T(e);
}
var nb = { exact: wm, subset: _m },
  bm = { exact: rb, subset: ob, ignored: () => !0 };
function fm(e, n, t) {
  return (
    nb[t.paths](e.root, n.root, t.matrixParams) &&
    bm[t.queryParams](e.queryParams, n.queryParams) &&
    !(t.fragment === "exact" && e.fragment !== n.fragment)
  );
}
function rb(e, n) {
  return _t(e, n);
}
function wm(e, n, t) {
  if (
    !zn(e.segments, n.segments) ||
    !ca(e.segments, n.segments, t) ||
    e.numberOfChildren !== n.numberOfChildren
  )
    return !1;
  for (let r in n.children)
    if (!e.children[r] || !wm(e.children[r], n.children[r], t)) return !1;
  return !0;
}
function ob(e, n) {
  return (
    Object.keys(n).length <= Object.keys(e).length &&
    Object.keys(n).every((t) => Dm(e[t], n[t]))
  );
}
function _m(e, n, t) {
  return Im(e, n, n.segments, t);
}
function Im(e, n, t, r) {
  if (e.segments.length > t.length) {
    let o = e.segments.slice(0, t.length);
    return !(!zn(o, t) || n.hasChildren() || !ca(o, t, r));
  } else if (e.segments.length === t.length) {
    if (!zn(e.segments, t) || !ca(e.segments, t, r)) return !1;
    for (let o in n.children)
      if (!e.children[o] || !_m(e.children[o], n.children[o], r)) return !1;
    return !0;
  } else {
    let o = t.slice(0, e.segments.length),
      i = t.slice(e.segments.length);
    return !zn(e.segments, o) || !ca(e.segments, o, r) || !e.children[P]
      ? !1
      : Im(e.children[P], n, i, r);
  }
}
function ca(e, n, t) {
  return n.every((r, o) => bm[t](e[o].parameters, r.parameters));
}
var St = class {
    root;
    queryParams;
    fragment;
    _queryParamMap;
    constructor(n = new W([], {}), t = {}, r = null) {
      (this.root = n), (this.queryParams = t), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Wn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return ab.serialize(this);
    }
  },
  W = class {
    segments;
    children;
    parent = null;
    constructor(n, t) {
      (this.segments = n),
        (this.children = t),
        Object.values(t).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return la(this);
    }
  },
  fn = class {
    path;
    parameters;
    _parameterMap;
    constructor(n, t) {
      (this.path = n), (this.parameters = t);
    }
    get parameterMap() {
      return (this._parameterMap ??= Wn(this.parameters)), this._parameterMap;
    }
    toString() {
      return Mm(this);
    }
  };
function ib(e, n) {
  return zn(e, n) && e.every((t, r) => _t(t.parameters, n[r].parameters));
}
function zn(e, n) {
  return e.length !== n.length ? !1 : e.every((t, r) => t.path === n[r].path);
}
function sb(e, n) {
  let t = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === P && (t = t.concat(n(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== P && (t = t.concat(n(o, r)));
    }),
    t
  );
}
var Jo = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({
        token: e,
        factory: () => new qn(),
        providedIn: "root",
      });
    }
    return e;
  })(),
  qn = class {
    parse(n) {
      let t = new Rd(n);
      return new St(
        t.parseRootSegment(),
        t.parseQueryParams(),
        t.parseFragment()
      );
    }
    serialize(n) {
      let t = `/${jo(n.root, !0)}`,
        r = ub(n.queryParams),
        o = typeof n.fragment == "string" ? `#${cb(n.fragment)}` : "";
      return `${t}${r}${o}`;
    }
  },
  ab = new qn();
function la(e) {
  return e.segments.map((n) => Mm(n)).join("/");
}
function jo(e, n) {
  if (!e.hasChildren()) return la(e);
  if (n) {
    let t = e.children[P] ? jo(e.children[P], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== P && r.push(`${o}:${jo(i, !1)}`);
      }),
      r.length > 0 ? `${t}(${r.join("//")})` : t
    );
  } else {
    let t = sb(e, (r, o) =>
      o === P ? [jo(e.children[P], !1)] : [`${o}:${jo(r, !1)}`]
    );
    return Object.keys(e.children).length === 1 && e.children[P] != null
      ? `${la(e)}/${t[0]}`
      : `${la(e)}/(${t.join("//")})`;
  }
}
function Sm(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function sa(e) {
  return Sm(e).replace(/%3B/gi, ";");
}
function cb(e) {
  return encodeURI(e);
}
function Od(e) {
  return Sm(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function ua(e) {
  return decodeURIComponent(e);
}
function pm(e) {
  return ua(e.replace(/\+/g, "%20"));
}
function Mm(e) {
  return `${Od(e.path)}${lb(e.parameters)}`;
}
function lb(e) {
  return Object.entries(e)
    .map(([n, t]) => `;${Od(n)}=${Od(t)}`)
    .join("");
}
function ub(e) {
  let n = Object.entries(e)
    .map(([t, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${sa(t)}=${sa(o)}`).join("&")
        : `${sa(t)}=${sa(r)}`
    )
    .filter((t) => t);
  return n.length ? `?${n.join("&")}` : "";
}
var db = /^[^\/()?;#]+/;
function _d(e) {
  let n = e.match(db);
  return n ? n[0] : "";
}
var fb = /^[^\/()?;=#]+/;
function pb(e) {
  let n = e.match(fb);
  return n ? n[0] : "";
}
var hb = /^[^=?&#]+/;
function gb(e) {
  let n = e.match(hb);
  return n ? n[0] : "";
}
var mb = /^[^&#]+/;
function vb(e) {
  let n = e.match(mb);
  return n ? n[0] : "";
}
var Rd = class {
  url;
  remaining;
  constructor(n) {
    (this.url = n), (this.remaining = n);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new W([], {})
        : new W([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let n = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(n);
      while (this.consumeOptional("&"));
    return n;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let n = [];
    for (
      this.peekStartsWith("(") || n.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), n.push(this.parseSegment());
    let t = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (t = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (n.length > 0 || Object.keys(t).length > 0) && (r[P] = new W(n, t)),
      r
    );
  }
  parseSegment() {
    let n = _d(this.remaining);
    if (n === "" && this.peekStartsWith(";")) throw new w(4009, !1);
    return this.capture(n), new fn(ua(n), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let n = {};
    for (; this.consumeOptional(";"); ) this.parseParam(n);
    return n;
  }
  parseParam(n) {
    let t = pb(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = _d(this.remaining);
      o && ((r = o), this.capture(r));
    }
    n[ua(t)] = ua(r);
  }
  parseQueryParam(n) {
    let t = gb(this.remaining);
    if (!t) return;
    this.capture(t);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = vb(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = pm(t),
      i = pm(r);
    if (n.hasOwnProperty(o)) {
      let s = n[o];
      Array.isArray(s) || ((s = [s]), (n[o] = s)), s.push(i);
    } else n[o] = i;
  }
  parseParens(n) {
    let t = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = _d(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new w(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : n && (i = P);
      let s = this.parseChildren();
      (t[i] = Object.keys(s).length === 1 ? s[P] : new W([], s)),
        this.consumeOptional("//");
    }
    return t;
  }
  peekStartsWith(n) {
    return this.remaining.startsWith(n);
  }
  consumeOptional(n) {
    return this.peekStartsWith(n)
      ? ((this.remaining = this.remaining.substring(n.length)), !0)
      : !1;
  }
  capture(n) {
    if (!this.consumeOptional(n)) throw new w(4011, !1);
  }
};
function Tm(e) {
  return e.segments.length > 0 ? new W([], { [P]: e }) : e;
}
function xm(e) {
  let n = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = xm(o);
    if (r === P && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) n[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (n[r] = i);
  }
  let t = new W(e.segments, n);
  return yb(t);
}
function yb(e) {
  if (e.numberOfChildren === 1 && e.children[P]) {
    let n = e.children[P];
    return new W(e.segments.concat(n.segments), n.children);
  }
  return e;
}
function xr(e) {
  return e instanceof St;
}
function Om(e, n, t = null, r = null) {
  let o = Rm(e);
  return Nm(o, n, t, r);
}
function Rm(e) {
  let n;
  function t(i) {
    let s = {};
    for (let c of i.children) {
      let l = t(c);
      s[c.outlet] = l;
    }
    let a = new W(i.url, s);
    return i === e && (n = a), a;
  }
  let r = t(e.root),
    o = Tm(r);
  return n ?? o;
}
function Nm(e, n, t, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (n.length === 0) return Id(o, o, o, t, r);
  let i = Cb(n);
  if (i.toRoot()) return Id(o, o, new W([], {}), t, r);
  let s = Db(i, o, e),
    a = s.processChildren
      ? Bo(s.segmentGroup, s.index, i.commands)
      : Pm(s.segmentGroup, s.index, i.commands);
  return Id(o, s.segmentGroup, a, t, r);
}
function da(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function Uo(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Id(e, n, t, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([c, l]) => {
      i[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  e === n ? (s = t) : (s = Am(e, n, t));
  let a = Tm(xm(s));
  return new St(a, i, o);
}
function Am(e, n, t) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === n ? (r[o] = t) : (r[o] = Am(i, n, t));
    }),
    new W(e.segments, r)
  );
}
var fa = class {
  isAbsolute;
  numberOfDoubleDots;
  commands;
  constructor(n, t, r) {
    if (
      ((this.isAbsolute = n),
      (this.numberOfDoubleDots = t),
      (this.commands = r),
      n && r.length > 0 && da(r[0]))
    )
      throw new w(4003, !1);
    let o = r.find(Uo);
    if (o && o !== Em(r)) throw new w(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function Cb(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new fa(!0, 0, e);
  let n = 0,
    t = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, l]) => {
              a[c] = typeof l == "string" ? l.split("/") : l;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
        ? (i.split("/").forEach((a, c) => {
            (c == 0 && a === ".") ||
              (c == 0 && a === ""
                ? (t = !0)
                : a === ".."
                ? n++
                : a != "" && o.push(a));
          }),
          o)
        : [...o, i];
    }, []);
  return new fa(t, n, r);
}
var Mr = class {
  segmentGroup;
  processChildren;
  index;
  constructor(n, t, r) {
    (this.segmentGroup = n), (this.processChildren = t), (this.index = r);
  }
};
function Db(e, n, t) {
  if (e.isAbsolute) return new Mr(n, !0, 0);
  if (!t) return new Mr(n, !1, NaN);
  if (t.parent === null) return new Mr(t, !0, 0);
  let r = da(e.commands[0]) ? 0 : 1,
    o = t.segments.length - 1 + r;
  return Eb(t, o, e.numberOfDoubleDots);
}
function Eb(e, n, t) {
  let r = e,
    o = n,
    i = t;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new w(4005, !1);
    o = r.segments.length;
  }
  return new Mr(r, !1, o - i);
}
function bb(e) {
  return Uo(e[0]) ? e[0].outlets : { [P]: e };
}
function Pm(e, n, t) {
  if (((e ??= new W([], {})), e.segments.length === 0 && e.hasChildren()))
    return Bo(e, n, t);
  let r = wb(e, n, t),
    o = t.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new W(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[P] = new W(e.segments.slice(r.pathIndex), e.children)),
      Bo(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new W(e.segments, {})
      : r.match && !e.hasChildren()
      ? Nd(e, n, t)
      : r.match
      ? Bo(e, 0, o)
      : Nd(e, n, t);
}
function Bo(e, n, t) {
  if (t.length === 0) return new W(e.segments, {});
  {
    let r = bb(t),
      o = {};
    if (
      Object.keys(r).some((i) => i !== P) &&
      e.children[P] &&
      e.numberOfChildren === 1 &&
      e.children[P].segments.length === 0
    ) {
      let i = Bo(e.children[P], n, t);
      return new W(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = Pm(e.children[i], n, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new W(e.segments, o)
    );
  }
}
function wb(e, n, t) {
  let r = 0,
    o = n,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= t.length) return i;
    let s = e.segments[o],
      a = t[r];
    if (Uo(a)) break;
    let c = `${a}`,
      l = r < t.length - 1 ? t[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && l && typeof l == "object" && l.outlets === void 0) {
      if (!gm(c, l, s)) return i;
      r += 2;
    } else {
      if (!gm(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function Nd(e, n, t) {
  let r = e.segments.slice(0, n),
    o = 0;
  for (; o < t.length; ) {
    let i = t[o];
    if (Uo(i)) {
      let c = _b(i.outlets);
      return new W(r, c);
    }
    if (o === 0 && da(t[0])) {
      let c = e.segments[n];
      r.push(new fn(c.path, hm(t[0]))), o++;
      continue;
    }
    let s = Uo(i) ? i.outlets[P] : `${i}`,
      a = o < t.length - 1 ? t[o + 1] : null;
    s && a && da(a)
      ? (r.push(new fn(s, hm(a))), (o += 2))
      : (r.push(new fn(s, {})), o++);
  }
  return new W(r, {});
}
function _b(e) {
  let n = {};
  return (
    Object.entries(e).forEach(([t, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (n[t] = Nd(new W([], {}), 0, r));
    }),
    n
  );
}
function hm(e) {
  let n = {};
  return Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n;
}
function gm(e, n, t) {
  return e == t.path && _t(n, t.parameters);
}
var Vo = "imperative",
  Ce = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(Ce || {}),
  We = class {
    id;
    url;
    constructor(n, t) {
      (this.id = n), (this.url = t);
    }
  },
  $t = class extends We {
    type = Ce.NavigationStart;
    navigationTrigger;
    restoredState;
    constructor(n, t, r = "imperative", o = null) {
      super(n, t), (this.navigationTrigger = r), (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  qe = class extends We {
    urlAfterRedirects;
    type = Ce.NavigationEnd;
    constructor(n, t, r) {
      super(n, t), (this.urlAfterRedirects = r);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Ae = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      (e[(e.Aborted = 4)] = "Aborted"),
      e
    );
  })(Ae || {}),
  zo = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(zo || {}),
  It = class extends We {
    reason;
    code;
    type = Ce.NavigationCancel;
    constructor(n, t, r, o) {
      super(n, t), (this.reason = r), (this.code = o);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ut = class extends We {
    reason;
    code;
    type = Ce.NavigationSkipped;
    constructor(n, t, r, o) {
      super(n, t), (this.reason = r), (this.code = o);
    }
  },
  Or = class extends We {
    error;
    target;
    type = Ce.NavigationError;
    constructor(n, t, r, o) {
      super(n, t), (this.error = r), (this.target = o);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Go = class extends We {
    urlAfterRedirects;
    state;
    type = Ce.RoutesRecognized;
    constructor(n, t, r, o) {
      super(n, t), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  pa = class extends We {
    urlAfterRedirects;
    state;
    type = Ce.GuardsCheckStart;
    constructor(n, t, r, o) {
      super(n, t), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ha = class extends We {
    urlAfterRedirects;
    state;
    shouldActivate;
    type = Ce.GuardsCheckEnd;
    constructor(n, t, r, o, i) {
      super(n, t),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  ga = class extends We {
    urlAfterRedirects;
    state;
    type = Ce.ResolveStart;
    constructor(n, t, r, o) {
      super(n, t), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ma = class extends We {
    urlAfterRedirects;
    state;
    type = Ce.ResolveEnd;
    constructor(n, t, r, o) {
      super(n, t), (this.urlAfterRedirects = r), (this.state = o);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  va = class {
    route;
    type = Ce.RouteConfigLoadStart;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  ya = class {
    route;
    type = Ce.RouteConfigLoadEnd;
    constructor(n) {
      this.route = n;
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Ca = class {
    snapshot;
    type = Ce.ChildActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Da = class {
    snapshot;
    type = Ce.ChildActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  Ea = class {
    snapshot;
    type = Ce.ActivationStart;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ba = class {
    snapshot;
    type = Ce.ActivationEnd;
    constructor(n) {
      this.snapshot = n;
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var Wo = class {},
  Rr = class {
    url;
    navigationBehaviorOptions;
    constructor(n, t) {
      (this.url = n), (this.navigationBehaviorOptions = t);
    }
  };
function Ib(e) {
  return !(e instanceof Wo) && !(e instanceof Rr);
}
function Sb(e, n) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = So(e.providers, n, `Route: ${e.path}`)),
    e._injector ?? n
  );
}
function gt(e) {
  return e.outlet || P;
}
function Mb(e, n) {
  let t = e.filter((r) => gt(r) === n);
  return t.push(...e.filter((r) => gt(r) !== n)), t;
}
function Pr(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let n = e.parent; n; n = n.parent) {
    let t = n.routeConfig;
    if (t?._loadedInjector) return t._loadedInjector;
    if (t?._injector) return t._injector;
  }
  return null;
}
var wa = class {
    rootInjector;
    outlet = null;
    route = null;
    children;
    attachRef = null;
    get injector() {
      return Pr(this.route?.snapshot) ?? this.rootInjector;
    }
    constructor(n) {
      (this.rootInjector = n), (this.children = new kr(this.rootInjector));
    }
  },
  kr = (() => {
    class e {
      rootInjector;
      contexts = new Map();
      constructor(t) {
        this.rootInjector = t;
      }
      onChildOutletCreated(t, r) {
        let o = this.getOrCreateContext(t);
        (o.outlet = r), this.contexts.set(t, o);
      }
      onChildOutletDestroyed(t) {
        let r = this.getContext(t);
        r && ((r.outlet = null), (r.attachRef = null));
      }
      onOutletDeactivated() {
        let t = this.contexts;
        return (this.contexts = new Map()), t;
      }
      onOutletReAttached(t) {
        this.contexts = t;
      }
      getOrCreateContext(t) {
        let r = this.getContext(t);
        return (
          r || ((r = new wa(this.rootInjector)), this.contexts.set(t, r)), r
        );
      }
      getContext(t) {
        return this.contexts.get(t) || null;
      }
      static ɵfac = function (r) {
        return new (r || e)(R(De));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  _a = class {
    _root;
    constructor(n) {
      this._root = n;
    }
    get root() {
      return this._root.value;
    }
    parent(n) {
      let t = this.pathFromRoot(n);
      return t.length > 1 ? t[t.length - 2] : null;
    }
    children(n) {
      let t = Ad(n, this._root);
      return t ? t.children.map((r) => r.value) : [];
    }
    firstChild(n) {
      let t = Ad(n, this._root);
      return t && t.children.length > 0 ? t.children[0].value : null;
    }
    siblings(n) {
      let t = Pd(n, this._root);
      return t.length < 2
        ? []
        : t[t.length - 2].children.map((o) => o.value).filter((o) => o !== n);
    }
    pathFromRoot(n) {
      return Pd(n, this._root).map((t) => t.value);
    }
  };
function Ad(e, n) {
  if (e === n.value) return n;
  for (let t of n.children) {
    let r = Ad(e, t);
    if (r) return r;
  }
  return null;
}
function Pd(e, n) {
  if (e === n.value) return [n];
  for (let t of n.children) {
    let r = Pd(e, t);
    if (r.length) return r.unshift(n), r;
  }
  return [];
}
var Ge = class {
  value;
  children;
  constructor(n, t) {
    (this.value = n), (this.children = t);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function Sr(e) {
  let n = {};
  return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
}
var qo = class extends _a {
  snapshot;
  constructor(n, t) {
    super(n), (this.snapshot = t), $d(this, n);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function km(e) {
  let n = Tb(e),
    t = new re([new fn("", {})]),
    r = new re({}),
    o = new re({}),
    i = new re({}),
    s = new re(""),
    a = new Mt(t, r, i, s, o, P, e, n.root);
  return (a.snapshot = n.root), new qo(new Ge(a, []), n);
}
function Tb(e) {
  let n = {},
    t = {},
    r = {},
    o = "",
    i = new Gn([], n, r, o, t, P, e, null, {});
  return new Yo("", new Ge(i, []));
}
var Mt = class {
  urlSubject;
  paramsSubject;
  queryParamsSubject;
  fragmentSubject;
  dataSubject;
  outlet;
  component;
  snapshot;
  _futureSnapshot;
  _routerState;
  _paramMap;
  _queryParamMap;
  title;
  url;
  params;
  queryParams;
  fragment;
  data;
  constructor(n, t, r, o, i, s, a, c) {
    (this.urlSubject = n),
      (this.paramsSubject = t),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(B((l) => l[Ko])) ?? T(void 0)),
      (this.url = n),
      (this.params = t),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(B((n) => Wn(n)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(B((n) => Wn(n)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Ia(e, n, t = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    n !== null &&
    (t === "always" ||
      o?.path === "" ||
      (!n.component && !n.routeConfig?.loadComponent))
      ? (r = {
          params: b(b({}, n.params), e.params),
          data: b(b({}, n.data), e.data),
          resolve: b(b(b(b({}, e.data), n.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: b({}, e.params),
          data: b({}, e.data),
          resolve: b(b({}, e.data), e._resolvedData ?? {}),
        }),
    o && Lm(o) && (r.resolve[Ko] = o.title),
    r
  );
}
var Gn = class {
    url;
    params;
    queryParams;
    fragment;
    data;
    outlet;
    component;
    routeConfig;
    _resolve;
    _resolvedData;
    _routerState;
    _paramMap;
    _queryParamMap;
    get title() {
      return this.data?.[Ko];
    }
    constructor(n, t, r, o, i, s, a, c, l) {
      (this.url = n),
        (this.params = t),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= Wn(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= Wn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let n = this.url.map((r) => r.toString()).join("/"),
        t = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${n}', path:'${t}')`;
    }
  },
  Yo = class extends _a {
    url;
    constructor(n, t) {
      super(t), (this.url = n), $d(this, t);
    }
    toString() {
      return Fm(this._root);
    }
  };
function $d(e, n) {
  (n.value._routerState = e), n.children.forEach((t) => $d(e, t));
}
function Fm(e) {
  let n = e.children.length > 0 ? ` { ${e.children.map(Fm).join(", ")} } ` : "";
  return `${e.value}${n}`;
}
function Sd(e) {
  if (e.snapshot) {
    let n = e.snapshot,
      t = e._futureSnapshot;
    (e.snapshot = t),
      _t(n.queryParams, t.queryParams) ||
        e.queryParamsSubject.next(t.queryParams),
      n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
      _t(n.params, t.params) || e.paramsSubject.next(t.params),
      tb(n.url, t.url) || e.urlSubject.next(t.url),
      _t(n.data, t.data) || e.dataSubject.next(t.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function kd(e, n) {
  let t = _t(e.params, n.params) && ib(e.url, n.url),
    r = !e.parent != !n.parent;
  return t && !r && (!e.parent || kd(e.parent, n.parent));
}
function Lm(e) {
  return typeof e.title == "string" || e.title === null;
}
var jm = new S(""),
  ei = (() => {
    class e {
      activated = null;
      get activatedComponentRef() {
        return this.activated;
      }
      _activatedRoute = null;
      name = P;
      activateEvents = new xe();
      deactivateEvents = new xe();
      attachEvents = new xe();
      detachEvents = new xe();
      routerOutletData = zg(void 0);
      parentContexts = v(kr);
      location = v(jt);
      changeDetector = v(Un);
      inputBinder = v(xa, { optional: !0 });
      supportsBindingToComponentInputs = !0;
      ngOnChanges(t) {
        if (t.name) {
          let { firstChange: r, previousValue: o } = t.name;
          if (r) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(t) {
        return this.parentContexts.getContext(t)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let t = this.parentContexts.getContext(this.name);
        t?.route &&
          (t.attachRef
            ? this.attach(t.attachRef, t.route)
            : this.activateWith(t.route, t.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new w(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new w(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new w(4012, !1);
        this.location.detach();
        let t = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(t.instance),
          t
        );
      }
      attach(t, r) {
        (this.activated = t),
          (this._activatedRoute = r),
          this.location.insert(t.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(t.instance);
      }
      deactivate() {
        if (this.activated) {
          let t = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(t);
        }
      }
      activateWith(t, r) {
        if (this.isActivated) throw new w(4013, !1);
        this._activatedRoute = t;
        let o = this.location,
          s = t.snapshot.component,
          a = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Fd(t, a, o.injector, this.routerOutletData);
        (this.activated = o.createComponent(s, {
          index: o.length,
          injector: c,
          environmentInjector: r,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵdir = ln({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name", routerOutletData: [1, "routerOutletData"] },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        features: [sn],
      });
    }
    return e;
  })(),
  Fd = class {
    route;
    childContexts;
    parent;
    outletData;
    constructor(n, t, r, o) {
      (this.route = n),
        (this.childContexts = t),
        (this.parent = r),
        (this.outletData = o);
    }
    get(n, t) {
      return n === Mt
        ? this.route
        : n === kr
        ? this.childContexts
        : n === jm
        ? this.outletData
        : this.parent.get(n, t);
    }
  },
  xa = new S("");
var Ud = (() => {
  class e {
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵcmp = k({
      type: e,
      selectors: [["ng-component"]],
      exportAs: ["emptyRouterOutlet"],
      decls: 1,
      vars: 0,
      template: function (r, o) {
        r & 1 && y(0, "router-outlet");
      },
      dependencies: [ei],
      encapsulation: 2,
    });
  }
  return e;
})();
function zd(e) {
  let n = e.children && e.children.map(zd),
    t = n ? K(b({}, e), { children: n }) : b({}, e);
  return (
    !t.component &&
      !t.loadComponent &&
      (n || t.loadChildren) &&
      t.outlet &&
      t.outlet !== P &&
      (t.component = Ud),
    t
  );
}
function xb(e, n, t) {
  let r = Zo(e, n._root, t ? t._root : void 0);
  return new qo(r, n);
}
function Zo(e, n, t) {
  if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
    let r = t.value;
    r._futureSnapshot = n.value;
    let o = Ob(e, n, t);
    return new Ge(r, o);
  } else {
    if (e.shouldAttach(n.value)) {
      let i = e.retrieve(n.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = n.value),
          (s.children = n.children.map((a) => Zo(e, a))),
          s
        );
      }
    }
    let r = Rb(n.value),
      o = n.children.map((i) => Zo(e, i));
    return new Ge(r, o);
  }
}
function Ob(e, n, t) {
  return n.children.map((r) => {
    for (let o of t.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Zo(e, r, o);
    return Zo(e, r);
  });
}
function Rb(e) {
  return new Mt(
    new re(e.url),
    new re(e.params),
    new re(e.queryParams),
    new re(e.fragment),
    new re(e.data),
    e.outlet,
    e.component,
    e
  );
}
var Nr = class {
    redirectTo;
    navigationBehaviorOptions;
    constructor(n, t) {
      (this.redirectTo = n), (this.navigationBehaviorOptions = t);
    }
  },
  Hm = "ngNavigationCancelingError";
function Sa(e, n) {
  let { redirectTo: t, navigationBehaviorOptions: r } = xr(n)
      ? { redirectTo: n, navigationBehaviorOptions: void 0 }
      : n,
    o = Bm(!1, Ae.Redirect);
  return (o.url = t), (o.navigationBehaviorOptions = r), o;
}
function Bm(e, n) {
  let t = new Error(`NavigationCancelingError: ${e || ""}`);
  return (t[Hm] = !0), (t.cancellationCode = n), t;
}
function Nb(e) {
  return Vm(e) && xr(e.url);
}
function Vm(e) {
  return !!e && e[Hm];
}
var Ab = (e, n, t, r) =>
    B(
      (o) => (
        new Ld(n, o.targetRouterState, o.currentRouterState, t, r).activate(e),
        o
      )
    ),
  Ld = class {
    routeReuseStrategy;
    futureState;
    currState;
    forwardEvent;
    inputBindingEnabled;
    constructor(n, t, r, o, i) {
      (this.routeReuseStrategy = n),
        (this.futureState = t),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(n) {
      let t = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(t, r, n),
        Sd(this.futureState.root),
        this.activateChildRoutes(t, r, n);
    }
    deactivateChildRoutes(n, t, r) {
      let o = Sr(t);
      n.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], r), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        });
    }
    deactivateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(n, t, s.children);
        } else this.deactivateChildRoutes(n, t, r);
      else i && this.deactivateRouteAndItsChildren(t, r);
    }
    deactivateRouteAndItsChildren(n, t) {
      n.value.component &&
      this.routeReuseStrategy.shouldDetach(n.value.snapshot)
        ? this.detachAndStoreRouteSubtree(n, t)
        : this.deactivateRouteAndOutlet(n, t);
    }
    detachAndStoreRouteSubtree(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = Sr(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(n.value.snapshot, {
          componentRef: s,
          route: n,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(n, t) {
      let r = t.getContext(n.value.outlet),
        o = r && n.value.component ? r.children : t,
        i = Sr(n);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(n, t, r) {
      let o = Sr(t);
      n.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new ba(i.value.snapshot));
      }),
        n.children.length && this.forwardEvent(new Da(n.value.snapshot));
    }
    activateRoutes(n, t, r) {
      let o = n.value,
        i = t ? t.value : null;
      if ((Sd(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(n, t, s.children);
        } else this.activateChildRoutes(n, t, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Sd(a.route.value),
            this.activateChildRoutes(n, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(n, null, s.children);
      } else this.activateChildRoutes(n, null, r);
    }
  },
  Ma = class {
    path;
    route;
    constructor(n) {
      (this.path = n), (this.route = this.path[this.path.length - 1]);
    }
  },
  Tr = class {
    component;
    route;
    constructor(n, t) {
      (this.component = n), (this.route = t);
    }
  };
function Pb(e, n, t) {
  let r = e._root,
    o = n ? n._root : null;
  return Ho(r, o, t, [r.value]);
}
function kb(e) {
  let n = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !n || n.length === 0 ? null : { node: e, guards: n };
}
function Fr(e, n) {
  let t = Symbol(),
    r = n.get(e, t);
  return r === t ? (typeof e == "function" && !jc(e) ? e : n.get(e)) : r;
}
function Ho(
  e,
  n,
  t,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = Sr(n);
  return (
    e.children.forEach((s) => {
      Fb(s, i[s.value.outlet], t, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => $o(a, t.getContext(s), o)),
    o
  );
}
function Fb(
  e,
  n,
  t,
  r,
  o = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let i = e.value,
    s = n ? n.value : null,
    a = t ? t.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = Lb(s, i, i.routeConfig.runGuardsAndResolvers);
    c
      ? o.canActivateChecks.push(new Ma(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? Ho(e, n, a ? a.children : null, r, o) : Ho(e, n, t, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new Tr(a.outlet.component, s));
  } else
    s && $o(n, a, o),
      o.canActivateChecks.push(new Ma(r)),
      i.component
        ? Ho(e, null, a ? a.children : null, r, o)
        : Ho(e, null, t, r, o);
  return o;
}
function Lb(e, n, t) {
  if (typeof t == "function") return t(e, n);
  switch (t) {
    case "pathParamsChange":
      return !zn(e.url, n.url);
    case "pathParamsOrQueryParamsChange":
      return !zn(e.url, n.url) || !_t(e.queryParams, n.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !kd(e, n) || !_t(e.queryParams, n.queryParams);
    case "paramsChange":
    default:
      return !kd(e, n);
  }
}
function $o(e, n, t) {
  let r = Sr(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? n
        ? $o(s, n.children.getContext(i), t)
        : $o(s, null, t)
      : $o(s, n, t);
  }),
    o.component
      ? n && n.outlet && n.outlet.isActivated
        ? t.canDeactivateChecks.push(new Tr(n.outlet.component, o))
        : t.canDeactivateChecks.push(new Tr(null, o))
      : t.canDeactivateChecks.push(new Tr(null, o));
}
function ti(e) {
  return typeof e == "function";
}
function jb(e) {
  return typeof e == "boolean";
}
function Hb(e) {
  return e && ti(e.canLoad);
}
function Bb(e) {
  return e && ti(e.canActivate);
}
function Vb(e) {
  return e && ti(e.canActivateChild);
}
function $b(e) {
  return e && ti(e.canDeactivate);
}
function Ub(e) {
  return e && ti(e.canMatch);
}
function $m(e) {
  return e instanceof Rt || e?.name === "EmptyError";
}
var aa = Symbol("INITIAL_VALUE");
function Ar() {
  return Ze((e) =>
    ki(e.map((n) => n.pipe(Me(1), bc(aa)))).pipe(
      B((n) => {
        for (let t of n)
          if (t !== !0) {
            if (t === aa) return aa;
            if (t === !1 || zb(t)) return t;
          }
        return !0;
      }),
      Ye((n) => n !== aa),
      Me(1)
    )
  );
}
function zb(e) {
  return xr(e) || e instanceof Nr;
}
function Gb(e, n) {
  return oe((t) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = t;
    return s.length === 0 && i.length === 0
      ? T(K(b({}, t), { guardsResult: !0 }))
      : Wb(s, r, o, e).pipe(
          oe((a) => (a && jb(a) ? qb(r, i, e, n) : T(a))),
          B((a) => K(b({}, t), { guardsResult: a }))
        );
  });
}
function Wb(e, n, t, r) {
  return ue(e).pipe(
    oe((o) => Kb(o.component, o.route, t, n, r)),
    Nt((o) => o !== !0, !0)
  );
}
function qb(e, n, t, r) {
  return ue(n).pipe(
    ir((o) =>
      Wt(
        Zb(o.route.parent, r),
        Yb(o.route, r),
        Xb(e, o.path, t),
        Qb(e, o.route, t)
      )
    ),
    Nt((o) => o !== !0, !0)
  );
}
function Yb(e, n) {
  return e !== null && n && n(new Ea(e)), T(!0);
}
function Zb(e, n) {
  return e !== null && n && n(new Ca(e)), T(!0);
}
function Qb(e, n, t) {
  let r = n.routeConfig ? n.routeConfig.canActivate : null;
  if (!r || r.length === 0) return T(!0);
  let o = r.map((i) =>
    Gr(() => {
      let s = Pr(n) ?? t,
        a = Fr(i, s),
        c = Bb(a) ? a.canActivate(n, e) : Te(s, () => a(n, e));
      return zt(c).pipe(Nt());
    })
  );
  return T(o).pipe(Ar());
}
function Xb(e, n, t) {
  let r = n[n.length - 1],
    i = n
      .slice(0, n.length - 1)
      .reverse()
      .map((s) => kb(s))
      .filter((s) => s !== null)
      .map((s) =>
        Gr(() => {
          let a = s.guards.map((c) => {
            let l = Pr(s.node) ?? t,
              u = Fr(c, l),
              d = Vb(u) ? u.canActivateChild(r, e) : Te(l, () => u(r, e));
            return zt(d).pipe(Nt());
          });
          return T(a).pipe(Ar());
        })
      );
  return T(i).pipe(Ar());
}
function Kb(e, n, t, r, o) {
  let i = n && n.routeConfig ? n.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return T(!0);
  let s = i.map((a) => {
    let c = Pr(n) ?? o,
      l = Fr(a, c),
      u = $b(l) ? l.canDeactivate(e, n, t, r) : Te(c, () => l(e, n, t, r));
    return zt(u).pipe(Nt());
  });
  return T(s).pipe(Ar());
}
function Jb(e, n, t, r) {
  let o = n.canLoad;
  if (o === void 0 || o.length === 0) return T(!0);
  let i = o.map((s) => {
    let a = Fr(s, e),
      c = Hb(a) ? a.canLoad(n, t) : Te(e, () => a(n, t));
    return zt(c);
  });
  return T(i).pipe(Ar(), Um(r));
}
function Um(e) {
  return dc(
    ge((n) => {
      if (typeof n != "boolean") throw Sa(e, n);
    }),
    B((n) => n === !0)
  );
}
function ew(e, n, t, r) {
  let o = n.canMatch;
  if (!o || o.length === 0) return T(!0);
  let i = o.map((s) => {
    let a = Fr(s, e),
      c = Ub(a) ? a.canMatch(n, t) : Te(e, () => a(n, t));
    return zt(c);
  });
  return T(i).pipe(Ar(), Um(r));
}
var Qo = class {
    segmentGroup;
    constructor(n) {
      this.segmentGroup = n || null;
    }
  },
  Xo = class extends Error {
    urlTree;
    constructor(n) {
      super(), (this.urlTree = n);
    }
  };
function Ir(e) {
  return or(new Qo(e));
}
function tw(e) {
  return or(new w(4e3, !1));
}
function nw(e) {
  return or(Bm(!1, Ae.GuardRejected));
}
var jd = class {
  urlSerializer;
  urlTree;
  constructor(n, t) {
    (this.urlSerializer = n), (this.urlTree = t);
  }
  lineralizeSegments(n, t) {
    let r = [],
      o = t.root;
    for (;;) {
      if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return T(r);
      if (o.numberOfChildren > 1 || !o.children[P])
        return tw(`${n.redirectTo}`);
      o = o.children[P];
    }
  }
  applyRedirectCommands(n, t, r, o, i) {
    return rw(t, o, i).pipe(
      B((s) => {
        if (s instanceof St) throw new Xo(s);
        let a = this.applyRedirectCreateUrlTree(
          s,
          this.urlSerializer.parse(s),
          n,
          r
        );
        if (s[0] === "/") throw new Xo(a);
        return a;
      })
    );
  }
  applyRedirectCreateUrlTree(n, t, r, o) {
    let i = this.createSegmentGroup(n, t.root, r, o);
    return new St(
      i,
      this.createQueryParams(t.queryParams, this.urlTree.queryParams),
      t.fragment
    );
  }
  createQueryParams(n, t) {
    let r = {};
    return (
      Object.entries(n).forEach(([o, i]) => {
        if (typeof i == "string" && i[0] === ":") {
          let a = i.substring(1);
          r[o] = t[a];
        } else r[o] = i;
      }),
      r
    );
  }
  createSegmentGroup(n, t, r, o) {
    let i = this.createSegments(n, t.segments, r, o),
      s = {};
    return (
      Object.entries(t.children).forEach(([a, c]) => {
        s[a] = this.createSegmentGroup(n, c, r, o);
      }),
      new W(i, s)
    );
  }
  createSegments(n, t, r, o) {
    return t.map((i) =>
      i.path[0] === ":" ? this.findPosParam(n, i, o) : this.findOrReturn(i, r)
    );
  }
  findPosParam(n, t, r) {
    let o = r[t.path.substring(1)];
    if (!o) throw new w(4001, !1);
    return o;
  }
  findOrReturn(n, t) {
    let r = 0;
    for (let o of t) {
      if (o.path === n.path) return t.splice(r), o;
      r++;
    }
    return n;
  }
};
function rw(e, n, t) {
  if (typeof e == "string") return T(e);
  let r = e,
    {
      queryParams: o,
      fragment: i,
      routeConfig: s,
      url: a,
      outlet: c,
      params: l,
      data: u,
      title: d,
    } = n;
  return zt(
    Te(t, () =>
      r({
        params: l,
        data: u,
        queryParams: o,
        fragment: i,
        routeConfig: s,
        url: a,
        outlet: c,
        title: d,
      })
    )
  );
}
var Hd = {
  matched: !1,
  consumedSegments: [],
  remainingSegments: [],
  parameters: {},
  positionalParamSegments: {},
};
function ow(e, n, t, r, o) {
  let i = zm(e, n, t);
  return i.matched
    ? ((r = Sb(n, r)),
      ew(r, n, t, o).pipe(B((s) => (s === !0 ? i : b({}, Hd)))))
    : T(i);
}
function zm(e, n, t) {
  if (n.path === "**") return iw(t);
  if (n.path === "")
    return n.pathMatch === "full" && (e.hasChildren() || t.length > 0)
      ? b({}, Hd)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: t,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (n.matcher || Cm)(t, e, n);
  if (!o) return b({}, Hd);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? b(b({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: t.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function iw(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? Em(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function mm(e, n, t, r) {
  return t.length > 0 && cw(e, t, r)
    ? {
        segmentGroup: new W(n, aw(r, new W(t, e.children))),
        slicedSegments: [],
      }
    : t.length === 0 && lw(e, t, r)
    ? {
        segmentGroup: new W(e.segments, sw(e, t, r, e.children)),
        slicedSegments: t,
      }
    : { segmentGroup: new W(e.segments, e.children), slicedSegments: t };
}
function sw(e, n, t, r) {
  let o = {};
  for (let i of t)
    if (Oa(e, n, i) && !r[gt(i)]) {
      let s = new W([], {});
      o[gt(i)] = s;
    }
  return b(b({}, r), o);
}
function aw(e, n) {
  let t = {};
  t[P] = n;
  for (let r of e)
    if (r.path === "" && gt(r) !== P) {
      let o = new W([], {});
      t[gt(r)] = o;
    }
  return t;
}
function cw(e, n, t) {
  return t.some((r) => Oa(e, n, r) && gt(r) !== P);
}
function lw(e, n, t) {
  return t.some((r) => Oa(e, n, r));
}
function Oa(e, n, t) {
  return (e.hasChildren() || n.length > 0) && t.pathMatch === "full"
    ? !1
    : t.path === "";
}
function uw(e, n, t) {
  return n.length === 0 && !e.children[t];
}
var Bd = class {};
function dw(e, n, t, r, o, i, s = "emptyOnly") {
  return new Vd(e, n, t, r, o, s, i).recognize();
}
var fw = 31,
  Vd = class {
    injector;
    configLoader;
    rootComponentType;
    config;
    urlTree;
    paramsInheritanceStrategy;
    urlSerializer;
    applyRedirects;
    absoluteRedirectCount = 0;
    allowRedirects = !0;
    constructor(n, t, r, o, i, s, a) {
      (this.injector = n),
        (this.configLoader = t),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new jd(this.urlSerializer, this.urlTree));
    }
    noMatchError(n) {
      return new w(4002, `'${n.segmentGroup}'`);
    }
    recognize() {
      let n = mm(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(n).pipe(
        B(({ children: t, rootSnapshot: r }) => {
          let o = new Ge(r, t),
            i = new Yo("", o),
            s = Om(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            { state: i, tree: s }
          );
        })
      );
    }
    match(n) {
      let t = new Gn(
        [],
        Object.freeze({}),
        Object.freeze(b({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        P,
        this.rootComponentType,
        null,
        {}
      );
      return this.processSegmentGroup(this.injector, this.config, n, P, t).pipe(
        B((r) => ({ children: r, rootSnapshot: t })),
        qt((r) => {
          if (r instanceof Xo)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof Qo ? this.noMatchError(r) : r;
        })
      );
    }
    processSegmentGroup(n, t, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(n, t, r, i)
        : this.processSegment(n, t, r, r.segments, o, !0, i).pipe(
            B((s) => (s instanceof Ge ? [s] : []))
          );
    }
    processChildren(n, t, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return ue(i).pipe(
        ir((s) => {
          let a = r.children[s],
            c = Mb(t, s);
          return this.processSegmentGroup(n, c, a, s, o);
        }),
        Ec((s, a) => (s.push(...a), s)),
        Yt(null),
        Dc(),
        oe((s) => {
          if (s === null) return Ir(r);
          let a = Gm(s);
          return pw(a), T(a);
        })
      );
    }
    processSegment(n, t, r, o, i, s, a) {
      return ue(t).pipe(
        ir((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? n,
            t,
            c,
            r,
            o,
            i,
            s,
            a
          ).pipe(
            qt((l) => {
              if (l instanceof Qo) return T(null);
              throw l;
            })
          )
        ),
        Nt((c) => !!c),
        qt((c) => {
          if ($m(c)) return uw(r, o, i) ? T(new Bd()) : Ir(r);
          throw c;
        })
      );
    }
    processSegmentAgainstRoute(n, t, r, o, i, s, a, c) {
      return gt(r) !== s && (s === P || !Oa(o, i, r))
        ? Ir(o)
        : r.redirectTo === void 0
        ? this.matchSegmentAgainstRoute(n, o, r, i, s, c)
        : this.allowRedirects && a
        ? this.expandSegmentAgainstRouteUsingRedirect(n, o, t, r, i, s, c)
        : Ir(o);
    }
    expandSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s, a) {
      let {
        matched: c,
        parameters: l,
        consumedSegments: u,
        positionalParamSegments: d,
        remainingSegments: p,
      } = zm(t, o, i);
      if (!c) return Ir(t);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > fw && (this.allowRedirects = !1));
      let f = new Gn(
          i,
          l,
          Object.freeze(b({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          vm(o),
          gt(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          ym(o)
        ),
        D = Ia(f, a, this.paramsInheritanceStrategy);
      return (
        (f.params = Object.freeze(D.params)),
        (f.data = Object.freeze(D.data)),
        this.applyRedirects
          .applyRedirectCommands(u, o.redirectTo, d, f, n)
          .pipe(
            Ze((U) => this.applyRedirects.lineralizeSegments(o, U)),
            oe((U) => this.processSegment(n, r, t, U.concat(p), s, !1, a))
          )
      );
    }
    matchSegmentAgainstRoute(n, t, r, o, i, s) {
      let a = ow(t, r, o, n, this.urlSerializer);
      return (
        r.path === "**" && (t.children = {}),
        a.pipe(
          Ze((c) =>
            c.matched
              ? ((n = r._injector ?? n),
                this.getChildConfig(n, r, o).pipe(
                  Ze(({ routes: l }) => {
                    let u = r._loadedInjector ?? n,
                      {
                        parameters: d,
                        consumedSegments: p,
                        remainingSegments: f,
                      } = c,
                      D = new Gn(
                        p,
                        d,
                        Object.freeze(b({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        vm(r),
                        gt(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        ym(r)
                      ),
                      M = Ia(D, s, this.paramsInheritanceStrategy);
                    (D.params = Object.freeze(M.params)),
                      (D.data = Object.freeze(M.data));
                    let { segmentGroup: U, slicedSegments: z } = mm(t, p, f, l);
                    if (z.length === 0 && U.hasChildren())
                      return this.processChildren(u, l, U, D).pipe(
                        B((ii) => new Ge(D, ii))
                      );
                    if (l.length === 0 && z.length === 0)
                      return T(new Ge(D, []));
                    let hn = gt(r) === i;
                    return this.processSegment(
                      u,
                      l,
                      U,
                      z,
                      hn ? P : i,
                      !0,
                      D
                    ).pipe(B((ii) => new Ge(D, ii instanceof Ge ? [ii] : [])));
                  })
                ))
              : Ir(t)
          )
        )
      );
    }
    getChildConfig(n, t, r) {
      return t.children
        ? T({ routes: t.children, injector: n })
        : t.loadChildren
        ? t._loadedRoutes !== void 0
          ? T({ routes: t._loadedRoutes, injector: t._loadedInjector })
          : Jb(n, t, r, this.urlSerializer).pipe(
              oe((o) =>
                o
                  ? this.configLoader.loadChildren(n, t).pipe(
                      ge((i) => {
                        (t._loadedRoutes = i.routes),
                          (t._loadedInjector = i.injector);
                      })
                    )
                  : nw(t)
              )
            )
        : T({ routes: [], injector: n });
    }
  };
function pw(e) {
  e.sort((n, t) =>
    n.value.outlet === P
      ? -1
      : t.value.outlet === P
      ? 1
      : n.value.outlet.localeCompare(t.value.outlet)
  );
}
function hw(e) {
  let n = e.value.routeConfig;
  return n && n.path === "";
}
function Gm(e) {
  let n = [],
    t = new Set();
  for (let r of e) {
    if (!hw(r)) {
      n.push(r);
      continue;
    }
    let o = n.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), t.add(o)) : n.push(r);
  }
  for (let r of t) {
    let o = Gm(r.children);
    n.push(new Ge(r.value, o));
  }
  return n.filter((r) => !t.has(r));
}
function vm(e) {
  return e.data || {};
}
function ym(e) {
  return e.resolve || {};
}
function gw(e, n, t, r, o, i) {
  return oe((s) =>
    dw(e, n, t, r, s.extractedUrl, o, i).pipe(
      B(({ state: a, tree: c }) =>
        K(b({}, s), { targetSnapshot: a, urlAfterRedirects: c })
      )
    )
  );
}
function mw(e, n) {
  return oe((t) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = t;
    if (!o.length) return T(t);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let l of Wm(c)) s.add(l);
    let a = 0;
    return ue(s).pipe(
      ir((c) =>
        i.has(c)
          ? vw(c, r, e, n)
          : ((c.data = Ia(c, c.parent, e).resolve), T(void 0))
      ),
      ge(() => a++),
      sr(1),
      oe((c) => (a === s.size ? T(t) : Pe))
    );
  });
}
function Wm(e) {
  let n = e.children.map((t) => Wm(t)).flat();
  return [e, ...n];
}
function vw(e, n, t, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !Lm(o) && (i[Ko] = o.title),
    Gr(
      () => (
        (e.data = Ia(e, e.parent, t).resolve),
        yw(i, e, n, r).pipe(
          B(
            (s) => ((e._resolvedData = s), (e.data = b(b({}, e.data), s)), null)
          )
        )
      )
    )
  );
}
function yw(e, n, t, r) {
  let o = xd(e);
  if (o.length === 0) return T({});
  let i = {};
  return ue(o).pipe(
    oe((s) =>
      Cw(e[s], n, t, r).pipe(
        Nt(),
        ge((a) => {
          if (a instanceof Nr) throw Sa(new qn(), a);
          i[s] = a;
        })
      )
    ),
    sr(1),
    B(() => i),
    qt((s) => ($m(s) ? Pe : or(s)))
  );
}
function Cw(e, n, t, r) {
  let o = Pr(n) ?? r,
    i = Fr(e, o),
    s = i.resolve ? i.resolve(n, t) : Te(o, () => i(n, t));
  return zt(s);
}
function Md(e) {
  return Ze((n) => {
    let t = e(n);
    return t ? ue(t).pipe(B(() => n)) : T(n);
  });
}
var Gd = (() => {
    class e {
      buildTitle(t) {
        let r,
          o = t.root;
        for (; o !== void 0; )
          (r = this.getResolvedTitleForRoute(o) ?? r),
            (o = o.children.find((i) => i.outlet === P));
        return r;
      }
      getResolvedTitleForRoute(t) {
        return t.data[Ko];
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: () => v(qm), providedIn: "root" });
    }
    return e;
  })(),
  qm = (() => {
    class e extends Gd {
      title;
      constructor(t) {
        super(), (this.title = t);
      }
      updateTitle(t) {
        let r = this.buildTitle(t);
        r !== void 0 && this.title.setTitle(r);
      }
      static ɵfac = function (r) {
        return new (r || e)(R(dm));
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  ni = new S("", { providedIn: "root", factory: () => ({}) }),
  ri = new S(""),
  Ym = (() => {
    class e {
      componentLoaders = new WeakMap();
      childrenLoaders = new WeakMap();
      onLoadStartListener;
      onLoadEndListener;
      compiler = v(Qu);
      loadComponent(t, r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return T(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = zt(Te(t, () => r.loadComponent())).pipe(
            B(Qm),
            ge((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            Wr(() => {
              this.componentLoaders.delete(r);
            })
          ),
          i = new nr(o, () => new ce()).pipe(tr());
        return this.componentLoaders.set(r, i), i;
      }
      loadChildren(t, r) {
        if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
        if (r._loadedRoutes)
          return T({ routes: r._loadedRoutes, injector: r._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(r);
        let i = Zm(r, this.compiler, t, this.onLoadEndListener).pipe(
            Wr(() => {
              this.childrenLoaders.delete(r);
            })
          ),
          s = new nr(i, () => new ce()).pipe(tr());
        return this.childrenLoaders.set(r, s), s;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Zm(e, n, t, r) {
  return zt(Te(t, () => e.loadChildren())).pipe(
    B(Qm),
    oe((o) =>
      o instanceof Ws || Array.isArray(o) ? T(o) : ue(n.compileModuleAsync(o))
    ),
    B((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(t).injector),
            (s = i.get(ri, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(zd), injector: i }
      );
    })
  );
}
function Dw(e) {
  return e && typeof e == "object" && "default" in e;
}
function Qm(e) {
  return Dw(e) ? e.default : e;
}
var Ra = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: () => v(Ew), providedIn: "root" });
    }
    return e;
  })(),
  Ew = (() => {
    class e {
      shouldProcessUrl(t) {
        return !0;
      }
      extract(t) {
        return t;
      }
      merge(t, r) {
        return t;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Xm = new S("");
var Km = new S(""),
  Jm = (() => {
    class e {
      currentNavigation = null;
      currentTransition = null;
      lastSuccessfulNavigation = null;
      events = new ce();
      transitionAbortWithErrorSubject = new ce();
      configLoader = v(Ym);
      environmentInjector = v(De);
      destroyRef = v(kn);
      urlSerializer = v(Jo);
      rootContexts = v(kr);
      location = v(dn);
      inputBindingEnabled = v(xa, { optional: !0 }) !== null;
      titleStrategy = v(Gd);
      options = v(ni, { optional: !0 }) || {};
      paramsInheritanceStrategy =
        this.options.paramsInheritanceStrategy || "emptyOnly";
      urlHandlingStrategy = v(Ra);
      createViewTransition = v(Xm, { optional: !0 });
      navigationErrorHandler = v(Km, { optional: !0 });
      navigationId = 0;
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      transitions;
      afterPreactivation = () => T(void 0);
      rootComponentType = null;
      destroyed = !1;
      constructor() {
        let t = (o) => this.events.next(new va(o)),
          r = (o) => this.events.next(new ya(o));
        (this.configLoader.onLoadEndListener = r),
          (this.configLoader.onLoadStartListener = t),
          this.destroyRef.onDestroy(() => {
            this.destroyed = !0;
          });
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(t) {
        let r = ++this.navigationId;
        this.transitions?.next(
          K(b({}, t), {
            extractedUrl: this.urlHandlingStrategy.extract(t.rawUrl),
            targetSnapshot: null,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
            abortController: new AbortController(),
            id: r,
          })
        );
      }
      setupNavigations(t) {
        return (
          (this.transitions = new re(null)),
          this.transitions.pipe(
            Ye((r) => r !== null),
            Ze((r) => {
              let o = !1;
              return T(r).pipe(
                Ze((i) => {
                  if (this.navigationId > r.id)
                    return (
                      this.cancelNavigationTransition(
                        r,
                        "",
                        Ae.SupersededByNewNavigation
                      ),
                      Pe
                    );
                  (this.currentTransition = r),
                    (this.currentNavigation = {
                      id: i.id,
                      initialUrl: i.rawUrl,
                      extractedUrl: i.extractedUrl,
                      targetBrowserUrl:
                        typeof i.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(i.extras.browserUrl)
                          : i.extras.browserUrl,
                      trigger: i.source,
                      extras: i.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? K(b({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                      abort: () => i.abortController.abort(),
                    });
                  let s =
                      !t.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    a = i.extras.onSameUrlNavigation ?? t.onSameUrlNavigation;
                  if (!s && a !== "reload") {
                    let c = "";
                    return (
                      this.events.next(
                        new Ut(
                          i.id,
                          this.urlSerializer.serialize(i.rawUrl),
                          c,
                          zo.IgnoredSameUrlNavigation
                        )
                      ),
                      i.resolve(!1),
                      Pe
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(i.rawUrl))
                    return T(i).pipe(
                      Ze(
                        (c) => (
                          this.events.next(
                            new $t(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              c.source,
                              c.restoredState
                            )
                          ),
                          c.id !== this.navigationId ? Pe : Promise.resolve(c)
                        )
                      ),
                      gw(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        t.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy
                      ),
                      ge((c) => {
                        (r.targetSnapshot = c.targetSnapshot),
                          (r.urlAfterRedirects = c.urlAfterRedirects),
                          (this.currentNavigation = K(
                            b({}, this.currentNavigation),
                            { finalUrl: c.urlAfterRedirects }
                          ));
                        let l = new Go(
                          c.id,
                          this.urlSerializer.serialize(c.extractedUrl),
                          this.urlSerializer.serialize(c.urlAfterRedirects),
                          c.targetSnapshot
                        );
                        this.events.next(l);
                      })
                    );
                  if (
                    s &&
                    this.urlHandlingStrategy.shouldProcessUrl(i.currentRawUrl)
                  ) {
                    let {
                        id: c,
                        extractedUrl: l,
                        source: u,
                        restoredState: d,
                        extras: p,
                      } = i,
                      f = new $t(c, this.urlSerializer.serialize(l), u, d);
                    this.events.next(f);
                    let D = km(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = r =
                        K(b({}, i), {
                          targetSnapshot: D,
                          urlAfterRedirects: l,
                          extras: K(b({}, p), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = l),
                      T(r)
                    );
                  } else {
                    let c = "";
                    return (
                      this.events.next(
                        new Ut(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          c,
                          zo.IgnoredByUrlHandlingStrategy
                        )
                      ),
                      i.resolve(!1),
                      Pe
                    );
                  }
                }),
                ge((i) => {
                  let s = new pa(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot
                  );
                  this.events.next(s);
                }),
                B(
                  (i) => (
                    (this.currentTransition = r =
                      K(b({}, i), {
                        guards: Pb(
                          i.targetSnapshot,
                          i.currentSnapshot,
                          this.rootContexts
                        ),
                      })),
                    r
                  )
                ),
                Gb(this.environmentInjector, (i) => this.events.next(i)),
                ge((i) => {
                  if (
                    ((r.guardsResult = i.guardsResult),
                    i.guardsResult && typeof i.guardsResult != "boolean")
                  )
                    throw Sa(this.urlSerializer, i.guardsResult);
                  let s = new ha(
                    i.id,
                    this.urlSerializer.serialize(i.extractedUrl),
                    this.urlSerializer.serialize(i.urlAfterRedirects),
                    i.targetSnapshot,
                    !!i.guardsResult
                  );
                  this.events.next(s);
                }),
                Ye((i) =>
                  i.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(i, "", Ae.GuardRejected),
                      !1)
                ),
                Md((i) => {
                  if (i.guards.canActivateChecks.length !== 0)
                    return T(i).pipe(
                      ge((s) => {
                        let a = new ga(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      }),
                      Ze((s) => {
                        let a = !1;
                        return T(s).pipe(
                          mw(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector
                          ),
                          ge({
                            next: () => (a = !0),
                            complete: () => {
                              a ||
                                this.cancelNavigationTransition(
                                  s,
                                  "",
                                  Ae.NoDataFromResolver
                                );
                            },
                          })
                        );
                      }),
                      ge((s) => {
                        let a = new ma(
                          s.id,
                          this.urlSerializer.serialize(s.extractedUrl),
                          this.urlSerializer.serialize(s.urlAfterRedirects),
                          s.targetSnapshot
                        );
                        this.events.next(a);
                      })
                    );
                }),
                Md((i) => {
                  let s = (a) => {
                    let c = [];
                    if (
                      a.routeConfig?.loadComponent &&
                      !a.routeConfig._loadedComponent
                    ) {
                      let l = Pr(a) ?? this.environmentInjector;
                      c.push(
                        this.configLoader.loadComponent(l, a.routeConfig).pipe(
                          ge((u) => {
                            a.component = u;
                          }),
                          B(() => {})
                        )
                      );
                    }
                    for (let l of a.children) c.push(...s(l));
                    return c;
                  };
                  return ki(s(i.targetSnapshot.root)).pipe(Yt(null), Me(1));
                }),
                Md(() => this.afterPreactivation()),
                Ze(() => {
                  let { currentSnapshot: i, targetSnapshot: s } = r,
                    a = this.createViewTransition?.(
                      this.environmentInjector,
                      i.root,
                      s.root
                    );
                  return a ? ue(a).pipe(B(() => r)) : T(r);
                }),
                B((i) => {
                  let s = xb(
                    t.routeReuseStrategy,
                    i.targetSnapshot,
                    i.currentRouterState
                  );
                  return (
                    (this.currentTransition = r =
                      K(b({}, i), { targetRouterState: s })),
                    (this.currentNavigation.targetRouterState = s),
                    r
                  );
                }),
                ge(() => {
                  this.events.next(new Wo());
                }),
                Ab(
                  this.rootContexts,
                  t.routeReuseStrategy,
                  (i) => this.events.next(i),
                  this.inputBindingEnabled
                ),
                Me(1),
                Li(
                  new G((i) => {
                    let s = r.abortController.signal,
                      a = () => i.next();
                    return (
                      s.addEventListener("abort", a),
                      () => s.removeEventListener("abort", a)
                    );
                  }).pipe(
                    Ye(() => !o && !r.targetRouterState),
                    ge(() => {
                      this.cancelNavigationTransition(
                        r,
                        r.abortController.signal.reason + "",
                        Ae.Aborted
                      );
                    })
                  )
                ),
                ge({
                  next: (i) => {
                    (o = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new qe(
                          i.id,
                          this.urlSerializer.serialize(i.extractedUrl),
                          this.urlSerializer.serialize(i.urlAfterRedirects)
                        )
                      ),
                      this.titleStrategy?.updateTitle(
                        i.targetRouterState.snapshot
                      ),
                      i.resolve(!0);
                  },
                  complete: () => {
                    o = !0;
                  },
                }),
                Li(
                  this.transitionAbortWithErrorSubject.pipe(
                    ge((i) => {
                      throw i;
                    })
                  )
                ),
                Wr(() => {
                  o ||
                    this.cancelNavigationTransition(
                      r,
                      "",
                      Ae.SupersededByNewNavigation
                    ),
                    this.currentTransition?.id === r.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                qt((i) => {
                  if (this.destroyed) return r.resolve(!1), Pe;
                  if (((o = !0), Vm(i)))
                    this.events.next(
                      new It(
                        r.id,
                        this.urlSerializer.serialize(r.extractedUrl),
                        i.message,
                        i.cancellationCode
                      )
                    ),
                      Nb(i)
                        ? this.events.next(
                            new Rr(i.url, i.navigationBehaviorOptions)
                          )
                        : r.resolve(!1);
                  else {
                    let s = new Or(
                      r.id,
                      this.urlSerializer.serialize(r.extractedUrl),
                      i,
                      r.targetSnapshot ?? void 0
                    );
                    try {
                      let a = Te(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(s)
                      );
                      if (a instanceof Nr) {
                        let { message: c, cancellationCode: l } = Sa(
                          this.urlSerializer,
                          a
                        );
                        this.events.next(
                          new It(
                            r.id,
                            this.urlSerializer.serialize(r.extractedUrl),
                            c,
                            l
                          )
                        ),
                          this.events.next(
                            new Rr(a.redirectTo, a.navigationBehaviorOptions)
                          );
                      } else throw (this.events.next(s), i);
                    } catch (a) {
                      this.options.resolveNavigationPromiseOnError
                        ? r.resolve(!1)
                        : r.reject(a);
                    }
                  }
                  return Pe;
                })
              );
            })
          )
        );
      }
      cancelNavigationTransition(t, r, o) {
        let i = new It(
          t.id,
          this.urlSerializer.serialize(t.extractedUrl),
          r,
          o
        );
        this.events.next(i), t.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let t = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0))
          ),
          r =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          t.toString() !== r?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function bw(e) {
  return e !== Vo;
}
var ev = (() => {
    class e {
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: () => v(ww), providedIn: "root" });
    }
    return e;
  })(),
  Ta = class {
    shouldDetach(n) {
      return !1;
    }
    store(n, t) {}
    shouldAttach(n) {
      return !1;
    }
    retrieve(n) {
      return null;
    }
    shouldReuseRoute(n, t) {
      return n.routeConfig === t.routeConfig;
    }
  },
  ww = (() => {
    class e extends Ta {
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = As(e)))(o || e);
        };
      })();
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  tv = (() => {
    class e {
      urlSerializer = v(Jo);
      options = v(ni, { optional: !0 }) || {};
      canceledNavigationResolution =
        this.options.canceledNavigationResolution || "replace";
      location = v(dn);
      urlHandlingStrategy = v(Ra);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      currentUrlTree = new St();
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      rawUrlTree = this.currentUrlTree;
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      createBrowserPath({ finalUrl: t, initialUrl: r, targetBrowserUrl: o }) {
        let i = t !== void 0 ? this.urlHandlingStrategy.merge(t, r) : r,
          s = o ?? i;
        return s instanceof St ? this.urlSerializer.serialize(s) : s;
      }
      commitTransition({ targetRouterState: t, finalUrl: r, initialUrl: o }) {
        r && t
          ? ((this.currentUrlTree = r),
            (this.rawUrlTree = this.urlHandlingStrategy.merge(r, o)),
            (this.routerState = t))
          : (this.rawUrlTree = o);
      }
      routerState = km(null);
      getRouterState() {
        return this.routerState;
      }
      stateMemento = this.createStateMemento();
      updateStateMemento() {
        this.stateMemento = this.createStateMemento();
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      resetInternalState({ finalUrl: t }) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            t ?? this.rawUrlTree
          ));
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: () => v(_w), providedIn: "root" });
    }
    return e;
  })(),
  _w = (() => {
    class e extends tv {
      currentPageId = 0;
      lastSuccessfulId = -1;
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      registerNonRouterCurrentEntryChangeListener(t) {
        return this.location.subscribe((r) => {
          r.type === "popstate" &&
            setTimeout(() => {
              t(r.url, r.state, "popstate");
            });
        });
      }
      handleRouterEvent(t, r) {
        t instanceof $t
          ? this.updateStateMemento()
          : t instanceof Ut
          ? this.commitTransition(r)
          : t instanceof Go
          ? this.urlUpdateStrategy === "eager" &&
            (r.extras.skipLocationChange ||
              this.setBrowserUrl(this.createBrowserPath(r), r))
          : t instanceof Wo
          ? (this.commitTransition(r),
            this.urlUpdateStrategy === "deferred" &&
              !r.extras.skipLocationChange &&
              this.setBrowserUrl(this.createBrowserPath(r), r))
          : t instanceof It &&
            t.code !== Ae.SupersededByNewNavigation &&
            t.code !== Ae.Redirect
          ? this.restoreHistory(r)
          : t instanceof Or
          ? this.restoreHistory(r, !0)
          : t instanceof qe &&
            ((this.lastSuccessfulId = t.id),
            (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(t, { extras: r, id: o }) {
        let { replaceUrl: i, state: s } = r;
        if (this.location.isCurrentPathEqualTo(t) || i) {
          let a = this.browserPageId,
            c = b(b({}, s), this.generateNgRouterState(o, a));
          this.location.replaceState(t, "", c);
        } else {
          let a = b(
            b({}, s),
            this.generateNgRouterState(o, this.browserPageId + 1)
          );
          this.location.go(t, "", a);
        }
      }
      restoreHistory(t, r = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            i = this.currentPageId - o;
          i !== 0
            ? this.location.historyGo(i)
            : this.getCurrentUrlTree() === t.finalUrl &&
              i === 0 &&
              (this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (r && this.resetInternalState(t), this.resetUrlToCurrentUrlTree());
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.getRawUrlTree()),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(t, r) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: t, ɵrouterPageId: r }
          : { navigationId: t };
      }
      static ɵfac = (() => {
        let t;
        return function (o) {
          return (t || (t = As(e)))(o || e);
        };
      })();
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Wd(e, n) {
  e.events
    .pipe(
      Ye(
        (t) =>
          t instanceof qe ||
          t instanceof It ||
          t instanceof Or ||
          t instanceof Ut
      ),
      B((t) =>
        t instanceof qe || t instanceof Ut
          ? 0
          : (
              t instanceof It
                ? t.code === Ae.Redirect ||
                  t.code === Ae.SupersededByNewNavigation
                : !1
            )
          ? 2
          : 1
      ),
      Ye((t) => t !== 2),
      Me(1)
    )
    .subscribe(() => {
      n();
    });
}
var Iw = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  Sw = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  pn = (() => {
    class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      disposed = !1;
      nonRouterCurrentEntryChangeSubscription;
      console = v($u);
      stateManager = v(tv);
      options = v(ni, { optional: !0 }) || {};
      pendingTasks = v(Ft);
      urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred";
      navigationTransitions = v(Jm);
      urlSerializer = v(Jo);
      location = v(dn);
      urlHandlingStrategy = v(Ra);
      injector = v(De);
      _events = new ce();
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      navigated = !1;
      routeReuseStrategy = v(ev);
      onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore";
      config = v(ri, { optional: !0 })?.flat() ?? [];
      componentInputBindingEnabled = !!v(xa, { optional: !0 });
      constructor() {
        this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this).subscribe({
            error: (t) => {
              this.console.warn(t);
            },
          }),
          this.subscribeToNavigationEvents();
      }
      eventsSubscription = new ne();
      subscribeToNavigationEvents() {
        let t = this.navigationTransitions.events.subscribe((r) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              i = this.navigationTransitions.currentNavigation;
            if (o !== null && i !== null) {
              if (
                (this.stateManager.handleRouterEvent(r, i),
                r instanceof It &&
                  r.code !== Ae.Redirect &&
                  r.code !== Ae.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (r instanceof qe) this.navigated = !0;
              else if (r instanceof Rr) {
                let s = r.navigationBehaviorOptions,
                  a = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl),
                  c = b(
                    {
                      browserUrl: o.extras.browserUrl,
                      info: o.extras.info,
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        o.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        bw(o.source),
                    },
                    s
                  );
                this.scheduleNavigation(a, Vo, null, c, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            Ib(r) && this._events.next(r);
          } catch (o) {
            this.navigationTransitions.transitionAbortWithErrorSubject.next(o);
          }
        });
        this.eventsSubscription.add(t);
      }
      resetRootComponentType(t) {
        (this.routerState.root.component = t),
          (this.navigationTransitions.rootComponentType = t);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              Vo,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (t, r, o) => {
              this.navigateToSyncWithBrowser(t, o, r);
            }
          );
      }
      navigateToSyncWithBrowser(t, r, o) {
        let i = { replaceUrl: !0 },
          s = o?.navigationId ? o : null;
        if (o) {
          let c = b({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (i.state = c);
        }
        let a = this.parseUrl(t);
        this.scheduleNavigation(a, r, s, i).catch((c) => {
          this.disposed || this.injector.get(ze)(c);
        });
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(t) {
        (this.config = t.map(zd)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this._events.unsubscribe(),
          this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(t, r = {}) {
        let {
            relativeTo: o,
            queryParams: i,
            fragment: s,
            queryParamsHandling: a,
            preserveFragment: c,
          } = r,
          l = c ? this.currentUrlTree.fragment : s,
          u = null;
        switch (a ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            u = b(b({}, this.currentUrlTree.queryParams), i);
            break;
          case "preserve":
            u = this.currentUrlTree.queryParams;
            break;
          default:
            u = i || null;
        }
        u !== null && (u = this.removeEmptyProps(u));
        let d;
        try {
          let p = o ? o.snapshot : this.routerState.snapshot.root;
          d = Rm(p);
        } catch {
          (typeof t[0] != "string" || t[0][0] !== "/") && (t = []),
            (d = this.currentUrlTree.root);
        }
        return Nm(d, t, u, l ?? null);
      }
      navigateByUrl(t, r = { skipLocationChange: !1 }) {
        let o = xr(t) ? t : this.parseUrl(t),
          i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(i, Vo, null, r);
      }
      navigate(t, r = { skipLocationChange: !1 }) {
        return Mw(t), this.navigateByUrl(this.createUrlTree(t, r), r);
      }
      serializeUrl(t) {
        return this.urlSerializer.serialize(t);
      }
      parseUrl(t) {
        try {
          return this.urlSerializer.parse(t);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(t, r) {
        let o;
        if (
          (r === !0 ? (o = b({}, Iw)) : r === !1 ? (o = b({}, Sw)) : (o = r),
          xr(t))
        )
          return fm(this.currentUrlTree, t, o);
        let i = this.parseUrl(t);
        return fm(this.currentUrlTree, i, o);
      }
      removeEmptyProps(t) {
        return Object.entries(t).reduce(
          (r, [o, i]) => (i != null && (r[o] = i), r),
          {}
        );
      }
      scheduleNavigation(t, r, o, i, s) {
        if (this.disposed) return Promise.resolve(!1);
        let a, c, l;
        s
          ? ((a = s.resolve), (c = s.reject), (l = s.promise))
          : (l = new Promise((d, p) => {
              (a = d), (c = p);
            }));
        let u = this.pendingTasks.add();
        return (
          Wd(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(u));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: r,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: t,
            extras: i,
            resolve: a,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((d) => Promise.reject(d))
        );
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
function Mw(e) {
  for (let n = 0; n < e.length; n++) if (e[n] == null) throw new w(4008, !1);
}
var xw = new S("");
function qd(e, ...n) {
  return Tn([
    { provide: ri, multi: !0, useValue: e },
    [],
    { provide: Mt, useFactory: Ow, deps: [pn] },
    { provide: qs, multi: !0, useFactory: Rw },
    n.map((t) => t.ɵproviders),
  ]);
}
function Ow(e) {
  return e.routerState.root;
}
function Rw() {
  let e = v(vt);
  return (n) => {
    let t = e.get(Bn);
    if (n !== t.components[0]) return;
    let r = e.get(pn),
      o = e.get(Nw);
    e.get(Aw) === 1 && r.initialNavigation(),
      e.get(Pw, null, { optional: !0 })?.setUpPreloading(),
      e.get(xw, null, { optional: !0 })?.init(),
      r.resetRootComponentType(t.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var Nw = new S("", { factory: () => new ce() }),
  Aw = new S("", { providedIn: "root", factory: () => 1 });
var Pw = new S("");
var Lr = class e {
  text = "";
  duration = 20;
  delay = 10;
  event = !1;
  singleExecution = !0;
  finalText = "";
  characters = "wxyz0123456789!?@#$%&*><:;=";
  hasAnimated = !1;
  constructor() {}
  ngAfterViewInit() {
    this.event == !0 && this.animateWord(this.text);
  }
  ngOnChanges() {
    this.event == !0 && this.animateWord(this.text);
  }
  animateWord(n) {
    if (this.singleExecution && this.hasAnimated) return;
    let t = n.split(""),
      r = Array(n.length).fill("");
    (this.hasAnimated = !0),
      Dn(this.delay).subscribe(() => {
        vc(this.duration)
          .pipe(Me(t.length))
          .subscribe((o) => {
            o < t.length && (r[o] = t[o]);
            for (let i = o + 1; i < t.length; i++)
              t[i] ==
              `
`
                ? (r[i] = `
`)
                : (r[i] = this.characters.charAt(
                    Math.floor(Math.random() * this.characters.length)
                  ));
            this.finalText = r.join("");
          });
      });
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-scrambler-text"]],
    inputs: {
      text: "text",
      duration: "duration",
      delay: "delay",
      event: "event",
      singleExecution: "singleExecution",
    },
    features: [sn],
    decls: 2,
    vars: 1,
    consts: [[2, "white-space", "pre-line"]],
    template: function (t, r) {
      t & 1 && (ft(0, "div", 0), E(1), pt()), t & 2 && (m(), ht(r.finalText));
    },
    encapsulation: 2,
  });
};
var Fw = ["warpCanvas"],
  Lw = ["baseCanvas"],
  nv = ["#7A60DC", "#6757AA", "#231E3B", "#CAC8EF", "#2F2C41"],
  Na = class e {
    constructor(n) {
      this.ngZone = n;
    }
    canvasRef;
    baseCanvasRef;
    _targetOffset = 0;
    set targetOffset(n) {
      n !== this._targetOffset &&
        this.ctx != null &&
        ((this._targetOffset = n), this.startAnimation());
    }
    get targetOffset() {
      return this._targetOffset;
    }
    ctx;
    baseCtx;
    stars = [];
    width = window.innerWidth;
    height = window.innerHeight;
    centerX = this.width / 2;
    centerY = this.height / 2;
    animationFrameId = null;
    isAnimating = !1;
    offset = 0;
    SMOOTHING_FACTOR = 0.3;
    THRESHOLD = 2;
    STARS_COUNT = this.width * 1.1;
    STAR_SIZE_RANGE = [0.8, 1.5];
    resizeTimeout;
    ngAfterViewInit() {
      typeof window < "u" && this.init();
    }
    init() {
      (this.width = window.innerWidth),
        (this.height = window.innerHeight),
        (this.centerX = this.width / 2),
        (this.centerY = this.height / 2),
        (this.ctx = this.canvasRef.nativeElement.getContext("2d")),
        (this.baseCtx = this.baseCanvasRef.nativeElement.getContext("2d")),
        this.resizeCanvas(),
        this.initializeStars(),
        this.drawFixedStars(),
        this.ngZone.runOutsideAngular(() => this.draw());
    }
    ngOnDestroy() {
      this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
    }
    onResize() {
      clearTimeout(this.resizeTimeout),
        (this.resizeTimeout = setTimeout(() => {
          (this.width = window.innerWidth),
            (this.height = window.innerHeight),
            (this.centerX = this.width / 2),
            (this.centerY = this.height / 2),
            this.resizeCanvas(),
            this.initializeStars(),
            this.drawFixedStars();
        }, 200));
    }
    resizeCanvas() {
      (this.canvasRef.nativeElement.width = this.width),
        (this.canvasRef.nativeElement.height = this.height),
        (this.baseCanvasRef.nativeElement.width = this.width),
        (this.baseCanvasRef.nativeElement.height = this.height);
    }
    initializeStars() {
      this.stars = Array.from({ length: this.STARS_COUNT }, () =>
        this.createStar()
      );
    }
    drawFixedStars() {
      for (let n of this.stars) this.updateStar(n), this.drawStar(n);
    }
    createStar() {
      let n = Math.random() * Math.PI * 2;
      return {
        angle: n,
        endAngle: n,
        radius:
          (Math.pow(Math.random(), 0.6) *
            Math.sqrt(this.width ** 2 + this.height ** 2)) /
          2,
        color: nv[Math.floor(Math.random() * nv.length)],
        size:
          Math.random() * (this.STAR_SIZE_RANGE[1] - this.STAR_SIZE_RANGE[0]) +
          this.STAR_SIZE_RANGE[0],
      };
    }
    startAnimation() {
      this.isAnimating ||
        ((this.isAnimating = !0),
        this.ngZone.runOutsideAngular(() => this.draw()));
    }
    stopAnimation() {
      (this.isAnimating = !1),
        this.animationFrameId &&
          (cancelAnimationFrame(this.animationFrameId),
          (this.animationFrameId = null));
    }
    draw = () => {
      (this.offset +=
        (this.targetOffset - this.offset) * this.SMOOTHING_FACTOR),
        this.clearCanvas();
      for (let n of this.stars) this.updateStar(n), this.drawExposureArc(n);
      if (this.offset > this.THRESHOLD)
        this.animationFrameId = requestAnimationFrame(this.draw);
      else {
        (this.offset = this.targetOffset), this.clearCanvas();
        for (let n of this.stars) this.updateStar(n);
        this.stopAnimation();
      }
    };
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    updateStar(n) {
      n.endAngle = n.angle + this.offset * 0.001;
    }
    drawStar(n) {
      (this.baseCtx.fillStyle = n.color),
        this.baseCtx.beginPath(),
        this.baseCtx.arc(
          this.centerX + Math.cos(n.angle) * n.radius,
          this.centerY + Math.sin(n.angle) * n.radius,
          n.size,
          0,
          Math.PI * 2
        ),
        this.baseCtx.fill();
    }
    drawExposureArc(n) {
      this.ctx.beginPath(),
        this.ctx.arc(
          this.centerX,
          this.centerY,
          n.radius,
          n.angle,
          n.endAngle,
          !1
        ),
        (this.ctx.strokeStyle = n.color),
        (this.ctx.lineWidth = n.size * 2),
        this.ctx.stroke();
    }
    static ɵfac = function (t) {
      return new (t || e)(x(te));
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-star-exposure"]],
      viewQuery: function (t, r) {
        if ((t & 1 && (Oe(Fw, 5), Oe(Lw, 5)), t & 2)) {
          let o;
          Re((o = Ne())) && (r.canvasRef = o.first),
            Re((o = Ne())) && (r.baseCanvasRef = o.first);
        }
      },
      hostBindings: function (t, r) {
        t & 1 &&
          O(
            "resize",
            function () {
              return r.onResize();
            },
            we
          );
      },
      inputs: { targetOffset: "targetOffset" },
      decls: 4,
      vars: 0,
      consts: [
        ["baseCanvas", ""],
        ["warpCanvas", ""],
        [1, "bg-canvas"],
      ],
      template: function (t, r) {
        t & 1 && Ht(0, "canvas", 2, 0)(2, "canvas", null, 1);
      },
      dependencies: [Q],
      styles: [
        ".bg-canvas[_ngcontent-%COMP%]{background-color:#000}canvas[_ngcontent-%COMP%]{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:-2;transition:scale 1s ease-in-out}",
      ],
    });
  };
function jw(e, n) {
  e & 1 &&
    (h(0, "div", 6), y(1, "div", 7), g(), h(2, "div", 8), y(3, "div", 9), g());
}
var Aa = class e {
  constructor(n) {
    this.ngZone = n;
  }
  primaryColor = "red";
  secondaryColor = "blue";
  animPercentage = 0;
  hasRings = !1;
  planetSize = 900;
  hasPerspective = !1;
  BASE_SIZE = 600;
  scaleFactor = 1;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  pendingAnimationFrame = !1;
  ngOnChanges() {
    (this.scaleFactor = this.planetSize / this.BASE_SIZE),
      (this.animPercentage = Math.min(100, Math.max(0, this.animPercentage)));
  }
  onMouseMoveEvent(n) {
    this.shouldUpdatePerspective() &&
      (this.pendingAnimationFrame ||
        ((this.pendingAnimationFrame = !0),
        this.ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => {
            this.updateMouseOffsets(n), (this.pendingAnimationFrame = !1);
          });
        })));
  }
  shouldUpdatePerspective() {
    return this.hasPerspective && this.hasRings;
  }
  updateMouseOffsets(n) {
    let t = n.clientX - window.innerWidth / 2,
      r = n.clientY - window.innerHeight / 2;
    (this.mouseOffsetX = (t / (window.innerWidth / 2)) * 100),
      (this.mouseOffsetY = (r / (window.innerHeight / 2)) * 100);
  }
  updateMask(n) {
    let i = this.interpolate(20, 0, n),
      s = this.interpolate(70, 0, n),
      a = this.interpolate(5, 0, n);
    return {
      background: `linear-gradient(126deg, #00000000 ${i}%, #000000 ${s}%)`,
      "margin-top": `${a}%`,
      "margin-left": `${a}%`,
    };
  }
  interpolate(n, t, r) {
    return n + (t - n) * (r / 100);
  }
  generateStyleVariables() {
    return {
      "--base-size": `${this.BASE_SIZE}px`,
      "--scale": `${this.scaleFactor}`,
      "--wanted-size": `${this.planetSize}px`,
      "--perspectiveY": `${this.interpolate(80, 82, -this.mouseOffsetY)}deg`,
      "--perspectiveX": `${this.interpolate(0, 1, this.mouseOffsetX)}deg`,
      "--color-primary": this.primaryColor,
      "--color-secondary": this.secondaryColor,
    };
  }
  static ɵfac = function (t) {
    return new (t || e)(x(te));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-planet-gen"]],
    hostBindings: function (t, r) {
      t & 1 &&
        O(
          "mousemove",
          function (i) {
            return r.onMouseMoveEvent(i);
          },
          ut
        );
    },
    inputs: {
      primaryColor: "primaryColor",
      secondaryColor: "secondaryColor",
      animPercentage: "animPercentage",
      hasRings: "hasRings",
      planetSize: "planetSize",
      hasPerspective: "hasPerspective",
    },
    features: [sn],
    decls: 7,
    vars: 3,
    consts: [
      [1, "planet-container", 3, "ngStyle"],
      [1, "wrapper"],
      [1, "p-background"],
      [1, "p-color-2"],
      [1, "p-color-1"],
      [1, "p-mask", 3, "ngStyle"],
      [1, "rings"],
      [1, "ring-left"],
      [1, "rings", 2, "z-index", "1"],
      [1, "ring-right"],
    ],
    template: function (t, r) {
      t & 1 &&
        (h(0, "div", 0)(1, "div", 1),
        y(2, "div", 2)(3, "div", 3)(4, "div", 4),
        fe(5, jw, 4, 0),
        y(6, "div", 5),
        g()()),
        t & 2 &&
          (C("ngStyle", r.generateStyleVariables()),
          m(5),
          pe(r.hasRings ? 5 : -1),
          m(),
          C("ngStyle", r.updateMask(r.animPercentage)));
    },
    dependencies: [Q, ae],
    styles: [
      "[_nghost-%COMP%]{--ring-color: #a3a9d781;--rings-distance: 500px}.planet-container[_ngcontent-%COMP%]{position:relative;width:var(--wanted-size);height:var(--wanted-size);transform:perspective(400px);display:flex;align-items:center;justify-content:center}.wrapper[_ngcontent-%COMP%]{position:absolute;display:block;width:var(--base-size);height:var(--base-size);transform:scale(var(--scale))}.planet[_ngcontent-%COMP%], .p-background[_ngcontent-%COMP%], .p-color-1[_ngcontent-%COMP%], .p-color-2[_ngcontent-%COMP%], .p-mask[_ngcontent-%COMP%]{position:absolute;width:var(--base-size);height:var(--base-size);transform:rotate(10deg);z-index:1;border-radius:100%;filter:blur(10px)}.p-background[_ngcontent-%COMP%]{scale:.95}.p-color-1[_ngcontent-%COMP%]{background-color:var(--color-primary)}.p-color-2[_ngcontent-%COMP%]{border-radius:100%;filter:blur(2px);background-color:var(--color-secondary)}.rings[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);--width: calc((var(--base-size) * 2) + var(--rings-distance));--height: calc((var(--width) / 2));transform:rotate(25deg) perspective(4000px) rotateX(var(--perspectiveY)) rotateY(var(--perspectiveX))}.rings[_ngcontent-%COMP%]   .ring-left[_ngcontent-%COMP%], .rings[_ngcontent-%COMP%]   .ring-right[_ngcontent-%COMP%]{position:absolute;left:50%;width:var(--width);height:var(--height);background:radial-gradient(circle,transparent 39%,var(--ring-color) 40%,var(--ring-color) 40%,transparent 41%,transparent 46%,var(--ring-color) 51%,var(--ring-color) 54%,transparent 55%,var(--ring-color) 58%,transparent 61%,rgba(0,0,0,.3) 64%,rgba(0,0,0,.3) 65%,transparent 67%,rgba(0,0,0,.2) 69%,transparent 71%);background-size:100% 200%;top:50%;transform:translate(-50%,-100%)}.rings[_ngcontent-%COMP%]   .ring-right[_ngcontent-%COMP%]{top:calc(50% + var(--height));transform:translate(-50%,-100%) scaleY(-1)}",
    ],
  });
};
function Hw(e, n) {
  if ((e & 1 && y(0, "div", 0), e & 2)) {
    let t = n.$implicit;
    C("ngStyle", t);
  }
}
var Pa = {
    MIN_RANDOM_OFFSET: 50,
    MAX_RANDOM_OFFSET: 700,
    ANIMATION_START_PAGE: 3,
    FADE_OUT_PAGE: 4,
  },
  ka = class e {
    constructor(n) {
      this.cdr = n;
    }
    STARS_POSITIONS_RATIO = [
      { x: 5, y: 15 },
      { x: 20, y: 20 },
      { x: 20, y: 40 },
      { x: 20, y: 70 },
      { x: 40, y: 30 },
      { x: 50, y: 20 },
      { x: 80, y: 25 },
      { x: 50, y: 50 },
      { x: 55, y: 70 },
      { x: 80, y: 85 },
      { x: 40, y: 85 },
      { x: 10, y: 80 },
      { x: 10, y: 50 },
      { x: 80, y: 45 },
      { x: 75, y: 55 },
      { x: -10, y: 40 },
      { x: -10, y: 10 },
      { x: 20, y: 90 },
      { x: 90, y: 10 },
      { x: 60, y: 95 },
      { x: 90, y: 70 },
      { x: 90, y: 40 },
      { x: 40, y: 54 },
      { x: 63, y: 50 },
      { x: 100, y: 100 },
      { x: 100, y: 120 },
      { x: 5, y: 100 },
      { x: 55, y: 100 },
      { x: 55, y: 10 },
    ];
    stars = [];
    screenHeight = 0;
    screenWidth = 0;
    set scrollPosition(n) {
      typeof n != "number" || isNaN(n)
        ? (console.warn(
            "Invalid scroll position provided to StarRainComponent"
          ),
          (this._scrollPosition = 0))
        : ((this._scrollPosition = n), this.updateStars());
    }
    get scrollPosition() {
      return this._scrollPosition;
    }
    _scrollPosition = 0;
    destroy$ = new ce();
    ngAfterViewInit() {
      typeof window < "u" && this.generateStarsStyle();
    }
    ngOnDestroy() {
      this.destroy$.next(), this.destroy$.complete();
    }
    calculatePercentageValue(n, t) {
      return n < 0 || t < 0 ? 0 : (t * n) / 100;
    }
    generateStarsStyle() {
      (this.screenHeight = window.innerHeight),
        (this.screenWidth = window.innerWidth);
      try {
        (this.stars = this.STARS_POSITIONS_RATIO.map((n) => {
          let t = this.getRandomNumber(
              Pa.MIN_RANDOM_OFFSET,
              Pa.MAX_RANDOM_OFFSET
            ),
            r = this.calculatePercentageValue(n.x, this.screenWidth),
            o = this.calculatePercentageValue(n.y, this.screenHeight);
          return {
            xStart: r + t,
            yStart: o + t,
            xEnd: r,
            yEnd: o,
            left: `${r}px`,
            top: `${o}px`,
            opacity: 0,
          };
        })),
          this.cdr.markForCheck();
      } catch (n) {
        console.error("Error generating star styles:", n), (this.stars = []);
      }
    }
    getRandomNumber(n, t) {
      return Math.floor(Math.random() * (t - n + 1)) + n;
    }
    interpolate(n, t, r) {
      return n + (Math.max(0, Math.min(200, r)) / 100) * (t - n);
    }
    updateStarsPositions() {
      let n = this.calculateScrollPercentage(Pa.ANIMATION_START_PAGE);
      if (n <= 0 || n >= 200) return [];
      try {
        return (
          this.stars.forEach((t) => {
            (t.left = `${this.interpolate(t.xStart, t.xEnd, n)}px`),
              (t.top = `${this.interpolate(t.yStart, t.yEnd, n)}px`),
              (t.opacity =
                n > 100
                  ? this.interpolate(
                      1,
                      0,
                      this.calculateScrollPercentage(Pa.FADE_OUT_PAGE)
                    )
                  : this.interpolate(0, 1, n));
          }),
          this.stars
        );
      } catch (t) {
        return console.error("Error updating star positions:", t), [];
      }
    }
    updateStars() {
      this.updateStarsPositions(), this.cdr.markForCheck();
    }
    calculateScrollPercentage(n) {
      if (n < 1) return 0;
      let t = this.screenHeight * (n - 1);
      return Math.max(
        0,
        ((this.scrollPosition - t) / (this.screenHeight * n - t)) * 100
      );
    }
    onResize() {
      (this.screenWidth = window.innerWidth),
        (this.screenHeight = window.innerHeight),
        this.generateStarsStyle();
    }
    static ɵfac = function (t) {
      return new (t || e)(x(Un));
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-star-rain"]],
      hostBindings: function (t, r) {
        t & 1 &&
          O(
            "resize",
            function () {
              return r.onResize();
            },
            we
          );
      },
      inputs: { scrollPosition: "scrollPosition" },
      decls: 2,
      vars: 0,
      consts: [[1, "star", 3, "ngStyle"]],
      template: function (t, r) {
        t & 1 && _e(0, Hw, 1, 1, "div", 0, qu),
          t & 2 && Ie(r.updateStarsPositions());
      },
      dependencies: [Q, ae],
      styles: [
        ".star[_ngcontent-%COMP%]{position:absolute;width:80px;height:4px;background:#724dda;background:linear-gradient(126deg,#724dda,#724dda00);border-radius:100px;transform:rotate(45deg)}",
      ],
      changeDetection: 0,
    });
  };
var jr = class e {
  projects = [
    {
      id: "spb",
      title: "Visual_Travel_Journal",
      description:
        "A minimalist, typographic travel diary of Saint Petersburg – blending candid photos, bold text, and subtle details to capture the city’s quiet magic.",
      services: ["Concept", "Design", "UI/UX", "Development", "WEB"],
      client: "L'Petersburg shop",
      tags: "Concept \u2023 Design \u2023 UI/UX \u2023 WEB",
      thumbnail: "projects/spb/1.png",
      medias: [
        { type: "image", url: "/projects/spb/2.png", name: "", color: "red" },
        { type: "image", url: "/projects/spb/3.png", name: "", color: "red" },
        { type: "image", url: "/projects/spb/4.png", name: "", color: "red" },
        { type: "image", url: "/projects/spb/5.png", name: "", color: "red" },
        { type: "image", url: "/projects/spb/6.png", name: "", color: "red" },
      ],
      year: "2025",
    },
    {
      id: "museum",
      title: " Transport_museum",
      description:
        "A modern, heritage-inspired digital experience for the Moscow Transport Museum - blending clean UI, intuitive navigation, and brand-driven design to connect history with today’s audience.",
      services: ["Web Design", "UI/UX", "Development", "AI", "3D",],
      client: "Moscow Transport Museum",
      websiteUrl: "https://mtmuseum.ru/",
      tags: "3D \u2023 WEB \u2023 Web DESIGN \u2023",
      thumbnail: "projects/museum/1.jpg",
      medias: [
  {
    type: "image",
    url: "/projects/museum/2.png",   // ← Теперь это ПЕРВОЕ изображение — и оно существует!
    name: "",
    color: "red",
  },
  {
    type: "image",
    url: "/projects/museum/3.png",  // ← Второе — оно реально существует
    name: "",
    color: "red",
  },
  {
    type: "image",
    url: "/projects/museum/4.png",
    name: "",
    color: "red",
  },
  {
    type: "image",
    url: "/projects/museum/5.png",
    name: "",
    color: "red",
  },
],
      year: "2024",
    },
    {
      id: "Starbucks",
      title: "Starbucks",
      description:
        "A bold, dark-themed coffee brand experience - using Starbucks signature green as a vibrant accent against a deep black background to create contrast, energy, and brand recognition. ",
      services: [
        "Web Design",
        "UI/UX",
        "Branding",
      ],
      client: "Starbucks Colorado",
      tags: "Concept \u2023 Design \u2023 UI/UX \u2023 WEB",
      thumbnail: "projects/starbucks//1.jpg",
      medias: [
        { type: "image", url: "/projects/starbucks/2.png", name: "", color: "red" },
        { type: "image", url: "/projects/starbucks/3.png", name: "", color: "red" },
        { type: "image", url: "/projects/starbucks/4.png", name: "", color: "red" },
        { type: "image", url: "/projects/starbucks/5.png", name: "", color: "red" },
        { type: "image", url: "/projects/starbucks/6.png", name: "", color: "red" },
      ],
      year: "2024",
    },
    {
      id: "Chery",
      title: "Chery_Automobile",
      description:
        "A bold, streamlined digital showroom for automotive exploration — combining striking hero visuals, clear promotional typography, and decisive calls-to-action to create an energetic, confident space that reflects the power and promise of the CHERY driving experience. ",
      services: [
        "Concept",
        "Mobile Design",
        "UI/UX",
        "Story Telling",
        "WEB Desing",
      ],
      client: "Chery Automobile Co. Ltd.",
      websiteUrl: "https://www.chery.ru/",
      tags: "Concept \u2023 Mobile Design \u2023 UI/UX \u2023 Story Telling",
      thumbnail: "projects/Chery/logo.png",
      medias: [
        { type: "image", url: "/projects/chery/1.png", name: "", color: "red" },
        { type: "image", url: "/projects/chery/2.png", name: "", color: "red" },
        { type: "image", url: "/projects/chery/3.png", name: "", color: "red" },
      ],
      year: "2024",
    },
  ];
  getAllProjects() {
    return this.projects;
  }
  getProjectIds() {
    return this.projects.map((n) => n.id);
  }
  getProjectById(n) {
    return this.projects.find((t) => t.id === n) || null;
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Vw = ["tracker"],
  $w = (e) => ({ transform: e }),
  rv = (e) => ({ "transition-delay": e });
function Uw(e, n) {
  if ((e & 1 && (h(0, "p", 5), E(1), g()), e & 2)) {
    let t = n.$implicit;
    m(), He(" ", t, " ");
  }
}
function zw(e, n) {
  if ((e & 1 && (h(0, "p", 10), E(1), g()), e & 2)) {
    let t = n.$implicit,
      r = n.$index;
    C("ngStyle", Y(2, rv, r * 0.006 + "s")), m(), He(" ", t, " ");
  }
}
function Gw(e, n) {
  if ((e & 1 && (h(0, "p", 12), E(1), g()), e & 2)) {
    let t = n.$implicit,
      r = n.$index;
    C("ngStyle", Y(2, rv, r * 0.006 + "s")), m(), He(" ", t, " ");
  }
}
var Fa = class e {
  target;
  project;
  transformStyle = "";
  animationFrameId = 0;
  SMOOTH_FACTOR = 0.1;
  PERSPECTIVE = 800;
  intersectionObserver;
  needToStopAnimation = !1;
  currentRotation = { x: 0, y: 0 };
  targetRotation = { x: 0, y: 0 };
  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }
  onMouseMove(n, t) {
    let r = t.getBoundingClientRect(),
      o = (n.clientX - r.left) / r.width - 0.5,
      i = (n.clientY - r.top) / r.height - 0.5;
    this.targetRotation = { x: i * 15, y: -o * 15 };
  }
  onMouseLeave() {
    this.stopAnimationLoop();
  }
  onMouseEnter() {
    cancelAnimationFrame(this.animationFrameId), this.startAnimationLoop();
  }
  startAnimationLoop() {
    this.needToStopAnimation = !1;
    let t = 1e3 / 60,
      r = performance.now(),
      o = (i) => {
        let s = i - r;
        if (
          (s >= t && ((r = i - (s % t)), this.smoothRotate()),
          this.needToStopAnimation &&
            this.currentRotation.x === 0 &&
            this.currentRotation.y === 0)
        ) {
          cancelAnimationFrame(this.animationFrameId);
          return;
        }
        this.animationFrameId = requestAnimationFrame(o);
      };
    this.animationFrameId = requestAnimationFrame(o);
  }
  stopAnimationLoop() {
    (this.needToStopAnimation = !0), (this.targetRotation = { x: 0, y: 0 });
  }
  smoothRotate() {
    (this.currentRotation.x +=
      (this.targetRotation.x - this.currentRotation.x) * this.SMOOTH_FACTOR),
      (this.currentRotation.y +=
        (this.targetRotation.y - this.currentRotation.y) * this.SMOOTH_FACTOR);
    let n = 0.1;
    Math.abs(this.currentRotation.x) < n && (this.currentRotation.x = 0),
      Math.abs(this.currentRotation.y) < n && (this.currentRotation.y = 0),
      (this.transformStyle = `perspective(${this.PERSPECTIVE}px) rotateX(${this.currentRotation.x}deg) rotateY(${this.currentRotation.y}deg)`);
  }
  setupIntersectionObserver() {
    (this.intersectionObserver = new IntersectionObserver(
      ([n]) => {
        n.isIntersecting
          ? n.target.classList.add("container-active")
          : n.target.classList.remove("container-active");
      },
      { threshold: 0.01 }
    )),
      this.target &&
        this.intersectionObserver.observe(this.target.nativeElement);
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-project-preview"]],
    viewQuery: function (t, r) {
      if ((t & 1 && Oe(Vw, 5), t & 2)) {
        let o;
        Re((o = Ne())) && (r.target = o.first);
      }
    },
    inputs: { project: "project" },
    decls: 17,
    vars: 6,
    consts: [
      ["tracker", ""],
      [1, "container", 3, "mousemove", "mouseleave", "mouseenter"],
      [1, "cover-container"],
      [1, "cover-img", 3, "src", "alt", "ngStyle"],
      [1, "hover-title"],
      [1, "hover-title-letter"],
      [1, "infos"],
      [1, "tags"],
      [1, "title-container"],
      [1, "title"],
      [1, "title-letter", 3, "ngStyle"],
      [1, "fake-title"],
      [1, "fake-title-letter", 3, "ngStyle"],
    ],
    template: function (t, r) {
      if (t & 1) {
        let o = Ee();
        h(0, "div", 1, 0),
          O("mousemove", function (s) {
            J(o);
            let a = Yu(1);
            return ee(r.onMouseMove(s, a));
          })("mouseleave", function () {
            return J(o), ee(r.onMouseLeave());
          })("mouseenter", function () {
            return J(o), ee(r.onMouseEnter());
          }),
          h(2, "div", 2),
          y(3, "img", 3),
          h(4, "div", 4),
          _e(5, Uw, 2, 1, "p", 5, rt),
          g()(),
          h(7, "div", 6)(8, "p", 7),
          E(9),
          g(),
          h(10, "div", 8)(11, "div", 9),
          _e(12, zw, 2, 4, "p", 10, rt),
          g(),
          h(14, "div", 11),
          _e(15, Gw, 2, 4, "p", 12, rt),
          g()()()();
      }
      t & 2 &&
        (m(3),
        C("src", r.project.thumbnail, nt)("alt", r.project.title)(
          "ngStyle",
          Y(4, $w, r.transformStyle)
        ),
        m(2),
        Ie(r.project.title),
        m(4),
        ht(r.project.tags),
        m(3),
        Ie(r.project.title),
        m(3),
        Ie(r.project.year));
    },
    dependencies: [Q, ae],
    styles: [
      ".container[_ngcontent-%COMP%]{transition:opacity .7s ease-in-out;cursor:pointer;opacity:0}.container[_ngcontent-%COMP%]   .glitcher[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%}.container[_ngcontent-%COMP%]:hover   .glitcher[_ngcontent-%COMP%]{animation:glitch .7s ease-in-out}.container[_ngcontent-%COMP%]:hover   .title-letter[_ngcontent-%COMP%]{transform:translateY(-100%);opacity:0}.container[_ngcontent-%COMP%]:hover   .fake-title-letter[_ngcontent-%COMP%]{transform:translateY(-100%);opacity:1}.container[_ngcontent-%COMP%]:hover   .cover-img[_ngcontent-%COMP%]{opacity:.5}.container[_ngcontent-%COMP%]:hover   .hover-title-letter[_ngcontent-%COMP%]{transform:translateY(0);opacity:1}.container-active[_ngcontent-%COMP%]{opacity:1}.container-active[_ngcontent-%COMP%]   .cover-container[_ngcontent-%COMP%]{transform:scale(1)}.container-active[_ngcontent-%COMP%]   .cover-container[_ngcontent-%COMP%]   .cover-img[_ngcontent-%COMP%]{width:125%}.container-active[_ngcontent-%COMP%]   .infos[_ngcontent-%COMP%]{transform:translateY(0);opacity:1}.cover-container[_ngcontent-%COMP%]{transition:transform .7s ease-in-out;position:relative;border-radius:35px;aspect-ratio:16/9;transform:scale(.8);display:flex;align-items:center;justify-content:center;overflow:hidden}.cover-container[_ngcontent-%COMP%]   .cover-img[_ngcontent-%COMP%]{transition:width .7s ease-in-out,opacity .7s ease-in-out;will-change:all;width:140%}.infos[_ngcontent-%COMP%]{margin-top:20px;font-size:2.1vw;transform:translateY(-50px);opacity:0;transition:transform .6s ease-out,opacity .6s ease-out}.infos[_ngcontent-%COMP%]   .tags[_ngcontent-%COMP%]{font-size:1.2vw}.infos[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .infos[_ngcontent-%COMP%]   .fake-title[_ngcontent-%COMP%]{font-family:Gothic,sans-serif}.title-container[_ngcontent-%COMP%]{position:relative;overflow:hidden}.title-container[_ngcontent-%COMP%]   .title-letter[_ngcontent-%COMP%], .title-container[_ngcontent-%COMP%]   .fake-title-letter[_ngcontent-%COMP%]{transition:all .5s cubic-bezier(1,0,.39,.86)}.title-container[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .title-container[_ngcontent-%COMP%]   .fake-title[_ngcontent-%COMP%]{display:flex}.title-container[_ngcontent-%COMP%]   .fake-title[_ngcontent-%COMP%]{position:absolute}.title-container[_ngcontent-%COMP%]   .fake-title-letter[_ngcontent-%COMP%]{opacity:0}.hover-title[_ngcontent-%COMP%]{position:fixed;display:flex;flex-wrap:wrap;width:100%;font-size:3vw;text-transform:uppercase;color:var(--white);mix-blend-mode:screen;overflow:hidden;font-family:Gothic,sans-serif;font-size:2.2vw;justify-content:center}.hover-title[_ngcontent-%COMP%]   .hover-title-letter[_ngcontent-%COMP%]{transition:all .5s cubic-bezier(1,0,.39,.86);transform:translateY(100%);opacity:0}",
    ],
  });
};
var Se = class e {
  constructor(n, t) {
    this.router = n;
    this.location = t;
    this.router.events.subscribe((r) => {
      r instanceof $t && this.loading.next(!0),
        r instanceof qe &&
          (setTimeout(() => {
            this.loading.next(!1);
          }, 200),
          (this.previousUrl = this.currentUrl),
          (this.currentUrl = r.urlAfterRedirects));
    });
  }
  loading = new re(!0);
  loading$ = this.loading.asObservable();
  previousUrl = null;
  currentUrl = null;
  acceptNavigation() {
    this.loading.next(!1);
  }
  navigateTo(n) {
    this.router.navigateByUrl(n);
  }
  navigateBack() {
    this.previousUrl == null
      ? this.router.navigateByUrl("")
      : this.router.navigateByUrl(this.previousUrl);
  }
  static ɵfac = function (t) {
    return new (t || e)(R(pn), R(dn));
  };
  static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Ww = ["tracking"],
  qw = (e, n) => n.id;
function Yw(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "div", 2, 0),
      O("click", function () {
        let o = J(t).$implicit,
          i = $();
        return ee(i.openProject(o.id));
      }),
      y(2, "app-project-preview", 3),
      g();
  }
  if (e & 2) {
    let t = n.$implicit;
    m(2), C("project", t);
  }
}
var Br = class e {
  maxCount = 4;
  projects = [];
  projectService = v(jr);
  crouterService = v(Se);
  targets;
  constructor() {
    this.projects = this.projectService.getAllProjects();
  }
  openProject(n) {
    this.crouterService.navigateTo("projects/" + n);
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-projects-preview"]],
    viewQuery: function (t, r) {
      if ((t & 1 && Oe(Ww, 5), t & 2)) {
        let o;
        Re((o = Ne())) && (r.targets = o);
      }
    },
    inputs: { maxCount: "maxCount" },
    decls: 3,
    vars: 0,
    consts: [
      ["tracking", ""],
      [1, "grid"],
      [3, "click"],
      [3, "project"],
    ],
    template: function (t, r) {
      t & 1 && (h(0, "div", 1), _e(1, Yw, 3, 1, "div", null, qw), g()),
        t & 2 && (m(), Ie(r.projects));
    },
    dependencies: [Q, Fa],
    styles: [
      ".grid[_ngcontent-%COMP%]{width:100%;display:flex;flex-wrap:wrap;gap:60px;padding:50px}.grid[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{width:calc(50% - 30px);height:fit-content}",
    ],
  });
};
var La = class e {
  constructor(n) {
    this.cdr = n;
  }
  mouseX = 0;
  mouseY = 0;
  mouseOffsetX = 0;
  mouseOffsetY = 0;
  finalX = 0;
  finalY = 0;
  smoothingFactor = 0.05;
  lastUpdate = 0;
  updateFrequency = 16;
  ngOnInit() {
    this.smoothUpdate();
  }
  onMouseMoveEvent(n) {
    (this.mouseX = n.clientX), (this.mouseY = n.clientY);
  }
  smoothUpdate() {
    let n = (t) => {
      t - this.lastUpdate >= this.updateFrequency &&
        (this.calculateMouseOffsetFromCenter(),
        (this.finalX +=
          (this.mouseOffsetX - this.finalX) * this.smoothingFactor),
        (this.finalY +=
          (this.mouseOffsetY - this.finalY) * this.smoothingFactor),
        this.cdr.markForCheck(),
        (this.lastUpdate = t)),
        requestAnimationFrame(n);
    };
    requestAnimationFrame(n);
  }
  calculateMouseOffsetFromCenter() {
    let n = window.innerWidth / 2,
      t = window.innerHeight / 2,
      r = this.mouseX - n,
      o = this.mouseY - t;
    (this.mouseOffsetX = (r / n) * 100), (this.mouseOffsetY = (o / t) * 100);
  }
  moveByMouseOffset(n) {
    let t = {};
    return (
      (t.transform = `translate(-50%, -50%) perspective(500px) rotateX(${
        this.finalY * -1 * 0.5
      }deg) rotateY(${this.finalX * 0.5}deg)`),
      t
    );
  }
  static ɵfac = function (t) {
    return new (t || e)(x(Un));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-nebula"]],
    hostBindings: function (t, r) {
      t & 1 &&
        O(
          "mousemove",
          function (i) {
            return r.onMouseMoveEvent(i);
          },
          ut
        );
    },
    decls: 1,
    vars: 1,
    consts: [
      ["src", "icons/nebula.svg", "alt", "", 1, "gradient-1", 3, "ngStyle"],
    ],
    template: function (t, r) {
      t & 1 && y(0, "img", 0), t & 2 && C("ngStyle", r.moveByMouseOffset(0.5));
    },
    dependencies: [Q, ae],
    styles: [
      ".gradient-1[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:110%;filter:blur(50px);z-index:0}",
    ],
  });
};
var Zw = ["canvas"];
function Qw(e, n) {
  e & 1 &&
    (h(0, "div", 8),
    y(1, "div", 9),
    g(),
    h(2, "div", 10),
    y(3, "div", 11),
    g());
}
var Xw = (() => {
    class e {
      contexts = new Map();
      ANIMATION_FRAME_RATE = 1e3 / 36;
      SHADER_A = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
    } 
  `;
      SHADER_B = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    #define time iTime
    const float arrow_density = 4.5;
    const float arrow_length = .45;
    const int iterationTime1 = 20;
    const int iterationTime2 = 20;
    const int vector_field_mode = 0;
    const float scale = 12.;
    const float velocity_x = 0.01;
    const float velocity_y = 0.01;
    const float mode_2_speed = 0.7;
    const float mode_1_detail = 200.;
    const float mode_1_twist = 50.;
    const bool isArraw = true;
    const vec3 luma = vec3(0.2126, 0.7152, 0.0722);

    float f(in vec2 p) {
      return sin(p.x+sin(p.y+time*velocity_x)) * sin(p.y*p.x*0.1+time*velocity_y);
    }

    struct Field {
      vec2 vel;
      vec2 pos;
    };

    Field field(in vec2 p,in int mode) {
      Field field;
      if(mode == 0){
        vec2 ep = vec2(0.05,0.);
        vec2 rz= vec2(0);
        for( int i=0; i<iterationTime1; i++ ) {
          float t0 = f(p);
          float t1 = f(p + ep.xy);
          float t2 = f(p + ep.yx);
          vec2 g = vec2((t1-t0), (t2-t0))/ep.xx;
          vec2 t = vec2(-g.y,g.x);
          p += (mode_1_twist*0.01)*t + g*(1./mode_1_detail);
          p.x = p.x + sin( time*mode_2_speed/10.)/10.;
          p.y = p.y + cos(time*mode_2_speed/10.)/10.;
          rz= g; 
        }
        field.vel = rz;
        return field;
      }
      return field;
    }

    float segm(in vec2 p, in vec2 a, in vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa,ba)/dot(ba,ba), 0., 1.);
      return length(pa - ba*h)*20.*arrow_density;
    }

    float fieldviz(in vec2 p,in int mode) {
      vec2 ip = floor(p*arrow_density)/arrow_density + .5/arrow_density;   
      vec2 t = field(ip,mode).vel;
      float m = min(0.1,pow(length(t),0.5)*(arrow_length/arrow_density));
      vec2 b = normalize(t)*m;
      float rz = segm(p, ip, ip+b);
      vec2 prp = (vec2(-b.y,b.x));
      rz = min(rz,segm(p, ip+b, ip+b*0.65+prp*0.3));
      return clamp(min(rz,segm(p, ip+b, ip+b*0.65-prp*0.3)),0.,1.);
    }

    vec3 getRGB(in Field fld,in int mode) {
      if(mode == 0) {
        vec2 p = fld.vel;
        //vec3 origCol = vec3(p.y * 0.2 + 0.2, p.x * 0.9 + p.y - 0.6, p.x * p.x * 2.0 + 0.5);
        vec3 origCol = vec3(0.3, p.y * 0.3 + 0.4, 0.8);
        return origCol;
      }
      return vec3(0.0);
    }

    void main() {
      vec2 p = gl_FragCoord.xy / iResolution.xy - 0.5;
      p.x *= iResolution.x/iResolution.y;
      p *= scale;
      
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec3 col;
      float fviz;
      
      int vector_mode = 0;
      Field fld = field(p,vector_mode);
      col = getRGB(fld,vector_mode) * 0.85;    
      gl_FragColor = vec4(col,1.0);
    } 
  `;
      constructor() {}
      initialize(t, r = null) {
        return xt(this, null, function* () {
          let o = t.getContext("webgl", {
            powerPreference: "low-power",
            antialias: !1,
          });
          if (!o) throw new Error("WebGL not supported");
          let i = yield this.createShader(o, r);
          this.contexts.set(t, {
            gl: o,
            program: i,
            animationFrameId: 0,
            lastUpdateTime: 0,
          });
        });
      }
      createShader(t, r = null) {
        return xt(this, null, function* () {
          let o = yield this.loadShader(t, t.VERTEX_SHADER, this.SHADER_A),
            i = yield this.loadShader(t, t.FRAGMENT_SHADER, this.SHADER_B, r),
            s = t.createProgram();
          if (
            (t.attachShader(s, o),
            t.attachShader(s, i),
            t.linkProgram(s),
            !t.getProgramParameter(s, t.LINK_STATUS))
          )
            throw new Error(
              "Unable to initialize shader program: " + t.getProgramInfoLog(s)
            );
          return this.setupBuffers(t, s), s;
        });
      }
      loadShader(t, r, o, i = null) {
        return xt(this, null, function* () {
          r === t.FRAGMENT_SHADER &&
            i &&
            (o = o.replace(
              /const float mode_2_speed = [0-9.]+;/,
              `const float mode_2_speed = ${i.toFixed(1)};`
            ));
          let s = t.createShader(r);
          if (
            (t.shaderSource(s, o),
            t.compileShader(s),
            !t.getShaderParameter(s, t.COMPILE_STATUS))
          )
            throw new Error(
              "An error occurred compiling the shaders: " +
                t.getShaderInfoLog(s)
            );
          return s;
        });
      }
      setupBuffers(t, r) {
        let o = t.createBuffer();
        t.bindBuffer(t.ARRAY_BUFFER, o),
          t.bufferData(
            t.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            t.STATIC_DRAW
          );
        let i = t.getAttribLocation(r, "a_position");
        t.enableVertexAttribArray(i),
          t.vertexAttribPointer(i, 2, t.FLOAT, !1, 0, 0);
      }
      resize(t) {
        let r = this.contexts.get(t);
        if (!r) return;
        let { gl: o } = r,
          i = Math.floor(t.clientWidth * 0.5),
          s = Math.floor(t.clientHeight * 0.5);
        (t.width !== i || t.height !== s) &&
          ((t.width = i),
          (t.height = s),
          o.viewport(0, 0, o.canvas.width, o.canvas.height));
      }
      animate(t, r) {
        let o = this.contexts.get(t);
        if (!o) return;
        let { gl: i, program: s, lastUpdateTime: a } = o,
          c = performance.now();
        if (c - a < this.ANIMATION_FRAME_RATE) {
          o.animationFrameId = requestAnimationFrame(() => this.animate(t, r));
          return;
        }
        (o.lastUpdateTime = c),
          i.useProgram(s),
          i.uniform1f(i.getUniformLocation(s, "iTime"), c / 1e3),
          i.uniform2f(
            i.getUniformLocation(s, "iResolution"),
            i.canvas.width,
            i.canvas.height
          ),
          i.drawArrays(i.TRIANGLE_STRIP, 0, 4),
          r(),
          (o.animationFrameId = requestAnimationFrame(() =>
            this.animate(t, r)
          ));
      }
      cleanup(t) {
        let r = this.contexts.get(t);
        if (!r) return;
        let { gl: o, program: i, animationFrameId: s } = r;
        cancelAnimationFrame(s), o.deleteProgram(i), this.contexts.delete(t);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Kw = (() => {
    class e {
      baseSize = 400;
      startOpacity = 20;
      endOpacity = 75;
      margin = 6;
      constructor() {}
      calculateScaleFactor(t) {
        return t / this.baseSize;
      }
      updatePlanetShadow(t) {
        if (t < 0 || t > 100)
          throw new Error(
            `Invalid animation percentage: ${t}. Value must be between 0 and 100.`
          );
        let r = this.interpolate(this.startOpacity, 0, t),
          o = this.interpolate(this.endOpacity, 0, t),
          i = this.interpolate(this.margin, 0, t);
        return {
          background: `linear-gradient(126deg, #00000000 ${r}%, #000000 ${o}%)`,
          "margin-top": `${i}%`,
          "margin-left": `${i}%`,
        };
      }
      generateStyleVariables(t) {
        let r = this.calculateScaleFactor(t.planetSize);
        return {
          "--base-size": `${this.baseSize}px`,
          "--scale": `${r}`,
          "--perspectiveX": `${
            t.xRotation + t.mouseOffsetX * t.movementIntensity
          }deg`,
          "--perspectiveY": `${
            t.yRotation + t.mouseOffsetY * t.movementIntensity * -1
          }deg`,
          "--color-primary": t.primaryColor,
          "--color-secondary": t.secondaryColor,
          "--rings-color": t.ringsColor,
          "--rings-distance": t.ringsDistance,
          "--shader-transform": `translate(calc(-50% + ${
            t.mouseOffsetX * t.movementIntensity
          }%), calc(-50% + ${t.mouseOffsetY * t.movementIntensity}%))`,
        };
      }
      interpolate(t, r, o) {
        return t + (r - t) * (o / 100);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  ov = (() => {
    class e {
      webglService;
      planetStyleService;
      canvasRef;
      planetSize = 500;
      primaryColor = "#1c00ff";
      secondaryColor = "#00E0FF";
      hasRings = !0;
      ringsColor = "#a3a9d781";
      ringsDistance = "400px";
      movementIntensity = 0.03;
      animationSpeed = 0.9;
      hasPerspective = !0;
      hasAtmopshere = !0;
      xRotation = 0;
      yRotation = 80;
      set nightPercentage(t) {
        if (t < 0 || t > 100)
          throw new Error(
            `Invalid night percentage: ${t}. Must be between 0 and 100.`
          );
        this._nightPercentage = t;
      }
      get nightPercentage() {
        return this._nightPercentage;
      }
      mouseOffsetX = 0;
      mouseOffsetY = 0;
      _nightPercentage = 0;
      resizeObserver = new ResizeObserver(() => this.handleResize());
      constructor(t, r) {
        (this.webglService = t), (this.planetStyleService = r);
      }
      ngAfterViewInit() {
        return xt(this, null, function* () {
          yield this.initWebGL();
        });
      }
      ngOnDestroy() {
        this.canvasRef?.nativeElement &&
          this.webglService.cleanup(this.canvasRef.nativeElement),
          this.resizeObserver.disconnect();
      }
      initWebGL() {
        return xt(this, null, function* () {
          if (!this.hasAtmopshere) return !1;
          try {
            let t = this.canvasRef.nativeElement;
            return (
              yield this.webglService.initialize(t, this.animationSpeed),
              this.webglService.animate(t, () => {}),
              this.resizeObserver.observe(t),
              !0
            );
          } catch (t) {
            return console.error("Failed to initialize WebGL:", t), !1;
          }
        });
      }
      handleResize() {
        this.canvasRef?.nativeElement &&
          this.webglService.resize(this.canvasRef.nativeElement);
      }
      updatePlanetShadow(t) {
        return this.planetStyleService.updatePlanetShadow(t);
      }
      generateStyleVariables() {
        return this.planetStyleService.generateStyleVariables({
          planetSize: this.planetSize,
          mouseOffsetX: this.mouseOffsetX,
          mouseOffsetY: this.mouseOffsetY,
          primaryColor: this.primaryColor,
          secondaryColor: this.secondaryColor,
          ringsColor: this.ringsColor,
          ringsDistance: this.ringsDistance,
          movementIntensity: this.movementIntensity,
          xRotation: this.xRotation,
          yRotation: this.yRotation,
        });
      }
      updateMouseOffsets(t) {
        (this.mouseOffsetX =
          ((t.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) *
          100),
          (this.mouseOffsetY =
            ((t.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) *
            100);
      }
      onMouseMoveEvent(t) {
        this.hasPerspective && this.updateMouseOffsets(t);
      }
      static ɵfac = function (r) {
        return new (r || e)(x(Xw), x(Kw));
      };
      static ɵcmp = k({
        type: e,
        selectors: [["lib-genesis"]],
        viewQuery: function (r, o) {
          if ((r & 1 && Oe(Zw, 5), r & 2)) {
            let i;
            Re((i = Ne())) && (o.canvasRef = i.first);
          }
        },
        hostBindings: function (r, o) {
          r & 1 &&
            O(
              "mousemove",
              function (s) {
                return o.onMouseMoveEvent(s);
              },
              ut
            );
        },
        inputs: {
          planetSize: "planetSize",
          primaryColor: "primaryColor",
          secondaryColor: "secondaryColor",
          hasRings: "hasRings",
          ringsColor: "ringsColor",
          ringsDistance: "ringsDistance",
          movementIntensity: "movementIntensity",
          animationSpeed: "animationSpeed",
          hasPerspective: "hasPerspective",
          hasAtmopshere: "hasAtmopshere",
          xRotation: "xRotation",
          yRotation: "yRotation",
          nightPercentage: "nightPercentage",
        },
        decls: 9,
        vars: 3,
        consts: [
          ["canvas", ""],
          [1, "planet-container", 3, "ngStyle"],
          [1, "wrapper"],
          [1, "p-background"],
          [1, "p-color-2"],
          [1, "shader-canvas"],
          [1, "atmosphere-color"],
          [1, "p-mask", 3, "ngStyle"],
          [1, "rings"],
          [1, "ring-left"],
          [1, "rings", 2, "z-index", "1"],
          [1, "ring-right"],
        ],
        template: function (r, o) {
          r & 1 &&
            (h(0, "div", 1)(1, "div", 2),
            y(2, "div", 3),
            h(3, "div", 4),
            y(4, "canvas", 5, 0),
            g(),
            y(6, "div", 6),
            fe(7, Qw, 4, 0),
            y(8, "div", 7),
            g()()),
            r & 2 &&
              (C("ngStyle", o.generateStyleVariables()),
              m(7),
              pe(o.hasRings ? 7 : -1),
              m(),
              C("ngStyle", o.updatePlanetShadow(o.nightPercentage)));
        },
        dependencies: [Q, ae],
        styles: [
          "*[_ngcontent-%COMP%]{transition:all .2s ease-out}.planet-container[_ngcontent-%COMP%]{position:relative;width:var(--planet-size);height:var(--planet-size);transform:perspective(400px);display:flex;align-items:center;justify-content:center}.wrapper[_ngcontent-%COMP%]{position:absolute;display:block;width:var(--base-size);height:var(--base-size);transform:scale(var(--scale))}.planet[_ngcontent-%COMP%], .p-background[_ngcontent-%COMP%], .atmosphere-color[_ngcontent-%COMP%], .p-color-2[_ngcontent-%COMP%], .p-mask[_ngcontent-%COMP%]{position:absolute;width:var(--base-size);height:var(--base-size);transform:rotate(10deg);z-index:1;border-radius:100%;filter:blur(10px)}.p-background[_ngcontent-%COMP%]{scale:.95}.atmosphere-color[_ngcontent-%COMP%]{background-color:var(--color-primary);mix-blend-mode:hue}.p-color-2[_ngcontent-%COMP%]{border-radius:100%;filter:blur(1px);overflow:hidden;background-color:var(--color-secondary)}.rings[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);--width: calc((var(--base-size) * 2) + var(--rings-distance));--height: calc((var(--width) / 2));transform:rotate(25deg) perspective(4000px) rotateX(var(--perspectiveY)) rotateY(var(--perspectiveX))}.rings[_ngcontent-%COMP%]   .ring-left[_ngcontent-%COMP%], .rings[_ngcontent-%COMP%]   .ring-right[_ngcontent-%COMP%]{position:absolute;left:50%;width:var(--width);height:var(--height);background:radial-gradient(circle,transparent 39%,var(--rings-color) 40%,var(--rings-color) 40%,transparent 41%,transparent 46%,var(--rings-color) 51%,var(--rings-color) 54%,transparent 55%,var(--rings-color) 58%,transparent 61%,rgba(0,0,0,.3) 64%,rgba(0,0,0,.3) 65%,transparent 67%,rgba(0,0,0,.2) 69%,transparent 71%);background-size:100% 200%;top:50%;transform:translate(-50%,-100%)}.rings[_ngcontent-%COMP%]   .ring-right[_ngcontent-%COMP%]{top:calc(50% + var(--height));transform:translate(-50%,-100.05%) scaleY(-1)}.shader-canvas[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;width:130%;height:130%;transform:var(--shader-transform);z-index:-1}",
        ],
      });
    }
    return e;
  })();
var Tt = class e {
  isMobileSubject = new re(this.checkIsMobile());
  isMobile$ = this.isMobileSubject.asObservable();
  ngAfterViewInit() {
    this.onResize();
  }
  onResize() {
    this.isMobileSubject.next(this.checkIsMobile());
  }
  checkIsMobile() {
    return typeof window < "u" ? window.innerWidth <= 768 : !1;
  }
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Zd = (e) => ({ opacity: e }),
  Jw = (e) => ({ "astronaut-show": e }),
  iv = (e, n) => ({ width: e, opacity: n }),
  e_ = (e) => ({ "planets-2-hide": e }),
  t_ = () => [4, 10],
  n_ = (e, n) => ({ opacity: e, top: n }),
  r_ = (e) => ({ bottom: e });
function o_(e, n) {
  if (
    (e & 1 &&
      (h(0, "div", 3),
      y(1, "lib-genesis", 16)(2, "lib-genesis", 17)(3, "lib-genesis", 18),
      g()),
    e & 2)
  ) {
    let t = $(2);
    C("ngStyle", t.updatePlanet()),
      m(),
      C("planetSize", t.screenHeight * 0.7)(
        "nightPercentage",
        t.getPositionForPageLimitted(0, 100, 1)
      ),
      m(),
      C("ngStyle", t.moveByMouseOffset("sat-1", 0.7))(
        "planetSize",
        t.screenHeight * 0.18
      )("nightPercentage", t.getPositionForPageLimitted(0, 100, 1))(
        "hasRings",
        !1
      )("hasAtmopshere", !1)("primaryColor", "#00d4ff")(
        "secondaryColor",
        "#8f89e4"
      ),
      m(),
      C("ngStyle", t.moveByMouseOffset("sat-2", 0.4))(
        "planetSize",
        t.screenHeight * 0.1
      )("nightPercentage", t.getPositionForPageLimitted(0, 100, 1))(
        "hasRings",
        !1
      )("hasAtmopshere", !1)("primaryColor", "#1b2733")(
        "secondaryColor",
        "#5d72cf"
      );
  }
}
function i_(e, n) {
  if (
    (e & 1 &&
      (h(0, "div", 4)(1, "div")(2, "p", 19),
      E(3, "FROSTA"),
      g(),
      h(4, "span", 19),
      E(5, "WITH"),
      g()(),
      h(6, "div")(7, "span", 19),
      E(8, "LOVE"),
      g(),
      h(9, "p", 19),
      E(10, "STUDIO"),
      g()()()),
    e & 2)
  ) {
    let t = $(2);
    m(2),
      C(
        "ngStyle",
        $n(
          4,
          iv,
          t.getPositionForPage(32, 0, 2) + "vh",
          t.getPositionForPage(1, 0, 2)
        )
      ),
      m(2),
      C("ngStyle", Y(7, Zd, t.getPositionForPage(1, 0, 3))),
      m(3),
      C("ngStyle", Y(9, Zd, t.getPositionForPage(1, 0, 3))),
      m(2),
      C(
        "ngStyle",
        $n(
          11,
          iv,
          t.getPositionForPage(43, 0, 2) + "vh",
          t.getPositionForPage(1, 0, 2)
        )
      );
  }
}
function s_(e, n) {
  if (
    (e & 1 &&
      (h(0, "div", 7), y(1, "lib-genesis", 20)(2, "app-planet-gen", 21), g()),
    e & 2)
  ) {
    let t = $(2);
    C("ngClass", Y(16, e_, t.currentPageIndex >= 9))(
      "ngStyle",
      $n(
        19,
        n_,
        t.getPositionForPage(0, 1, 5),
        t.getPositionForPage2(0, 70, Zu(18, t_)) * -1 + "vh"
      )
    ),
      m(),
      C("nightPercentage", t.getPositionForPage(100, 0, 6))(
        "planetSize",
        t.screenHeight * 1.3
      )("primaryColor", "#637f91")("secondaryColor", "#4253a3")("hasRings", !0)(
        "hasAtmopshere",
        !0
      )("animationSpeed", 0.001)("xRotation", -20)("movementIntensity", 0.01),
      m(),
      C("ngStyle", Y(22, r_, t.getPositionForPage(0, 40, 6) + "px"))(
        "animPercentage",
        t.getPositionForPage(100, 0, 6)
      )("planetSize", t.screenHeight * 0.2)("primaryColor", "#636491")(
        "secondaryColor",
        "#4253a3"
      );
  }
}
function a_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "div", 15),
      y(1, "app-nebula"),
      h(2, "div", 22)(3, "div", 23)(4, "div", 24)(5, "p"),
      E(6, "LET'S CHAT"),
      g(),
      h(7, "p"),
      E(8, "LET'S CHAT"),
      g(),
      h(9, "p"),
      E(10, "LET'S CHAT"),
      g()(),
      h(11, "p", 25),
      E(12, "GET IN TOUCH"),
      g(),
      h(13, "div", 26),
      O("click", function () {
        J(t);
        let o = $(2);
        return ee(o.navigateTo("/contact"));
      }),
      h(14, "div"),
      E(15, " LET'S CONNECT "),
      y(16, "div", 27),
      g(),
      y(17, "img", 28),
      g()(),
      h(18, "div", 29),
      y(19, "img", 30),
      h(20, "p", 31),
      E(21, "\xA9 Frosta Studio"),
      g(),
      h(22, "p"),
      E(23, "hello@frostastudio.com"),
      g(),
      y(24, "img", 32),
      g()()();
  }
  if (e & 2) {
    let t = $(2);
    C("ngStyle", t.fixToPage(12));
  }
}
function c_(e, n) {
  if (
    (e & 1 &&
      (y(0, "app-star-exposure", 0),
      h(1, "div", 1)(2, "div", 2),
      fe(3, o_, 4, 17, "div", 3),
      fe(4, i_, 11, 14, "div", 4),
      y(5, "app-star-rain", 5)(6, "app-projects-preview", 6),
      fe(7, s_, 3, 24, "div", 7),
      h(8, "div", 8),
      y(9, "app-scrambler-text", 9),
      h(10, "div", 10),
      y(11, "app-scrambler-text", 11)(12, "app-scrambler-text", 11),
      g()(),
      h(13, "div", 8),
      y(14, "app-scrambler-text", 9)(15, "app-scrambler-text", 12),
      g(),
      h(16, "div", 13)(17, "p"),
      E(18, "frosta"),
      g(),
      h(19, "p"),
      E(20, "studio"),
      g()(),
      y(21, "img", 14),
      fe(22, a_, 25, 1, "div", 15),
      g()()),
    e & 2)
  ) {
    let t = $();
    C(
      "ngStyle",
      Y(28, Zd, t.currentPageIndex >= 2 && t.currentPageIndex <= 5 ? 0 : 1)
    )("targetOffset", t.getPositionForPage(0, 100, 10)),
      m(3),
      pe(t.currentPageIndex < 3 ? 3 : -1),
      m(),
      pe(t.currentPageIndex < 5 ? 4 : -1),
      m(),
      C("scrollPosition", t.scrollPosition),
      m(),
      C("maxCount", 4)("ngStyle", t.fixToPage(4)),
      m(),
      pe(t.currentPageIndex >= 5 && t.currentPageIndex < 10 ? 7 : -1),
      m(2),
      C(
        "text",
        `on time 
 on budget 
 built to last`
      )("event", t.currentPageIndex == 7)("ngStyle", t.appearDisappear(7)),
      m(),
      C("ngStyle", t.appearDisappear(7)),
      m(),
    C(
  "text",
  `FROSTA STUDIO COMBINES GLOBAL DESIGN
   TALENT WITH EXPERT MANAGMENT 
   TO DELIVER STUNNING WEBSITES⁠`
)("event", t.currentPageIndex == 7)("duration", 10),
      m(),
      C(
        "text",
        `
 `
      )("event", t.currentPageIndex == 7)("duration", 10),
      m(2),
      C(
        "text",
        `Clear 
        Communication`
      )("event", t.currentPageIndex == 8)("ngStyle", t.appearDisappear(8)),
      m(),
      C("ngStyle", t.appearDisappear(8))(
        "text",
        
        `MODERN INTERFACES
BUILT FOR YOUR GOALS
CLEAN, SCALABLE, TIMELESS

⁠`
      )("event", t.currentPageIndex == 8)("duration", 10),
      m(),
      C("ngStyle", t.stretch(9)),
      m(5),
      C("ngClass", Y(30, Jw, t.currentPageIndex >= 9)),
      m(),
      pe(t.currentPageIndex > 11 ? 22 : -1);
  }
}
function l_(e, n) {
  if (e & 1) {
    let t = Ee();
    y(0, "app-star-exposure", 33),
      h(1, "div", 34),
      O("scroll", function (o) {
        J(t);
        let i = $();
        return ee(i.onWindowScroll(o));
      }),
      h(2, "div", 35)(3, "div", 36),
      y(4, "app-planet-gen", 37)(5, "app-planet-gen", 38),
      g(),
      h(6, "div", 39)(7, "h1"),
      E(8, "CREATE "),
      y(9, "br"),
      E(10, " ANYTHING"),
      g()()(),
      h(11, "div", 40),
      y(12, "app-projects-preview", 41),
      g(),
      h(13, "div", 42),
      y(14, "img", 43),
      g(),
      h(15, "div", 44),
      y(16, "img", 45),
      h(17, "div", 46)(18, "h1"),
      E(19, " GET "),
      y(20, "br"),
      E(21, " IN "),
      y(22, "br"),
      E(23, " TOUCH "),
      g(),
      h(24, "div", 47),
      O("click", function () {
        J(t);
        let o = $();
        return ee(o.navigateTo("/contact"));
      }),
      E(25, " LET'S CONNECT "),
      y(26, "img", 48),
      g()(),
      y(27, "div", 49),
      g()();
  }
  if (e & 2) {
    let t = $();
    C("targetOffset", t.getPositionForPage(0, 300, 3)),
      m(3),
      C("ngStyle", t.updatePlanet()),
      m(),
      C("animPercentage", t.getPositionForPage(0, 100, 1))(
        "planetSize",
        t.screenHeight * 0.9
      )("primaryColor", "#4239ac")("secondaryColor", "#00E0FF")("hasRings", !0),
      m(),
      C("animPercentage", t.getPositionForPage(0, 100, 1))(
        "planetSize",
        t.screenHeight * 0.15
      )("primaryColor", "#51598b")("secondaryColor", "#2f1a94"),
      m(7),
      C("maxCount", 4);
  }
}
var Ha = class e {
  constructor(n, t) {
    this.crouter = n;
    this.deviceDetector = t;
    t.isMobile$.subscribe((r) => {
      this.clientIsMobile = r;
    });
  }
  mouseX = 0;
  mouseY = 0;
  scrollPosition = 0;
  screenWidth = 0;
  screenHeight = 0;
  mouseOffsetX;
  mouseOffsetY;
  currentPageIndex = 0;
  clientIsMobile = !1;
  ngOnInit() {
    typeof window < "u" &&
      ((this.screenWidth = window.innerWidth),
      (this.screenHeight = window.innerHeight),
      this.crouter.acceptNavigation());
  }
  getPageIndexFromScroll() {
    let n =
        ((this.scrollPosition -
          this.screenHeight *
            Math.floor(this.scrollPosition / this.screenHeight)) /
          this.screenHeight) *
        100,
      t = Math.floor(this.scrollPosition / this.screenHeight);
    return n > 0 && (t += 1), t;
  }
  navigateTo(n) {
    this.crouter.navigateTo(n);
  }
  calculateMouseOffsetFromCenter() {
    let n = window.innerWidth / 2,
      t = window.innerHeight / 2,
      r = this.mouseX - n,
      o = this.mouseY - t;
    (this.mouseOffsetX = (r / n) * 100), (this.mouseOffsetY = (o / t) * 100);
  }
  moveByMouseOffset(n, t) {
    let r = (this.mouseOffsetX / 2) * t,
      o = (this.mouseOffsetY / 2) * t,
      i = {};
    switch (n) {
      case "nebula":
        i.transform = `translate(-50%, -50%) perspective(500px) rotateX(${
          this.mouseOffsetY * -1 * 0.5
        }deg) rotateY(${this.mouseOffsetX * 0.5}deg)`;
        break;
      case "sat-1":
        (i.left = `calc(10vw + ${r}px)`), (i.bottom = `calc(10vh + ${-o}px)`);
        break;
      case "sat-2":
        (i.right = `calc(10vw + ${r}px)`), (i.top = `calc(10vh + ${-o}px)`);
        break;
      default:
        return i;
    }
    return i;
  }
  fixToPage(n) {
    return { top: `${this.scrollPosition * -1 + this.screenHeight * n}px` };
  }
  updatePlanet() {
    return {
      opacity: this.getPositionOnPercentage(1, 0, this.calculPercentage(2)),
      scale: this.getPositionOnPercentage(1, 1.3, this.calculPercentage(2)),
    };
  }
  calculPercentage(n) {
    let t = this.screenHeight * n,
      r = t - this.screenHeight,
      o = ((this.scrollPosition - r) / (t - r)) * 100;
    return o < 0 ? 0 : o;
  }
  getPositionForPage(n, t, r) {
    let o = n + (this.calculPercentage(r) / 100) * (t - n);
    return isNaN(o) ? n : o < 0 ? 0 : o;
  }
  getPositionForPageLimitted(n, t, r) {
    let o = n + (this.calculPercentage(r) / 100) * (t - n);
    return isNaN(o)
      ? Math.max(0, Math.min(100, n))
      : Math.max(0, Math.min(100, o));
  }
  getPositionForPage2(n, t, r) {
    let o = n + (this.calculPercentage2(r) / 100) * (t - n);
    return o < 0 ? 0 : o;
  }
  calculPercentage2(n) {
    let t = this.screenHeight * n[1],
      r = t - this.screenHeight * (n[1] - n[0]);
    return ((this.scrollPosition - r) / (t - r)) * 100;
  }
  getPositionOnPercentage(n, t, r) {
    return n + (r / 100) * (t - n);
  }
  appearDisappear(n) {
    return this.currentPageIndex == n
      ? { opacity: 1, "margin-top": "0px" }
      : this.currentPageIndex > n
      ? { opacity: 0, "margin-top": "-100px" }
      : { opacity: 0, "margin-top": "100px" };
  }
  stretch(n) {
    return this.currentPageIndex == n
      ? {
          opacity: 1,
          "margin-top": "0px",
          "letter-spacing":
            this.getPositionForPage(0, this.screenWidth / 10, n) + "px",
          "margin-right":
            this.getPositionForPage(0, this.screenWidth / 10, n) * -1 + "px",
        }
      : this.currentPageIndex > n
      ? {
          opacity: 1,
          "margin-top": "0px",
          "letter-spacing": this.screenWidth / 10 + "px",
          "margin-right": (this.screenWidth / 10) * -1 + "px",
        }
      : {};
  }
  onWindowScroll(n = null) {
    n
      ? (this.scrollPosition = n.target.scrollTop)
      : (this.scrollPosition = window.scrollY),
      (this.currentPageIndex = this.getPageIndexFromScroll());
  }
  onResize() {
    (this.screenWidth = window.innerWidth),
      (this.screenHeight = window.innerHeight);
  }
  onMouseMoveEvent(n) {
    (this.mouseX = n.clientX),
      (this.mouseY = n.clientY),
      this.calculateMouseOffsetFromCenter();
  }
  static ɵfac = function (t) {
    return new (t || e)(x(Se), x(Tt));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-home"]],
    hostBindings: function (t, r) {
      t & 1 &&
        O(
          "scroll",
          function () {
            return r.onWindowScroll();
          },
          we
        )(
          "resize",
          function () {
            return r.onResize();
          },
          we
        )(
          "mousemove",
          function (i) {
            return r.onMouseMoveEvent(i);
          },
          ut
        );
    },
    decls: 2,
    vars: 1,
    consts: [
      [3, "ngStyle", "targetOffset"],
      [1, "canvas"],
      [1, "presented"],
      [1, "planets-1", 3, "ngStyle"],
      [1, "landing-title"],
      [3, "scrollPosition"],
      [1, "projects", 3, "maxCount", "ngStyle"],
      [1, "planets-2", 3, "ngClass", "ngStyle"],
      [1, "sliding-text"],
      [1, "title", 3, "text", "event", "ngStyle"],
      [1, "paragraph", 3, "ngStyle"],
      [3, "text", "event", "duration"],
      [1, "paragraph", 3, "ngStyle", "text", "event", "duration"],
      [1, "sliding-text-2", 3, "ngStyle"],
      [
        "src",
        "images/astronaut.svg",
        "alt",
        "",
        "loading",
        "lazy",
        1,
        "astronaut",
        3,
        "ngClass",
      ],
      [1, "contact-container", 3, "ngStyle"],
      [1, "planet-1", 3, "planetSize", "nightPercentage"],
      [
        1,
        "planet-1-satellite-1",
        3,
        "ngStyle",
        "planetSize",
        "nightPercentage",
        "hasRings",
        "hasAtmopshere",
        "primaryColor",
        "secondaryColor",
      ],
      [
        1,
        "planet-1-satellite-2",
        3,
        "ngStyle",
        "planetSize",
        "nightPercentage",
        "hasRings",
        "hasAtmopshere",
        "primaryColor",
        "secondaryColor",
      ],
      [3, "ngStyle"],
      [
        1,
        "planet-2",
        3,
        "nightPercentage",
        "planetSize",
        "primaryColor",
        "secondaryColor",
        "hasRings",
        "hasAtmopshere",
        "animationSpeed",
        "xRotation",
        "movementIntensity",
      ],
      [
        1,
        "planet-2-satellite",
        3,
        "ngStyle",
        "animPercentage",
        "planetSize",
        "primaryColor",
        "secondaryColor",
      ],
      [1, "contact"],
      [1, "center-text"],
      [1, "small-text"],
      [1, "main"],
      [1, "connect-button", 3, "click"],
      [1, "line"],
      ["src", "icons/arrow-right.svg", "alt", "", "loading", "lazy"],
      [1, "footer"],
      [
        "src",
        "icons/cool-cross.svg",
        "alt",
        "",
        "loading",
        "lazy",
        1,
        "cross",
        "c3",
      ],
      [1, "credit"],
      [
        "src",
        "icons/cool-cross.svg",
        "alt",
        "",
        "loading",
        "lazy",
        1,
        "cross",
        "c4",
      ],
      [3, "targetOffset"],
      [1, "m-wrapper", 3, "scroll"],
      [1, "m-section", "m-landing"],
      [1, "m-planets-1", 3, "ngStyle"],
      [
        1,
        "m-planet-1",
        3,
        "animPercentage",
        "planetSize",
        "primaryColor",
        "secondaryColor",
        "hasRings",
      ],
      [
        1,
        "m-planet-1-satellite-1",
        3,
        "animPercentage",
        "planetSize",
        "primaryColor",
        "secondaryColor",
      ],
      [1, "m-landing-title"],
      [1, "m-section", "m-projects"],
      [3, "maxCount"],
      [1, "m-section", "m-exposure"],
      ["src", "images/astronaut.svg", "alt", "", 1, "m-astronaut"],
      [1, "m-section", "m-contact"],
      ["src", "icons/nebula.svg", "alt", "", 1, "m-nebula"],
      [1, "m-content"],
      [1, "m-connect-btn", 3, "click"],
      ["src", "icons/arrow-right.svg", "alt", ""],
      [1, "m-hider"],
    ],
    template: function (t, r) {
      t & 1 && fe(0, c_, 23, 32)(1, l_, 28, 12),
        t & 2 && pe(r.clientIsMobile === !1 ? 0 : 1);
    },
    dependencies: [Q, Vt, ae, Lr, Na, Aa, ka, Br, La, ov],
    styles: [
      "@media (max-width: 768px){.planets-1[_ngcontent-%COMP%]   .planet-1[_ngcontent-%COMP%]{top:50%;left:40%!important;transform:translateY(-50%)!important}.planets-1[_ngcontent-%COMP%]   .planet-1-satellite-2[_ngcontent-%COMP%], .landing-title[_ngcontent-%COMP%]{display:none!important}.landing-title-mobile-1[_ngcontent-%COMP%], .landing-title-mobile-2[_ngcontent-%COMP%]{display:block!important}}app-star-exposure[_ngcontent-%COMP%]{transition:all .3s ease-in-out;z-index:-2}.projects[_ngcontent-%COMP%]{position:absolute;left:0}.presented[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;position:fixed;width:100vw;height:100vh}.canvas[_ngcontent-%COMP%]{height:1300vh;filter:pixelate(1px)}.star-background-img[_ngcontent-%COMP%]{position:absolute;height:150vh;bottom:10px;left:-100vh;z-index:-1}.planets-1[_ngcontent-%COMP%]{position:relative;width:80vw;height:90vh}.planets-1[_ngcontent-%COMP%]   .planet-1[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.planets-1[_ngcontent-%COMP%]   .planet-1-satellite-1[_ngcontent-%COMP%]{position:absolute;left:10vw;bottom:10vh;transition:all .2s ease-out}.planets-1[_ngcontent-%COMP%]   .planet-1-satellite-2[_ngcontent-%COMP%]{position:absolute;z-index:10;top:10vh;right:10vw;transition:all .2s ease-out}.planets-2-hide[_ngcontent-%COMP%]{opacity:0!important;top:-70vh!important}.planets-2[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:-1;transition:all .55s cubic-bezier(.17,.67,.54,.97);opacity:0}.planets-2[_ngcontent-%COMP%]   .planet-2[_ngcontent-%COMP%]{position:absolute;top:20%;left:20%;transform:translateY(-25%) scaleX(-1) rotate(-20deg);z-index:-2}.planets-2[_ngcontent-%COMP%]   .planet-2-satellite[_ngcontent-%COMP%]{position:absolute;right:10%;bottom:5%;transform:translateY(-25%) scaleX(-1) rotate(-30deg);z-index:-2}.landing-title-mobile-1[_ngcontent-%COMP%]{display:none;position:absolute;z-index:-1}.landing-title-mobile-1[_ngcontent-%COMP%]   .multi[_ngcontent-%COMP%]{position:relative;text-align:center}.landing-title-mobile-1[_ngcontent-%COMP%]   .multi[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{position:absolute;transform:translate(-50%,-50%);font-size:18vw}.landing-title-mobile-2[_ngcontent-%COMP%]{display:none;position:absolute}.landing-title-mobile-2[_ngcontent-%COMP%]   .multi[_ngcontent-%COMP%]{position:relative;text-align:center}.landing-title-mobile-2[_ngcontent-%COMP%]   .multi[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{position:absolute;transform:translate(-50%,-50%);font-size:18vw;color:transparent;-webkit-text-fill-color:transparent;-webkit-text-stroke:1px var(--white)}.landing-title-mobile-2[_ngcontent-%COMP%]   .sub[_ngcontent-%COMP%]{position:fixed;left:50%;bottom:30px;transform:translate(-50%);font-size:10vw;color:#4f44d6;white-space:nowrap}.landing-title[_ngcontent-%COMP%]{position:absolute;display:flex;flex-direction:column;font-family:JetBrains-Regular,sans-serif;z-index:0}.landing-title[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;align-items:baseline}.landing-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:9vh;overflow:hidden}.landing-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:5vh;margin-inline:20px;color:#4f44d6}.sliding-text[_ngcontent-%COMP%]{position:absolute;display:flex;flex-direction:column;justify-content:space-between;width:70%;top:30%;opacity:1;z-index:-1}.sliding-text[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%], .sliding-text[_ngcontent-%COMP%]   .paragraph[_ngcontent-%COMP%]{transition:all .3s ease-in-out}.sliding-text[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{font-size:6vh}.sliding-text[_ngcontent-%COMP%]   .paragraph[_ngcontent-%COMP%]{font-size:2vh;display:flex;flex-direction:column;gap:20px;text-align:right;transition-delay:.1s}.sliding-text-2[_ngcontent-%COMP%]{position:absolute;top:30%;transform:translateY(-50%);z-index:-1;font-size:8vh;transition:all .3s ease-out;color:#344bbd;line-height:1cap;opacity:0;margin-top:100px}.astronaut[_ngcontent-%COMP%]{position:absolute;height:55vh;left:49%;transform:translate(-50%);bottom:-300px;opacity:0;transition:all .45s ease-in-out;z-index:-1}.astronaut-show[_ngcontent-%COMP%]{bottom:0;opacity:1}.fader[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#000;border-radius:100%;background-size:100%;background-position:center;transition:all .6s ease-in-out;width:0;height:0}.fader-show[_ngcontent-%COMP%]{opacity:1;width:140vw;height:140vw}.contact-container[_ngcontent-%COMP%]{position:absolute;width:100vw;height:calc(100vh + 10px);background-color:#000;overflow:hidden}.contact[_ngcontent-%COMP%]{position:absolute;width:100vw;height:100vh;overflow:hidden;z-index:1}.contact[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]{position:absolute;width:fit-content;top:50%;left:50%;transform:translate(-50%,-50%)}.contact[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]   .small-text[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.contact[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]{width:fit-content;font-size:13vw;white-space:nowrap}.contact[_ngcontent-%COMP%]   .connect-button[_ngcontent-%COMP%]{width:fit-content;display:flex;cursor:pointer;font-size:2vw;margin:auto;margin-top:7vw}.contact[_ngcontent-%COMP%]   .connect-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:1.8vw;object-fit:contain;margin-left:1.5vw}.contact[_ngcontent-%COMP%]   .connect-button[_ngcontent-%COMP%]   .line[_ngcontent-%COMP%]{width:0%;height:3px;background-color:var(--white);transition:width .15s ease-in-out}.contact[_ngcontent-%COMP%]   .connect-button[_ngcontent-%COMP%]:hover   .line[_ngcontent-%COMP%]{width:100%}.contact[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]{position:absolute;display:flex;align-items:center;gap:50px;height:1.5vw;width:calc(100vw - 100px);bottom:50px;left:50px;z-index:3}.contact[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .cross[_ngcontent-%COMP%]{width:1.5vw}.contact[_ngcontent-%COMP%]   .footer[_ngcontent-%COMP%]   .credit[_ngcontent-%COMP%]{margin-right:auto}",
      ".m-wrapper[_ngcontent-%COMP%]{height:calc(100% + 2px);overflow:auto;overscroll-behavior:none}h1[_ngcontent-%COMP%]{font-size:18vw}h2[_ngcontent-%COMP%]{font-size:13vw;font-weight:400}.m-section[_ngcontent-%COMP%]{position:relative;width:100vw;height:100vh;overflow:hidden}.m-landing[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.m-landing-title[_ngcontent-%COMP%]{text-align:center;font-size:18vw}.m-planets-1[_ngcontent-%COMP%]{position:absolute;width:100vw;height:100vh;z-index:-1}.m-planets-1[_ngcontent-%COMP%]   .m-planet-1[_ngcontent-%COMP%]{position:absolute;top:50%;left:100%;transform:translate(-40%,-50%)}.m-planets-1[_ngcontent-%COMP%]   .m-planet-1-satellite-1[_ngcontent-%COMP%]{position:absolute;left:30vw;bottom:10vh}.m-planets-2[_ngcontent-%COMP%]{position:absolute;left:0;width:100vw;height:100vh;z-index:-1}.m-planets-2[_ngcontent-%COMP%]   .m-planet-2[_ngcontent-%COMP%]{position:absolute;top:0;left:50%;transform:translate(-50%) rotate(10deg)}.m-planets-2[_ngcontent-%COMP%]   .m-planet-2-satellite[_ngcontent-%COMP%]{position:absolute;left:30vw;bottom:10vh}.m-projects[_ngcontent-%COMP%]{height:fit-content}.m-bio[_ngcontent-%COMP%]{height:200vh;padding-top:50px;padding-inline:25px}.m-exposure[_ngcontent-%COMP%]   .m-astronaut[_ngcontent-%COMP%]{position:absolute;width:130%;left:50%;bottom:-5px;transform:translate(-50%)}.m-contact[_ngcontent-%COMP%]{background-color:#000;text-align:center}.m-contact[_ngcontent-%COMP%]   .m-content[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;flex-direction:column;position:absolute;left:0;top:0;width:100vw;height:100vh}.m-contact[_ngcontent-%COMP%]   .m-nebula[_ngcontent-%COMP%]{position:absolute;width:400vw;left:50%;top:50%;transform:translate(-50%,-50%);z-index:0;filter:blur(50px)}.m-contact[_ngcontent-%COMP%]   .m-connect-btn[_ngcontent-%COMP%]{display:flex}.m-contact[_ngcontent-%COMP%]   .m-connect-btn[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:20px;object-fit:contain;margin-left:10px}.m-contact[_ngcontent-%COMP%]   .m-hider[_ngcontent-%COMP%]{position:absolute;top:99vh;left:0;width:100vw;height:300vh;background-color:#000}",
    ],
  });
};
var u_ = ["warpCanvas"],
  sv = [
    [152, 126, 250],
    [133, 117, 200],
    [65, 60, 89],
    [232, 230, 269],
  ],
  Ba = class e {
    constructor(n) {
      this.deviceDetector = n;
      n.isMobile$.subscribe((t) => {
        (this.isMobile = t),
          t && ((this.TARGET_SPEED = 3), (this.TEXT_COUNT = 0));
      });
    }
    canvasRef;
    ctx;
    stars = [];
    width = 0;
    height = 0;
    animationFrameId;
    devicePixelRatio = 1;
    currentSpeed = 0;
    ctxFill = "rgba(0, 0, 0, 0)";
    starSystemGen = this.starSystemGenerator();
    displayText = !1;
    TARGET_SPEED = 7;
    STARS_COUNT = this.width * 1.1;
    LINE_LENGTH = 2;
    TEXT_COUNT = 17;
    smoothSpeedIntervalId;
    isMobile = !1;
    ngOnInit() {
      this.initStars();
    }
    ngAfterViewInit() {
      typeof window < "u" &&
        ((this.width = window.innerWidth),
        (this.height = window.innerHeight),
        (this.STARS_COUNT = this.width),
        (this.devicePixelRatio = window.devicePixelRatio || 1),
        (this.ctx = this.canvasRef.nativeElement.getContext("2d")),
        this.resizeCanvas(),
        this.smoothSpeedIncrease());
    }
    ngOnDestroy() {
      this.animationFrameId && cancelAnimationFrame(this.animationFrameId),
        clearInterval(this.smoothSpeedIntervalId);
    }
    onResize() {
      this.isMobile == !1 && this.resizeCanvas();
    }
    smoothSpeedIncrease() {
      let n = this.TARGET_SPEED * 10,
        t = 0.2,
        r = !0;
      (this.smoothSpeedIntervalId = setInterval(() => {
        r && this.currentSpeed < n
          ? (this.currentSpeed += t)
          : this.currentSpeed > this.TARGET_SPEED
          ? ((this.ctxFill = "rgba(0, 0, 0, 1)"),
            (r = !1),
            (this.currentSpeed -= t))
          : ((this.currentSpeed = this.TARGET_SPEED),
            clearInterval(this.smoothSpeedIntervalId),
            (this.displayText = !0));
      }, 5)),
        this.animate();
    }
    *starSystemGenerator() {
      let n = [
          "Alpha",
          "Beta",
          "Gamma",
          "Delta",
          "Epsilon",
          "Zeta",
          "Theta",
          "Omicron",
          "Sigma",
          "Omega",
        ],
        t = [
          "Centauri",
          "Eridani",
          "Ceti",
          "Luyten",
          "Proxima",
          "Wolf",
          "Gliese",
          "Kepler",
          "TRAPPIST",
          "Andromeda",
        ];
      for (;;)
        yield `${n[Math.floor(Math.random() * n.length)]} ${
          t[Math.floor(Math.random() * t.length)]
        }`;
    }
    resizeCanvas() {
      let n = this.canvasRef.nativeElement;
      (this.width = window.innerWidth),
        (this.height = window.innerHeight),
        (n.width = this.width * this.devicePixelRatio),
        (n.height = this.height * this.devicePixelRatio),
        this.ctx.setTransform(1, 0, 0, 1, 0, 0),
        this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio),
        this.initStars();
    }
    initStars() {
      let n = 0;
      this.stars = new Array(Math.round(this.STARS_COUNT))
        .fill(null)
        .map(
          () => (
            n++,
            {
              x: Math.random() * this.width - this.width / 2,
              y: Math.random() * this.height - this.height / 2,
              z: Math.random() * this.width,
              prevZ: 0,
              color: sv[Math.floor(Math.random() * sv.length)],
              text:
                n < this.TEXT_COUNT ? this.starSystemGen.next().value : null,
            }
          )
        );
    }
    animate() {
      (this.ctx.fillStyle = this.ctxFill),
        this.ctx.fillRect(0, 0, this.width, this.height);
      let n = this.width / 2,
        t = this.height / 2;
      this.stars.forEach((r) => {
        (r.prevZ = r.z),
          (r.z -= this.currentSpeed),
          r.z <= 0 &&
            ((r.x = Math.random() * this.width - n),
            (r.y = Math.random() * this.height - t),
            (r.z = this.width),
            (r.prevZ = this.width));
        let o = (r.x / r.z) * this.width + n,
          i = (r.y / r.z) * this.height + t,
          s = (r.x / r.prevZ) * this.width + n,
          a = (r.y / r.prevZ) * this.height + t,
          c = o - s,
          l = i - a,
          u = Math.sqrt(c * c + l * l) || 1,
          d = c / u,
          p = l / u,
          f = o + d * this.LINE_LENGTH,
          D = i + p * this.LINE_LENGTH,
          M = 1.2 - r.z / this.width,
          U = `rgb(${Math.floor(r.color[0] * M)}, ${Math.floor(
            r.color[1] * M * 1.2
          )}, ${Math.floor(r.color[2] * M)})`;
        (this.ctx.strokeStyle = U),
          (this.ctx.lineWidth = 1.5),
          this.ctx.beginPath(),
          this.ctx.moveTo(s, a),
          this.ctx.lineTo(f, D),
          this.ctx.stroke(),
          r.text &&
            this.displayText &&
            ((this.ctx.strokeStyle = "#343434"),
            (this.ctx.fillStyle = "#343434"),
            (this.ctx.font = `${
              (this.height / 150) * this.devicePixelRatio
            }px JetBrains-Regular`),
            this.ctx.fillText(r.text, o + 15, i + 6),
            this.ctx.strokeRect(o - 7, i - 7, 14, 14));
      }),
        (this.animationFrameId = requestAnimationFrame(() => this.animate()));
    }
    static ɵfac = function (t) {
      return new (t || e)(x(Tt));
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-contact"]],
      viewQuery: function (t, r) {
        if ((t & 1 && Oe(u_, 7), t & 2)) {
          let o;
          Re((o = Ne())) && (r.canvasRef = o.first);
        }
      },
      hostBindings: function (t, r) {
        t & 1 &&
          O(
            "resize",
            function () {
              return r.onResize();
            },
            we
          );
      },
      decls: 22,
      vars: 19,
      consts: [
        ["warpCanvas", ""],
        [1, "title"],
        [3, "duration", "event", "text"],
        [3, "delay", "duration", "event", "text"],
        [1, "links"],
        ["href", "mailto:hello@frostastudio.com"],
        ["src", "icons/arrow-up-right-mini.svg", "alt", "", "loading", "lazy"],
        [
          "href",
          "https://github.com",
          "target",
          "_blank",
          "rel",
          "noopener noreferrer",
        ],
        [
          "href",
          "https://www.figma.com/design/sN2yv4OJALg3Il1OOyJAXu/%D0%A7%D0%B5%D1%80%D0%BD%D0%BE%D0%B2%D0%B8%D0%BA-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=0-1&p=f&t=iMqbWX7lJEvIiDe8-0",
          "target",
          "_blank",
          "rel",
          "noopener noreferrer",
        ],
        [1, "credits"],
        [1, "right-text"],
        ["src", "icons/heart.svg", "alt", "", "loading", "lazy"],
      ],
      template: function (t, r) {
        t & 1 &&
          (y(0, "canvas", null, 0),
          h(2, "div", 1),
          y(3, "app-scrambler-text", 2)(4, "app-scrambler-text", 3),
          g(),
          h(5, "div", 4)(6, "a", 5),
          y(7, "app-scrambler-text", 3)(8, "img", 6),
          g(),
          h(9, "a", 7),
          y(10, "app-scrambler-text", 3)(11, "img", 6),
          g(),
          h(12, "a", 8),
          y(13, "app-scrambler-text", 3)(14, "img", 6),
          g()(),
          h(15, "div", 9)(16, "p"),
      
          g(),
          h(18, "div", 10)(19, "p"),
         
          g(),
          y(21, "img", 11),
          g()()),
          t & 2 &&
            (m(3),
            C("duration", 100)("event", r.displayText)("text", "LET'S GET"),
            m(),
            C("delay", 800)("duration", 100)("event", r.displayText)(
              "text",
              "IN TOUCH!"
            ),
            m(3),
            C("delay", 1600)("duration", 50)("event", r.displayText)(
              "text",
              "hello@frostastudio.com"
            ),
            m(3),
            C("delay", 2600)("duration", 100)("event", r.displayText)(
              "text",
              "Linkedin"
            ),
            m(3),
            C("delay", 3e3)("duration", 100)("event", r.displayText)(
              "text",
              "Our Figma"
            ));
      },
      dependencies: [Lr],
      styles: [
        "@media (max-width: 768px){.title[_ngcontent-%COMP%]{left:20px!important;font-size:16.2vw!important;bottom:auto!important;top:20vw!important}.links[_ngcontent-%COMP%]{left:25px!important;top:70vw!important;right:auto!important;text-align:left!important;font-size:5.2vw!important}.links[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:none!important}.credits[_ngcontent-%COMP%]{font-size:3vw!important;padding:25px!important}.credits[_ngcontent-%COMP%]   .right-text[_ngcontent-%COMP%]{display:none}}*[_ngcontent-%COMP%]{box-sizing:border-box}canvas[_ngcontent-%COMP%]{position:fixed;width:100%;height:100%;display:block;background:#000}.title[_ngcontent-%COMP%]{position:absolute;font-size:6.5vh;left:30px;bottom:70px}.links[_ngcontent-%COMP%]{position:absolute;font-size:28px;text-align:right;right:30px;bottom:90px;display:flex;flex-direction:column;gap:15px;font-size:2.1vh}.links[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{transition:all .15s ease-in-out}.links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:relative;color:var(--white);text-decoration:none;overflow:hidden}.links[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;right:-30px;top:50%;transform:translateY(-47%);height:1.4vh;object-fit:cover}.links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{padding-right:4vh}.links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%]{right:10px}.credits[_ngcontent-%COMP%]{position:absolute;bottom:0;left:0;padding:30px;width:100%;display:flex;justify-content:space-between;font-size:1.5vh}.credits[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{display:flex;gap:8px}.credits[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:2vh;object-fit:contain}",
      ],
    });
  };
var Va = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-footer"]],
    decls: 7,
    vars: 0,
    consts: [
      [1, "footer-container"],
      [
        "src",
        "icons/cool-cross.svg",
        "alt",
        "",
        "loading",
        "lazy",
        1,
        "cross",
        "c3",
      ],
      [1, "credit"],
      [
        "src",
        "icons/cool-cross.svg",
        "alt",
        "",
        "loading",
        "lazy",
        1,
        "cross",
        "c4",
      ],
    ],
    template: function (t, r) {
      t & 1 &&
        (ft(0, "div", 0),
        Ht(1, "img", 1),
        ft(2, "p", 2),
        E(3, "\xA9 Frosta Studio"),
        pt(),
        ft(4, "p"),
        E(5, "hello@frostastudio.com"),
        pt(),
        Ht(6, "img", 3),
        pt());
    },
    styles: [
      "@media (max-width: 768px){.footer-container[_ngcontent-%COMP%]{display:none!important}}.footer-container[_ngcontent-%COMP%]{display:flex;align-items:center;gap:50px;height:1.5vw;padding:50px}.footer-container[_ngcontent-%COMP%]   .cross[_ngcontent-%COMP%]{width:1.5vw}.footer-container[_ngcontent-%COMP%]   .credit[_ngcontent-%COMP%]{margin-right:auto}",
    ],
  });
};
var $a = class e {
  constructor(n) {
    this.crouter = n;
  }
  loadedImageCount = 0;
  imageCount = 1;
  imageLoaded() {
    this.loadedImageCount++,
      this.loadedImageCount >= this.imageCount &&
        this.crouter.acceptNavigation();
  }
  static ɵfac = function (t) {
    return new (t || e)(x(Se));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-projects"]],
    decls: 28,
    vars: 0,
    consts: [
      [1, "mobile-landing"],
      ["src", "icons/nebulla-2.svg", "alt", "", 1, "gradient-mobile"],
      [1, "texts"],
      [1, "heading"],
      [1, "desktop-landing"],
      ["src", "icons/nebulla-2.svg", "alt", "", 1, "gradient-1", 3, "load"],
      [1, "center-text"],
      [1, "small-text"],
      [1, "main"],
    ],
    template: function (t, r) {
      t & 1 &&
        (h(0, "div", 0),
        y(1, "img", 1),
        h(2, "div", 2)(3, "div", 3)(4, "p"),
        E(5, "WEB DESIGN"),
        g(),
        h(6, "p"),
        E(7, "UX/UI"),
        g(),
        h(8, "p"),
        E(9, "AND MORE"),
        g()(),
        h(10, "h1"),
        E(11, "OUR PROJECTS"),
        g()()(),
        h(12, "div", 4)(13, "img", 5),
        O("load", function () {
          return r.imageLoaded();
        }),
        g(),
        h(14, "div", 6)(15, "div", 7)(16, "p"),
        E(17, "WEB DESIGN"),
        g(),
        h(18, "p"),
        E(19, "UX/UI"),
        g(),
        h(20, "p"),
        E(21, "MOBILE DEVELOPMENT"),
        g(),
        h(22, "p"),
        E(23, "AND MORE"),
        g()(),
        h(24, "p", 8),
        E(25, "OUR PROJECTS"),
        g()()(),
        y(26, "app-projects-preview")(27, "app-footer"));
    },
    dependencies: [Br, Va],
    styles: [
      "@media (max-width: 768px){.desktop-landing[_ngcontent-%COMP%]{display:none!important}.mobile-landing[_ngcontent-%COMP%]{display:flex!important}}.wrapper[_ngcontent-%COMP%]{position:relative;width:100vw;overflow-x:hidden}.mobile-landing[_ngcontent-%COMP%]{position:relative;display:none;align-items:center;justify-content:center;width:100vw;height:40vh}.mobile-landing[_ngcontent-%COMP%]   .texts[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.mobile-landing[_ngcontent-%COMP%]   .texts[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:12vw;margin:0}.gradient-mobile[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;width:400vw;height:200vw;transform:translate(-50%,-50%);filter:blur(50px);z-index:-1;opacity:.9}.desktop-landing[_ngcontent-%COMP%]{position:relative;width:100vw;height:80vh;background-color:#000}.desktop-landing[_ngcontent-%COMP%]   .gradient-1[_ngcontent-%COMP%]{position:absolute;width:100%;top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(50px)}.desktop-landing[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]{position:absolute;width:fit-content;top:50%;left:50%;transform:translate(-50%,-50%)}.desktop-landing[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]   .small-text[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.desktop-landing[_ngcontent-%COMP%]   .center-text[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]{width:fit-content;font-size:13vw;white-space:nowrap}",
    ],
  });
};
var av = (e) => ({ top: e }),
  Ua = class e {
    constructor(n, t) {
      this.crouter = n;
      this.deviceDetector = t;
      t.isMobile$.subscribe((r) => {
        this.clientIsMobile = r;
      });
    }
    mouseX = 0;
    mouseY = 0;
    scrollPosition = 0;
    screenWidth = 0;
    screenHeight = 0;
    mouseOffsetX;
    mouseOffsetY;
    currentPageIndex = 0;
    clientIsMobile = !1;
    ngOnInit() {
      typeof window < "u" &&
        ((this.screenWidth = window.innerWidth),
        (this.screenHeight = window.innerHeight),
        this.crouter.acceptNavigation());
    }
    getPageIndexFromScroll() {
      let n =
          ((this.scrollPosition -
            this.screenHeight *
              Math.floor(this.scrollPosition / this.screenHeight)) /
            this.screenHeight) *
          100,
        t = Math.floor(this.scrollPosition / this.screenHeight);
      return n > 0 && (t += 1), t;
    }
    navigateTo(n) {
      this.crouter.navigateTo(n);
    }
    calculateMouseOffsetFromCenter() {
      let n = window.innerWidth / 2,
        t = window.innerHeight / 2,
        r = this.mouseX - n,
        o = this.mouseY - t;
      (this.mouseOffsetX = (r / n) * 100), (this.mouseOffsetY = (o / t) * 100);
    }
    moveByMouseOffset(n, t) {
      let r = (this.mouseOffsetX / 2) * t,
        o = (this.mouseOffsetY / 2) * t,
        i = {};
      switch (n) {
        case "nebula":
          i.transform = `translate(-50%, -50%) perspective(500px) rotateX(${
            this.mouseOffsetY * -1 * 0.5
          }deg) rotateY(${this.mouseOffsetX * 0.5}deg)`;
          break;
        case "sat-1":
          (i.left = `calc(10vw + ${r}px)`), (i.bottom = `calc(10vh + ${-o}px)`);
          break;
        case "sat-2":
          (i.right = `calc(10vw + ${r}px)`), (i.top = `calc(10vh + ${-o}px)`);
          break;
        default:
          return i;
      }
      return i;
    }
    fixToPage(n) {
      return { top: `${this.scrollPosition * -1 + this.screenHeight * n}px` };
    }
    updatePlanet() {
      return {
        opacity: this.getPositionOnPercentage(1, 0, this.calculPercentage(2)),
        scale: this.getPositionOnPercentage(1, 1.3, this.calculPercentage(2)),
      };
    }
    calculPercentage(n) {
      let t = this.screenHeight * n,
        r = t - this.screenHeight,
        o = ((this.scrollPosition - r) / (t - r)) * 100;
      return o < 0 ? 0 : o;
    }
    getPositionForPage(n, t, r) {
      let o = n + (this.calculPercentage(r) / 100) * (t - n);
      return isNaN(o) ? n : o < 0 ? 0 : o;
    }
    getPositionForPage2(n, t, r) {
      let o = n + (this.calculPercentage2(r) / 100) * (t - n);
      return o < 0 ? 0 : o;
    }
    calculPercentage2(n) {
      let t = this.screenHeight * n[1],
        r = t - this.screenHeight * (n[1] - n[0]);
      return ((this.scrollPosition - r) / (t - r)) * 100;
    }
    getPositionOnPercentage(n, t, r) {
      return n + (r / 100) * (t - n);
    }
    appearDisappear(n) {
      return this.currentPageIndex == n
        ? { opacity: 1, "margin-top": "0px" }
        : this.currentPageIndex > n
        ? { opacity: 0, "margin-top": "-100px" }
        : { opacity: 0, "margin-top": "100px" };
    }
    stretch(n) {
      return this.currentPageIndex == n
        ? {
            opacity: 1,
            "margin-top": "0px",
            "letter-spacing":
              this.getPositionForPage(0, this.screenWidth / 10, n) + "px",
            "margin-right":
              this.getPositionForPage(0, this.screenWidth / 10, n) * -1 + "px",
          }
        : this.currentPageIndex > n
        ? {
            opacity: 1,
            "margin-top": "0px",
            "letter-spacing": this.screenWidth / 10 + "px",
            "margin-right": (this.screenWidth / 10) * -1 + "px",
          }
        : {};
    }
    onWindowScroll(n = null) {
      n
        ? (this.scrollPosition = n.target.scrollTop)
        : (this.scrollPosition = window.scrollY),
        (this.currentPageIndex = this.getPageIndexFromScroll());
    }
    onResize() {
      (this.screenWidth = window.innerWidth),
        (this.screenHeight = window.innerHeight);
    }
    onMouseMoveEvent(n) {
      (this.mouseX = n.clientX),
        (this.mouseY = n.clientY),
        this.calculateMouseOffsetFromCenter();
    }
    static ɵfac = function (t) {
      return new (t || e)(x(Se), x(Tt));
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-about"]],
      hostBindings: function (t, r) {
        t & 1 &&
          O(
            "scroll",
            function () {
              return r.onWindowScroll();
            },
            we
          )(
            "resize",
            function () {
              return r.onResize();
            },
            we
          )(
            "mousemove",
            function (i) {
              return r.onMouseMoveEvent(i);
            },
            ut
          );
      },
      decls: 14,
      vars: 6,
      consts: [
        [1, "section"],
        ["src", "images/07.webp", "alt", "", 1, "img-07", 3, "ngStyle"],
        ["src", "images/02.webp", "alt", "", 1, "img-02"],
        [1, "center-text", 3, "ngStyle"],
        [1, "small-text"],
        [1, "main"],
      ],
      template: function (t, r) {
        t & 1 &&
          (h(0, "div", 0),
          y(1, "img", 1)(2, "img", 2),
          h(3, "div", 3)(4, "div", 4)(5, "p"),
          E(6, "LET'S CHAT"),
          g(),
          h(7, "p"),
          E(8, "LET'S CHAT"),
          g(),
          h(9, "p"),
          E(10, "LET'S CHAT"),
          g()(),
          h(11, "p", 5),
          E(12, "RISING STAR"),
          g()()(),
          y(13, "div", 0)),
          t & 2 &&
            (m(),
            C("ngStyle", Y(2, av, r.getPositionForPage(50, 40, 1) + "%")),
            m(2),
            C("ngStyle", Y(4, av, r.getPositionForPage(50, 100, 1) + "%")));
      },
      dependencies: [Q, ae],
      styles: [
        ".section[_ngcontent-%COMP%]{position:relative;height:100svh;overflow:hidden;background-color:#000}.section[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;left:50%;top:50%;transform:translate(-50%,-50%);object-fit:cover}.section[_ngcontent-%COMP%]   .img-02[_ngcontent-%COMP%]{z-index:2}.section[_ngcontent-%COMP%]   .img-07[_ngcontent-%COMP%]{z-index:0}.center-text[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1}.small-text[_ngcontent-%COMP%]{display:flex;justify-content:space-between}.main[_ngcontent-%COMP%]{font-size:10vw;white-space:nowrap}",
      ],
    });
  };
var d_ = ["carousel"],
  f_ = ["videoPlayers"],
  oi = (e) => ({ "media-loaded": e });
function p_(e, n) {
    console.log("Rendering image template"); // 👈 ДОБАВЬ ЭТО

  if ((e & 1 && y(0, "img", 30), e & 2)) {
    let t = $(),
      r = t.$implicit,
      o = t.$index,
      i = $();
    C("ngClass", Y(2, oi, i.isMediaLoaded(o)))("src", r.url, nt);
  }
}
function h_(e, n) {
  if (
    (e & 1 && (y(0, "div", 31), h(1, "video", 32, 2), y(3, "source", 33), g()),
    e & 2)
  ) {
    let t = $(),
      r = t.$implicit,
      o = t.$index,
      i = $();
    m(), C("ngClass", Y(2, oi, i.isMediaLoaded(o))), m(2), C("src", r.url, nt);
  }
}
function g_(e, n) {
  if (
    (e & 1 &&
      (h(0, "div", 6), fe(1, p_, 1, 4, "img", 30), fe(2, h_, 4, 4), g()),
    e & 2)
  ) {
    let t = n.$implicit;
    m(), pe(t.type == "image" ? 1 : -1), m(), pe(t.type == "video" ? 2 : -1);
  }
}
function m_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "div", 34),
      O("click", function () {
        J(t);
        let o = $();
        return ee(o.visitWebsite());
      }),
      E(1, " START PROJECT "),
      y(2, "img", 35),
      g();
  }
}
function v_(e, n) {
  if ((e & 1 && (Ys(0), E(1), y(2, "br"), Zs()), e & 2)) {
    let t = n.$implicit;
    m(), He(" ", t, " ");
  }
}
function y_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "img", 38),
      O("load", function () {
        J(t);
        let o = $().$index,
          i = $();
        return ee(i.loaded(o));
      }),
      g();
  }
  if (e & 2) {
    let t = $(),
      r = t.$implicit,
      o = t.$index,
      i = $();
    C("src", r.url, nt)("ngClass", Y(2, oi, i.isMediaLoaded(o)));
  }
}
function C_(e, n) {
  if (e & 1) {
    let t = Ee();
    y(0, "div", 31),
      h(1, "video", 39, 2),
      O("playing", function () {
        J(t);
        let o = $().$index,
          i = $();
        return ee(i.loaded(o));
      }),
      y(3, "source", 33),
      E(4, " Your browser does not support the video tag. "),
      g();
  }
  if (e & 2) {
    let t = $(),
      r = t.$implicit,
      o = t.$index,
      i = $();
    m(), C("ngClass", Y(2, oi, i.isMediaLoaded(o))), m(2), C("src", r.url, nt);
  }
}
function D_(e, n) {
  if (
    (e & 1 &&
      (h(0, "div", 6),
      y(1, "div", 36),
      fe(2, y_, 1, 4, "img", 37),
      fe(3, C_, 5, 4),
      g()),
    e & 2)
  ) {
    let t = n.$implicit;
    m(2), pe(t.type == "image" ? 2 : -1), m(), pe(t.type == "video" ? 3 : -1);
  }
}
function E_(e, n) {
  if ((e & 1 && (h(0, "p", 26), E(1), g()), e & 2)) {
    let t = n.$implicit;
    m(), ht(t);
  }
}
function b_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "img", 42),
      O("load", function () {
        J(t);
        let o = $().$index,
          i = $();
        return ee(i.loaded(o));
      }),
      g();
  }
  if (e & 2) {
    let t = $().$implicit;
    C("src", t.url, nt);
  }
}
function w_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "video", 43, 2),
      O("playing", function () {
        J(t);
        let o = $().$index,
          i = $();
        return ee(i.loaded(o));
      }),
      y(2, "source", 33),
      E(3, " Your browser does not support the video tag. "),
      g();
  }
  if (e & 2) {
    let t = $().$implicit;
    m(2), C("src", t.url, nt);
  }
}
function __(e, n) {
  if (
    (e & 1 && (fe(0, b_, 1, 1, "img", 40), fe(1, w_, 4, 1, "video", 41)), e & 2)
  ) {
    let t = n.$implicit;
    pe(t.type == "image" ? 0 : -1), m(), pe(t.type == "video" ? 1 : -1);
  }
}
var za = class e {
  constructor(n, t, r) {
    this.route = n;
    this.crouter = t;
    this.projectsService = r;
  }
  myElement;
  videoPlayers;
  targetPosition = 0;
  currentPosition = 0;
  animationFrameId = 0;
  SMOOTHING_FACTOR = 0.25;
  SCROLL_SENSITIVITY = 1.2;
  projectId = null;
  isExiting = !1;
  project = null;
  loadedMediaIndexes = [];
  thumbnailLoaded = !1;
  ngOnInit() {
    this.fetchProjectID(), this.smoothUpdate(), this.crouter.acceptNavigation();
  }
  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
  ngAfterViewInit() {
    this.playVideos();
  }
  playVideos() {
    this.videoPlayers.forEach((n) => {
      (n.nativeElement.muted = !0), n.nativeElement.play();
    });
  }
  fetchProjectID() {
    this.route.paramMap.subscribe((n) => {
      (!(this.projectId = n.get("id")) ||
        !(this.project = this.getProjectById(this.projectId))) &&
        this.crouter.navigateTo("/");
    });
  }
  isMediaLoaded(n) {
    return this.loadedMediaIndexes.includes(n);
  }
  loaded(n) {
    this.loadedMediaIndexes.push(n);
  }
  getProjectById(n) {
    return this.projectsService.getProjectById(n);
  }
  onScroll(n) {
    this.targetPosition = Math.max(
      0,
      this.targetPosition + n.deltaY * this.SCROLL_SENSITIVITY
    );
    let t = this.getWidth() - window.innerWidth + 30;
    this.targetPosition > t && (this.targetPosition = t);
  }
  getWidth() {
    return this.myElement.nativeElement.offsetWidth;
  }
  smoothUpdate() {
    let n = () => {
      (this.currentPosition +=
        (this.targetPosition - this.currentPosition) * this.SMOOTHING_FACTOR),
        (this.animationFrameId = requestAnimationFrame(n));
    };
    this.animationFrameId = requestAnimationFrame(n);
  }
  updateScrollPosition() {
    return { transform: `translate3d(${-this.currentPosition}px, 0, 0)` };
  }
  visitWebsite() {
    this.project?.websiteUrl && window.open(this.project.websiteUrl, "_blank");
  }
  goBack() {
    (this.isExiting = !0), this.crouter.navigateBack();
  }
  static ɵfac = function (t) {
    return new (t || e)(x(Mt), x(Se), x(jr));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-project-infos"]],
    viewQuery: function (t, r) {
      if ((t & 1 && (Oe(d_, 5), Oe(f_, 5)), t & 2)) {
        let o;
        Re((o = Ne())) && (r.myElement = o.first),
          Re((o = Ne())) && (r.videoPlayers = o);
      }
    },
    decls: 52,
    vars: 18,
    consts: [
      ["carousel2", ""],
      ["carousel", ""],
      ["videoPlayers", ""],
      [1, "desktop-view"],
      [1, "carousel-container-2", 3, "wheel"],
      [1, "carousel", 3, "ngStyle"],
      [1, "carousel-item"],
      [1, "cover-image", 3, "load", "ngClass", "src"],
      [1, "carousel-container", 3, "wheel"],
      [1, "carousel-first-item"],
      [1, "project-title"],
      [1, "flex"],
      [1, "section"],
      [1, "section-title"],
      [1, "section-content"],
      ["style", "margin-top: 50px;", "class", "button", 3, "click", 4, "ngIf"],
      [1, "section", 2, "margin-bottom", "25px"],
      [
        1,
        "section-content",
        2,
        "word-wrap",
        "normal",
        "word-break",
        "keep-all",
        "white-space",
        "nowrap",
      ],
      [4, "ngFor", "ngForOf"],
      [1, "back-button", 3, "click"],
      ["src", "icons/arrow-left-black.svg", "loading", "lazy"],
      [1, "mobile-view"],
      ["alt", "", 1, "m-thumbnail", 3, "src"],
      [1, "m-infos"],
      [1, "m-project-title"],
      [1, "m-tags-container"],
      [1, "m-tag"],
      [1, "m-description"],
      [1, "m-launch-btn"],
      ["src", "icons/arrow-up-right-mini-black.svg", "alt", ""],
      [3, "ngClass", "src"],
      [1, "video-guard"],
      ["autoplay", "", "loop", "", "muted", "", 3, "ngClass"],
      ["type", "video/mp4", 3, "src"],
      [1, "button", 2, "margin-top", "50px", 3, "click"],
      ["src", "icons/arrow-up-right-mini.svg", "alt", ""],
      [1, "media-loader", "gradient"],
      [3, "src", "ngClass"],
      [3, "load", "src", "ngClass"],
      [
        "autoplay",
        "",
        "muted",
        "",
        "playsinline",
        "",
        "loop",
        "",
        "preload",
        "auto",
        3,
        "playing",
        "ngClass",
      ],
      [1, "m-media-image", 3, "src"],
      [
        "autoplay",
        "",
        "muted",
        "",
        "playsinline",
        "",
        "loop",
        "",
        "preload",
        "auto",
        1,
        "m-media-video",
      ],
      [1, "m-media-image", 3, "load", "src"],
      [
        "autoplay",
        "",
        "muted",
        "",
        "playsinline",
        "",
        "loop",
        "",
        "preload",
        "auto",
        1,
        "m-media-video",
        3,
        "playing",
      ],
    ],
    template: function (t, r) {
      if (t & 1) {
        let o = Ee();
        h(0, "div", 3)(1, "div", 4),
          O("wheel", function (s) {
            return J(o), ee(r.onScroll(s));
          }),
          h(2, "div", 5, 0)(4, "div", 6)(5, "img", 7),
          O("load", function () {
            return J(o), ee((r.thumbnailLoaded = !0));
          }),
          g()(),
          _e(6, g_, 3, 2, "div", 6, rt),
          g()(),
          h(8, "div", 8),
          O("wheel", function (s) {
            return J(o), ee(r.onScroll(s));
          }),
          h(9, "div", 5, 1)(11, "div", 9)(12, "div", 10),
          E(13),
          g(),
          h(14, "div", 11)(15, "div", 12)(16, "p", 13),
          E(17, "STORY"),
          g(),
          h(18, "p", 14),
          E(19),
          g(),
          To(20, m_, 3, 0, "div", 15),
          g(),
          h(21, "div")(22, "div", 16)(23, "p", 13),
          E(24, "TAGS"),
          g(),
          h(25, "p", 17),
          To(26, v_, 3, 1, "ng-container", 18),
          g()(),
          h(27, "div", 12)(28, "p", 13),
          E(29, "CLIENT"),
          g(),
          h(30, "p", 14),
          E(31),
          g()()()()(),
          _e(32, D_, 4, 2, "div", 6, rt),
          g()(),
          h(34, "div", 19),
          O("click", function () {
            return J(o), ee(r.goBack());
          }),
          y(35, "img", 20),
          E(36, " BACK "),
          g()(),
          h(37, "div", 21),
          y(38, "img", 22),
          h(39, "div", 23)(40, "p", 24),
          E(41),
          g(),
          h(42, "div", 25),
          _e(43, E_, 2, 1, "p", 26, rt),
          g(),
          h(45, "div", 27),
          E(46),
          g(),
          h(47, "div", 28),
          E(48, " START PROJECT "),
          y(49, "img", 29),
          g()(),
          _e(50, __, 2, 2, null, null, rt),
          g();
      }
      t & 2 &&
        (m(2),
        Vn("exiting", r.isExiting),
        C("ngStyle", r.updateScrollPosition()),
        m(3),
        C("ngClass", Y(16, oi, r.thumbnailLoaded))(
          "src",
          (r.project == null ? null : r.project.thumbnail) || "",
          nt
        ),
        m(),
        Ie(r.project == null ? null : r.project.medias),
        m(3),
        Vn("exiting", r.isExiting),
        C("ngStyle", r.updateScrollPosition()),
        m(4),
        ht(r.project == null ? null : r.project.title),
        m(6),
        He(" ", r.project == null ? null : r.project.description, " "),
        m(),
        C("ngIf", r.project == null ? null : r.project.websiteUrl),
        m(6),
        C("ngForOf", r.project == null ? null : r.project.services),
        m(5),
        He(" ", r.project == null ? null : r.project.client, " "),
        m(),
        Ie(r.project == null ? null : r.project.medias),
        m(6),
        C("src", r.project == null ? null : r.project.thumbnail, nt),
        m(3),
        ht(r.project == null ? null : r.project.title),
        m(2),
        Ie(r.project == null ? null : r.project.services),
        m(3),
        ht(r.project == null ? null : r.project.description),
        m(4),
        Ie(r.project == null ? null : r.project.medias));
    },
    dependencies: [Q, Vt, na, pd, ae],
    styles: [
      "@media (max-width: 768px){.desktop-view[_ngcontent-%COMP%]{display:none}}.desktop-view[_ngcontent-%COMP%]{overflow:hidden}*[_ngcontent-%COMP%]{will-change:transform,opacity}.project-title[_ngcontent-%COMP%]{font-size:6vh;margin-bottom:30px;font-family:Gothic,sans-serif}.carousel-container[_ngcontent-%COMP%]{width:100vw;height:100vh}.carousel-container-2[_ngcontent-%COMP%]{width:100vw;height:100vh;position:absolute;filter:blur(60px);transform:scale(1.5);opacity:.3}.carousel[_ngcontent-%COMP%]{display:flex;align-items:center;width:fit-content;height:100%;gap:10px}.carousel-item[_ngcontent-%COMP%]{height:70%;aspect-ratio:16/9;border-radius:50px;overflow:hidden}.carousel-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], .carousel-item[_ngcontent-%COMP%]   video[_ngcontent-%COMP%]{height:100%;aspect-ratio:16/9;object-fit:cover;opacity:0;transition:opacity .6s ease}.media-loaded[_ngcontent-%COMP%]{opacity:1!important}.carousel-first-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;width:40vw;height:70%;padding:50px}.section[_ngcontent-%COMP%]{font-size:19px}.section-title[_ngcontent-%COMP%]{margin-bottom:10px;background-color:var(--white);color:#000;width:fit-content;padding-inline:5px}.section-content[_ngcontent-%COMP%]{text-align:justify}.flex[_ngcontent-%COMP%]{gap:60px}.button[_ngcontent-%COMP%]{display:flex;align-items:center;gap:15px;width:fit-content;padding:13px;padding-inline:24px;border:1.5px solid var(--white);border-radius:100px;cursor:pointer;font-size:22px}.button[_ngcontent-%COMP%]:hover{background-color:#ffffff1a}.button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:20px;object-fit:cover}.back-button[_ngcontent-%COMP%]{position:fixed;display:flex;align-items:center;gap:10px;bottom:5vh;left:50%;transform:translate(-50%);background-color:var(--white);color:#000;padding:14px;padding-inline:20px;font-size:22px;border-radius:100px;cursor:pointer}.back-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:15px}.video-guard[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1}.media-loader[_ngcontent-%COMP%]{position:absolute;background-color:#000000a4;border:1.5px solid rgba(255,255,255,.194);border-radius:50px;width:102%;height:102%;left:-1%;top:-1%}.gradient[_ngcontent-%COMP%]{animation-duration:2s;animation-fill-mode:forwards;animation-iteration-count:infinite;animation-name:_ngcontent-%COMP%_placeHolderShimmer;animation-timing-function:linear;background:#f6f7f8;background:linear-gradient(to right,#2a2a2a53 8%,#2a2a2a24 38%,#2a2a2a53 54%);background-size:200%}@keyframes _ngcontent-%COMP%_placeHolderShimmer{0%{background-position:100%}to{background-position:-100%}}",
      "@media (max-width: 768px){.mobile-view[_ngcontent-%COMP%]{display:block!important}}.mobile-view[_ngcontent-%COMP%]{display:none}.m-thumbnail[_ngcontent-%COMP%]{width:100%;height:70vh;object-fit:cover}.m-infos[_ngcontent-%COMP%]{padding:20px}.m-infos[_ngcontent-%COMP%]   .m-project-title[_ngcontent-%COMP%]{font-size:60px;font-family:Gothic,sans-serif}.m-infos[_ngcontent-%COMP%]   .m-tags-container[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;margin-bottom:50px}.m-infos[_ngcontent-%COMP%]   .m-tags-container[_ngcontent-%COMP%]   .m-tag[_ngcontent-%COMP%]{padding:5px;padding-inline:10px;border:1.5px solid var(--white);border-radius:100px}.m-infos[_ngcontent-%COMP%]   .m-description[_ngcontent-%COMP%]{text-align:justify;margin-bottom:50px}.m-launch-btn[_ngcontent-%COMP%]{display:flex;gap:10px;width:fit-content;background-color:var(--white);color:#000;padding:12px;padding-inline:17px;border-radius:100px;margin-bottom:50px;margin-inline:auto}.m-launch-btn[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:14px;object-fit:contain}.m-media-image[_ngcontent-%COMP%], .m-media-video[_ngcontent-%COMP%]{width:100%}",
    ],
  });
};
var I_ = 300,
  Vr = () => T(null).pipe(Cc(I_));
var cv = [
  { path: "", component: Ha, resolve: { delay: Vr } },
  { path: "contact", component: Ba, resolve: { delay: Vr } },
  { path: "projects", component: $a, resolve: { delay: Vr } },
  { path: "about", component: Ua, resolve: { delay: Vr } },
  { path: "projects/:id", component: za, resolve: { delay: Vr } },
  { path: "**", redirectTo: "" },
];
var lv = { providers: [wl(), Ku({ eventCoalescing: !0 }), qd(cv)] };
var S_ = (e) => ({ "dots-container-close": e }),
  M_ = (e) => ({ "navigation-menu-show": e }),
  T_ = (e) => ({ "animation-delay": e }),
  x_ = (e, n) => ({ "real-nav-show": e, "real-nav-hide": n }),
  O_ = (e) => ({ "line-active": e });
function R_(e, n) {
  if (e & 1) {
    let t = Ee();
    h(0, "div", 15)(1, "nav", 16),
      O("click", function () {
        let o = J(t).$implicit,
          i = $();
        return ee(i.navigate(o.url));
      }),
      E(2),
      h(3, "p", 17),
      E(4),
      g()(),
      y(5, "div", 18),
      g();
  }
  if (e & 2) {
    let t = n.$implicit,
      r = n.$index,
      o = $();
    m(2),
      He(" ", t.name, " "),
      m(),
      C("ngStyle", Y(5, T_, r * 0.05 + "s"))(
        "ngClass",
        $n(7, x_, o.showNavigationMenu == !0, o.showNavigationMenu == !1)
      ),
      m(),
      He(" ", t.name, " "),
      m(),
      C("ngClass", Y(10, O_, o.currentUrl == t.url && o.showNavigationMenu));
  }
}
var Ga = class e {
  constructor(n, t) {
    this.router = n;
    this.crouter = t;
    this.router.events.subscribe((r) => {
      r instanceof qe && (this.currentUrl = r.urlAfterRedirects);
    });
  }
  ROUTES = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
    { name: "Contact Us", url: "/contact" },
  ];
  currentUrl = "";
  showNavigationMenu = !1;
  navigateTo(n) {
    this.crouter.navigateTo(n);
  }
  manageNavigationMenu() {
    this.showNavigationMenu
      ? (this.showNavigationMenu = !1)
      : (this.showNavigationMenu = !0);
  }
  navigate(n) {
    (this.showNavigationMenu = !1), this.crouter.navigateTo(n);
  }
  static ɵfac = function (t) {
    return new (t || e)(x(pn), x(Se));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-navbar"]],
    decls: 21,
    vars: 8,
    consts: [
      [1, "navbar-container"],
      [1, "navbar-mobile"],
      [
        "src",
        "icons/favicon.ico",
        "alt",
        "",
        "loading",
        "lazy",
  
        3,
        "click",
      ],
      [1, "mobile-btn", 3, "click"],
      [1, "c"],
      [1, "navbar"],
      [
        "src",
        "icons/favicon.ico",
        "alt",
        "",
        
        3,
        "click",
      ],
      [1, "navbar-text-item"],
      [1, "menu-btn", 3, "click"],
      [1, "dots-container", 3, "ngClass"],
      [1, "circle", "c-1"],
      [1, "circle", "c-2"],
      ["src", "icons/close.svg", "alt", "", "loading", "lazy", 1, "close-icon"],
      [1, "navigation-menu", 3, "ngClass"],
      [1, "navigation"],
      [1, "nav-container"],
      [1, "fake-nav", 3, "click"],
      [1, "real-nav", 3, "ngStyle", "ngClass"],
      [1, "line", 3, "ngClass"],
    ],
    template: function (t, r) {
      t & 1 &&
        (h(0, "div", 0)(1, "div", 1)(2, "img", 2),
        O("click", function () {
          return r.navigateTo("/");
        }),
        g(),
        h(3, "div", 3),
        O("click", function () {
          return r.manageNavigationMenu();
        }),
        y(4, "div", 4)(5, "div", 4),
        g()(),
        h(6, "div", 5)(7, "img", 6),
        O("click", function () {
          return r.navigateTo("/");
        }),
        g(),
        h(8, "p", 7),
        E(9, "est.2024"),
        g(),
        h(10, "div", 8),
        O("click", function () {
          return r.manageNavigationMenu();
        }),
        h(11, "p"),
        E(12, "MENU"),
        g(),
        h(13, "div", 9),
        y(14, "div", 10)(15, "div", 11)(16, "img", 12),
        g()()(),
        h(17, "div", 13)(18, "div", 14),
        _e(19, R_, 6, 12, "div", 15, rt),
        g()()()),
        t & 2 &&
          (m(3),
          Vn("mobile-btn-active", r.showNavigationMenu),
          m(10),
          C("ngClass", Y(4, S_, r.showNavigationMenu)),
          m(4),
          C("ngClass", Y(6, M_, r.showNavigationMenu)),
          m(2),
          Ie(r.ROUTES));
    },
    dependencies: [Q, Vt, ae],
    styles: [
      "@media (max-width: 768px){.navbar[_ngcontent-%COMP%]{display:none!important}.navbar-mobile[_ngcontent-%COMP%]{display:flex!important;padding:25px!important}.main-logo[_ngcontent-%COMP%]{width:100px!important;left:25px!important;transform:none!important}nav[_ngcontent-%COMP%]{font-size:5vh!important;margin-left:25px!important}.navigation[_ngcontent-%COMP%]{gap:10px!important}}.mobile-btn-active[_ngcontent-%COMP%]{background-color:var(--white)!important;transform:rotate(90deg)}.mobile-btn-active[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%]{background-color:#242327!important}.mobile-btn[_ngcontent-%COMP%]{width:40px;height:40px;background-color:#242327;border-radius:100px;margin-left:auto;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .15s ease-in-out}.mobile-btn[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%]{width:7px;aspect-ratio:1/1;background-color:var(--white);border-radius:100px}.navbar-mobile[_ngcontent-%COMP%]{display:none;position:fixed;top:0;left:0;width:100vw;padding:30px;padding-inline:40px;pointer-events:none;z-index:21;align-items:center;font-size:1.8vh}.navbar-mobile[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{pointer-events:auto}.navbar[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;padding:30px;padding-inline:30px;display:flex;z-index:21;align-items:center;font-size:1.8vh}.main-logo[_ngcontent-%COMP%]{position:absolute;min-width:13vh;width:13vh;left:50%;transform:translate(-50%);cursor:pointer;pointer-events:all}.menu-btn[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1.2vh;padding:1vh;padding-inline:1.8vh;border-radius:100px;background-color:#0009;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1.5px solid rgb(75,75,75);cursor:pointer;margin-left:auto}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]{position:relative;width:1.9vh;aspect-ratio:1/1;border-radius:100%;transition:all .2s ease-in-out}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]   *[_ngcontent-%COMP%]{transition:all .2s ease-in-out}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]   .circle[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;width:.75vh;aspect-ratio:1/1;transform:translateY(-50%);background-color:var(--white);border-radius:100%}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]   .c-1[_ngcontent-%COMP%]{left:0%}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]   .c-2[_ngcontent-%COMP%]{left:auto;right:0%}.menu-btn[_ngcontent-%COMP%]   .dots-container[_ngcontent-%COMP%]   .close-icon[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;width:1.3vh;aspect-ratio:1/1;opacity:0;transform:translate(-50%,-50%) scale(0)}.menu-btn[_ngcontent-%COMP%]:hover   .dots-container[_ngcontent-%COMP%], .dots-container-close[_ngcontent-%COMP%]{transform:rotate(180deg)}.dots-container-close[_ngcontent-%COMP%]   .circle[_ngcontent-%COMP%]{opacity:0}.dots-container-close[_ngcontent-%COMP%]   .close-icon[_ngcontent-%COMP%]{opacity:1!important;transform:translate(-50%,-50%) scale(1)!important}.navigation-menu[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100vw;height:100vh;background-color:#00000039;-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);opacity:0;pointer-events:none;z-index:10;transition:opacity .6s ease-in-out}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;height:100%;width:100%}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:fit-content}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .line[_ngcontent-%COMP%]{width:0%;height:2px;background-color:var(--white);transition:all .15s ease-in-out;margin-left:auto}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .line-active[_ngcontent-%COMP%]{width:100%!important}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{font-size:6vh;cursor:pointer;width:fit-content;margin-left:30vw}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .fake-nav[_ngcontent-%COMP%]{position:relative;color:transparent;overflow:hidden}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .real-nav[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;color:var(--white)}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .real-nav-show[_ngcontent-%COMP%]{opacity:0;animation:_ngcontent-%COMP%_lala .4s ease-in-out forwards}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]   .real-nav-hide[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_lala2 .15s ease-in-out forwards}.navigation-menu[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%]   .nav-container[_ngcontent-%COMP%]:hover   .line[_ngcontent-%COMP%]{width:20%}@keyframes _ngcontent-%COMP%_lala{0%{top:90px;opacity:1}to{top:0;opacity:1}}@keyframes _ngcontent-%COMP%_lala2{0%{top:0;opacity:1}to{top:-50px;opacity:0}}.navigation-menu-show[_ngcontent-%COMP%]{opacity:1;pointer-events:all}",
    ],
  });
};
var Wa = class e {
  static ɵfac = function (t) {
    return new (t || e)();
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-footer-blur"]],
    decls: 9,
    vars: 0,
    consts: [
      [1, "container"],
      [1, "progressive-blur-container"],
      [1, "blur-filter"],
    ],
    template: function (t, r) {
      t & 1 &&
        (ft(0, "div", 0)(1, "div", 1),
        Ht(2, "div", 2)(3, "div", 2)(4, "div", 2)(5, "div", 2)(6, "div", 2)(
          7,
          "div",
          2
        )(8, "div", 2),
        pt()());
    },
    styles: [
      "*[_ngcontent-%COMP%]{box-sizing:border-box}[_nghost-%COMP%]{position:fixed;display:flex;flex-direction:column;left:0;bottom:0;height:50px;width:100vw}.container[_ngcontent-%COMP%]{position:relative;width:100%;height:100%;text-align:center;padding:0 35px 35px;overflow:hidden}.progressive-blur-container[_ngcontent-%COMP%]{position:absolute;left:0;right:0;bottom:0;height:100%}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]{position:absolute;inset:0}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(1){-webkit-backdrop-filter:blur(0px);backdrop-filter:blur(0px);mask:linear-gradient(rgba(0,0,0,0),rgb(0,0,0) 10%,rgb(0,0,0) 30%,rgba(0,0,0,0) 40%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(2){-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px);mask:linear-gradient(rgba(255,255,255,0) 10%,rgb(255,255,255) 20%,rgb(255,255,255) 40%,rgba(255,255,255,0) 50%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(3){-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);mask:linear-gradient(rgba(0,0,0,0) 15%,rgb(0,0,0) 30%,rgb(0,0,0) 50%,rgba(0,0,0,0) 60%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(4){-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);mask:linear-gradient(rgba(0,0,0,0) 20%,rgb(0,0,0) 40%,rgb(0,0,0) 60%,rgba(0,0,0,0) 70%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(5){-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);mask:linear-gradient(rgba(0,0,0,0) 40%,rgb(0,0,0) 60%,rgb(0,0,0) 80%,rgba(0,0,0,0) 90%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(6){-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);mask:linear-gradient(rgba(0,0,0,0) 60%,rgb(0,0,0) 80%)}.progressive-blur-container[_ngcontent-%COMP%] > .blur-filter[_ngcontent-%COMP%]:nth-child(7){z-index:10;-webkit-backdrop-filter:blur(80px);backdrop-filter:blur(80px);mask:linear-gradient(rgba(0,0,0,0) 80%,rgb(0,0,0) 100%)}.progressive-blur-container[_ngcontent-%COMP%] > .gradient[_ngcontent-%COMP%]{position:absolute;inset:0;background:linear-gradient(transparent,#000)}",
    ],
  });
};
var N_ = (e) => ({ height: e }),
  qa = class e {
    element;
    scrollPosition = 0;
    hideTimeout = null;
    screenHeight = 0;
    BAR_HEIGHT = 150;
    constructor() {}
    ngAfterViewInit() {
      typeof window < "u" &&
        ((this.element = document.getElementById("bar-container")),
        (this.screenHeight = window.innerHeight));
    }
    onWindowScroll() {
      (this.scrollPosition = window.scrollY),
        this.element.classList.replace("hide", "show"),
        window.scrollY == 0 && this.element.classList.replace("show", "hide"),
        this.hideTimeout && clearTimeout(this.hideTimeout),
        (this.hideTimeout = setTimeout(() => {
          this.element.classList.replace("show", "hide");
        }, 1e3));
    }
    onResize() {
      this.screenHeight = window.innerHeight;
    }
    calculateBarPosition() {
      return {
        "margin-top": `${
          this.BAR_HEIGHT *
          (this.scrollPosition / (this.getPageHeight() - this.screenHeight))
        }px`,
      };
    }
    getPageHeight() {
      return typeof window < "u"
        ? Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
          )
        : 0;
    }
    static ɵfac = function (t) {
      return new (t || e)();
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-scrollbar"]],
      hostBindings: function (t, r) {
        t & 1 &&
          O(
            "scroll",
            function () {
              return r.onWindowScroll();
            },
            we
          )(
            "resize",
            function () {
              return r.onResize();
            },
            we
          );
      },
      decls: 3,
      vars: 4,
      consts: [
        ["barContainer", ""],
        ["id", "bar-container", 1, "bar-container", "hide"],
        [1, "bar", 3, "ngStyle"],
      ],
      template: function (t, r) {
        t & 1 && (h(0, "div", 1, 0), y(2, "div", 2), g()),
          t & 2 &&
            (m(2),
            C("ngStyle", Y(2, N_, r.BAR_HEIGHT + "px"))(
              "ngStyle",
              r.calculateBarPosition()
            ));
      },
      dependencies: [Q, ae],
      styles: [
        ".bar-container[_ngcontent-%COMP%]{position:fixed;height:200px;right:10px;top:50%;transform:translateY(-50%);background-color:#ffffff2f;width:6px;border-radius:100px;transition:all .3s ease-in-out;z-index:5}.show[_ngcontent-%COMP%]{opacity:1}.hide[_ngcontent-%COMP%]{opacity:0;right:8px}.bar[_ngcontent-%COMP%]{background-color:#fff;width:100%;height:50px;border-radius:100px;margin-top:10px}",
      ],
    });
  };
var A_ = (e) => ({ show: e }),
  Ya = class e {
    constructor(n) {
      this.crouter = n;
      n.loading$.subscribe((t) => {
        this.showFader = t;
      });
    }
    showFader = !1;
    static ɵfac = function (t) {
      return new (t || e)(x(Se));
    };
    static ɵcmp = k({
      type: e,
      selectors: [["app-navigation-fader"]],
      decls: 1,
      vars: 3,
      consts: [[1, "fader", 3, "ngClass"]],
      template: function (t, r) {
        t & 1 && y(0, "div", 0), t & 2 && C("ngClass", Y(1, A_, r.showFader));
      },
      dependencies: [Q, Vt],
      styles: [
        ".fader[_ngcontent-%COMP%]{position:fixed;top:-10vh;left:-10vw;width:120vw;height:120vh;background-color:#000;z-index:21;opacity:0;transition:all .15s ease-in-out;pointer-events:none}.show[_ngcontent-%COMP%]{opacity:1!important;pointer-events:all}",
      ],
    });
  };
function P_(e, n) {
  e & 1 && y(0, "app-footer-blur")(1, "app-scrollbar");
}
var Za = class e {
  constructor(n) {
    this.deviceDetector = n;
    n.isMobile$.subscribe((t) => {
      this.clientIsMobile = t;
    });
  }
  title = fo("Frosta Studio");
  clientIsMobile = !1;
  static ɵfac = function (t) {
    return new (t || e)(x(Tt));
  };
  static ɵcmp = k({
    type: e,
    selectors: [["app-root"]],
    decls: 4,
    vars: 1,
    template: function (t, r) {
      t & 1 &&
        (y(0, "app-navbar")(1, "router-outlet"),
        fe(2, P_, 2, 0),
        y(3, "app-navigation-fader")),
        t & 2 && (m(2), pe(r.clientIsMobile ? -1 : 2));
    },
    dependencies: [ei, Ga, Wa, qa, Ya],
    styles: [
      ".maintenance[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:30px;background-color:#fff;color:#000;text-align:center}",
    ],
  });
};
wd(Za, lv).catch((e) => console.error(e));
