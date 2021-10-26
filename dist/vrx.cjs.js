"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function (d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value);
        });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
      label: 0,
      sent: function () {
        if (t[0] & 1) throw t[1];
        return t[1];
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g;
  return (
    (g = { next: verb(0), throw: verb(1), return: verb(2) }),
    typeof Symbol === "function" &&
      (g[Symbol.iterator] = function () {
        return this;
      }),
    g
  );
  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (
          ((f = 1),
          y &&
            (t =
              op[0] & 2
                ? y["return"]
                : op[0]
                ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                : y.next) &&
            !(t = t.call(y, op[1])).done)
        )
          return t;
        if (((y = 0), t)) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (
              !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
              (op[0] === 6 || op[0] === 2)
            ) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
    m = s && o[s],
    i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function () {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      },
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
    r,
    ar = [],
    e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error: error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}

function __spreadArray(to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];
  return to;
}

function __await(v) {
  return this instanceof __await ? ((this.v = v), this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
    i,
    q = [];
  return (
    (i = {}),
    verb("next"),
    verb("throw"),
    verb("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function verb(n) {
    if (g[n])
      i[n] = function (v) {
        return new Promise(function (a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await
      ? Promise.resolve(r.value.v).then(fulfill, reject)
      : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
  }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
    i;
  return m
    ? m.call(o)
    : ((o = typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i);
  function verb(n) {
    i[n] =
      o[n] &&
      function (v) {
        return new Promise(function (resolve, reject) {
          (v = o[n](v)), settle(resolve, reject, v.done, v.value);
        });
      };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({ value: v, done: d });
    }, reject);
  }
}

function isFunction(value) {
  return typeof value === "function";
}

function createErrorClass(createImpl) {
  var _super = function (instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors
      ? errors.length +
        " errors occurred during unsubscription:\n" +
        errors
          .map(function (err, i) {
            return i + 1 + ") " + err.toString();
          })
          .join("\n  ")
      : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

var Subscription = (function () {
  function Subscription(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._teardowns = null;
  }
  Subscription.prototype.unsubscribe = function () {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (
              var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next();
              !_parentage_1_1.done;
              _parentage_1_1 = _parentage_1.next()
            ) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                _a.call(_parentage_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialTeardown = this.initialTeardown;
      if (isFunction(initialTeardown)) {
        try {
          initialTeardown();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _teardowns = this._teardowns;
      if (_teardowns) {
        this._teardowns = null;
        try {
          for (
            var _teardowns_1 = __values(_teardowns), _teardowns_1_1 = _teardowns_1.next();
            !_teardowns_1_1.done;
            _teardowns_1_1 = _teardowns_1.next()
          ) {
            var teardown_1 = _teardowns_1_1.value;
            try {
              execTeardown(teardown_1);
            } catch (err) {
              errors = errors !== null && errors !== void 0 ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_teardowns_1_1 && !_teardowns_1_1.done && (_b = _teardowns_1.return))
              _b.call(_teardowns_1);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription.prototype.add = function (teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execTeardown(teardown);
      } else {
        if (teardown instanceof Subscription) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(
          teardown
        );
      }
    }
  };
  Subscription.prototype._hasParent = function (parent) {
    var _parentage = this._parentage;
    return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
  };
  Subscription.prototype._addParent = function (parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage)
      ? (_parentage.push(parent), _parentage)
      : _parentage
      ? [_parentage, parent]
      : parent;
  };
  Subscription.prototype._removeParent = function (parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription.prototype.remove = function (teardown) {
    var _teardowns = this._teardowns;
    _teardowns && arrRemove(_teardowns, teardown);
    if (teardown instanceof Subscription) {
      teardown._removeParent(this);
    }
  };
  Subscription.EMPTY = (function () {
    var empty = new Subscription();
    empty.closed = true;
    return empty;
  })();
  return Subscription;
})();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
  return (
    value instanceof Subscription ||
    (value &&
      "closed" in value &&
      isFunction(value.remove) &&
      isFunction(value.add) &&
      isFunction(value.unsubscribe))
  );
}
function execTeardown(teardown) {
  if (isFunction(teardown)) {
    teardown();
  } else {
    teardown.unsubscribe();
  }
}

var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: undefined,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false,
};

var timeoutProvider = {
  setTimeout: function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    return (
      (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout
    ).apply(void 0, __spreadArray([], __read(args)));
  },
  clearTimeout: function (handle) {
    var delegate = timeoutProvider.delegate;
    return (
      (delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout
    )(handle);
  },
  delegate: undefined,
};

function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function () {
    {
      throw err;
    }
  });
}

function noop() {}

var COMPLETE_NOTIFICATION = (function () {
  return createNotification("C", undefined, undefined);
})();
function errorNotification(error) {
  return createNotification("E", undefined, error);
}
function nextNotification(value) {
  return createNotification("N", value, undefined);
}
function createNotification(kind, value, error) {
  return {
    kind: kind,
    value: value,
    error: error,
  };
}

var context = null;
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context,
        errorThrown = _a.errorThrown,
        error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}

var Subscriber = (function (_super) {
  __extends(Subscriber, _super);
  function Subscriber(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber.create = function (next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber.prototype.next = function (value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber.prototype.error = function (err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber.prototype.complete = function () {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber.prototype.unsubscribe = function () {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber.prototype._next = function (value) {
    this.destination.next(value);
  };
  Subscriber.prototype._error = function (err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber.prototype._complete = function () {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber;
})(Subscription);
var SafeSubscriber = (function (_super) {
  __extends(SafeSubscriber, _super);
  function SafeSubscriber(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var next;
    if (isFunction(observerOrNext)) {
      next = observerOrNext;
    } else if (observerOrNext) {
      (next = observerOrNext.next),
        (error = observerOrNext.error),
        (complete = observerOrNext.complete);
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function () {
          return _this.unsubscribe();
        };
      } else {
        context_1 = observerOrNext;
      }
      next = next === null || next === void 0 ? void 0 : next.bind(context_1);
      error = error === null || error === void 0 ? void 0 : error.bind(context_1);
      complete = complete === null || complete === void 0 ? void 0 : complete.bind(context_1);
    }
    _this.destination = {
      next: next ? wrapForErrorHandling(next) : noop,
      error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler),
      complete: complete ? wrapForErrorHandling(complete) : noop,
    };
    return _this;
  }
  return SafeSubscriber;
})(Subscriber);
function wrapForErrorHandling(handler, instance) {
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    try {
      handler.apply(void 0, __spreadArray([], __read(args)));
    } catch (err) {
      {
        reportUnhandledError(err);
      }
    }
  };
}
function defaultErrorHandler(err) {
  throw err;
}
function handleStoppedNotification(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification &&
    timeoutProvider.setTimeout(function () {
      return onStoppedNotification(notification, subscriber);
    });
}
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop,
};

var observable = (function () {
  return (typeof Symbol === "function" && Symbol.observable) || "@@observable";
})();

function identity(x) {
  return x;
}

function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function (prev, fn) {
      return fn(prev);
    }, input);
  };
}

var Observable = (function () {
  function Observable(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable.prototype.lift = function (operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };
  Observable.prototype.subscribe = function (observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext)
      ? observerOrNext
      : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function () {
      var _a = _this,
        operator = _a.operator,
        source = _a.source;
      subscriber.add(
        operator
          ? operator.call(subscriber, source)
          : source
          ? _this._subscribe(subscriber)
          : _this._trySubscribe(subscriber)
      );
    });
    return subscriber;
  };
  Observable.prototype._trySubscribe = function (sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable.prototype.forEach = function (next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var subscription;
      subscription = _this.subscribe(
        function (value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscription === null || subscription === void 0 ? void 0 : subscription.unsubscribe();
          }
        },
        reject,
        resolve
      );
    });
  };
  Observable.prototype._subscribe = function (subscriber) {
    var _a;
    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
  };
  Observable.prototype[observable] = function () {
    return this;
  };
  Observable.prototype.pipe = function () {
    var operations = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable.prototype.toPromise = function (promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var value;
      _this.subscribe(
        function (x) {
          return (value = x);
        },
        function (err) {
          return reject(err);
        },
        function () {
          return resolve(value);
        }
      );
    });
  };
  Observable.create = function (subscribe) {
    return new Observable(subscribe);
  };
  return Observable;
})();
function getPromiseCtor(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !==
    null && _a !== void 0
    ? _a
    : Promise;
}
function isObserver(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
  return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

function hasLift(source) {
  return isFunction(source === null || source === void 0 ? void 0 : source.lift);
}
function operate(init) {
  return function (source) {
    if (hasLift(source)) {
      return source.lift(function (liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

var OperatorSubscriber = (function (_super) {
  __extends(OperatorSubscriber, _super);
  function OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this._next = onNext
      ? function (value) {
          try {
            onNext(value);
          } catch (err) {
            destination.error(err);
          }
        }
      : _super.prototype._next;
    _this._error = onError
      ? function (err) {
          try {
            onError(err);
          } catch (err) {
            destination.error(err);
          } finally {
            this.unsubscribe();
          }
        }
      : _super.prototype._error;
    _this._complete = onComplete
      ? function () {
          try {
            onComplete();
          } catch (err) {
            destination.error(err);
          } finally {
            this.unsubscribe();
          }
        }
      : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber.prototype.unsubscribe = function () {
    var _a;
    var closed = this.closed;
    _super.prototype.unsubscribe.call(this);
    !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
  };
  return OperatorSubscriber;
})(Subscriber);

var ObjectUnsubscribedError = createErrorClass(function (_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

var Subject = (function (_super) {
  __extends(Subject, _super);
  function Subject() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject.prototype.lift = function (operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject.prototype._throwIfClosed = function () {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }
  };
  Subject.prototype.next = function (value) {
    var _this = this;
    errorContext(function () {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        var copy = _this.observers.slice();
        try {
          for (
            var copy_1 = __values(copy), copy_1_1 = copy_1.next();
            !copy_1_1.done;
            copy_1_1 = copy_1.next()
          ) {
            var observer = copy_1_1.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (copy_1_1 && !copy_1_1.done && (_a = copy_1.return)) _a.call(copy_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
    });
  };
  Subject.prototype.error = function (err) {
    var _this = this;
    errorContext(function () {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject.prototype.complete = function () {
    var _this = this;
    errorContext(function () {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject.prototype.unsubscribe = function () {
    this.isStopped = this.closed = true;
    this.observers = null;
  };
  Object.defineProperty(Subject.prototype, "observed", {
    get: function () {
      var _a;
      return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
    },
    enumerable: false,
    configurable: true,
  });
  Subject.prototype._trySubscribe = function (subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject.prototype._subscribe = function (subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject.prototype._innerSubscribe = function (subscriber) {
    var _a = this,
      hasError = _a.hasError,
      isStopped = _a.isStopped,
      observers = _a.observers;
    return hasError || isStopped
      ? EMPTY_SUBSCRIPTION
      : (observers.push(subscriber),
        new Subscription(function () {
          return arrRemove(observers, subscriber);
        }));
  };
  Subject.prototype._checkFinalizedStatuses = function (subscriber) {
    var _a = this,
      hasError = _a.hasError,
      thrownError = _a.thrownError,
      isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject.prototype.asObservable = function () {
    var observable = new Observable();
    observable.source = this;
    return observable;
  };
  Subject.create = function (destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject;
})(Observable);
var AnonymousSubject = (function (_super) {
  __extends(AnonymousSubject, _super);
  function AnonymousSubject(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject.prototype.next = function (value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null ||
    _b === void 0
      ? void 0
      : _b.call(_a, value);
  };
  AnonymousSubject.prototype.error = function (err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null ||
    _b === void 0
      ? void 0
      : _b.call(_a, err);
  };
  AnonymousSubject.prototype.complete = function () {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null ||
    _b === void 0
      ? void 0
      : _b.call(_a);
  };
  AnonymousSubject.prototype._subscribe = function (subscriber) {
    var _a, _b;
    return (_b =
      (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null &&
      _b !== void 0
      ? _b
      : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject;
})(Subject);

var BehaviorSubject = (function (_super) {
  __extends(BehaviorSubject, _super);
  function BehaviorSubject(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject.prototype, "value", {
    get: function () {
      return this.getValue();
    },
    enumerable: false,
    configurable: true,
  });
  BehaviorSubject.prototype._subscribe = function (subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject.prototype.getValue = function () {
    var _a = this,
      hasError = _a.hasError,
      thrownError = _a.thrownError,
      _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject.prototype.next = function (value) {
    _super.prototype.next.call(this, (this._value = value));
  };
  return BehaviorSubject;
})(Subject);

var EMPTY = new Observable(function (subscriber) {
  return subscriber.complete();
});

function isScheduler(value) {
  return value && isFunction(value.schedule);
}

function last(arr) {
  return arr[arr.length - 1];
}
function popResultSelector(args) {
  return isFunction(last(args)) ? args.pop() : undefined;
}
function popScheduler(args) {
  return isScheduler(last(args)) ? args.pop() : undefined;
}
function popNumber(args, defaultValue) {
  return typeof last(args) === "number" ? args.pop() : defaultValue;
}

var isArrayLike = function (x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

function isPromise(value) {
  return isFunction(value === null || value === void 0 ? void 0 : value.then);
}

function isInteropObservable(input) {
  return isFunction(input[observable]);
}

function isAsyncIterable(obj) {
  return (
    Symbol.asyncIterator &&
    isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator])
  );
}

function createInvalidObservableTypeError(input) {
  return new TypeError(
    "You provided " +
      (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") +
      " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable."
  );
}

function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

function isIterable(input) {
  return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
}

function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          return [4, __await(reader.read())];
        case 3:
          (_a = _b.sent()), (value = _a.value), (done = _a.done);
          if (!done) return [3, 5];
          return [4, __await(void 0)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
}

function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function (subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function (subscriber) {
    for (var i = 0; i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function (subscriber) {
    promise
      .then(
        function (value) {
          if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
          }
        },
        function (err) {
          return subscriber.error(err);
        }
      )
      .then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function (subscriber) {
    var e_1, _a;
    try {
      for (
        var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next();
        !iterable_1_1.done;
        iterable_1_1 = iterable_1.next()
      ) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function (subscriber) {
    process(asyncIterable, subscriber).catch(function (err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
function process(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, void 0, void 0, function () {
    var value, e_2_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!((asyncIterable_1_1 = _b.sent()), !asyncIterable_1_1.done)) return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)))
            return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2) throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
}

function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
  if (delay === void 0) {
    delay = 0;
  }
  if (repeat === void 0) {
    repeat = false;
  }
  var scheduleSubscription = scheduler.schedule(function () {
    work();
    if (repeat) {
      parentSubscription.add(this.schedule(null, delay));
    } else {
      this.unsubscribe();
    }
  }, delay);
  parentSubscription.add(scheduleSubscription);
  if (!repeat) {
    return scheduleSubscription;
  }
}

function observeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function (source, subscriber) {
    source.subscribe(
      new OperatorSubscriber(
        subscriber,
        function (value) {
          return executeSchedule(
            subscriber,
            scheduler,
            function () {
              return subscriber.next(value);
            },
            delay
          );
        },
        function () {
          return executeSchedule(
            subscriber,
            scheduler,
            function () {
              return subscriber.complete();
            },
            delay
          );
        },
        function (err) {
          return executeSchedule(
            subscriber,
            scheduler,
            function () {
              return subscriber.error(err);
            },
            delay
          );
        }
      )
    );
  });
}

function subscribeOn(scheduler, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return operate(function (source, subscriber) {
    subscriber.add(
      scheduler.schedule(function () {
        return source.subscribe(subscriber);
      }, delay)
    );
  });
}

function scheduleObservable(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function schedulePromise(input, scheduler) {
  return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}

function scheduleArray(input, scheduler) {
  return new Observable(function (subscriber) {
    var i = 0;
    return scheduler.schedule(function () {
      if (i === input.length) {
        subscriber.complete();
      } else {
        subscriber.next(input[i++]);
        if (!subscriber.closed) {
          this.schedule();
        }
      }
    });
  });
}

function scheduleIterable(input, scheduler) {
  return new Observable(function (subscriber) {
    var iterator$1;
    executeSchedule(subscriber, scheduler, function () {
      iterator$1 = input[iterator]();
      executeSchedule(
        subscriber,
        scheduler,
        function () {
          var _a;
          var value;
          var done;
          try {
            (_a = iterator$1.next()), (value = _a.value), (done = _a.done);
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        },
        0,
        true
      );
    });
    return function () {
      return (
        isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) &&
        iterator$1.return()
      );
    };
  });
}

function scheduleAsyncIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }
  return new Observable(function (subscriber) {
    executeSchedule(subscriber, scheduler, function () {
      var iterator = input[Symbol.asyncIterator]();
      executeSchedule(
        subscriber,
        scheduler,
        function () {
          iterator.next().then(function (result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        },
        0,
        true
      );
    });
  });
}

function scheduleReadableStreamLike(input, scheduler) {
  return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
}

function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    }
    if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    }
    if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    }
    if (isAsyncIterable(input)) {
      return scheduleAsyncIterable(input, scheduler);
    }
    if (isIterable(input)) {
      return scheduleIterable(input, scheduler);
    }
    if (isReadableStreamLike(input)) {
      return scheduleReadableStreamLike(input, scheduler);
    }
  }
  throw createInvalidObservableTypeError(input);
}

function from(input, scheduler) {
  return scheduler ? scheduled(input, scheduler) : innerFrom(input);
}

function of() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  return from(args, scheduler);
}

function map(project, thisArg) {
  return operate(function (source, subscriber) {
    var index = 0;
    source.subscribe(
      new OperatorSubscriber(subscriber, function (value) {
        subscriber.next(project.call(thisArg, value, index++));
      })
    );
  });
}

function mergeInternals(
  source,
  subscriber,
  project,
  concurrent,
  onBeforeNext,
  expand,
  innerSubScheduler,
  additionalTeardown
) {
  var buffer = [];
  var active = 0;
  var index = 0;
  var isComplete = false;
  var checkComplete = function () {
    if (isComplete && !buffer.length && !active) {
      subscriber.complete();
    }
  };
  var outerNext = function (value) {
    return active < concurrent ? doInnerSub(value) : buffer.push(value);
  };
  var doInnerSub = function (value) {
    expand && subscriber.next(value);
    active++;
    var innerComplete = false;
    innerFrom(project(value, index++)).subscribe(
      new OperatorSubscriber(
        subscriber,
        function (innerValue) {
          onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
          if (expand) {
            outerNext(innerValue);
          } else {
            subscriber.next(innerValue);
          }
        },
        function () {
          innerComplete = true;
        },
        undefined,
        function () {
          if (innerComplete) {
            try {
              active--;
              var _loop_1 = function () {
                var bufferedValue = buffer.shift();
                if (innerSubScheduler) {
                  executeSchedule(subscriber, innerSubScheduler, function () {
                    return doInnerSub(bufferedValue);
                  });
                } else {
                  doInnerSub(bufferedValue);
                }
              };
              while (buffer.length && active < concurrent) {
                _loop_1();
              }
              checkComplete();
            } catch (err) {
              subscriber.error(err);
            }
          }
        }
      )
    );
  };
  source.subscribe(
    new OperatorSubscriber(subscriber, outerNext, function () {
      isComplete = true;
      checkComplete();
    })
  );
  return function () {
    additionalTeardown === null || additionalTeardown === void 0 ? void 0 : additionalTeardown();
  };
}

function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  if (isFunction(resultSelector)) {
    return mergeMap(function (a, i) {
      return map(function (b, ii) {
        return resultSelector(a, b, i, ii);
      })(innerFrom(project(a, i)));
    }, concurrent);
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }
  return operate(function (source, subscriber) {
    return mergeInternals(source, subscriber, project, concurrent);
  });
}

function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Infinity;
  }
  return mergeMap(identity, concurrent);
}

function concatAll() {
  return mergeAll(1);
}

function concat() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return concatAll()(from(args, popScheduler(args)));
}

function merge() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var scheduler = popScheduler(args);
  var concurrent = popNumber(args, Infinity);
  var sources = args;
  return !sources.length
    ? EMPTY
    : sources.length === 1
    ? innerFrom(sources[0])
    : mergeAll(concurrent)(from(sources, scheduler));
}

function filter(predicate, thisArg) {
  return operate(function (source, subscriber) {
    var index = 0;
    source.subscribe(
      new OperatorSubscriber(subscriber, function (value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      })
    );
  });
}

function bufferCount(bufferSize, startBufferEvery) {
  if (startBufferEvery === void 0) {
    startBufferEvery = null;
  }
  startBufferEvery =
    startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
  return operate(function (source, subscriber) {
    var buffers = [];
    var count = 0;
    source.subscribe(
      new OperatorSubscriber(
        subscriber,
        function (value) {
          var e_1, _a, e_2, _b;
          var toEmit = null;
          if (count++ % startBufferEvery === 0) {
            buffers.push([]);
          }
          try {
            for (
              var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next();
              !buffers_1_1.done;
              buffers_1_1 = buffers_1.next()
            ) {
              var buffer = buffers_1_1.value;
              buffer.push(value);
              if (bufferSize <= buffer.length) {
                toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
                toEmit.push(buffer);
              }
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          if (toEmit) {
            try {
              for (
                var toEmit_1 = __values(toEmit), toEmit_1_1 = toEmit_1.next();
                !toEmit_1_1.done;
                toEmit_1_1 = toEmit_1.next()
              ) {
                var buffer = toEmit_1_1.value;
                arrRemove(buffers, buffer);
                subscriber.next(buffer);
              }
            } catch (e_2_1) {
              e_2 = { error: e_2_1 };
            } finally {
              try {
                if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
              } finally {
                if (e_2) throw e_2.error;
              }
            }
          }
        },
        function () {
          var e_3, _a;
          try {
            for (
              var buffers_2 = __values(buffers), buffers_2_1 = buffers_2.next();
              !buffers_2_1.done;
              buffers_2_1 = buffers_2.next()
            ) {
              var buffer = buffers_2_1.value;
              subscriber.next(buffer);
            }
          } catch (e_3_1) {
            e_3 = { error: e_3_1 };
          } finally {
            try {
              if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return)) _a.call(buffers_2);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
          subscriber.complete();
        },
        undefined,
        function () {
          buffers = null;
        }
      )
    );
  });
}

function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
  return function (source, subscriber) {
    var hasState = hasSeed;
    var state = seed;
    var index = 0;
    source.subscribe(
      new OperatorSubscriber(
        subscriber,
        function (value) {
          var i = index++;
          state = hasState ? accumulator(state, value, i) : ((hasState = true), value);
          emitOnNext && subscriber.next(state);
        },
        emitBeforeComplete &&
          function () {
            hasState && subscriber.next(state);
            subscriber.complete();
          }
      )
    );
  };
}

function reduce(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, false, true));
}

var arrReducer = function (arr, value) {
  return arr.push(value), arr;
};
function toArray() {
  return operate(function (source, subscriber) {
    reduce(arrReducer, [])(source).subscribe(subscriber);
  });
}

function take(count) {
  return count <= 0
    ? function () {
        return EMPTY;
      }
    : operate(function (source, subscriber) {
        var seen = 0;
        source.subscribe(
          new OperatorSubscriber(subscriber, function (value) {
            if (++seen <= count) {
              subscriber.next(value);
              if (count <= seen) {
                subscriber.complete();
              }
            }
          })
        );
      });
}

function pairwise() {
  return operate(function (source, subscriber) {
    var prev;
    var hasPrev = false;
    source.subscribe(
      new OperatorSubscriber(subscriber, function (value) {
        var p = prev;
        prev = value;
        hasPrev && subscriber.next([p, value]);
        hasPrev = true;
      })
    );
  });
}

function pluck() {
  var properties = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    properties[_i] = arguments[_i];
  }
  var length = properties.length;
  if (length === 0) {
    throw new Error("list of properties cannot be empty.");
  }
  return map(function (x) {
    var currentProp = x;
    for (var i = 0; i < length; i++) {
      var p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
      if (typeof p !== "undefined") {
        currentProp = p;
      } else {
        return undefined;
      }
    }
    return currentProp;
  });
}

function scan(accumulator, seed) {
  return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
}

function share(options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.connector,
    connector =
      _a === void 0
        ? function () {
            return new Subject();
          }
        : _a,
    _b = options.resetOnError,
    resetOnError = _b === void 0 ? true : _b,
    _c = options.resetOnComplete,
    resetOnComplete = _c === void 0 ? true : _c,
    _d = options.resetOnRefCountZero,
    resetOnRefCountZero = _d === void 0 ? true : _d;
  return function (wrapperSource) {
    var connection = null;
    var resetConnection = null;
    var subject = null;
    var refCount = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function () {
      resetConnection === null || resetConnection === void 0
        ? void 0
        : resetConnection.unsubscribe();
      resetConnection = null;
    };
    var reset = function () {
      cancelReset();
      connection = subject = null;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function () {
      var conn = connection;
      reset();
      conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
    };
    return operate(function (source, subscriber) {
      refCount++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
      subscriber.add(function () {
        refCount--;
        if (refCount === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection) {
        connection = new SafeSubscriber({
          next: function (value) {
            return dest.next(value);
          },
          error: function (err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function () {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          },
        });
        from(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
function handleReset(reset, on) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return null;
  }
  if (on === false) {
    return null;
  }
  return on
    .apply(void 0, __spreadArray([], __read(args)))
    .pipe(take(1))
    .subscribe(function () {
      return reset();
    });
}

function startWith() {
  var values = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    values[_i] = arguments[_i];
  }
  var scheduler = popScheduler(values);
  return operate(function (source, subscriber) {
    (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
  });
}

function withLatestFrom() {
  var inputs = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    inputs[_i] = arguments[_i];
  }
  var project = popResultSelector(inputs);
  return operate(function (source, subscriber) {
    var len = inputs.length;
    var otherValues = new Array(len);
    var hasValue = inputs.map(function () {
      return false;
    });
    var ready = false;
    var _loop_1 = function (i) {
      innerFrom(inputs[i]).subscribe(
        new OperatorSubscriber(
          subscriber,
          function (value) {
            otherValues[i] = value;
            if (!ready && !hasValue[i]) {
              hasValue[i] = true;
              (ready = hasValue.every(identity)) && (hasValue = null);
            }
          },
          noop
        )
      );
    };
    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
    source.subscribe(
      new OperatorSubscriber(subscriber, function (value) {
        if (ready) {
          var values = __spreadArray([value], __read(otherValues));
          subscriber.next(
            project ? project.apply(void 0, __spreadArray([], __read(values))) : values
          );
        }
      })
    );
  });
}

function wrapPanel(panel) {
  return {
    webview: of(panel.webview),
    identifier: panel.viewType,
  };
}
function forWebviews(namespace, defaultValue, wvProviders) {
  return merge(...wvProviders.map((wv) => wv.webview)).pipe(
    take(wvProviders.length),
    toArray(),
    map((wvs) => {
      return wvs.map((wv) => {
        const provider = {
          onMessage: (listener) => {
            wv.onDidReceiveMessage((event) => {
              listener(event);
            });
          },
          postMessage: (message) => {
            return new Promise((resolve) => {
              wv.postMessage(message).then(() => resolve());
            });
          },
        };
        return provider;
      });
    }),
    map((providers) => {
      return new Bus(namespace, defaultValue, providers);
    })
  );
}
function forDOM(namespace, defaultValue, window, vscode) {
  const provider = {
    onMessage: (listener) => {
      window.addEventListener("message", (event) => listener(event.data));
    },
    postMessage: (message) => {
      vscode.postMessage(message);
      return Promise.resolve();
    },
  };
  return new Client(namespace, defaultValue, [provider]);
}
class Client {
  constructor(namespace, defaultValue, providers, _isBus = false) {
    this.namespace = namespace;
    this.defaultValue = defaultValue;
    this.providers = providers;
    this._isBus = _isBus;
    this._outbound = new Subject();
    this._inbound = new BehaviorSubject(this.defaultValue);
    this._events = new Subject();
    this._transient = this.register();
  }

  get events() {
    return this._events.asObservable().pipe(share());
  }

  get transient() {
    return this._transient;
  }

  broadcast(transient) {
    this._outbound.next(transient);
  }

  on(eventName, fn) {
    this.events
      .pipe(
        mergeMap((events) => from(Object.entries(events))),
        filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
        map(([_, v]) => v)
      )
      .subscribe(fn);
  }

  onAll(fn) {
    this.events.subscribe(fn);
  }

  register() {
    const providers = from(this.providers);

    const inGrouped$ = this._inbound.pipe(this.grouped());

    const outGrouped$ = this._outbound.pipe(this.grouped());

    const transientGrouped$ = merge(
      inGrouped$.pipe(pluck("transient")),
      outGrouped$.pipe(pluck("transient"))
    );
    const inEvent$ = inGrouped$.pipe(pluck("event"));
    inEvent$.subscribe((event) => {
      this._events.next(event);
    });
    const transient$ = merge(providers).pipe(
      this.fromProviders(),
      mergeMap((provider) => {
        return transientGrouped$.pipe(
          scan(this.fold, this.defaultValue),
          mergeMap((transient) => {
            const namespaced = {};
            namespaced[this.namespace] = transient;

            if (this._isBus) {
              return from(provider.postMessage(namespaced).then(() => transient));
            } else {
              return of(transient);
            }
          })
        );
      }),
      bufferCount(this.providers.length),
      map((transients) => {
        return transients.reduce(this.fold, this.defaultValue);
      }),
      share()
    );
    const outEvent$ = outGrouped$.pipe(pluck("event"));
    const event$ = this._isBus ? merge(outEvent$, inEvent$) : outEvent$;
    event$
      .pipe(
        withLatestFrom(transient$),
        map(([event, transient]) => {
          return { ...transient, ...event };
        }),
        map((combo) => {
          const namespaced = {};
          namespaced[this.namespace] = combo;
          this.providers.forEach((provider) => {
            provider.postMessage(namespaced);
          });
        })
      )
      .subscribe();
    transient$.subscribe();
    return transient$;
  }

  fromProviders() {
    return (source) => {
      return source.pipe(
        map((provider) => {
          provider.onMessage((payload) => {
            const unpacked = payload[this.namespace];

            if (unpacked) {
              const payload = unpacked;

              this._inbound.next(payload);
            }
          });
          return provider;
        })
      );
    };
  }

  dedupe() {
    return (source) => {
      return source.pipe(
        startWith(this.defaultValue),
        pairwise(),
        filter(([prev, curr]) => JSON.stringify(prev) !== JSON.stringify(curr)),
        map(([_, curr]) => curr)
      );
    };
  }

  fold(acc, one) {
    return { ...acc, ...one };
  }

  fromEntries(accum, [k, v]) {
    const r = { ...accum };
    r[k] = v;
    return r;
  }

  grouped() {
    return (source) => {
      return source.pipe(
        map((payload) => {
          const entries = Object.entries(payload);
          const grouped = entries.map((entry) => {
            const isPrefixed = entry[0].indexOf("on") === 0;
            const obj = this.fromEntries(this.defaultValue, entry);

            if (isPrefixed) {
              return {
                event: obj,
              };
            }

            return {
              transient: obj,
            };
          });
          return grouped;
        }),
        map((grouped) => {
          return {
            transient: grouped.reduce((accum, one) => {
              return { ...accum, ...one.transient };
            }, this.defaultValue),
            event: grouped.reduce((accum, one) => {
              return { ...accum, ...one.event };
            }, this.defaultValue),
          };
        })
      );
    };
  }
}
class Bus extends Client {
  constructor(namespace, defaultValue, providers) {
    super(namespace, defaultValue, providers, true);
  }
}

exports.Bus = Bus;
exports.Client = Client;
exports.forDOM = forDOM;
exports.forWebviews = forWebviews;
exports.wrapPanel = wrapPanel;
