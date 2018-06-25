// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxFuncInfo,
         SxParserState,
         SxSymbol,
         SxToken }            from './types';
import { evalute,
         resolveValueSymbol,
         installScope,
         uninstallScope,
         getScope }           from './evalute';



export const $car = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = args.slice(0, 1);
    return (car.length === 1) ? car[0] : null;
};
export const $$car = $car(null as any, null as any);


export const $cdr = (state: SxParserState, name: string) => (...args: any[]) => {
    let cdr: any = args.slice(1);
    if (cdr.length === 0) {
        cdr = null;
    } else if (cdr.length === 1) {
        cdr = cdr[0];
    }
    return cdr;
};
export const $$cdr = $cdr(null as any, null as any);


export const $cons = (state: SxParserState, name: string) => (...args: any[]) => {
    let car = args.slice(0, 1);
    car = (car.length === 1) ? car[0] : null;

    let cdr: any = args.slice(1);
    if (cdr.length === 0) {
        cdr = null;
    } else if (cdr.length === 1) {
        cdr = cdr[0];
    }

    return {car, cdr};
};
export const $$cons = $cons(null as any, null as any);


export const $atom = (state: SxParserState, name: string) => (...args: any[]) => {
    let car = args.slice(0, 1);
    car = (car.length === 1) ? car[0] : null;

    if (car === null || car === void 0) {
        return true;
    }

    if (Array.isArray(car)) {
        if (car.length === 0) return  true;
        else                  return false;
    }

    switch (typeof car) {
    case 'number': case 'string': case 'function':
        return true;
    case 'object':
        {
            if (Object.prototype.hasOwnProperty.call(car, 'symbol')) {
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
};
export const $$atom = $atom(null as any, null as any);


export const $eq = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return car === cdr;
};
export const $$eq = $eq(null as any, null as any);


export const $notEq = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return car !== cdr;
};
export const $$notEq = $notEq(null as any, null as any);


export const $list = (state: SxParserState, name: string) => (...args: any[]) =>
    args.slice(0);
export const $$list = $list(null as any, null as any);


// tslint:disable-next-line:variable-name
export const $__scope = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__scope '((name value) ...) 'expr)
    const {car, cdr} = $$cons(...args);
    let r: SxToken;
    try {
        const scope: any = {};
        if (Array.isArray(car)) {
            for (const x of car) {
                const kv = $$cons(...x);
                scope[String(kv.car)] = kv.cdr;
            }
        }
        installScope(state, scope);

        if (2 < args.length) {
            r = [];
            for (const x of cdr) {
                r.push(evalute(state, x));
            }
        } else {
            r = evalute(state, cdr);
        }
    } finally {
        uninstallScope(state);
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__get = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__get 'nameOrIndex1 ... 'nameOrIndexN)
    const {car, cdr} = $$cons(...args);
    const v = resolveValueSymbol(state, {symbol: String(args[0])});
    return v;
};


// tslint:disable-next-line:variable-name
export const $__let = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__let 'name expr)
    const {car, cdr} = $$cons(...args);
    return ['$__let: not impl'];
};


// tslint:disable-next-line:variable-name
export const $__if = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__if cond 'expr)
    //  -> (if cond is true ) S expr  : expr
    //  -> (if cond is false) S expr  : ()
    const {car, cdr} = $$cons(...args);
    let r: SxToken = [];
    if ($$boolean(car)) {
        if (2 < args.length) {
            r.push({symbol: state.config.reservedNames.Template}, ...cdr);
            r = evalute(state, r);
        } else {
            r = evalute(state, cdr);
        }
    }
    return r;
};


// tslint:disable-next-line:variable-name
export const $__for = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: ($__for list 'expr)
    //  -> S expr  : (Template expr ... expr)
    const {car, cdr} = $$cons(...args);
    const r: SxToken[] = [];
    if (Array.isArray(car)) {
        for (let i = 0; i < car.length; i++) {
            const x = car[i];
            const v = $__scope(state, name)([
                ['$data', x],
                ['$index', i],
                ['$parent', getScope(state)],
            ], ...cdr);

            if (2 < args.length && Array.isArray(v)) {
                r.push(...v);
            } else {
                r.push(v);
            }
        }
    }
    // All of r items are already evaluted.
    return evalute(state,
        ([{symbol: state.config.reservedNames.Template}] as SxToken[])
        .concat(r.map(z => [{symbol: state.config.reservedNames.quote}, z])));
};


export const $boolean = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    if (Array.isArray(car) && car.length === 0) return false;
    else return Boolean(car);
};
export const $$boolean = $boolean(null as any, null as any);


export const $not = (state: SxParserState, name: string) => (...args: any[]) => {
    return ! $$boolean(...args);
};
export const $$not = $not(null as any, null as any);


