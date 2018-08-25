// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig } from '../../types';
import operators          from './arithmetic.operator';
import macros             from './arithmetic.macro';
import symbols            from './arithmetic.symbol';



export default function install(config: SxParserConfig): SxParserConfig {
    config.funcs = (config.funcs || []).concat(operators);
    config.macros = (config.macros || []).concat(macros);
    config.symbols = (config.symbols || []).concat(symbols);
    return config;
}
