// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         MaxEvaluationCountError } from './types';



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


export function checkUnsafeVarNames(name: string, varName: string) {
    if (varName === '__proto__') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (varName === 'prototype') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    return varName;
}


export function checkUnsafeVarNamesEx(name: string, target: any, varName: string) {
    if (varName === '__proto__') {
        throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
    }
    if (varName === 'prototype') {
        if (target === null || target === void 0 || typeof target === 'function') {
            throw new Error(`[SX] ${name}: Invalid var name ${varName}.`);
        }
    }
    return varName;
}
