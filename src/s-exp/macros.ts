// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxMacroInfo,
         SxParserState } from './types';



export const macros: SxMacroInfo[] = [{
    name: '@',
    fn: (state: SxParserState, name: string) => (list) => {
        return [{symbol: state.config.reservedNames.quote}, list];
    },
}, {
    name: '$get',
    fn: (state: SxParserState, name: string) => (list) => {
        return [
            {symbol: '$__get'},
            ...(list.slice(1).map(x => [{symbol: state.config.reservedNames.quote}, x])),
        ];
    },
}, {
    name: '$let',
    fn: (state: SxParserState, name: string) => (list) => {
        return [
            {symbol: '$__let'},
            [{symbol: state.config.reservedNames.quote}, list[1]],
            list[2],
        ];
    },
}, {
    name: '$scope',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($scope ((name value) ...) expr)
        //  -> S expr  : ($__scope '((name value) ...) 'expr)
        return [
            {symbol: '$__scope'},
            [{symbol: state.config.reservedNames.quote}, list[1]],
            ...(list.slice(2).map(x => [{symbol: state.config.reservedNames.quote}, x])),
        ];
    },
}, {
    name: '$if',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($if cond expr)
        //  -> S expr  : ($__if cond 'expr)
        return [
            {symbol: '$__if'},
            list[1],
            ...(list.slice(2).map(x => [{symbol: state.config.reservedNames.quote}, x])),
        ];
    },
}, {
    name: '$for',
    fn: (state: SxParserState, name: string) => (list) => {
        // S expression: ($for list expr)
        //  -> S expr  : ($__for list 'expr)
        return [
            {symbol: '$__for'},
            list[1],
            ...(list.slice(2).map(x => [{symbol: state.config.reservedNames.quote}, x])),
        ];
    },
}];
