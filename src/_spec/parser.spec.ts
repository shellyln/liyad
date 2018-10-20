

import { S, lisp, lisp_async, LM, LM_async, LSX, LSX_async } from '../';



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


describe("repl", function() {
    it("not a repl", function() {
        expect(lisp`($let foo 3)`).toEqual(3);
        expect(lisp`($list foo)`).toEqual(['foo']);
    });
    it("repl", function() {
        const repl = lisp.repl();
        expect(repl`($let foo 3)`).toEqual(3);
        expect(repl`($list foo)`).toEqual([3]);
    });
    it("not a repl async", function(done) {
        (async () => {
            try {
                expect(await lisp_async`($let-async foo 3)`).toEqual(3);
                expect(await lisp_async`($list foo)`).toEqual(['foo']);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
    it("repl async", function(done) {
        const repl = lisp_async.repl();
        (async () => {
            try {
                expect(await repl`($let-async foo 3)`).toEqual(3);
                expect(await repl`($list foo)`).toEqual([3]);
            } catch (e) {
                expect(1).toEqual(0);
            }
            done();
        })();
    });
});


describe("spread", function() {
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list 7 11) 13)`).toEqual([3, 5, 7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list 7) 13)`).toEqual([3, 5, 7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...($list) 13)`).toEqual([3, 5, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list 7 11))`).toEqual([5, 7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list 7))`).toEqual([5, 7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...($list))`).toEqual([5]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7 11) 13)`).toEqual([7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7) 13)`).toEqual([7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list) 13)`).toEqual([13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7 11))`).toEqual([7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list 7))`).toEqual([7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...($list))`).toEqual([]);
    });

    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'(7 11) 13)`).toEqual([3, 5, 7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'(7) 13)`).toEqual([3, 5, 7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 3 5 ...'() 13)`).toEqual([3, 5, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'(7 11))`).toEqual([5, 7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'(7))`).toEqual([5, 7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list 5 ...'())`).toEqual([5]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7 11) 13)`).toEqual([7, 11, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7) 13)`).toEqual([7, 13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'() 13)`).toEqual([13]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7 11))`).toEqual([7, 11]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'(7))`).toEqual([7]);
    });
    it("spread", function() {
        const repl = lisp.repl();
        expect(repl`($list ...'())`).toEqual([]);
    });
});


describe("tail call optimization", function() {
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
            ($if (<= x y)
                y
                (tarai (tarai (- x 1) y z)
                       (tarai (- y 1) z x)
                       (tarai (- z 1) x y))))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    /*
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
            ($if (<= x y)
                y
                ($self (tarai (- x 1) y z)
                       (tarai (- y 1) z x)
                       (tarai (- z 1) x y))))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    */
});
