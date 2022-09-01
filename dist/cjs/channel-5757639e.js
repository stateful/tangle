'use strict';

var tangle = require('./tangle-bdca56c6.js');

function isObservable(obj) {
    return !!obj && (obj instanceof tangle.Observable || (tangle.isFunction(obj.lift) && tangle.isFunction(obj.subscribe)));
}

function debounce(durationSelector) {
    return tangle.operate(function (source, subscriber) {
        var hasValue = false;
        var lastValue = null;
        var durationSubscriber = null;
        var emit = function () {
            durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
            durationSubscriber = null;
            if (hasValue) {
                hasValue = false;
                var value = lastValue;
                lastValue = null;
                subscriber.next(value);
            }
        };
        source.subscribe(tangle.createOperatorSubscriber(subscriber, function (value) {
            durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
            hasValue = true;
            lastValue = value;
            durationSubscriber = tangle.createOperatorSubscriber(subscriber, emit, tangle.noop);
            tangle.innerFrom(durationSelector(value)).subscribe(durationSubscriber);
        }, function () {
            emit();
            subscriber.complete();
        }, undefined, function () {
            lastValue = durationSubscriber = null;
        }));
    });
}

function switchMap(project, resultSelector) {
    return tangle.operate(function (source, subscriber) {
        var innerSubscriber = null;
        var index = 0;
        var isComplete = false;
        var checkComplete = function () { return isComplete && !innerSubscriber && subscriber.complete(); };
        source.subscribe(tangle.createOperatorSubscriber(subscriber, function (value) {
            innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
            var innerIndex = 0;
            var outerIndex = index++;
            tangle.innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = tangle.createOperatorSubscriber(subscriber, function (innerValue) { return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue); }, function () {
                innerSubscriber = null;
                checkComplete();
            })));
        }, function () {
            isComplete = true;
            checkComplete();
        }));
    });
}

function tap(observerOrNext, error, complete) {
    var tapObserver = tangle.isFunction(observerOrNext) || error || complete
        ?
            { next: observerOrNext, error: error, complete: complete }
        : observerOrNext;
    return tapObserver
        ? tangle.operate(function (source, subscriber) {
            var _a;
            (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
            var isUnsub = true;
            source.subscribe(tangle.createOperatorSubscriber(subscriber, function (value) {
                var _a;
                (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                subscriber.next(value);
            }, function () {
                var _a;
                isUnsub = false;
                (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                subscriber.complete();
            }, function (err) {
                var _a;
                isUnsub = false;
                (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                subscriber.error(err);
            }, function () {
                var _a, _b;
                if (isUnsub) {
                    (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                }
                (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
            }));
        })
        :
            tangle.identity;
}

class BaseChannel {
    constructor(_namespace, _defaultValue) {
        this._namespace = _namespace;
        this._defaultValue = _defaultValue;
        this.providers = [];
    }
    debounceResolution(count, timeout) {
        return (source) => source.pipe(debounce(ps => {
            const t = ps.length === count ? 0 : timeout;
            return tangle.timer(t);
        }));
    }
    registerPromise(providers) {
        const observableProviders = providers.map((p) => {
            return typeof p.then === 'function' ? tangle.from(p) : tangle.of(p);
        });
        return new Promise((resolve, reject) => this.register(observableProviders).subscribe({ next: resolve, error: reject }));
    }
    _register(providers, providerMapper) {
        const observableProviders = providers.map((p) => isObservable(p) ? p : tangle.of(p));
        const providers$ = tangle.merge(...observableProviders).pipe(tap(p => this.providers.push(p)), tangle.map(p => providerMapper(p)), tangle.scan((acc, one) => {
            acc.push(one);
            return acc;
        }, []));
        return providers$.pipe(this.debounceResolution(this.providers.length, 100), switchMap(providers => {
            return new tangle.Observable(observer => {
                const bus = this._initiateBus(providers, this._state);
                const s = bus.transient.subscribe(transient => this._state = transient);
                observer.next(bus);
                return () => {
                    bus.dispose();
                    s.unsubscribe();
                };
            });
        }));
    }
    _initiateBus(providers, previousState) {
        return new tangle.Bus(this._namespace, providers, previousState || this._defaultValue || {});
    }
    _initiateClient(provider) {
        const client = new tangle.Client(this._namespace, [provider], this._defaultValue || {});
        client.notify();
        return client;
    }
}

exports.BaseChannel = BaseChannel;
