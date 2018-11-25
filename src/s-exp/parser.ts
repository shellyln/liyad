// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxEof,
         SxExternalValue,
         SxSymbol,
         SxDottedFragment,
         SxComment,
         SxToken,
         SxChar,
         quote,
         backquote,
         // wrapByUnquote,
         spread,
         // splice,
         ScriptTerminationError } from './types';



function isEOF(ch: SxChar): boolean {
    return typeof ch === 'object' && Object.prototype.hasOwnProperty.call(ch, 'eof');
}


function isSpace(ch: SxChar): boolean {
    return typeof ch === 'string' && ch.trim().length === 0;
}


function isNumberFirstChar(ch: SxChar): boolean {
    return typeof ch === 'string' && /^[0-9\+\-]$/.test(ch);
}


function isNumberAfterSignChar(ch: SxChar): boolean {
    return typeof ch === 'string' && /^[0-9]$/.test(ch);
}


function isSymbolFirstChar(ch: SxChar): boolean {
    return typeof ch === 'string' &&
        !isSpace(ch) &&
        !isNumberFirstChar(ch);
}



function lookCurrentLineHint(state: SxParserState): string {
    return `line: ${state.line} / strings: ${state.index} / pos: ${state.pos} :${
        state.strings.length > state.index ?
            state.strings[state.index].slice(state.pos, state.pos + 20) : ''}`;
}


