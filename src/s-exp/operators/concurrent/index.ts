// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig } from '../../types';
import operators          from './concurrent.operator';
import macros             from './concurrent.macro';
import symbols            from './concurrent.symbol';



export default function install(config: SxParserConfig): SxParserConfig {
    config.funcs = (config.funcs || []).concat(operators);
    config.macros = (config.macros || []).concat(macros);
    config.symbols = (config.symbols || []).concat(symbols);
    return config;
}
