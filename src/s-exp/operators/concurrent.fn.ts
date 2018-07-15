// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState } from '../types';
import { $__let,
         $__set  }       from './core.fn';



// tslint:disable-next-line:variable-name
export const $__letAsync = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__let 'nameStrOrSymbol promise)
    //  -> S expr  : promise
    let promise: Promise<any> = args[1];
    if (typeof promise !== 'object' || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
    }
    promise.then(v => {
        $__let(state, '')(args[0], v);
        return v;
    });
    return promise;
};
// tslint:disable-next-line:variable-name
export const $$__letAsync = $__letAsync(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__setAsync = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__set-async 'nameOrListOfNameOrIndex promise)
    //  -> S expr  : promise
    let promise: Promise<any> = args[1];
    if (typeof promise !== 'object' || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
    }
    promise.then(v => {
        $__set(state, '')(args[0], v);
        return v;
    });
    return promise;
};
// tslint:disable-next-line:variable-name
export const $$__setAsync = $__setAsync(null as any, null as any);


export const $then = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($then promise (lambda (val) ...) (lambda (err) ...))
    //  -> S expr  : promise
    let promise: Promise<any> = args[0];
    if (typeof promise !== 'object' || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
    }
    if (typeof args[2] === 'function') {
        promise.then(args[1], args[2]);
    } else {
        if (typeof args[1] !== 'function') {
            throw new Error(`[SX] $then: Invalid argument(s): args[1] is not function.`);
        }
        promise.then(args[1]);
    }
    return promise;
};
export const $$then = $then(null as any, null as any);


export const $resolveAll = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($resolve-all promise1 ... promiseN)
    //  -> S expr  : promise
    const promises: Array<Promise<any>> = args.slice(0);
    for (let i = 0; i < promises.length; i++) {
        if (typeof promises[i] !== 'object' || typeof (promises[i] as any).then !== 'function') {
            promises[i] = Promise.resolve(promises[i]);
        }
    }
    return Promise.all(promises);
};
export const $$resolveAll = $resolveAll(null as any, null as any);


export const $resolveAny = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($resolve-any promise1 ... promiseN)
    //  -> S expr  : promise
    const promises: Array<Promise<any>> = args.slice(0);
    for (let i = 0; i < promises.length; i++) {
        if (typeof promises[i] !== 'object' || typeof (promises[i] as any).then !== 'function') {
            promises[i] = Promise.resolve(promises[i]);
        }
    }
    return Promise.race(promises);
};
export const $$resolveAny = $resolveAny(null as any, null as any);


export const $resolvePipe = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($resolve-pipe promise<val1> (lambda (val1) ... promiseOrVal2) (lambda (val2) ... promiseOrVal3) ... (lambda (valN-1) ... promiseOrValN))
    //  -> S expr  : promise
    // remarks: If the formal argument lambda is a non-lambda value, the value is then piped as is.
    let promise: Promise<any> = args[0];
    if (typeof promise !== 'object' || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
    }
    const lambdas = args.slice(1);
    for (let i = 0; i < lambdas.length; i++) {
        if (typeof lambdas[i] !== 'function') {
            const v = lambdas[i];
            lambdas[i] = () => v;
        }
    }
    let p = promise;
    for (const l of lambdas) {
        p = p.then(l);
    }
    return p;
};
export const $$resolvePipe = $resolvePipe(null as any, null as any);


export const $resolveFork = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($resolve-fork promise<val1> (lambda (val1) ... promiseOrVal2a) ... (lambda (val1) ... promiseOrVal2z))
    //  -> S expr  : (promise<val2a> ... promise<val2z>)
    // remarks: If the formal argument lambda is a non-lambda value, the value is then piped as is.
    let promise: Promise<any> = args[0];
    if (typeof promise !== 'object' || typeof promise.then !== 'function') {
        promise = Promise.resolve(promise);
    }
    const lambdas = args.slice(1);
    for (let i = 0; i < lambdas.length; i++) {
        if (typeof lambdas[i] !== 'function') {
            const v = lambdas[i];
            lambdas[i] = () => v;
        }
    }

    const resolvers = new Array(lambdas.length);
    const rejectors = new Array(lambdas.length);

    const pa: Array<Promise<any>> = [];
    for (let i = 0; i < lambdas.length; i++) {
        pa.push(new Promise<any>((resolve: any, reject: any) => {
            resolvers[i] = resolve;
            rejectors[i] = reject;
        }));
    }

    promise
    .then(
        v => resolvers.forEach(f => f(v)),
        e => rejectors.forEach(f => f(e))
    );

    return pa;
};
export const $$resolveFork = $resolveFork(null as any, null as any);