function getChar(state: SxParserState, virtualEof?: string[], disableEscape?: boolean): SxChar {
    if (state.strings.length <= state.index) {
        return {eof: true};
    }
    if (state.strings[state.index].length <= state.pos) {
        if ((! state.values) || (state.values.length <= state.index)) {
            state.pos = 0;
            state.index++;
            return getChar(state);
        } else {
            const ch = {value: state.values[state.index]};
            state.pos = 0;
            state.index++;
            return ch;
        }
    }
    if (virtualEof) {
        for (const v of virtualEof) {
            const ch = state.strings[state.index].slice(state.pos, state.pos + v.length);
            if (ch === v) {
                state.pos += v.length;
                state.line += ch.split('\n').length - 1;
                return { eof: false , eofSeq: v };
            }
        }
    }
    {
        let ch = state.strings[state.index].slice(state.pos, state.pos + 1);
        state.pos++;

        if (ch === '\n') {
            state.line++;
        }

        if ((! disableEscape) && ch === '\\') {
            if (state.strings[state.index].length <= state.pos) {
                throw new Error(`[SX] getChar: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
            }
            ch = state.strings[state.index].slice(state.pos, state.pos + 1);
            state.pos++;

            switch (ch) {
            case 'b':
                ch = '\b';
                break;
            case 't':
                ch = '\t';
                break;
            case 'n':
                ch = '\n';
                break;
            case 'v':
                ch = '\v';
                break;
            case 'f':
                ch = '\f';
                break;
            case 'r':
                ch = '\r';
                break;
            case 'U': case 'u':
                {
                    if (state.strings[state.index].slice(state.pos, state.pos + 1) === '{') {
                        let ch1 = '';
                        for (let i = 0; i < 6; i++) {
                            const ch2 = state.strings[state.index].slice(state.pos + i, state.pos + 1 + i);
                            if (ch2 === '}') {
                                if (i === 0) {
                                    throw new Error(`[SX] getChar: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                                }
                                state.pos += i;
                                break;
                            } else if (! /^[0-9A-Fa-f]{1}$/.test(ch1)) {
                                throw new Error(`[SX] getChar: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                            }
                            ch1 += ch2;
                        }
                        if (state.strings[state.index].slice(state.pos, state.pos + 1) !== '}') {
                            throw new Error(`[SX] getChar: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                        }
                        state.pos++;
                        ch = String.fromCodePoint(Number.parseInt(ch1, 16));
                    } else {
                        const ch1 = state.strings[state.index].slice(state.pos, state.pos + 4);
                        if (! /^[0-9A-Fa-f]{4}$/.test(ch1)) {
                            throw new Error(`[SX] getChar: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                        }
                        state.pos += 4;
                        ch = String.fromCodePoint(Number.parseInt(ch1, 16));
                    }
                }
                break;
            }
        }
        return ch;
    }
}


function lookAheads(state: SxParserState, n: number, virtualEof?: string[], disableEscape?: boolean): SxChar[] {
    const index = state.index;
    const pos = state.pos;
    const line = state.line;
    const chs: SxChar[] = [];

    try {
        for (let i = 0; i < n; i++) {
            chs.push(getChar(state, virtualEof, disableEscape));
        }
    } finally {
        state.index = index;
        state.pos = pos;
        state.line = line;
    }

    return chs;
}


function lookAhead(state: SxParserState, virtualEof?: string[], disableEscape?: boolean): SxChar {
    const index = state.index;
    const pos = state.pos;
    const line = state.line;
    let ch: SxChar;

    try {
        ch = getChar(state, virtualEof, disableEscape);
    } finally {
        state.index = index;
        state.pos = pos;
        state.line = line;
    }

    return ch;
}


function skipWhitespaces(state: SxParserState): void {
    let ch = lookAhead(state);
    while (!isEOF(ch) && isSpace(ch)) {
        getChar(state);
        ch = lookAhead(state);
    }
}



function parseNumber(state: SxParserState, virtualEof?: string[]): number {
    let s = '';
    let ch = lookAhead(state, virtualEof);

    while (! isEOF(ch)) {
        if (typeof ch === 'string') {
            if (/^0[XxOoBb][0-9]*$/.test(s + ch)) {
                getChar(state, virtualEof);
                s += ch;
            } else if (/^[0-9\+\-\.EeInfinityNaN]+$/.test(s + ch)) {
                getChar(state, virtualEof);
                s += ch;
            } else {
                break;
            }
        } else {
            break;
        }

        ch = lookAhead(state, virtualEof);
    }

    if (! /^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)|(0[XxOoBb][0-9]+)|([\+\-]Infinity)|(NaN)$/.test(s)) {
        throw new Error(`[SX] parseNumber: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
    }
    return Number(s);
}


function parseSymbol(state: SxParserState, virtualEof?: string[]): SxSymbol | number | null {
    let s = '';
    let ch = lookAhead(state, virtualEof);

    while (! isEOF(ch)) {
        if (typeof ch === 'string') {
            if (isSpace(ch)) {
                break;
            } else if (ch === '#' && lookAheads(state, 2, virtualEof)[1] === '|') {
                break;
            } else if (/^[^.;()"]+$/.test(s + ch)) {
                getChar(state, virtualEof);
                s += ch;
            } else {
                break;
            }
        } else {
            if (typeof ch === 'object' && Object.prototype.hasOwnProperty.call(ch, 'value')) {
                getChar(state, virtualEof);
                const v = (ch as SxExternalValue).value;
                s += String(ch);
            } else {
                throw new Error(`[SX] parseSymbol: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
            }
        }

        ch = lookAhead(state, virtualEof);
    }

    if (state.config.enableShorthands) {
        let m: RegExpMatchArray | null = null;
        // tslint:disable-next-line:no-conditional-assignment
        if (m = s.match(/^::([^=:][^=]+)=$/)) {
            // ::foo:bar:baz= -> ($splice ($set (foo bar baz)))
            const ws = m[1].split(':');
            const z =
                [{symbol: state.config.reservedNames.splice},
                    [{symbol: state.config.reservedNames.set},
                        ws
                    ]
                ];
            return z as any;
        }
        // tslint:disable-next-line:no-conditional-assignment
        else if (m = s.match(/^::([^@:][^@]+)@([^@:]+)$/)) {
            // ::foo:bar@baz -> ($splice ($call ($get foo bar) baz))
            const ws = m[1].split(':');
            const z =
                [{symbol: state.config.reservedNames.splice},
                    [{symbol: state.config.reservedNames.call},
                        [{symbol: state.config.reservedNames.get}, ...ws],
                        {symbol: m[2]},
                    ]
                ];
            return z as any;
        }
        // tslint:disable-next-line:no-conditional-assignment
        else if (m = s.match(/^::([^:].+)$/)) {
            // ::foo:bar:baz -> ($get foo bar baz)
            const ws = m[1].split(':');
            const z = [{symbol: state.config.reservedNames.get}, ...ws];
            return z as any;
        }
    }

    return {symbol: s};
}


function parseStringOrComment(
        state: SxParserState, eof: string[],
        valuesStartSeq: string | null ,
        valuesStopChar: string,
        disableEscape: boolean
    ): { strings: string[], values: any[] } {

    const eofSeqs = valuesStartSeq ? [...eof, valuesStartSeq] : eof;
    const strings: string[] = [];
    const values: any[] = [];

    for (;;) {
        let s = '';
        let ch = lookAhead(state, eofSeqs, disableEscape);

        while (! isEOF(ch)) {
            if (typeof ch === 'string') {
                getChar(state, eofSeqs, disableEscape);
                s += ch;
            } else {
                if (typeof ch === 'object' && Object.prototype.hasOwnProperty.call(ch, 'value')) {
                    getChar(state, eofSeqs, disableEscape);
                    const v = (ch as SxExternalValue).value;
                    s += String(ch);
                } else {
                    throw new Error(`[SX] parseStringOrComment: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                }
            }

            ch = lookAhead(state, eofSeqs, disableEscape);
        }

        getChar(state, eofSeqs, disableEscape);

        if ((ch as SxEof).eof === true) {
            throw new ScriptTerminationError('parseStringOrComment');
        }

        strings.push(s);

        if ((ch as SxEof).eofSeq === valuesStartSeq) {
            values.push(parseList(state, valuesStopChar, []));
        } else {
            break;
        }
    }

    return { strings, values };
}


function parseString(state: SxParserState, disableEscape: boolean): string {
    return parseStringOrComment(state, ['"'], null, ')', disableEscape).strings[0];
}


function parseHereDoc(state: SxParserState, symbol: SxSymbol, attrs: SxToken[] | null): SxToken[] {
    const q: SxToken[] = [symbol];

    if (attrs) {
        q.push(attrs);
    }

    const inner = parseStringOrComment(state, ['"""'], '%%%(', ')', false);
    for (let i = 0; i < inner.strings.length; i++) {
        q.push(inner.strings[i]);
        if (i < inner.values.length) {
            q.push(inner.values[i]);
        }
    }

    return q;
}


function parseSingleLineComment(state: SxParserState): SxComment | ' ' {
    return {
        comment: parseStringOrComment(state, ['\r', '\n'], null, ')', false).strings[0]
    };
}


function parseMultiLineComment(state: SxParserState): SxComment | ' ' {
    return {
        comment: parseStringOrComment(state, ['|#'], null, ')', false).strings[0]
    };
}


function parseOneToken(state: SxParserState): SxToken {
    skipWhitespaces(state);
    let ch = lookAhead(state);

    while (! isEOF(ch)) {
        switch (ch) {
        case ')':
            throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);

        case '(':
            getChar(state);
            return parseList(state, ')', []);

        case "'": case "`":
            {
                getChar(state);
                skipWhitespaces(state);
                return (ch === "'" ? quote : backquote)(state, parseOneToken(state));
            }

        case ".":
            {
                getChar(state);
                const aheads = lookAheads(state, 2);
                if (state.config.enableSpread && aheads[0] === '.' && aheads[1] === '.') {
                    getChar(state);
                    getChar(state);
                    skipWhitespaces(state);
                    return spread(state, parseOneToken(state));
                } else {
                    skipWhitespaces(state);
                    return {dotted: parseOneToken(state)};
                }
            }

        case ';':
            getChar(state);
            return parseSingleLineComment(state);

        case '#':
            {
                const aheads = lookAheads(state, 2);
                if (aheads[1] === '|') {
                    getChar(state);
                    getChar(state);
                    return parseMultiLineComment(state);
                } else {
                    return parseSymbol(state);
                }
            }

        case '"':
            {
                getChar(state);
                const aheads = lookAheads(state, 4);
                if (state.config.enableHereDoc && aheads[0] === '"' && aheads[1] === '"') {
                    let isHereDoc = true;
                    if (isEOF(aheads[2]) || isSpace(aheads[2])) {
                        // here doc
                    } else if (isNumberFirstChar(aheads[2])) { // TODO: single +/- char is a symbol.
                        if (aheads[2] === '+' || aheads[2] === '-') {
                            if (! isNumberAfterSignChar(aheads[3])) {
                                isHereDoc = false;
                            }
                        }
                        // here doc
                    } else if (isSymbolFirstChar(aheads[2])) {
                        isHereDoc = false;
                    } else {
                        // here doc
                    }
                    getChar(state);
                    getChar(state);

                    let sym: SxSymbol | number | null = null;
                    let attrs: SxToken[] | null = null;
                    if (isHereDoc) {
                        sym = {symbol: state.config.reservedNames.Template};
                    } else {
                        sym = parseSymbol(state, ['@']);
                        if (sym === null) {
                            throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                        }
                        if (typeof sym === 'number') {
                            throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                        }
                        const ahs = lookAheads(state, 2);
                        if (ahs[0] === '@') {
                            if (ahs[1] !== '{') {
                                throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                            }
                            getChar(state);
                            getChar(state);
                            const a = parseList(state, '}', [{symbol: '@'}]);
                            if (Array.isArray(a)) {
                                attrs = a;
                            }
                        }
                    }

                    return parseHereDoc(state, sym, attrs);
                } else {
                    return parseString(state, false);
                }
            }

        case '@':
            if (state.config.enableVerbatimStringLiteral) {
                const aheads = lookAheads(state, 2);
                if (aheads[1] === '"') {
                    getChar(state);
                    getChar(state);
                    return parseString(state, true);
                }
            }
            // FALL_THRU

        default:
            if (typeof ch !== 'string') {
                if (typeof ch === 'object' && Object.prototype.hasOwnProperty.call(ch, 'value')) {
                    getChar(state);
                    return state.config.wrapExternalValue ? ch : (ch as SxExternalValue).value;
                } else {
                    throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                }
            } else if (isSpace(ch)) {
                break;
            } else if (isNumberFirstChar(ch)) { // TODO: single +/- char is a symbol.
                if (ch === '+' || ch === '-') {
                    const aheads = lookAheads(state, 2);
                    if (! isNumberAfterSignChar(aheads[1])) {
                        return parseSymbol(state);
                    }
                }
                return parseNumber(state);
            } else if (isSymbolFirstChar(ch)) {
                return parseSymbol(state);
            } else {
                throw new Error(`[SX] parseOneToken: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
            }
        }

        skipWhitespaces(state);
        ch = lookAhead(state);
    }

    throw new ScriptTerminationError('parseOneToken');
}


function parseList(state: SxParserState, listStopChar: string, initialList: SxToken[]): SxToken {
    const r: SxToken[] = initialList.slice(0);
    let dotted = false;

    skipWhitespaces(state);
    let ch = lookAhead(state);

    while (! isEOF(ch)) {
        switch (ch) {
        case listStopChar:
            getChar(state);
            if (dotted) {
                return r[0];
            } else {
                return r;
            }

        default:
            {
                const t = parseOneToken(state);
                if (typeof t === 'object' && Object.prototype.hasOwnProperty.call(t, 'dotted')) {
                    if (r.length !== 1) {
                        throw new Error(`[SX] parseList: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                    }
                    dotted = true;
                    if (Array.isArray(t)) {
                        t.unshift(r.pop() as SxToken);
                        r.push(t);
                    } else {
                        r.push({car: r.pop() as SxToken, cdr: (t as SxDottedFragment).dotted});
                    }
                } else if (typeof t === 'object' && Object.prototype.hasOwnProperty.call(t, 'comment')) {
                    if (! state.config.stripComments) {
                        r.push(t);
                    }
                } else {
                    if (dotted) {
                        throw new Error(`[SX] parseList: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                    }
                    r.push(t);
                }
            }
            break;
        }

        skipWhitespaces(state);
        ch = lookAhead(state);
    }

    throw new ScriptTerminationError('parseList');
}



export function parse(state: SxParserState) {
    const r: SxToken[] = [];

    skipWhitespaces(state);
    let ch = lookAhead(state);

    while (! isEOF(ch)) {
        switch (ch) {
        case '(':
            getChar(state);
            r.push(parseList(state, ')', []));
            break;

        case "'": case "`":
            {
                getChar(state);
                skipWhitespaces(state);
                for (;;) {
                    const t = parseOneToken(state);
                    if (typeof t === 'object' && Object.prototype.hasOwnProperty.call(t, 'comment')) {
                        if (! state.config.stripComments) {
                            r.push(t);
                        }
                    } else {
                        r.push((ch === "'" ? quote : backquote)(state, t));
                        break;
                    }
                }
                break;
            }

        case ';':
            getChar(state);
            if (state.config.stripComments) {
                parseSingleLineComment(state);
            } else {
                r.push(parseSingleLineComment(state));
            }
            break;

        case '#':
            {
                const aheads = lookAheads(state, 2);
                if (aheads[1] === '|') {
                    getChar(state);
                    getChar(state);
                    if (state.config.stripComments) {
                        parseMultiLineComment(state);
                    } else {
                        r.push(parseMultiLineComment(state));
                    }
                } else {
                    getChar(state);
                    if (state.config.stripComments) {
                        parseSingleLineComment(state);
                    } else {
                        r.push(parseSingleLineComment(state));
                    }
                }
            }
            break;

        case '"':
            {
                const aheads = lookAheads(state, 3);
                if (aheads[1] === '"' && aheads[2] === '"') {
                    r.push(parseOneToken(state));
                    break;
                }
            }
            // FALL_THRU

        default:
            throw new Error(`[SX] parseInitialState: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
        }

        skipWhitespaces(state);
        ch = lookAhead(state);
    }

    return r;
}
