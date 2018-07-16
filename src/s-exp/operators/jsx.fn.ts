// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxToken,
         quote,
         isSymbol }  from '../types';
import { evaluate,
         getScope }  from '../evaluate';
import { $$first,
         $$firstAndSecond,
         $__scope,
         $$boolean } from './core.fn';



// tslint:disable-next-line:variable-name
export const $__outputIf = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__outputIf cond 'expr)
    //  -> (if cond is true ) S expr  : expr
    //  -> (if cond is false) S expr  : ()
    const {car, cdr} = $$firstAndSecond(...args);
    let r: SxToken = [];
    if ($$boolean(car)) {
        if (2 < args.length) {
            r.push({symbol: state.config.reservedNames.Template}, ...args.slice(1));
            r = evaluate(state, r);
        } else {
            r = evaluate(state, cdr);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__outputForOf = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__outputForOf list 'expr)
    //  -> S expr  : (Template expr ... expr)
    const car = $$first(...args);
    const r: SxToken[] = [];
    if (Array.isArray(car)) {
        for (let i = 0; i < car.length; i++) {
            const x = car[i];
            const v = $__scope(state, name)(true, true, [
                ['$data', quote(state, x)],
                ['$index', i],
                ['$parent', getScope(state)],
            ], ...args.slice(1));

            if (2 < args.length && Array.isArray(v)) {
                r.push(...v);
            } else {
                r.push(v);
            }
        }
    }
    // All of r items are already evaluated.
    return evaluate(state,
        ([{symbol: state.config.reservedNames.Template}] as SxToken[])
        .concat(r.map(z => [{symbol: state.config.reservedNames.quote}, z])));
};


export const $jsxProps = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (@ (name value...)...)
    //  -> JSON    : {name: value, ...}
    const r: any = {};
    for (const x of args) {
        if (Array.isArray(x) && 0 < x.length) {
            const sym = isSymbol(x[0]);
            const keyName =
                sym ? sym.symbol :
                String(evaluate(state, x[0]));
            switch (keyName) {
            case 'style':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (style) ...)
                        //  -> JSON    : {..., style: "", ...}
                        r[keyName] = "";
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (style "styleName1: styleValue1; ..." ...) ...)
                        // S expression: (@ ... (style (styleName1 styleValue1) ...) ...)
                        //  -> JSON    : {..., style: {styleName1: styleValue1}, ...}
                        const styles: object = {};
                        for (const s of x.slice(1)) {
                            if (Array.isArray(s) && 1 < s.length) {
                                styles[String(evaluate(state, s[0]))] = String(evaluate(state, s[1]));
                            } else if (typeof s === 'string') {
                                for (const v of s.split(';')) {
                                    const matched = /^\s*(\S+)\s*:\s*(.*?)\s*$/.exec(v);
                                    if (matched) {
                                        styles[matched[1]] = matched[2];
                                    }
                                }
                            }
                        }
                        r[keyName] = styles;
                    }
                }
                break;
            case 'class': case 'styleClass':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (class) ...)
                        //  -> JSON    : {..., class: [], ...}
                        r[keyName] = [];
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (class "className1 className2 ...") ...)
                        // S expression: (@ ... (class (className1 className2 ...)) ...)
                        //  -> JSON    : {..., class: [className1 className2 ...], ...}
                        let classes: any[] = [];
                        for (const c of x.slice(1)) {
                            if (Array.isArray(c)) {
                                classes = classes.concat(c.map(z => evaluate(state, z)));
                            } else if (typeof c === 'string') {
                                classes = classes.concat(c.split(' '));
                            }
                        }
                        r[keyName] = classes.map(c => (c === null || c === void 0) ? "" : String(c));
                    }
                }
                break;
            case 'className':
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (class) ...)
                        //  -> JSON    : {..., class: "", ...}
                        r[keyName] = '';
                    } else if (x.length >= 2) {
                        // S expression: (@ ... (class "className1 className2 ...") ...)
                        // S expression: (@ ... (class (className1 className2 ...)) ...)
                        //  -> JSON    : {..., class: "className1 className2 ...", ...}
                        let classes: string = '';
                        for (const c of x.slice(1)) {
                            let f = '';
                            if (Array.isArray(c)) {
                                f = c
                                    .map(z => evaluate(state, z))
                                    .map(z => (z === null || z === void 0) ? "" : String(z))
                                    .join(' ');
                            } else if (typeof c === 'string') {
                                f = c;
                            }
                            if (0 < classes.length) classes += ' ' + f;
                            else classes = f;
                        }
                        r[keyName] = classes;
                    }
                }
                break;
            case 'dangerouslySetInnerHTML':
                {
                    if (x.length === 1) {
                        r[keyName] = {__html: ''};
                    } else if (x.length >= 2) {
                        r[keyName] = {__html: evaluate(state, x[1])};
                    } else {
                        r[keyName] = {__html:
                            evaluate(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                            .concat(x.slice(1)))
                        };
                    }
                }
                break;
            default:
                {
                    if (x.length === 1) {
                        // S expression: (@ ... (keyName) ...)
                        //  -> JSON    : {..., keyName: true, ...}
                        r[keyName] = true;
                    } else if (x.length === 2) {
                        // S expression: (@ ... (keyName value) ...)
                        //  -> JSON    : {..., keyName: value, ...}
                        r[keyName] = evaluate(state, x[1]);
                    } else {
                        // S expression: (@ ... (keyName value1 value2 ...) ...)
                        //  -> JSON    : {..., keyName: [value1, value2, ], ...}
                        r[keyName] =
                            evaluate(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                            .concat(x.slice(1)));
                    }
                }
                break;
            }
        }
    }
    return r;
};


function getJsxTagsParams(state: SxParserState, ...args: any[]) {
    let children = args;
    let props: any = {};
    if (0 < args.length && Array.isArray(args[0])) {
        const sym = isSymbol(args[0][0], '@');

        if (sym) {
            props = $jsxProps(state, '')(...args[0].slice(1));
            children = children.slice(1);
        }
    }
    return {props, children};
}


export const $jsxStandardTag = (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(name, props, ...children);
};


export const $jsxComponentTag = (component: any) => (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(component, props, ...children);
};
