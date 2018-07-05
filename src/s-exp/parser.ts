// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { SxParserState,
         SxEof,
         SxExternalValue,
         SxSymbol,
         SxComment,
         SxToken,
         SxChar,
         quote } from './types';



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


function getChar(state: SxParserState, virtualEof?: string[]): SxChar {
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

        if (ch === '\\') {
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


function lookAheads(state: SxParserState, n: number, virtualEof?: string[]): SxChar[] {
    const index = state.index;
    const pos = state.pos;
    const line = state.line;
    const chs: SxChar[] = [];

    try {
        for (let i = 0; i < n; i++) {
            chs.push(getChar(state, virtualEof));
        }
    } finally {
        state.index = index;
        state.pos = pos;
        state.line = line;
    }

    return chs;
}


function lookAhead(state: SxParserState, virtualEof?: string[]): SxChar {
    const index = state.index;
    const pos = state.pos;
    const line = state.line;
    let ch: SxChar;

    try {
        ch = getChar(state, virtualEof);
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
            if (/^[0-9\+\-\.EeInfinityNaN]+$/.test(s + ch)) {
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

    if (! /^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)|([\+\-]Infinity)|(NaN)$/.test(s)) {
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

    return {symbol: s};
}


function parseStringOrComment(
        state: SxParserState, eof: string[],
        valuesStartSeq: string | null ,
        valuesStopChar: string
    ): { strings: string[], values: any[] } {

    const eofSeqs = valuesStartSeq ? [...eof, valuesStartSeq] : eof;
    const strings: string[] = [];
    const values: any[] = [];

    for (;;) {
        let s = '';
        let ch = lookAhead(state, eofSeqs);

        while (! isEOF(ch)) {
            if (typeof ch === 'string') {
                getChar(state, eofSeqs);
                s += ch;
            } else {
                if (typeof ch === 'object' && Object.prototype.hasOwnProperty.call(ch, 'value')) {
                    getChar(state, eofSeqs);
                    const v = (ch as SxExternalValue).value;
                    s += String(ch);
                } else {
                    throw new Error(`[SX] parseStringOrComment: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                }
            }

            ch = lookAhead(state, eofSeqs);
        }

        getChar(state, eofSeqs);

        if ((ch as SxEof).eof === true) {
            throw new Error(`[SX] parseStringOrComment: Unexpected termination of script.`);
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


function parseString(state: SxParserState): string {
    return parseStringOrComment(state, ['"'], null, ')').strings[0];
}


function parseHereDoc(state: SxParserState, symbol: SxSymbol, attrs: SxToken[] | null): SxToken[] {
    const q: SxToken[] = [symbol];

    if (attrs) {
        q.push(attrs);
    }

    const inner =  parseStringOrComment(state, ['"""'], '%%%(', ')');
    for (let i = 0; i < inner.strings.length; i++) {
        q.push(inner.strings[i]);
        if (i < inner.values.length) {
            q.push(inner.values[i]);
        }
    }

    return q;
}


function parseSingleLineComment(state: SxParserState): SxComment | ' ' {
    return state.config.stripComments ?
        state.config.strippedCommentValue :
        { comment: parseStringOrComment(state, ['\r', '\n'], null, ')').strings[0] };
}


function parseMultiLineComment(state: SxParserState): SxComment | ' ' {
    return state.config.stripComments ?
        state.config.strippedCommentValue :
        { comment: parseStringOrComment(state, ['|#'], null, ')').strings[0] };
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

        case "'":
            {
                getChar(state);
                skipWhitespaces(state);
                return quote(state, parseOneToken(state));
            }

        case ".":
            getChar(state);
            skipWhitespaces(state);
            return {dotted: parseOneToken(state)};

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
                            attrs = parseList(state, '}', [{symbol: '@'}]);
                        }
                    }

                    return parseHereDoc(state, sym, attrs);
                } else {
                    return parseString(state);
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

    throw new Error(`[SX] parseOneToken: Unexpected termination of script.`);
}


function parseList(state: SxParserState, listStopChar: string, initialList: SxToken[]) {
    const r: SxToken[] = initialList.slice(0);

    skipWhitespaces(state);
    let ch = lookAhead(state);

    while (! isEOF(ch)) {
        switch (ch) {
        case listStopChar:
            getChar(state);
            return r;

        default:
            {
                const t = parseOneToken(state);
                if (typeof t === 'object' && Object.prototype.hasOwnProperty.call(t, 'dotted')) {
                    if (r.length === 0 || Array.isArray(r[r.length - 1])) {
                        throw new Error(`[SX] parseList: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
                    }
                    if (Array.isArray(t)) {
                        t.unshift(r.pop() as SxToken);
                        r.push(t);
                    } else {
                        r.push({car: r.pop() as SxToken, cdr: t});
                    }
                } else {
                    r.push(t);
                }
            }
            break;
        }

        skipWhitespaces(state);
        ch = lookAhead(state);
    }

    throw new Error(`[SX] parseList: Unexpected termination of script.`);
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

        case "'":
            {
                getChar(state);
                skipWhitespaces(state);
                r.push(quote(state, parseOneToken(state)));
                break;
            }

        case ';':
            getChar(state);
            r.push(parseSingleLineComment(state));
            break;

        case '#':
            {
                const aheads = lookAheads(state, 2);
                if (aheads[1] === '|') {
                    getChar(state);
                    getChar(state);
                    r.push(parseMultiLineComment(state));
                } else {
                    getChar(state);
                    r.push(parseSingleLineComment(state));
                }
            }
            break;

        default:
            throw new Error(`[SX] parseInitialState: Invalid syntax at: ${lookCurrentLineHint(state)}.`);
        }

        skipWhitespaces(state);
        ch = lookAhead(state);
    }

    return r;
}
