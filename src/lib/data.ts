// Copyright (c) 2017, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export class Query<T> {
    public constructor(public data: T[]) {
    }

    public orderBy(condition: Array<string | string[/* colName: string, ('asc' | 'desc') */]> | ((a: T, b: T) => number)): Query<T> {
        let fn: (a: T, b: T) => number;
        if (Array.isArray(condition)) {
            fn = (x: T, y: T) => {
                for (const c of condition) {
                    if (typeof c === 'string') {
                        if (x[c] > y[c]) return 1;
                        if (x[c] < y[c]) return -1;
                    } else {
                        const desc = c[1] === 'desc' ? -1 : 1;
                        if (x[c[0]] > y[c[0]]) return 1 * desc;
                        if (x[c[0]] < y[c[0]]) return -1 * desc;
                    }
                }
                return 0;
            };
        } else {
            fn = condition;
        }
        return new Query(this.data.slice(0).sort(fn));
    }

    public groupBy(condition: string[/* colName: string */] | ((a: T, b: T, index: number, array: T[]) => boolean)): Query<T[]> {
        let fn: (a: T, b: T, index: number, array: T[]) => boolean;
        if (Array.isArray(condition)) {
            fn = (x: T, y: T) => {
                for (const c of condition) {
                    if (x[c] !== y[c]) return false;
                }
                return true;
            };
        } else{
            fn = condition;
        }
        const r: T[][] = [];
        let start = 0;
        let i = 1;
        for (; i < this.data.length; i++) {
            if (! fn(this.data[start], this.data[i], i, this.data)) {
                r.push(this.data.slice(start, i));
                start = i;
            }
        }
        r.push(this.data.slice(start, i));
        return new Query(r);
    }

    public groupEvery(n: number | {single: number, first?: number, intermediate: number, last?: number}): Query<T[]> {
        if (typeof n === 'number') {
            return this.groupBy((a, b, index, array) => {
                if ((index % n) === 0) return false;
                return true;
            });
        } else {
            const w = Object.assign(Object.create(null), {first: n.intermediate, last: n.intermediate}, n);
            const r = this.groupBy((a, b, index, array) => {
                if (w.single >= array.length) {
                    if ((index % w.single) === 0) return false;
                    return true;
                } else if (index <= w.first) {
                    if ((index % w.first) === 0) return false;
                    return true;
                } else {
                    if (((index - w.first) % w.intermediate) === 0) return false;
                    return true;
                }
            });
            if (r.data.length === 1) {
                if (w.single < r.data[0].length) {
                    r.data.push([]);
                }
            } else {
                if (w.first < r.data[0].length) {
                    // case of w.first === 0
                    r.data.unshift([]);
                }
            }
            if (r.data.length > 1) {
                if (r.data[r.data.length - 1].length > w.last) {
                    r.data.push([]);
                }
            }
            return r;
        }
    }

    public where(fn: (value: T, index: number, array: T[]) => boolean): Query<T> {
        return new Query(this.data.filter(fn));
    }

    public select(): T[];
    public select<R>(fn: (value: T, index: number, array: T[]) => R): R[];
    public select<R>(fn?: (value: T, index: number, array: T[]) => R): Array<R | T> {
        return fn ? this.data.map(fn) : this.data as any;
    }
}



export function query<T>(data: T[]): Query<T> {
    return new Query<T>(data);
}
