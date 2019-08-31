// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig }       from '../../types';
import { operators,
         compilationOperators } from './core.operator';
import { macros,
         compilationMacros }    from './core.macro';
import symbols                  from './core.symbol';



export default function install(config: SxParserConfig): SxParserConfig {
    config.funcs = (config.funcs || [])
        .concat(operators)
        .concat(config.enableCompilationOperators ? compilationOperators : []);
    config.macros = (config.macros || [])
        .concat(macros)
        .concat(config.enableCompilationOperators ? compilationMacros : []);
    config.symbols = (config.symbols || []).concat(symbols);
    return config;
}
