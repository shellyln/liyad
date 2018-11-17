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
import { evaluate }         from './evaluate';
import installCore          from './operators/core';
import installArithmetic    from './operators/arithmetic';
import installSequence      from './operators/sequence';
import installJsx           from './operators/jsx';
import installConcurrent    from './operators/concurrent';



export const defaultReservedNames: SxReservedNames = {
    eval: '$eval',
    quote: '$quote',
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

    Template: 'Template',
};

export const defaultConfig: SxParserConfig = {
    raiseOnUnresolvedSymbol: false,
    enableEvaluate: true,
    enableHereDoc: true,
    enableSpread: true,
    enableSplice: true,
    enableShorthands: true,
    enableTailCallOptimization: true,
    stripComments: false,
    wrapExternalValue: true,
    returnMultipleRoot: false,
    maxEvalCount: 0,

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

        evalCount: 0,

        scopes: [{isBlockLocal: false, scope: globals}],

        macroMap: new Map<string, SxMacroInfo>(config.macros.map(x => [x.name, x] as [string, SxMacroInfo])),
        funcMap: new Map<string, SxFuncInfo>(config.funcs.map(x => [x.name, x] as [string, SxFuncInfo])),
        symbolMap: new Map<string, SxSymbolInfo>(config.symbols.map(x => [x.name, x] as [string, SxSymbolInfo])),

        config,
    };
}


function resetState(state: SxParserState, strings: TemplateStringsArray | string, values?: any[]) {
    state.strings = typeof strings === 'string' ? [strings] : strings;
    state.values = values || [];
    state.index = 0;
    state.pos = 0;
    state.line = 0;
    state.evalCount = 0;
    return state;
}



interface SExpressionRepl<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): R;
    sync: (strings: TemplateStringsArray | string, ...values: any[]) => R;
}

interface SExpressionTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): R;
    evaluateAST: (ast: SxToken[]) => R;
    repl: () => SExpressionRepl<R>;
    setGlobals: (globals: object) => SExpressionTemplateFn<R>;
    appendGlobals: (globals: object) => SExpressionTemplateFn<R>;
    setStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionTemplateFn<R>;
    setStartupAST: (ast: SxToken[]) => SExpressionTemplateFn<R>;
    appendStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionTemplateFn<R>;
    appendStartupAST: (ast: SxToken[]) => SExpressionTemplateFn<R>;
    install: (installer: (config: SxParserConfig) => SxParserConfig) => SExpressionTemplateFn<R>;
}

export function SExpression(conf?: SxParserConfig): SExpressionTemplateFn {
    let config = conf || Object.assign({}, defaultConfig);
    let globalScope: any = {};
    let startup: SxToken[] = [];

    const exec = (state: SxParserState, s: SxToken[]) => {
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

    const f: SExpressionTemplateFn = ((strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        return exec(state, startup.concat(parse(state)));
    }) as any;

    f.evaluateAST = (ast: SxToken[]) => {
        const state = initState(config, Object.assign({}, globalScope), '');
        return exec(state, startup.concat(ast));
    };
    (f as any).repl = () => {
        const state = initState(config, Object.assign({}, globalScope), '');
        exec(state, startup.slice(0));
        const fRepl: SExpressionTemplateFn = ((strings: TemplateStringsArray | string, ...values: any[]) => {
            resetState(state, strings, values);
            return exec(state, parse(state));
        }) as any;
        (fRepl as any).sync = fRepl;
        return fRepl;
    };
    f.setGlobals = (globals: object) => {
        globalScope = Object.assign({}, globals || {});
        return f;
    };
    f.appendGlobals = (globals: object) => {
        globalScope = Object.assign({}, globalScope, globals || {});
        return f;
    };
    f.setStartup = (strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        startup = parse(state);
        return f;
    };
    f.setStartupAST = (ast: SxToken[]) => {
        startup = ast;
        return f;
    };
    f.appendStartup = (strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        startup = startup.concat(parse(state));
        return f;
    };
    f.appendStartupAST = (ast: SxToken[]) => {
        startup = startup.concat(ast);
        return f;
    };
    f.install = (installer) => {
        config = installer(config);
        return f;
    };

    return f;
}


interface SExpressionAsyncRepl<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): Promise<R>;
    sync: (strings: TemplateStringsArray | string, ...values: any[]) => Promise<R>;
}

