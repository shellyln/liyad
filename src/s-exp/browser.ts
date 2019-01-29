// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SExpressionTemplateFn,
         SExpressionAsyncTemplateFn } from './types';



export function runScriptTags(lisp: SExpressionTemplateFn | SExpressionAsyncTemplateFn, globals?: object, contentType = 'text/lisp') {
    const codes = document.querySelectorAll(`script[type="${contentType}"]`);
    const cs = [];
    for (let i = 0; i < codes.length; i++) {
        cs.push(codes[i].innerHTML);
    }
    lisp = lisp.appendGlobals(globals || Object.create(null));
    return lisp(cs.join('\n'));
}
