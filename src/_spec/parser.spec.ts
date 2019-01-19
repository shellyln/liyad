

// tslint:disable-next-line:no-implicit-dependencies
import * as RedAgate from 'red-agate';
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
                           (tarai (- z 1) x y) )))
            (tarai 5 6 0)
        `).toEqual(6);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 6 6 0)
        `).toEqual(6);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    it("no optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    (tarai (tarai (- x 1) y z)
                           (tarai (- y 1) z x)
                           (tarai (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });

    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 5 6 0)
        `).toEqual(6);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 6 6 0)
        `).toEqual(6);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 7 6 0)
        `).toEqual(7);
    });
    it("optimization", function() {
        expect(lisp`
            ($defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });

    it("optimization", function() {
        expect(lisp`
            ($local ()
                ($let fib-sub (-> (n a b)
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]);
    });

    it("no optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        (fib-sub (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 2, 5, 9, 16, 27, 45, 74, 121, 197, 320, 519, 841, 1362, 2205, 3569, 5776, 9347, 15125, 24474]);
    });
    it("optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 2, 5, 9, 16, 27, 45, 74, 121, 197, 320, 519, 841, 1362, 2205, 3569, 5776, 9347, 15125, 24474]);
    });

    it("no optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        (fib-sub (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });
    it("optimization", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub (|-> (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });
});


describe("compiler", function() {
    it("compiler 1", function() {
        expect(lisp`
            ($$defun tarai(x y z)
                ($if (<= x y)
                    y
                    ($self ($self (- x 1) y z)
                           ($self (- y 1) z x)
                           ($self (- z 1) x y) )))
            (tarai 9 6 0)
        `).toEqual(9);
    });
    it("compiler 2", function() {
        expect(lisp`
            ($local (fib-sub)
                ($set fib-sub ($$closure (n a b) use (fib-sub)
                    ($set a (+ a 1))
                    ($set b (+ b 1))
                    ($if (< n 3)
                        ($cond (=== n 2) (+ a b)
                               (=== n 1) a
                               true      0)
                        ($self (- n 1) (+ a b) a) ) ))
                ($capture (fib-sub)
                    ($$defun fib (n) (fib-sub n 1 0)) ) )
            ($map ($range 0 20) (<- fib))
        `).toEqual([0, 2, 3, 7, 13, 23, 39, 65, 107, 175, 285, 463, 751, 1217, 1971, 3191, 5165, 8359, 13527, 21889, 35419]);
    });

    // TODO: generated code don't check actual arguments length.
    // it("compiler 3a", function() {
    //     expect(() => lisp`
    //         ($$defun foo (a b ...c)
    //             ($list ($list a) ($list b) c)
    //         )
    //         (foo 1)
    //     `).toThrow();
    // });
    it("compiler 3b", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2)
        `).toEqual([[1], [2], []]);
    });

    it("compiler 3c", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2 3)
        `).toEqual([[1], [2], [3]]);
    });
    it("compiler 3d", function() {
        expect(lisp`
            ($$defun foo (a b ...c)
                ($list ($list a) ($list b) c)
            )
            (foo 1 2 3 4)
        `).toEqual([[1], [2], [3, 4]]);
    });
    it("compiler 4a", function() {
        expect(lisp`
            ($let fn (-> (...a) ($concat ...a)) )
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4b0a", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn "x")
        `).toEqual('x');
    });
    it("compiler 4b0a2", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn "x")
        `).toEqual('xx');
    });
    it("compiler 4b0b", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn ($list 3))
        `).toEqual([3]);
    });
    it("compiler 4b0b", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn ($list 3))
        `).toEqual([3, 3]);
    });
    it("compiler 4b1", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4b1a", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a)) )
            (fn ($list 3) ($list 5))
        `).toEqual([3, 5]);
    });
    it("compiler 4b2", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat ...a ...a)) )
            (fn ($list 3) ($list 5))
        `).toEqual([3, 5, 3, 5]);
    });
    it("compiler 4b3", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat "p")) )
            (fn "x" "y")
        `).toEqual('p');
    });
    it("compiler 4b4", function() {
        expect(lisp`
            ($let fn (=> (...a) ($concat "p" "q")) )
            (fn "x" "y")
        `).toEqual('pq');
    });
    it("compiler 4c", function() {
        expect(lisp`
            ($defun fn (...a) ($concat ...a))
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4d", function() {
        expect(lisp`
            ($$defun fn (...a) ($concat ...a))
            (fn "x" "y")
        `).toEqual('xy');
    });
    it("compiler 4d2", function() {
        expect(lisp`
            ($$defun fn (a b) ($concat a b))
            (fn "x" "y")
        `).toEqual('xy');
    });

    it("compiler 4e", function() {
        expect(lisp`
            ($defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fa", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fb", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6)
        `).toEqual(19);
    });
    it("compiler 4fc", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ x y ...z)
            )
            (fn 13 6 1 4)
        `).toEqual(24);
    });
    it("compiler 4fd", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6 1)
        `).toEqual(20);
    });
    it("compiler 4fe", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6)
        `).toEqual(19);
    });
    it("compiler 4ff", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (+ ...z x y)
            )
            (fn 13 6 1 4)
        `).toEqual(24);
    });

    it("compiler -4e", function() {
        expect(lisp`
            ($defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(6);
    });
    it("compiler -4fa", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1)
        `).toEqual(6);
    });
    it("compiler -4fb", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6)
        `).toEqual(7);
    });
    it("compiler -4fc", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- x y ...z)
            )
            (fn 13 6 1 4)
        `).toEqual(2);
    });
    it("compiler -4fd", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6 1)
        `).toEqual(-18);
    });
    it("compiler -4fe", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6)
        `).toEqual(7);
    });
    it("compiler -4ff", function() {
        expect(lisp`
            ($$defun fn(x y ...z)
                (- ...z x y)
            )
            (fn 13 6 1 4)
        `).toEqual(-22);
    });
    it("compiler 4g1", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3)
            )
            (fn)
        `).toEqual(3);
    });
    it("compiler 4g2", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3 5)
            )
            (fn)
        `).toEqual(8);
    });
    it("compiler 4g3", function() {
        expect(lisp`
            ($$defun fn()
                (+ 3 5 7)
            )
            (fn)
        `).toEqual(15);
    });
    it("compiler 4h1", function() {
        expect(lisp`
            ($$defun fn()
                (- 3)
            )
            (fn)
        `).toEqual(-3);
    });
    it("compiler 4h2", function() {
        expect(lisp`
            ($$defun fn()
                (- 3 5)
            )
            (fn)
        `).toEqual(-2);
    });
    it("compiler 4g3", function() {
        expect(lisp`
            ($$defun fn()
                (- 3 5 7)
            )
            (fn)
        `).toEqual(-9);
    });

    /*
    // TODO: compiler bugs
    it("compiler 5a", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2
        expect(lisp`
            ($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
                \`($last
                    ($local ((,i ,s))
                        ($while (<= ,i ,e)
                            ,@body
                            ($set ,i (+ ,i 1)) ))))

            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                (FOR p [ FROM (+ 1) TO (+ 6 -3) ]
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5a2", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2
        expect(lisp`
            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                ($last
                    ($local ((p (+ 1)))
                        ($while (<= p (+ 6 -3))
                            ($set c1 (+ c1 p))
                            ($set c2 (+ c2 p))
                            ($set p (+ p 1)) )))

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
                \`($last
                    ($local ((,i ,s))
                        ($while (<= ,i ,e)
                            ,@body
                            ($set ,i (+ ,i 1)) ))))

            ($let c1   0)
            ($let c2 100)
            ($$defun foo ()
                (FOR p [ FROM (+ 1) TO (+ 6 -3) ]
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b2", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($let c1   0)
            ($let c2 100)
            ($$defun foo ()
                ($last
                    ($local ((p (+ 1)))
                        ($while (<= p (+ 6 -3))
                            ($set c1 (+ c1 p))
                            ($set c2 (+ c2 p))
                            ($set p (+ p 1)) )))

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, "p", "i", "s", "e"]);
    });
    it("compiler 5b3", function() {
        // TypeError: (intermediate value)(intermediate value) is not a function
        expect(lisp`
            ($let c1   0)
            ($let c2 100)
            ($let p (+ 1))
            ($$defun foo ()
                ($while (<= p (+ 6 -3))
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p))
                    ($set p (+ p 1)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, 4, "i", "s", "e"]);
    });
    it("compiler 5b4", function() {
        // Error: [SX] compileToken:$__let: Invalid argument length: expected: 1 / args: 2.
        expect(lisp`
            ($$defun foo ()
                ($let c1   0)
                ($let c2 100)
                ($let p (+ 1))
                ($while (<= p (+ 6 -3))
                    ($set c1 (+ c1 p))
                    ($set c2 (+ c2 p))
                    ($set p (+ p 1)) )

                ($list c1 c2 p i s e) )

            (foo)
        `).toEqual([6, 106, 4, "i", "s", "e"]);
    });
    it("compiler 999", function() {
        expect(lisp`
            (+ 0)
        `).toEqual(0);
    });
    */
});