interface SExpressionAsyncTemplateFn<R = SxToken> {
    (strings: TemplateStringsArray | string, ...values: any[]): Promise<R>;
    evaluateAST: (ast: SxToken[]) => Promise<R>;
    repl: () => SExpressionAsyncRepl<R>;
    setGlobals: (globals: object) => SExpressionAsyncTemplateFn<R>;
    appendGlobals: (globals: object) => SExpressionAsyncTemplateFn<R>;
    setStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionAsyncTemplateFn<R>;
    setStartupAST: (ast: SxToken[]) => SExpressionAsyncTemplateFn<R>;
    appendStartup: (strings: TemplateStringsArray | string, ...values: any[]) => SExpressionAsyncTemplateFn<R>;
    appendStartupAST: (ast: SxToken[]) => SExpressionAsyncTemplateFn<R>;
    install: (installer: (config: SxParserConfig) => SxParserConfig) => SExpressionAsyncTemplateFn<R>;
}

export function SExpressionAsync(conf?: SxParserConfig): SExpressionAsyncTemplateFn {
    let config = conf || Object.assign({}, defaultConfig);
    let globalScope: any = {};
    let startup: SxToken[] = [];

    const exec = async (state: SxParserState, s: SxToken[]) => {
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
    };

    const f: SExpressionAsyncTemplateFn = (async (strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        return exec(state, startup.concat(parse(state)));
    }) as any;

    f.evaluateAST = (ast: SxToken[]) => {
        const state = initState(config, Object.assign({}, globalScope), '');
        return exec(state, startup.concat(ast));
    };
    (f as any).repl = () => {
        const execSync = (stat: SxParserState, s: SxToken[]) => {
            if (config.enableEvaluate) {
                for (let i = 0; i < s.length; i++) {
                    s[i] = evaluate(stat, s[i]);
                }
            }

            if (config.returnMultipleRoot) {
                return s.length === 1 ? s[0] : s;
            } else {
                return s[s.length - 1];
            }
        };
        const state = initState(config, Object.assign({}, globalScope), '');
        exec(state, startup.slice(0));
        const fRepl: SExpressionAsyncTemplateFn = (async (strings: TemplateStringsArray | string, ...values: any[]) => {
            resetState(state, strings, values);
            return exec(state, parse(state));
        }) as any;
        const fReplSync: SExpressionTemplateFn = ((strings: TemplateStringsArray | string, ...values: any[]) => {
            resetState(state, strings, values);
            return execSync(state, parse(state));
        }) as any;
        (fRepl as any).sync = fReplSync;
        return fRepl;
    };
    f.setGlobals = (globals: object) => {
        globalScope = Object.assign({}, globals || {});
        return f;
    };
    f.appendGlobals = (globals: object) => {
        globalScope = Object.assign({}, globalScope, globals || {});
        return f;
    };
    f.setStartup = (strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        startup = parse(state);
        return f;
    };
    f.setStartupAST = (ast: SxToken[]) => {
        startup = ast;
        return f;
    };
    f.appendStartup = (strings: TemplateStringsArray | string, ...values: any[]) => {
        const state = initState(config, Object.assign({}, globalScope), strings, values);
        startup = startup.concat(parse(state));
        return f;
    };
    f.appendStartupAST = (ast: SxToken[]) => {
        startup = startup.concat(ast);
        return f;
    };
    f.install = (installer) => {
        config = installer(config);
        return f;
    };

    return f;
}



export const S = (() => {
    const config: SxParserConfig = Object.assign({}, defaultConfig);

    config.enableEvaluate = false;
    config.returnMultipleRoot = true;

    return SExpression(config);
})();



export const L = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);
    config.reservedNames = Object.assign({}, config.reservedNames, {
        Template: '$concat',
    });

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.stripComments = true;

    return SExpression(config);
})();

export const LS = L;
export const lisp = L;



// tslint:disable-next-line:variable-name
export const L_async = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);
    config.reservedNames = Object.assign({}, config.reservedNames, {
        Template: '$concat',
    });

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installConcurrent(config);

    config.stripComments = true;

    return SExpressionAsync(config);
})();

// tslint:disable-next-line:variable-name
export const LS_async = L_async;
// tslint:disable-next-line:variable-name
export const lisp_async = L_async;



export const LM = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);
    config.reservedNames = Object.assign({}, config.reservedNames, {
        Template: '$concat',
    });

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);

    config.stripComments = true;
    config.returnMultipleRoot = true;

    return SExpression(config);
})();



// tslint:disable-next-line:variable-name
export const LM_async = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);
    config.reservedNames = Object.assign({}, config.reservedNames, {
        Template: '$concat',
    });

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installConcurrent(config);

    config.stripComments = true;
    config.returnMultipleRoot = true;

    return SExpressionAsync(config);
})();



export function LSX<R = SxToken>(lsxConf: LsxConfig): SExpressionTemplateFn<R> {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installJsx(config, lsxConf);

    config.stripComments = true;

    return SExpression(config) as any;
}



export function LSX_async<R = SxToken>(lsxConf: LsxConfig): SExpressionAsyncTemplateFn<R> {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installConcurrent(config);
    config = installJsx(config, lsxConf);

    config.stripComments = true;

    return SExpressionAsync(config) as any;
}
