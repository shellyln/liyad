// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserConfig } from '../../types';
import { SExpression }    from '../../interpreters';
import { defaultConfig }  from '../../defaults';



export const S = (() => {
    const config: SxParserConfig = Object.assign({}, defaultConfig);

    config.enableEvaluate = false;
    config.returnMultipleRoot = true;

    return SExpression(config);
})();
