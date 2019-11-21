// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig,
         SxToken,
         LsxConfig,
         SExpressionTemplateFn,
         SExpressionAsyncTemplateFn } from './types';
import installCore          from './operators/core';
import installArithmetic    from './operators/arithmetic';
import installSequence      from './operators/sequence';
import installJsx           from './operators/jsx';
import installConcurrent    from './operators/concurrent';
import { SExpression,
         SExpressionAsync } from './interpreter';
export { SExpression,
         SExpressionAsync };
import { defaultReservedNames,
         defaultConfig }    from './defaults';
export { defaultReservedNames,
         defaultConfig };



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
    config = installConcurrent(config);

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
    config = installConcurrent(config);

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
