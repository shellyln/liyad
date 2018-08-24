

import { S, lisp, LM, LSX } from '../';



describe("parser.parse.dotted-pair", function() {
    it(". b -> throw", function() {
        expect(() => lisp`(. 2)`).toThrow();
    });
    it("a . b c -> throw", function() {
        expect(() => lisp`(1 . 2 3)`).toThrow();
    });
    it("a . b -> value", function() {
        expect(lisp`(1 . 2)`).toEqual({car: 1, cdr: 2} as any);
    });
    it("a . b -> value", function() {
        expect(lisp`((* 3 5) . (* 7 11))`).toEqual({car: 15, cdr: 77} as any);
    });
    it("a . () -> (a)", function() {
        expect(lisp`(3 . ())`).toEqual([3]);
    });
    it("a . nil -> (a)", function() {
        expect(lisp`(3 . nil)`).toEqual([3]);
    });
    it("a . null -> value", function() {
        expect(lisp`(3 . null)`).toEqual({car: 3, cdr: null} as any);
    });
    it("a . undefined -> value", function() {
        expect(lisp`(3 . undefined)`).toEqual({car: 3, cdr: void 0} as any);
    });
    it("a . (b) -> (a b)", function() {
        expect(lisp`(3 . '(5))`).toEqual([3, 5]);
    });
});
