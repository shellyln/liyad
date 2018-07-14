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



function initState(config: SxParserConfig, globals: any, strings: TemplateStringsArray | string, values?: any[]): SxParserState {
    return {
        strings: typeof strings === 'string' ? [strings] : strings,
        values: values || [],

        index: 0,
        pos: 0,
        line: 0,

        scopes: [{isBlockLocal: false, scope: globals}],

        macroMap: new Map<string, SxMacroInfo>(config.macros.map(x => [x.name, x] as [string, SxMacroInfo])),
        funcMap: new Map<string, SxFuncInfo>(config.funcs.map(x => [x.name, x] as [string, SxFuncInfo])),
        symbolMap: new Map<string, SxSymbolInfo>(config.symbols.map(x => [x.name, x] as [string, SxSymbolInfo])),

        config,
    };
}



interface SExpressionTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): R;
    setGlobals: (globals: object) => SExpressionTemplateFn<R>;
    setStartup: (code: string) => SExpressionTemplateFn<R>;
}

export function SExpression(config: SxParserConfig): SExpressionTemplateFn {
    let globalScope: any = {};
    let startup: SxToken[] = [];

    const f: SExpressionTemplateFn = ((strings: TemplateStringsArray, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);

        const s = startup.concat(parse(state));

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
    }) as any;

    f.setGlobals = (globals: object) => {
        globalScope = Object.assign({}, globals || {});
        return f;
    };
    f.setStartup = (code: string) => {
        const state = initState(config, Object.assign({}, globalScope), code, void 0);
        startup = parse(state);
        return f;
    };

    return f;
}



interface SExpressionAsyncTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): Promise<R>;
    setGlobals: (globals: object) => SExpressionAsyncTemplateFn<R>;
    setStartup: (code: string) => SExpressionAsyncTemplateFn<R>;
}

export function SExpressionAsync(config: SxParserConfig): SExpressionAsyncTemplateFn {
    let globalScope: any = {};
    let startup: SxToken[] = [];

    const f: SExpressionAsyncTemplateFn = (async (strings: TemplateStringsArray, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);

        const s = startup.concat(parse(state));

        if (config.enableEvaluate) {
            for (let i = 0; i < s.length; i++) {
                s[i] = evaluate(state, s[i]);

                if (typeof s[i] === 'object' && typeof (s[i] as any).then === 'function') {
                    s[i] = await s[i];
                }
            }
        }

        if (config.returnMultipleRoot) {
            return s.length === 1 ? s[0] : s;
        } else {
            return s[s.length - 1];
        }
    }) as any;

    f.setGlobals = (globals: object) => {
        globalScope = Object.assign({}, globals || {});
        return f;
    };
    f.setStartup = (code: string) => {
        const state = initState(config, Object.assign({}, globalScope), code, void 0);
        startup = parse(state);
        return f;
    };

    return f;
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



// tslint:disable-next-line:variable-name
export const L_async = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    return SExpressionAsync(config);
})();

// tslint:disable-next-line:variable-name
export const LS_async = L_async;
// tslint:disable-next-line:variable-name
export const lisp_async = L_async;



export const LM = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.returnMultipleRoot = true;

    return SExpression(config);
})();



// tslint:disable-next-line:variable-name
export const LM_async = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.returnMultipleRoot = true;

    return SExpressionAsync(config);
})();



export function LSX<R = SxToken>(lsxConf: LsxConfig): SExpressionTemplateFn<R> {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installJsx(config, lsxConf);

    return SExpression(config) as any;
}



export function LSX_async<R = SxToken>(lsxConf: LsxConfig): SExpressionAsyncTemplateFn<R> {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installJsx(config, lsxConf);

    return SExpressionAsync(config) as any;
}