export const $and = (state: SxParserState, name: string) => (...args: any[]) =>
    (args as any[]).reduce((prev, curr) => prev && curr, true);
export const $$and = $and(null as any, null as any);


export const $or = (state: SxParserState, name: string) => (...args: any[]) =>
    (args as any[]).reduce((prev, curr) => prev || curr, false);
export const $$or = $or(null as any, null as any);


export const $bitNot = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return ~Number(car);
};
export const $$bitNot = $bitNot(null as any, null as any);


export const $bitAnd = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) & Number(curr), Number(car));
};
export const $$bitAnd = $bitAnd(null as any, null as any);


export const $bitOr = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) | Number(curr), Number(car));
};
export const $$bitOr = $bitOr(null as any, null as any);


export const $bitXor = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) ^ Number(curr), Number(car));
};
export const $$bitXor = $bitXor(null as any, null as any);


export const $ambiguousEq = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    if (Array.isArray(car) && car.length === 0 &&
        Array.isArray(cdr) && cdr.length === 0) return true;
    // tslint:disable-next-line:triple-equals
    else return car == cdr;
};
export const $$ambiguousEq = $ambiguousEq(null as any, null as any);


export const $ambiguousNotEq = (state: SxParserState, name: string) => (...args: any[]) => {
    return ! $$ambiguousEq(...args);
};
export const $$ambiguousNotEq = $ambiguousNotEq(null as any, null as any);


export const $lt = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return Number(car) < Number(cdr);
};
export const $$lt = $lt(null as any, null as any);


export const $le = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return Number(car) <= Number(cdr);
};
export const $$le = $le(null as any, null as any);


export const $gt = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return Number(car) > Number(cdr);
};
export const $$gt = $gt(null as any, null as any);


export const $ge = (state: SxParserState, name: string) => (...args: any[]) => {
    const {car, cdr} = $$cons(...args);
    return Number(car) >= Number(cdr);
};
export const $$ge = $ge(null as any, null as any);


export const $add = (state: SxParserState, name: string) => (...args: any[]) =>
    args.reduce((prev, curr) => Number(prev) + Number(curr), 0);
export const $$add = $add(null as any, null as any);


export const $sub = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    const last = args.slice(1);
    if (last.length === 0) {
        // negate
        return -Number(car);
    } else {
        // subtract
        return args.slice(1).reduce((prev, curr) => Number(prev) - Number(curr), Number(car));
    }
};
export const $$sub = $sub(null as any, null as any);


export const $mul = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) * Number(curr), Number(car));
};
export const $$mul = $mul(null as any, null as any);


export const $sup = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) ** Number(curr), Number(car));
};
export const $$sup = $sup(null as any, null as any);


export const $div = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) / Number(curr), Number(car));
};
export const $$div = $div(null as any, null as any);


export const $mod = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return args.slice(1).reduce((prev, curr) => Number(prev) % Number(curr), Number(car));
};
export const $$mod = $mod(null as any, null as any);


export const $toString = (state: SxParserState, name: string) => (...args: any[]) => {
    return String($$car(...args));
};
export const $$toString = $toString(null as any, null as any);


export const $toNumber = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number($$car(...args));
};
export const $$toNumber = $toNumber(null as any, null as any);


export const $isNaN = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isNaN(Number($$car(...args)));
};
export const $$isNaN = $isNaN(null as any, null as any);


export const $isFinite = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isFinite(Number($$car(...args)));
};
export const $$isFinite = $isFinite(null as any, null as any);


export const $isInteger = (state: SxParserState, name: string) => (...args: any[]) => {
    return Number.isInteger(Number($$car(...args)));
};
export const $$isInteger = $isInteger(null as any, null as any);


export const $floor = (state: SxParserState, name: string) => (...args: any[]) => {
    return Math.floor(Number($$car(...args)));
};
export const $$floor = $floor(null as any, null as any);


export const $ceil = (state: SxParserState, name: string) => (...args: any[]) => {
    return Math.ceil(Number($$car(...args)));
};
export const $$ceil = $ceil(null as any, null as any);


export const $concat = (state: SxParserState, name: string) => (...args: any[]) => {
    const car = $$car(...args);
    return car.concat(...args.slice(1));
};
export const $$concat = $concat(null as any, null as any);


export const $slice = (state: SxParserState, name: string) => (...args: any[]) =>
    args.slice(2).slice(Number(args[0]), Number(args[1]));
export const $$slice = $slice(null as any, null as any);