describe("shorthands", function() {
    it("shorthands 1", function() {
        expect(lisp`
            ($let foo (#
                (bar)
                (baz (#)) ))
            (::foo:bar= 7)
            (::foo:baz:boo= 13)
            ($list ::foo:bar ::foo:baz:boo)
        `).toEqual([7, 13]);
    });
    it("shorthands 2", function() {
        class X {
            public x: number;
            constructor() {
                this.x = 3;
            }
            public mul(y: number, z: number) {
                return this.x * y * z;
            }
        }
        expect(lisp`
            ($let foo (#
                (bar)
                (baz ${new X()}) ))
            (::foo:baz@mul 5 7)
        `).toEqual(105);
    });
});


describe("splice", function() {
    it("splice 1", function() {
        expect(lisp`
            ($list 1 2 3 ($splice (4 5)) 6 7)
        `).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it("splice 2", function() {
        expect(lisp`
            ($list 1 2 3 ($splice 4 5) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
    it("splice 3", function() {
        expect(lisp`
            ($list 1 2 3 ($quote ($splice (4 5))) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
    it("splice 4", function() {
        expect(lisp`
            ($list 1 2 3 '($splice (4 5)) 6 7)
        `).toEqual([1, 2, 3, 4, 6, 7]);
    });
});


describe("string literal", function() {
    it("string literal 1", function() {
        expect(lisp`
            ($last "a\\nb\\tc")
        `).toEqual("a\nb\tc");
    });
    it("string literal 2", function() {
        expect(lisp`
            ($last @"a\\nb\\tc")
        `).toEqual("a\\nb\\tc");
    });
    it("string literal 3", function() {
        expect(lisp`
            ($last @123)
        `).toEqual("@123");
    });
});


describe("$eval", function() {
    it("$eval 1a", function() {
        expect(lisp`
            ($eval '(+ 1 2))
        `).toEqual(3);
    });
    it("$eval 1b", function() {
        expect(lisp`
            ($eval ($quote (+ 1 2)))
        `).toEqual(3);
    });
    it("$eval 2a", function() {
        expect(lisp`
            ($eval \`(+ 1 2))
        `).toEqual(3);
    });
    it("$eval 2b", function() {
        expect(lisp`
            ($eval ($backquote (+ 1 2)))
        `).toEqual(3);
    });
    it("$eval 3a", function() {
        expect(lisp`
            '(+ 1 2)
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 3b", function() {
        expect(lisp`
            ($quote (+ 1 2))
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 4a", function() {
        expect(lisp`
            \`(+ 1 2)
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
    it("$eval 4b", function() {
        expect(lisp`
            ($backquote (+ 1 2))
        `).toEqual([{ symbol: '+' }, 1, 2 ]);
    });
});


describe("prototype pollution", function() {
    it("prototype pollution 0", function() {
        expect(() => lisp`
            __proto__
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 1", function() {
        expect(() => lisp`
            ($let x (#))
            ($set (x "__proto__" "foo") 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 2", function() {
        expect(() => lisp`
            ($let x (# (bar (#))))
            ($set (x "bar" "__proto__" "foo") 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 3", function() {
        expect(() => lisp`
            ($let __proto__ (# (foo 1234)))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 4", function() {
        expect(() => lisp`
            ($let x (#))
            ($let y ($get x __proto__))
            ($set (y foo) 1234)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 5", function() {
        expect(() => lisp`
            (# (__proto__ (# (foo 1234))))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 6", function() {
        expect(() => lisp`
            ($let x 0)
            ($for __proto__ of '((# (foo 1234)))
                ($set x 1)
            )
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 7", function() {
        expect(() => lisp`
            ($let x 0)
            ($repeat __proto__ of 10
                ($set x 1)
            )
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 8", function() {
        expect(() => lisp`
            ($local ((__proto__ (# (foo 1234))))
                1
            )
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 9", function() {
        expect(() => lisp`
            ($defun __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 9b", function() {
        expect(() => lisp`
            ($$defun __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 10", function() {
        expect(() => lisp`
            ($defmacro __proto__ () 1234)
            (__proto__)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 11", function() {
        expect(() => lisp`
            ($let x (#))
            ($call x __proto__)
            ($get x)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 12", function() {
        expect(() => lisp`
            ($let x (<- __proto__))
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("prototype pollution 13", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(() => render(lsx`
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (__proto__ (# (foo 1234)))
                        (style (color "red")
                               ("width" "100%")
                               (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        `)).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
});


describe("(compile) prototype pollution", function() {
    it("(compile) prototype pollution 0", function() {
        expect(() => lisp`
        ($$defun fn ()
            __proto__
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 1", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($set (x "__proto__" "foo") 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 2", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (# (bar (#))))
            ($set (x "bar" "__proto__" "foo") 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 3", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let __proto__ (# (foo 1234)))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 4", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($let y ($get x __proto__))
            ($set (y foo) 1234)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 5", function() {
        expect(() => lisp`
        ($$defun fn ()
            (# (__proto__ (# (foo 1234))))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 6", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x 0)
            ($for __proto__ of '((# (foo 1234)))
                ($set x 1)
            )
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 7", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x 0)
            ($repeat __proto__ of 10
                ($set x 1)
            )
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 8", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($local ((__proto__ (# (foo 1234))))
                1
            )
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 9", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($defun __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 9b", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($$defun __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 10", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($defmacro __proto__ () 1234)
            (__proto__)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 11", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (#))
            ($call x __proto__)
            ($get x)
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 12", function() {
        expect(() => lisp`
        ($$defun fn ()
            ($let x (<- __proto__))
        )
        (fn)
        `).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
    it("(compile) prototype pollution 13", function() {
        const dom = RedAgate.createElement;
        const fragment = RedAgate.Template;
        const render = RedAgate.renderAsHtml_noDefer;
        const Hello = (props: any) =>
            dom('div', {},
                `Hello, ${props.name}, Lisp!`,
                ...(Array.isArray(props.children) ? props.children : [props.children])
            );
        const lsx = LSX({
            jsx: dom,
            jsxFlagment: fragment,
            components: {
                Html5: RedAgate.Html5,
                Svg: RedAgate.Svg,
                Rect: RedAgate.Rect,
                Hello,
            },
        });
        expect(() => render(lsx`
        ($$defun fn ()
            (let class "clazz")
            (let color "coloooor")
            ($=if (== "qwerty" ${'qwerty'})
                (div (@ (class ("aaa" "bbb" "ccc" ($if false "ggg" null) ($if true "hhh" null) ($concat "cls-" 8) ))
                        (__proto__ (# (foo 1234)))
                        (style (color "red")
                                ("width" "100%")
                                (($concat "style-" 1) ($concat "style-value-" 1)) ))
                    "Hello, asdfgh!" )
                (Hello (@ (name ($concat "abc" "def"))) "foo" "bar" (div "qqq") "baz")
            )
        )
        (fn)
        `)).toThrow();
        expect((Object.prototype as any).foo).toBeUndefined();
    });
});
