// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig,
         SxToken,
         LsxConfig,
         SExpressionTemplateFn,
         SExpressionAsyncTemplateFn } from '../../types';
import installCore          from '../../operators/core';
import installArithmetic    from '../../operators/arithmetic';
import installSequence      from '../../operators/sequence';
import installJsx           from '../../operators/jsx';
import installConcurrent    from '../../operators/concurrent';
import { SExpression,
         SExpressionAsync } from '../../interpreters';
import { defaultConfig }    from '../../defaults';



export function LSX<R = SxToken>(lsxConf: LsxConfig): SExpressionTemplateFn<R> {
    let config: SxParserConfig = Object.assign({}, defaultConfig);

    config = installCore(config);
    config = installArithmetic(config);
    config = installSequence(config);
    config = installConcurrent(config);
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
