// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         MaxEvaluationCountError } from './types';
import { globalObj }               from './consts';



export function setEvaluationCount(state: SxParserState) {
    state.evalCount++;
    if (state.config.maxEvalCount && state.config.maxEvalCount < state.evalCount) {
        throw new MaxEvaluationCountError();
    }
}


export function checkParamsLength(name: string, args: ArrayLike<any>, min: number, max?: number) {
    if (args.length < min) {
        throw new Error(`[SX] ${name}: Invalid argument length: expected: ${min} / args: ${args.length}.`);
    }
    if (max && max < args.length) {
        throw new Error(`[SX] ${name}: Invalid argument length: expected: ${max} / args: ${args.length}.`);
    }
    return args;
}


const objConstructor = ({}).constructor; // NOTE: objConstructor            === Object
const funConstructor = Function;         // NOTE: ({}).toString.constructor === Function

export function checkUnsafeVarNames(name: string, varName: string) {
    if (varName === '__proto__' ||
        varName === '__defineGetter__' || varName === '__defineSetter__' ||
        varName === '__lookupGetter__' || varName === '__lookupSetter__') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (varName === 'prototype' || varName === 'constructor') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (objConstructor.hasOwnProperty(varName)) {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (varName === 'call' || varName === 'arguments' || varName === 'caller') {
        // NOTE: arguments, caller are not accessible in strict mode
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    return varName;
}


export function checkUnsafeVarNamesEx(name: string, target: any, varName: string) {
    if (target === globalObj ||
        varName === '__proto__' ||
        varName === '__defineGetter__' || varName === '__defineSetter__' ||
        varName === '__lookupGetter__' || varName === '__lookupSetter__') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (varName === 'prototype' || varName === 'constructor') {
        if (target === null || target === void 0 || typeof target === 'function') {
            throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
        }
    }
    if (target === null || target === void 0 || target === objConstructor) {
        if (objConstructor.hasOwnProperty(varName)) {
            throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
        }
    }
    if (target === null || target === void 0 || target === funConstructor) {
        // checking 'call', 'arguments', 'caller', ...
        let con: any = funConstructor;
        while (con) {
            if (con.hasOwnProperty(varName)) {
                throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
            }
            con = con.__proto__;
        }
    }
    if (typeof target === 'function') {
        if (!target.hasOwnProperty(varName)) {
            // function's prototypes' members
            throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
        }
    }
    return varName;
}
