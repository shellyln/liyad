// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxFuncInfo,
         SxSymbolInfo,
         SxReservedNames,
         SxParserConfig,
         SxParserState,
         SxToken,
         LsxConfig }        from './types';
import { parse }            from './parser';
import { evaluate }          from './evaluate';
import installCore          from './operators/core';
import installArithmetic    from './operators/arithmetic';
import installSequence      from './operators/sequence';
import installJsx           from './operators/jsx';



export const defaultReservedNames: SxReservedNames = {
    eval: '$eval',
    quote: '$quote',
    spread: '$spread',

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

    not: '$not',
    and: '$and',
    or: '$or',

    Template: 'Template',
};

export const defaultConfig: SxParserConfig = {
    raiseOnUnresolvedSymbol: false,
    enableEvaluate: true,
    enableHereDoc: true,
    enableSpread: true,
    enableTailCallOptimization: true,
    stripComments: false,
    strippedCommentValue: [],
    wrapExternalValue: true,
    returnMultipleRoot: false,

    reservedNames: defaultReservedNames,
    symbols: [],
    macros: [],
    funcs: [],
};



export function SExpression(config: SxParserConfig): (strings: TemplateStringsArray, ...values: any[]) => SxToken {
    return (strings: TemplateStringsArray, ...values: any[]) => {
        const state: SxParserState = {
            strings: typeof strings === 'string' ? [strings] : strings,
            values: values || [],

            index: 0,
            pos: 0,
            line: 0,

            scopes: [{isBlockLocal: false, scope: {}}],

            macroMap: new Map<string, SxMacroInfo>(config.macros.map(x => [x.name, x] as [string, SxMacroInfo])),
            funcMap: new Map<string, SxFuncInfo>(config.funcs.map(x => [x.name, x] as [string, SxFuncInfo])),
            symbolMap: new Map<string, SxSymbolInfo>(config.symbols.map(x => [x.name, x] as [string, SxSymbolInfo])),

            config,
        };

        const s = parse(state);

        if (config.enableEvaluate) {
            for (let i = 0; i < s.length; i++) {
                s[i] = evaluate(state, s[i]);
            }
        }

        if (config.returnMultipleRoot) {
            return s.length === 1 ? s[0] : s;
        } else {
            return s[s.length - 1];
        }
    };
}



export const S = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.enableEvaluate = false;
    config.returnMultipleRoot = true;

    return SExpression(config);
})();



export const L = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    return SExpression(config);
})();

export const LS = L;
export const lisp = L;



export const LM = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.returnMultipleRoot = true;

    return SExpression(config);
})();



export function LSX<R = SxToken>(lsxConf: LsxConfig): (strings: TemplateStringsArray, ...values: any[]) => R {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installJsx(config, lsxConf);

    return SExpression(config) as any;
}
