// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig,
         LsxConfig }        from '../../types';
import operators            from './jsx.operator';
import macros               from './jsx.macro';
import symbols              from './jsx.symbol';

import { $jsxStandardTag,
         $jsxComponentTag } from './jsx.fn';



export default function install(config: SxParserConfig, lsxConf: LsxConfig): SxParserConfig {
    config.funcs = (config.funcs || []).concat(operators);
    config.macros = (config.macros || []).concat(macros);
    config.symbols = (config.symbols || []).concat(symbols);

    const components =
        Object.entries(lsxConf.components)
        .map(x => ({name: x[0], fn: $jsxComponentTag(x[1])}));

    config.funcs = config.funcs.concat(
        {name: config.reservedNames.Template, fn: $jsxComponentTag(lsxConf.jsxFlagment)},
        ...components
    );

    config.funcSymbolResolverFallback = $jsxStandardTag;
    config.jsx = lsxConf.jsx;
    config.JsxFragment = lsxConf.jsxFlagment;

    return config;
}
