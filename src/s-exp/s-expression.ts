// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxFuncInfo,
         SxSymbolInfo,
         SxParserConfig,
         SxParserState,
         SxToken }      from './types';
import { parse }        from './parser';
import { evalute }      from './evalute';
import { macros }       from './macros';
import { funcs, $jsxStandardTag }        from './operators';
import { symbols }      from './symbols';



export function SExpression(config: SxParserConfig): (strings: TemplateStringsArray, ...values: any[]) => SxToken {
    return (strings: TemplateStringsArray, ...values: any[]) => {
        const state: SxParserState = {
            strings,
            values,

            index: 0,
            pos: 0,
            line: 0,

            scopes: [{}],

            macroMap: new Map<string, SxMacroInfo>(config.macros.map(x => [x.name, x] as [string, SxMacroInfo])),
            funcMap: new Map<string, SxFuncInfo>(config.funcs.map(x => [x.name, x] as [string, SxFuncInfo])),
            symbolMap: new Map<string, SxSymbolInfo>(config.symbols.map(x => [x.name, x] as [string, SxSymbolInfo])),

            config,
        };

        const s = parse(state);

        if (config.enableEvalute) {
            for (let i = 0; i < s.length; i++) {
                s[i] = evalute(state, s[i]);
            }
        }

        return s.length === 1 ? s[0] : s;
    };
}



export const S = SExpression({
    raiseOnUnresolvedSymbol: false,
    enableEvalute: false,
    enableHereDoc: true,
    stripComments: false,
    strippedCommentValue: ' ',
    wrapExternalValue: true,

    reservedNames: {
        quote: '$quote',
        eval: '$eval',
        list: '$list',
        Template: '$list',
    },

    macros,
    funcs,
    symbols,
});



export const SS = SExpression({
    raiseOnUnresolvedSymbol: false,
    enableEvalute: true,
    enableHereDoc: true,
    stripComments: false,
    strippedCommentValue: ' ',
    wrapExternalValue: true,

    reservedNames: {
        quote: '$quote',
        eval: '$eval',
        list: '$list',
        Template: '$list',
    },

    macros,
    funcs: funcs.concat({name: 'DIV', fn: $jsxStandardTag}),
    symbols,

    jsx: (comp, props, ...children) => {
        return {
            JSX: 'Debug handler',
            comp,
            props,
            children,
        };
    }
});
