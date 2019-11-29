// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxReservedNames,
         SxParserConfig } from './types';



export const defaultReservedNames: SxReservedNames = {
    eval: '$eval',
    quote: '$quote',
    backquote: '$backquote',
    unquote: '$unquote',
    spread: '$spread',
    splice: '$splice',

    car: '$car',
    cdr: '$cdr',
    cons: '$cons',
    atom: '$atom',
    eq: '$eq',
    list: '$list',

    let: '$clisp-let',
    lambda: '$lambda',
    self: '$self',
    defun: '$defun',
    thiz: '$this',

    if: '$if',
    cond: '$cond',

    while: '$while',
    doWhile: '$do-while',
    until: '$until',
    doUntil: '$do-until',

    get: '$get',
    defvar: '$clisp-defvar',
    setq: '$clisp-setq',
    set: '$set',
    call: '$call',

    not: '$not',
    and: '$and',
    or: '$or',

    isSymbol: '$is-symbol',
    gensym: '$gensym',
    raise: '$raise',
    catch: '$catch',

    Template: 'Template',
};

export const defaultConfig: SxParserConfig = {
    raiseOnUnresolvedSymbol: false,
    enableEvaluate: true,
    enableHereDoc: true,
    enableSpread: true,
    enableSplice: true,
    enableShorthands: true,
    enableVerbatimStringLiteral: true,
    enableTailCallOptimization: true,
    enableRegExpMatchOperators: true,
    enableCompilationOperators: true,
    stripComments: false,
    wrapExternalValue: true,
    returnMultipleRoot: false,
    maxEvalCount: 0,

    reservedNames: defaultReservedNames,
    symbols: [],
    macros: [],
    funcs: [],
};
