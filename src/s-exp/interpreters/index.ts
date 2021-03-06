// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxFuncInfo,
         SxSymbolInfo,
         SxParserConfig,
         SxParserState,
         SxToken,
         SExpressionTemplateFn,
         SExpressionAsyncTemplateFn } from '../types';
import { parse }                      from '../parser';
import { evaluate }                   from '../evaluate';
import { defaultConfig }              from '../defaults';



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


export function SExpressionAsync(conf?: SxParserConfig): SExpressionAsyncTemplateFn {
    let config = conf || Object.assign({}, defaultConfig);
    let globalScope: any = {};
    let startup: SxToken[] = [];

    const exec = async (state: SxParserState, s: SxToken[]) => {
        if (config.enableEvaluate) {
            for (let i = 0; i < s.length; i++) {
                s[i] = evaluate(state, s[i]);

                if (typeof s[i] === 'object' && s[i] !== null && typeof (s[i] as any).then === 'function') {
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