export const $jsxListToProps = (state: SxParserState, name: string) => (...args: any[]) => {
    // S expression: (@ (name value...)...)
    //  -> JSON    : {name: value, ...}
    const r: any = {};
    for (const x of args) {
        if (Array.isArray(x) && 0 < x.length) {
            if (Object.prototype.hasOwnProperty.call(x[0], 'symbol')) {
                const keyName = (x[0] as SxSymbol).symbol;
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
                                    if (Object.prototype.hasOwnProperty.call(s[0], 'symbol')) {
                                        styles[String(evalute(state, s[0]))] = String(evalute(state, s[1]));
                                    }
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
                case 'class': case 'className': case 'styleClass':
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
                                    classes = classes.concat(c.map(z => evalute(state, z)));
                                } else if (typeof c === 'string') {
                                    classes = classes.concat(c.split(' '));
                                }
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
                            r[keyName] = {__html: evalute(state, x[1])};
                        } else {
                            r[keyName] = {__html:
                                evalute(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
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
                            r[keyName] = evalute(state, x[1]);
                        } else {
                            // S expression: (@ ... (keyName value1 value2 ...) ...)
                            //  -> JSON    : {..., keyName: [value1, value2, ], ...}
                            r[keyName] =
                                evalute(state, ([{symbol: state.config.reservedNames.list}] as SxToken[])
                                .concat(x.slice(1)));
                        }
                    }
                    break;
                }
            }
        }
    }
    return r;
};
export const $$jsxListToProps = $jsxListToProps(null as any, null as any);


function getJsxTagsParams(state: SxParserState, ...args: any[]) {
    let children = args;
    let props: any = {};
    if (0 < args.length && Array.isArray(args[0]) &&
        typeof args[0][0] === 'object' && Object.prototype.hasOwnProperty.call(args[0][0], 'symbol')) {

        if (args[0][0].symbol === '@') {
            props = $jsxListToProps(state, '')(...args[0].slice(1));
            children = children.slice(1);
        }
    }
    return {props, children};
}


export const $jsxStandardTag = (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(name, props, ...children);
};
export const $$jsxStandardTag = $jsxStandardTag(null as any, null as any);


export const $$jsxComponentTag = (component: any) => (state: SxParserState, name: string) => (...args: any[]) => {
    const {props, children} = getJsxTagsParams(state, ...args);
    return (state.config.jsx as any)(component, props, ...children);
};



export const funcs: SxFuncInfo[] = [{
    name: '$car',
    fn: $car,
}, {
    name: '$cdr',
    fn: $cdr,
}, {
    name: '$cons',
    fn: $cons,
}, {
    name: '$atom',
    fn: $atom,
}, {
    name: '$eq',
    fn: $eq,
}, {
    name: '$notEq',
    fn: $notEq,
}, {
    name: '$list',
    fn: $list,
}, {
    name: '$__scope',
    fn: $__scope,
}, {
    name: '$__get',
    fn: $__get,
}, {
    name: '$__let',
    fn: $__let,
}, {
    name: '$__if',
    fn: $__if,
}, {
    name: '$__for',
    fn: $__for,
}, {
    name: '$boolean',
    fn: $boolean,
}, {
    name: '$not',
    fn: $not,
}, {
    name: '$and',
    fn: $and,
}, {
    name: '$or',
    fn: $or,
}, {
    name: '$bitNot',
    fn: $bitNot,
}, {
    name: '$bitAnd',
    fn: $bitAnd,
}, {
    name: '$bitOr',
    fn: $bitOr,
}, {
    name: '$bitXor',
    fn: $bitXor,
}, {
    name: '==',
    fn: $ambiguousEq,
}, {
    name: '!=',
    fn: $ambiguousNotEq,
}, {
    name: '<',
    fn: $lt,
}, {
    name: '<=',
    fn: $le,
}, {
    name: '>',
    fn: $gt,
}, {
    name: '>=',
    fn: $ge,
}, {
    name: '+',
    fn: $add,
}, {
    name: '$add',
    fn: $add,
}, {
    name: '-',
    fn: $sub,
}, {
    name: '$sub',
    fn: $sub,
}, {
    name: '*',
    fn: $mul,
}, {
    name: '$mul',
    fn: $mul,
}, {
    name: '**',
    fn: $sup,
}, {
    name: '$sup',
    fn: $sup,
}, {
    name: '/',
    fn: $div,
}, {
    name: '$div',
    fn: $div,
}, {
    name: '%',
    fn: $mod,
}, {
    name: '$mod',
    fn: $mod,
}, {
    name: '$toString',
    fn: $toString,
}, {
    name: '$toNumber',
    fn: $toNumber,
}, {
    name: '$isNaN',
    fn: $isNaN,
}, {
    name: '$isFinite',
    fn: $isFinite,
}, {
    name: '$isInteger',
    fn: $isInteger,
}, {
    name: '$floor',
    fn: $floor,
}, {
    name: '$ceil',
    fn: $ceil,
}, {
    name: '$concat',
    fn: $concat,
}, {
    name: '$slice',
    fn: $slice,
}];

