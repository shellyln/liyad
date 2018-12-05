

import { S, lisp, LM, LSX } from '../';
import { isSymbol } from '../s-exp/ast';



describe("operator.core.$car", function() {
    it("$car -> throw", function() {
        expect(() => lisp`($car)`).toThrow();
    });
    it("$car () -> null", function() {
        expect(() => lisp`($car '())`).toThrow();
    });
    it("$car (a) -> a", function() {
        expect(lisp`($car '(3))`).toEqual(3);
    });
    it("$car (a b) -> a", function() {
        expect(lisp`($car '(3 7))`).toEqual(3);
    });
    it("$car (a b c) -> a", function() {
        expect(lisp`($car '(3 7 11))`).toEqual(3);
    });
    it("$car (a b c) -> a", function() {
        expect(() => lisp`($car '(3 7 11) '(13 17 19))`).toThrow();
    });
    it("$car number -> raise error", function() {
        expect(() => lisp`($car 1)`).toThrow();
    });
    it("$car string -> raise error", function() {
        expect(() => lisp`($car "a")`).toThrow();
    });
});


describe("operator.core.$cdr", function() {
    it("$cdr -> throw", function() {
        expect(() => lisp`($cdr)`).toThrow();
    });
    it("$cdr () -> null", function() {
        expect(() => lisp`($cdr '())`).toThrow();
    });
    it("$cdr (a) -> null", function() {
        expect(lisp`($cdr '(3))`).toEqual([]);
    });
    it("$cdr (a b) -> (b)", function() {
        expect(lisp`($cdr '(3 7))`).toEqual([7]);
    });
    it("$cdr (a b c) -> (b c)", function() {
        expect(lisp`($cdr '(3 7 11))`).toEqual([7, 11]);
    });
    it("$cdr (a b c) -> (b c)", function() {
        expect(() => lisp`($cdr '(3 7 11) '(13 17 19))`).toThrow();
    });
    it("$cdr number -> raise error", function() {
        expect(() => lisp`($cdr 1)`).toThrow();
    });
    it("$cdr string -> raise error", function() {
        expect(() => lisp`($cdr "a")`).toThrow();
    });
});


describe("operator.core.$cons", function() {
    it("$cons -> throw", function() {
        expect(() => lisp`($cons)`).toThrow();
    });
    it("$cons a -> (a)", function() {
        expect(() => lisp`($cons 3)`).toThrow();
    });
    it("$cons a b -> (a . b)", function() {
        expect(lisp`($cons 3 5)`).toEqual({car: 3, cdr: 5});
    });
    it("$cons a b c -> (a . b)", function() {
        expect(() => lisp`($cons 3 5 7)`).toThrow();
    });
    it("$cons a null -> (a)", function() {
        expect(lisp`($cons 3 null)`).toEqual([3]);
    });
    it("$cons a nil -> (a)", function() {
        expect(lisp`($cons 3 nil)`).toEqual([3]);
    });
    it("$cons a () -> (a)", function() {
        expect(lisp`($cons 3 ())`).toEqual([3]);
    });
    it("$cons null null -> ()", function() {
        expect(lisp`($cons null null)`).toEqual([[]]);
    });
    it("$cons nil nil -> ()", function() {
        expect(lisp`($cons nil nil)`).toEqual([[]]);
    });
    it("$cons () () -> ()", function() {
        expect(lisp`($cons () ())`).toEqual([[]]);
    });
    it("$cons a (b) -> (a b)", function() {
        expect(lisp`($cons 3 '(5))`).toEqual([3, 5]);
    });
    it("$cons a (b c) -> (a b c)", function() {
        expect(lisp`($cons 3 '(5 7))`).toEqual([3, 5, 7]);
    });
    it("$cons () (b c) -> (() b c)", function() {
        expect(lisp`($cons () '(5 7))`).toEqual([[], 5, 7]);
    });
    it("$cons (a) (b c) -> ((a) b c)", function() {
        expect(lisp`($cons '(3) '(5 7))`).toEqual([[3], 5, 7]);
    });
    it("$cons (a b) (c d) -> ((a b) c d)", function() {
        expect(lisp`($cons '(3 5) '(7 11))`).toEqual([[3, 5], 7, 11]);
    });
    it("$cons ", function() {
        expect(lisp`
            ($defun NUMERAL (x) x)
            ($defun SUCC (x) ($cons 0 x))
            ($defun PRED (x) ($cdr x))
            ($let   ZERO (NUMERAL nil))
            ($let   ONE (SUCC ZERO))
            ($last ZERO)
        `).toEqual([]);
    });
    it("$cons ", function() {
        expect(lisp`
            ($defun NUMERAL (x) x)
            ($defun SUCC (x) ($cons 0 x))
            ($defun PRED (x) ($cdr x))
            ($defun TIMES (n f x)
                ($if (=== n 0)
                    x
                    ($self (- n 1) f (f x)) ))
            ($let   ZERO (NUMERAL nil))
            ($let   ONE (SUCC ZERO))
            ($defun ADD (x y)
                ($if (== y ZERO)
                    x
                    ($self (SUCC x) (PRED y)) ))
            ($defun MUL_sub (x y p)
                ($if (== (PRED y) (PRED ONE))  ;; (== nil nil) -> true
                    x
                    ($self (ADD x p) (PRED y) p) ))
            ($defun MUL (x y)
                ($if (== y ZERO)
                    ZERO
                    (MUL_sub x y x) ))
            ($list
                ($length (ADD ZERO ZERO))
                ($length (ADD ZERO ONE))
                ($length (ADD ONE ZERO))
                ($length (ADD ONE ONE))
                ($length (ADD (SUCC ONE) ONE))
                ($length (ADD (SUCC ONE) (SUCC (SUCC ONE))))
                ($length (ADD (SUCC (SUCC ONE)) (SUCC ONE)))
                ($length (MUL ZERO ZERO))
                ($length (MUL ZERO ONE))
                ($length (MUL ONE ZERO))
                ($length (MUL ONE ONE))
                ($length (MUL (SUCC ONE) ONE))
                ($length (MUL (SUCC ONE) (SUCC (SUCC ONE))))
                ($length (MUL (SUCC (SUCC ONE)) (SUCC ONE)))
                ($length (TIMES 0 (<- SUCC) ZERO))
                ($length (TIMES 1 (<- SUCC) ZERO))
                ($length (TIMES 2 (<- SUCC) ZERO))
                ($length (TIMES 13 (<- SUCC) ZERO))
            )
        `).toEqual([0, 1, 1, 2, 3, 5, 5, 0, 0, 0, 1, 2, 6, 6, 0, 1, 2, 13]);
    });
    it("$cons ", function() {
        expect(lisp`
            ($let   FALSE   ((-> (x y) y) ($cons 0 FALSE) nil))
            ($let   TRUE    ((-> (x y) x) ($cons 0 FALSE) nil))
            ($defun AND     (x y) ($if (!= x FALSE) y FALSE))
            ($defun OR      (x y) ($if (!= x FALSE) TRUE  y))
            ($defun NOT     (x)   ($if (!= x FALSE) FALSE TRUE))
            ($defun XOR     (x y) ($if (!= x FALSE) (NOT y) y))
            ($list
                (AND FALSE FALSE)
                (AND TRUE FALSE)
                (AND FALSE TRUE)
                (AND TRUE TRUE)
                (OR  FALSE FALSE)
                (OR  TRUE FALSE)
                (OR  FALSE TRUE)
                (OR  TRUE TRUE)
                (NOT TRUE)
                (NOT FALSE)
                (XOR FALSE FALSE)
                (XOR TRUE FALSE)
                (XOR FALSE TRUE)
                (XOR TRUE TRUE)
            )
        `).toEqual([
            [],
            [],
            [],
            [0],
            [],
            [0],
            [0],
            [0],
            [],
            [0],
            [],
            [0],
            [0],
            [],
        ]);
    });
});


describe("operator.core.$first", function() {
    it("$first -> null", function() {
        expect(lisp`($first)`).toEqual(null);
    });
    it("$first a -> a", function() {
        expect(lisp`($first 3)`).toEqual(3);
    });
    it("$first a b -> a", function() {
        expect(lisp`($first 3 5)`).toEqual(3);
    });
    it("$first a b c -> a", function() {
        expect(lisp`($first 3 5 11)`).toEqual(3);
    });
    it("$first (a) -> (a)", function() {
        expect(lisp`($first '(3))`).toEqual([3]);
    });
    it("$first (a) b -> (a)", function() {
        expect(lisp`($first '(3) 5)`).toEqual([3]);
    });
    it("$first (a) b c -> (a)", function() {
        expect(lisp`($first '(3) 5 7)`).toEqual([3]);
    });
    it("$first () a -> ()", function() {
        expect(lisp`($first () 3)`).toEqual([]);
    });
    it("$first (a b) c -> (a b)", function() {
        expect(lisp`($first '(3 5) 7)`).toEqual([3, 5]);
    });
});


describe("operator.core.$second", function() {
    it("$second -> null", function() {
        expect(lisp`($second)`).toEqual(null);
    });
    it("$second a -> null", function() {
        expect(lisp`($second 3)`).toEqual(null);
    });
    it("$second a b -> b", function() {
        expect(lisp`($second 3 5)`).toEqual(5);
    });
    it("$second a b c -> b", function() {
        expect(lisp`($second 3 5 7)`).toEqual(5);
    });
    it("$second (a) -> null", function() {
        expect(lisp`($second '(3))`).toEqual(null);
    });
    it("$second (a) b -> b", function() {
        expect(lisp`($second '(3) 5)`).toEqual(5);
    });
    it("$second (a) b c -> b", function() {
        expect(lisp`($second '(3) 5 7)`).toEqual(5);
    });
    it("$second null a -> a", function() {
        expect(lisp`($second null 3)`).toEqual(3);
    });
    it("$second () a -> a", function() {
        expect(lisp`($second () 3)`).toEqual(3);
    });
    it("$second (a b) c -> c", function() {
        expect(lisp`($second '(3 5) 7)`).toEqual(7);
    });
    it("$second a (b) -> (b)", function() {
        expect(lisp`($second 3 '(5))`).toEqual([5]);
    });
    it("$second a null b -> ()", function() {
        expect(lisp`($second 3 null 5)`).toEqual(null);
    });
    it("$second a () b -> ()", function() {
        expect(lisp`($second 3 () 5)`).toEqual([]);
    });
    it("$second a (b c) d -> (b c)", function() {
        expect(lisp`($second 3 '(5 7) 11)`).toEqual([5, 7]);
    });
});


describe("operator.core.$last", function() {
    it("$last -> null", function() {
        expect(lisp`($last)`).toEqual(null);
    });
    it("$last a -> a", function() {
        expect(lisp`($last 3)`).toEqual(3);
    });
    it("$last a b -> b", function() {
        expect(lisp`($last 3 5)`).toEqual(5);
    });
    it("$last a b c -> c", function() {
        expect(lisp`($last 3 5 7)`).toEqual(7);
    });
    it("$last (a) -> (a)", function() {
        expect(lisp`($last '(3))`).toEqual([3]);
    });
    it("$last a (b) -> (b)", function() {
        expect(lisp`($last 3 '(5))`).toEqual([5]);
    });
    it("$last a b (c) -> (c)", function() {
        expect(lisp`($last 3 5 '(7))`).toEqual([7]);
    });
    it("$last a b (c d) -> (c d)", function() {
        expect(lisp`($last 3 5 '(7 11))`).toEqual([7, 11]);
    });
    it("$last a b (c d) e -> e", function() {
        expect(lisp`($last 3 5 '(7 11) 13)`).toEqual(13);
    });
    it("$last a b null -> null", function() {
        expect(lisp`($last 3 5 null)`).toEqual(null);
    });
    it("$last a b () -> ()", function() {
        expect(lisp`($last 3 5 ())`).toEqual([]);
    });
});


describe("operator.core.$rest", function() {
    it("$rest -> null", function() {
        expect(lisp`($rest)`).toEqual(null);
    });
    it("$rest a -> a", function() {
        expect(lisp`($rest 3)`).toEqual(null);
    });
    it("$rest a b -> (b)", function() {
        expect(lisp`($rest 3 5)`).toEqual([5]);
    });
    it("$rest a b c -> (b c)", function() {
        expect(lisp`($rest 3 5 7)`).toEqual([5, 7]);
    });
    it("$rest a b null -> (b null)", function() {
        expect(lisp`($rest 3 5 null)`).toEqual([5, null]);
    });
    it("$rest a b () -> (b ())", function() {
        expect(lisp`($rest 3 5 ())`).toEqual([5, []]);
    });
    it("$rest a b (c) -> (b (c))", function() {
        expect(lisp`($rest 3 5 '(7))`).toEqual([5, [7]]);
    });
    it("$rest a b (c d) -> (b (c d))", function() {
        expect(lisp`($rest 3 5 '(7 11))`).toEqual([5, [7, 11]]);
    });
    it("$rest a b (c d) e -> (b (c d) e)", function() {
        expect(lisp`($rest 3 5 '(7 11) 13)`).toEqual([5, [7, 11], 13]);
    });
});


describe("operator.core.$first-and-second", function() {
    it("$first-and-second -> null", function() {
        expect(lisp`($first-and-second)`).toEqual({car: null, cdr: null});
    });
    it("$first-and-second a -> (a)", function() {
        expect(lisp`($first-and-second 3)`).toEqual({car: 3, cdr: null});
    });
    it("$first-and-second a b -> (a . b)", function() {
        expect(lisp`($first-and-second 3 5)`).toEqual({car: 3, cdr: 5});
    });
    it("$first-and-second a b c -> (a . b)", function() {
        expect(lisp`($first-and-second 3 5 7)`).toEqual({car: 3, cdr: 5});
    });
    it("$first-and-second (a) -> ((a))", function() {
        expect(lisp`($first-and-second '(3))`).toEqual({car: [3], cdr: null});
    });
    it("$first-and-second (a) b -> b", function() {
        expect(lisp`($first-and-second '(3) 5)`).toEqual({car: [3], cdr: 5});
    });
    it("$first-and-second (a) b c -> b", function() {
        expect(lisp`($first-and-second '(3) 5 7)`).toEqual({car: [3], cdr: 5});
    });
    it("$first-and-second null a -> a", function() {
        expect(lisp`($first-and-second null 3)`).toEqual({car: null, cdr: 3});
    });
    it("$first-and-second () a -> a", function() {
        expect(lisp`($first-and-second () 3)`).toEqual({car: [], cdr: 3});
    });
    it("$first-and-second (a b) c -> c", function() {
        expect(lisp`($first-and-second '(3 5) 7)`).toEqual({car: [3, 5], cdr: 7});
    });
    it("$first-and-second a (b) -> (b)", function() {
        expect(lisp`($first-and-second 3 '(5))`).toEqual({car: 3, cdr: [5]});
    });
    it("$first-and-second a null b -> ()", function() {
        expect(lisp`($first-and-second 3 null 5)`).toEqual({car: 3, cdr: null});
    });
    it("$first-and-second a () b -> ()", function() {
        expect(lisp`($first-and-second 3 () 5)`).toEqual({car: 3, cdr: []});
    });
    it("$first-and-second a (b c) d -> (b c)", function() {
        expect(lisp`($first-and-second 3 '(5 7) 11)`).toEqual({car: 3, cdr: [5, 7]});
    });
});


describe("operator.core.$atom", function() {
    it("$atom -> throw", function() {
        expect(() => lisp`($atom)`).toThrow();
    });
    it("$atom number -> true", function() {
        expect(lisp`($atom 0)`).toEqual(true);
    });
    it("$atom number -> true", function() {
        expect(lisp`($atom 3)`).toEqual(true);
    });
    it("$atom number -> true", function() {
        expect(lisp`($atom +Infinity)`).toEqual(true);
    });
    it("$atom number -> true", function() {
        expect(lisp`($atom -Infinity)`).toEqual(true);
    });
    it("$atom number -> true", function() {
        expect(lisp`($atom NaN)`).toEqual(true);
    });
    it("$atom string -> true", function() {
        expect(lisp`($atom "")`).toEqual(true);
    });
    it("$atom string -> true", function() {
        expect(lisp`($atom "a")`).toEqual(true);
    });
    it("$atom boolean -> true", function() {
        expect(lisp`($atom false)`).toEqual(true);
    });
    it("$atom boolean -> true", function() {
        expect(lisp`($atom true)`).toEqual(true);
    });
    it("$atom undefined -> true", function() {
        expect(lisp`($atom undefined)`).toEqual(true);
    });
    it("$atom null -> true", function() {
        expect(lisp`($atom null)`).toEqual(true);
    });
    it("$atom nil -> true", function() {
        expect(lisp`($atom nil)`).toEqual(true);
    });
    it("$atom () -> true", function() {
        expect(lisp`($atom ())`).toEqual(true);
    });
    it("$atom (a) -> false", function() {
        expect(lisp`($atom '(3))`).toEqual(false);
    });
    it("$atom (a b) -> false", function() {
        expect(lisp`($atom '(3 5))`).toEqual(false);
    });
    it("$atom (#) -> false", function() {
        expect(lisp`($atom (#))`).toEqual(false);
    });
    it("$atom symbol -> true", function() {
        expect(lisp`($atom 'A)`).toEqual(true);
    });
});


describe("operator.core.$eq", function() {
    it("$eq -> throw", function() {
        expect(() => lisp`($eq)`).toThrow();
    });
    it("$eq a -> throw", function() {
        expect(() => lisp`($eq 3)`).toThrow();
    });
    it("$eq a a -> true", function() {
        expect(lisp`($eq 0 0)`).toEqual(true);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($eq 3 3)`).toEqual(true);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($eq +Infinity +Infinity)`).toEqual(true);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($eq -Infinity -Infinity)`).toEqual(true);
    });
    it("$eq a b -> false", function() {
        expect(lisp`($eq +Infinity -Infinity)`).toEqual(false);
    });
    it("$eq NaN NaN -> false", function() {
        expect(lisp`($eq NaN NaN)`).toEqual(false);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($eq "3" "3")`).toEqual(true);
    });
    it("$eq true true -> true", function() {
        expect(lisp`($eq true true)`).toEqual(true);
    });
    it("$eq false false -> true", function() {
        expect(lisp`($eq false false)`).toEqual(true);
    });
    it("$eq null null -> true", function() {
        expect(lisp`($eq null null)`).toEqual(true);
    });
    it("$eq nil nil -> false", function() {
        expect(lisp`($eq nil nil)`).toEqual(false);
    });
    it("$eq () () -> false", function() {
        expect(lisp`($eq () ())`).toEqual(false);
    });
    it("$eq () nil -> false", function() {
        expect(lisp`($eq () nil)`).toEqual(false);
    });
    it("$eq () null -> false", function() {
        expect(lisp`($eq () null)`).toEqual(false);
    });
    it("$eq (a) (a) -> false", function() {
        expect(lisp`($eq '(3) '(3))`).toEqual(false);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($let A '(3))($eq A A)`).toEqual(true);
    });
    it("$eq a a -> false", function() {
        expect(lisp`($eq 'A 'A)`).toEqual(false);
    });
    it("$eq undefined undefined -> true", function() {
        expect(lisp`($eq undefined undefined)`).toEqual(true);
    });
    it("$eq a a -> true", function() {
        expect(lisp`($let x (#)) ($eq x x)`).toEqual(true);
    });
    it("$eq a b -> false", function() {
        expect(lisp`($eq (#) (#))`).toEqual(false);
    });
    it("$eq a b -> false", function() {
        expect(lisp`($eq 3 5)`).toEqual(false);
    });
    it("$eq a b -> false", function() {
        expect(lisp`($eq "3" "5")`).toEqual(false);
    });
    it("$eq string number -> false", function() {
        expect(lisp`($eq "3" 3)`).toEqual(false);
    });
    it("$eq number string -> false", function() {
        expect(lisp`($eq 3 "3")`).toEqual(false);
    });
    it("$eq null nil -> false", function() {
        expect(lisp`($eq null nil)`).toEqual(false);
    });
    it("$eq null 0 -> false", function() {
        expect(lisp`($eq null 0)`).toEqual(false);
    });
    it("$eq null undefined -> false", function() {
        expect(lisp`($eq null undefined)`).toEqual(false);
    });
});


describe("operator.core.$not-eq", function() {
    it("$not-eq -> throw", function() {
        expect(() => lisp`($not-eq)`).toThrow();
    });
    it("$not-eq a -> throw", function() {
        expect(() => lisp`($not-eq 3)`).toThrow();
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($not-eq 0 0)`).toEqual(false);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($not-eq 3 3)`).toEqual(false);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($not-eq +Infinity +Infinity)`).toEqual(false);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($not-eq -Infinity -Infinity)`).toEqual(false);
    });
    it("$not-eq a b -> true", function() {
        expect(lisp`($not-eq +Infinity -Infinity)`).toEqual(true);
    });
    it("$not-eq NaN NaN -> true", function() {
        expect(lisp`($not-eq NaN NaN)`).toEqual(true);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($not-eq "3" "3")`).toEqual(false);
    });
    it("$not-eq true true -> false", function() {
        expect(lisp`($not-eq true true)`).toEqual(false);
    });
    it("$not-eq false false -> false", function() {
        expect(lisp`($not-eq false false)`).toEqual(false);
    });
    it("$not-eq null null -> false", function() {
        expect(lisp`($not-eq null null)`).toEqual(false);
    });
    it("$not-eq nil nil -> true", function() {
        expect(lisp`($not-eq nil nil)`).toEqual(true);
    });
    it("$not-eq () () -> true", function() {
        expect(lisp`($not-eq () ())`).toEqual(true);
    });
    it("$not-eq () nil -> true", function() {
        expect(lisp`($not-eq () nil)`).toEqual(true);
    });
    it("$not-eq () null -> false", function() {
        expect(lisp`($not-eq () null)`).toEqual(true);
    });
    it("$not-eq (a) (a) -> true", function() {
        expect(lisp`($not-eq '(3) '(3))`).toEqual(true);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($let A '(3))($not-eq A A)`).toEqual(false);
    });
    it("$not-eq a a -> true", function() {
        expect(lisp`($not-eq 'A 'A)`).toEqual(true);
    });
    it("$not-eq undefined undefined -> false", function() {
        expect(lisp`($not-eq undefined undefined)`).toEqual(false);
    });
    it("$not-eq a a -> false", function() {
        expect(lisp`($let x (#)) ($not-eq x x)`).toEqual(false);
    });
    it("$not-eq a b -> true", function() {
        expect(lisp`($not-eq (#) (#))`).toEqual(true);
    });
    it("$not-eq a b -> true", function() {
        expect(lisp`($not-eq 3 5)`).toEqual(true);
    });
    it("$not-eq a b -> true", function() {
        expect(lisp`($not-eq "3" "5")`).toEqual(true);
    });
    it("$not-eq string number -> true", function() {
        expect(lisp`($not-eq "3" 3)`).toEqual(true);
    });
    it("$not-eq number string -> true", function() {
        expect(lisp`($not-eq 3 "3")`).toEqual(true);
    });
    it("$not-eq null nil -> true", function() {
        expect(lisp`($not-eq null nil)`).toEqual(true);
    });
    it("$not-eq null 0 -> true", function() {
        expect(lisp`($not-eq null 0)`).toEqual(true);
    });
    it("$not-eq null undefined -> true", function() {
        expect(lisp`($not-eq null undefined)`).toEqual(true);
    });
});


describe("operator.core.$list", function() {
    it("$list -> ()", function() {
        expect(lisp`($list)`).toEqual([]);
    });
    it("$list null -> (null)", function() {
        expect(lisp`($list null)`).toEqual([null]);
    });
    it("$list nil -> (())", function() {
        expect(lisp`($list nil)`).toEqual([[]]);
    });
    it("$list undefined -> (undefined)", function() {
        expect(lisp`($list undefined)`).toEqual([void 0] as any);
    });
    it("$list a -> (a)", function() {
        expect(lisp`($list "3")`).toEqual(["3"]);
    });
    it("$list a -> (a)", function() {
        expect(lisp`($list 3)`).toEqual([3]);
    });
    it("$list a b -> (a b)", function() {
        expect(lisp`($list 3 5)`).toEqual([3, 5]);
    });
    it("$list a b c -> (a b c)", function() {
        expect(lisp`($list 3 5 7)`).toEqual([3, 5, 7]);
    });
    it("$list (a) b c -> ((a) b c)", function() {
        expect(lisp`($list '(3) 5 7)`).toEqual([[3], 5, 7]);
    });
    it("$list (a b) c d -> ((a b) c d)", function() {
        expect(lisp`($list '(3 5) 7 11)`).toEqual([[3, 5], 7, 11]);
    });
});


describe("operator.core.$local", function() {
    it("$local -> throw", function() {
        expect(() => lisp`($local)`).toThrow();
    });
    it("$local undefined-symbol -> string", function() {
        expect(lisp`
            ($local ()
                5
                A
            )
        `).toEqual("A");
    });
    it("$local defined-in-local -> defined-in-local", function() {
        expect(lisp`
            ($local ()
                ($let A 3)
                5
                A
            )
        `).toEqual(3);
    });
    it("$local defined-in-local -> defined-in-local", function() {
        expect(lisp`
            ($local ((A 3))
                5
                A
            )
        `).toEqual(3);
    });
    it("$local defined-in-global -> defined-in-global", function() {
        expect(lisp`
            ($let A 3)
            ($local ()
                5
                A
            )
        `).toEqual(3);
    });
    it("$get out-of-scoped-local-var -> throw", function() {
        expect(() => lisp`
            ($local ()
                ($let A 3)
                5
                A
            )
            ($get A)
        `).toThrow();
    });
    it("$get out-of-scoped-local-var -> string", function() {
        expect(lisp`
            ($local ()
                ($let A 3)
                5
                A
            )
            ($last A)
        `).toEqual("A");
    });
    it("$get out-of-scoped-local-var -> throw", function() {
        expect(() => lisp`
            ($local ((A 3))
                5
                A
            )
            ($get A)
        `).toThrow();
    });
    it("$get out-of-scoped-local-var -> string", function() {
        expect(lisp`
            ($local ((A 3))
                5
                A
            )
            ($last A)
        `).toEqual("A");
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ()
                ($let A 5)
                7
                A
            )
        `).toEqual(5);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                A
            )
        `).toEqual(5);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($let B 5)
            ($local ((A 7)(B 11))
                13
                B
            )
        `).toEqual(11);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                ($let A 7)
                11
                A
            )
        `).toEqual(7);
    });
    it("$get defined-in-local-not-overwritten -> global-var", function() {
        expect(lisp`
            ($let A 3)
            ($local ()
                ($let A 5)
                7
                A
            )
            ($get A)
        `).toEqual(5);
    });
    it("$get defined-in-local-overwritten -> global-var", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                A
            )
            ($get A)
        `).toEqual(3);
    });
    it("$get defined-in-local-overwritten -> global-var", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                ($let A 7)
                11
                A
            )
            ($get A)
        `).toEqual(3);
    });
    it("$get defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($let B 5)
            ($local (A B)
                ($let A 7)
                ($let B 11)
                13
                ($list ($get A)($get B))
            )
        `).toEqual([7, 11]);
    });
    it("$get defined-in-local-overwritten -> global-var", function() {
        expect(lisp`
            ($let A 3)
            ($let B 5)
            ($local (A B)
                ($let A 7)
                ($let B 11)
                13
                A
            )
            ($list ($get A)($get B))
        `).toEqual([3, 5]);
    });
});


describe("operator.core.$global", function() {
    it("$global undefined-symbol -> string", function() {
        expect(lisp`
            ($global
                5
                A
            )
        `).toEqual("A");
    });
    it("$local defined-in-local -> defined-in-local", function() {
        expect(lisp`
            ($global
                ($let A 3)
                5
                A
            )
        `).toEqual(3);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                ($global
                    A 999
                )
            )
        `).toEqual(999);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                ($global
                    A
                )
            )
        `).toEqual(3);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                ($global
                    ($let A 11)
                    A
                )
            )
        `).toEqual(11);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                ($global
                    ($let A 11)
                )
                13
                A
            )
        `).toEqual(5);
    });
    it("$local defined-in-local-overwritten -> defined-in-local-overwritten", function() {
        expect(lisp`
            ($let A 3)
            ($local ((A 5))
                7
                ($global
                    ($let A 11)
                )
                13
                A
            )
            ($get A)
        `).toEqual(11);
    });
});


describe("operator.core.$capture", function() {
    it("$capture #1", function() {
        expect(() => lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture
                    (-> () (* a b c))
                ))
            )
            (fn)
        `).toThrow();
    });
    it("$capture #2", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture ()
                    (-> () ($concat a b c))
                ))
            )
            (fn)
        `).toEqual('abc');
    });
    it("$capture #3", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a "3")
                ($let b "5")
                ($let c "7")
                ($let fn ($capture (a c)
                    (-> () ($concat a b c))
                ))
            )
            (fn)
        `).toEqual('3b7');
    });
    it("$capture #4", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture (a b c)
                    (-> () (* a b c))
                ))
            )
            (fn)
        `).toEqual(105);
    });
    it("$capture #5", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture (a b c)
                    (-> () (* a b c))
                ))
            )
            (* a b c)
        `).toEqual(NaN);
    });
    it("$capture #6", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture (a b c)
                    (-> () ($let c (+ c 1)))
                ))
            )
            (fn)
        `).toEqual(8);
    });
    it("$capture #7", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($capture (a b c)
                    (-> () ($let c (+ c 1)))
                ))
            )
            (fn)(fn)
        `).toEqual(9);
    });
    it("$capture #8", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a b c)
                    ($let fn
                        (-> () ($let c (+ c 1)))
                    )
                )
            )
            (fn)(fn)
        `).toEqual(9);
    });
    it("$capture #9", function() {
        expect(lisp`
            ($let fn nil)
            ($let fn2 nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a b c)
                    ($let fn
                        (-> () ($let c (+ c 1)))
                    )
                    ($let fn2
                        (-> () ($let c (+ c 2)))
                    )
                )
            )
            (fn)(fn2)
        `).toEqual(10);
    });
    it("$capture #10", function() {
        expect(lisp`
            ($let fn nil)
            ($let fn2 nil)
            ($let fn3 nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a b c)
                    ($let fn
                        (-> () ($let c (+ c 1)))
                    )
                    ($let fn2
                        (-> () ($let c (+ c 2)))
                    )
                )
                ($capture (a b c)
                    ($let fn3
                        (-> () ($let c (+ c 3)))
                    )
                )
            )
            (fn)(fn2)(fn3)
        `).toEqual(13);
    });
    it("$capture #11", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a)
                    ($capture (b)
                        ($capture (c)
                            ($let fn
                                (-> () (* a b c))
                            )
                        )
                    )
                )
            )
            (fn)
        `).toEqual(105);
    });
    it("$capture #12", function() {
        expect(() => lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a)
                    ((-> ()
                        ($capture (a b)
                            ((-> ()
                                ($capture (a b c)
                                    ($let fn
                                        (-> () (* a b c))
                                    )
                                )
                            ))
                        )
                    ))
                )
            )
            (fn)
        `).toThrow();
    });
    it("$capture #13", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a b c)
                    ((-> ()
                        ($capture (a b c)
                            ((-> ()
                                ($capture (a b c)
                                    ($let fn
                                        (-> () (* a b c))
                                    )
                                )
                            ))
                        )
                    ))
                )
            )
            (fn)
        `).toEqual(105);
    });
    it("$capture #14", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($capture (a b c)
                    ((-> ()
                        ($capture (a b c)
                            ((-> ()
                                ($capture (a b c)
                                    ($let fn
                                        (-> () ($let c (+ c 1)))
                                    )
                                )
                            ))
                        )
                    ))
                )
            )
            (fn)(fn)
        `).toEqual(9);
    });
});


describe("operator.core.$closure", function() {
    it("$closure #1", function() {
        expect(() => lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($closure
                    (* a b c)
                ))
            )
            (fn)
        `).toThrow();
    });
    it("$closure #2", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($closure () use () ($concat a b c)) )
            )
            (fn)
        `).toEqual('abc');
    });
    it("$closure #3", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a "3")
                ($let b "5")
                ($let c "7")
                ($let fn ($closure () use (a c) ($concat a b c)) )
            )
            (fn)
        `).toEqual('3b7');
    });
    it("$closure #4", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn ($closure () use (a c) ($let c (+ c 1) )) )
            )
            (fn)(fn)
        `).toEqual(9);
    });

    it("|-> #1", function() {
        expect(() => lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn (|->
                    (* a b c)
                ))
            )
            (fn)
        `).toThrow();
    });
    it("|-> #2", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn (|-> () use () ($concat a b c)) )
            )
            (fn)
        `).toEqual('abc');
    });
    it("|-> #3", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a "3")
                ($let b "5")
                ($let c "7")
                ($let fn (|-> () use (a c) ($concat a b c)) )
            )
            (fn)
        `).toEqual('3b7');
    });
    it("|-> #4", function() {
        expect(lisp`
            ($let fn nil)
            ($local ()
                ($let a 3)
                ($let b 5)
                ($let c 7)
                ($let fn (|-> () use (a c) ($let c (+ c 1) )) )
            )
            (fn)(fn)
        `).toEqual(9);
    });
});


describe("operator.core.$lambda", function() {
    it("$lambda fac", function() {
        expect(lisp`
            ($let fac
                ($lambda (n)
                    ($if (== n 0)
                        1
                        (* n ($self (- n 1))) ) )
            )
            (fac 4)
        `).toEqual(24);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn)
        `).toEqual([]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn 3)
        `).toEqual([3]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn 3 5)
        `).toEqual([3, 5]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn 3 5 7)
        `).toEqual([3, 5, 7]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn ($list 3))
        `).toEqual([[3]]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn ($list 3) ($list 5))
        `).toEqual([[3], [5]]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn ($list 3) ($list 5) ($list 7))
        `).toEqual([[3], [5], [7]]);
    });
    it("$lambda rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (...a)
                    a
                )
            )
            (fn ...($list 3 5 7))
        `).toEqual([3, 5, 7]);
    });
    it("$lambda normal and rest params", function() {
        expect(() => lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn)
        `).toThrow();
    });
    it("$lambda normal and rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn 3)
        `).toEqual([3, []]);
    });
    it("$lambda normal and rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn 3 5)
        `).toEqual([3, [5]]);
    });
    it("$lambda normal and rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn 3 5 7)
        `).toEqual([3, [5, 7]]);
    });
    it("$lambda normal and rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn ...($list 3 5 7))
        `).toEqual([3, [5, 7]]);
    });
    it("$lambda normal and rest params", function() {
        expect(lisp`
            ($let fn
                ($lambda (a ...b)
                    ($list a b)
                )
            )
            (fn ($list 3 5 7))
        `).toEqual([[3, 5, 7], []]);
    });
});


describe("operator.core.$defun", function() {
    it("$defun fac", function() {
        expect(lisp`
            ($defun fac (n)
                ($if (== n 0)
                    1
                    (* n ($self (- n 1))) ) )
            (fac 5)
        `).toEqual(120);
    });
    it("$defun fac w/o $self", function() {
        expect(lisp`
            ($defun fac (n)
                ($if (== n 0)
                    1
                    (* n (fac (- n 1))) ) )
            (fac 5)
        `).toEqual(120);
    });
    it("$defun normal and rest params", function() {
        expect(() => lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            (fn)
        `).toThrow();
    });
    it("$defun normal and rest params", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            (fn 3)
        `).toEqual([3, []]);
    });
    it("$defun normal and rest params", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            (fn 3 5)
        `).toEqual([3, [5]]);
    });
    it("$defun normal and rest params", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            (fn 3 5 7)
        `).toEqual([3, [5, 7]]);
    });
    it("$defun normal and rest params", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            (fn ($list 3 5 7))
        `).toEqual([[3, 5, 7], []]);
    });
});


describe("operator.core.$refun", function() {
    it("$refun #1", function() {
        expect(() => lisp`
            ($let fn ($refun aaaaa))
            (fn 3 5)
        `).toThrow();
    });
    it("$refun #2", function() {
        expect(lisp`
            ($let fn ($refun *))
            (fn 3 5)
        `).toEqual(15);
    });
    it("$refun #3", function() {
        expect(lisp`
            ($defun foo (a b) (+ a b))
            ($let fn ($refun foo))
            (fn 3 5)
        `).toEqual(8);
    });

    it("<- #1", function() {
        expect(() => lisp`
            ($let fn (<- aaaaa))
            (fn 3 5)
        `).toThrow();
    });
    it("<- #2", function() {
        expect(lisp`
            ($let fn (<- *))
            (fn 3 5)
        `).toEqual(15);
    });
    it("<- #3", function() {
        expect(lisp`
            ($defun foo (a b) (+ a b))
            ($let fn (<- foo))
            (fn 3 5)
        `).toEqual(8);
    });
});


describe("operator.core.$defmacro", function() {
    it("$defmacro 0a", function() {
        expect(lisp`
            ($let x 3)
            ($let y 5)
            ($let z 7)
            ($backquote (* ,x ,y ,z))
        `).toEqual([{symbol: '*'}, 3, 5, 7]);
    });
    it("$defmacro 0b", function() {
        expect(lisp`
            ($let x 3)
            ($let y 5)
            ($let z 7)
            \`(* ,x ,y ,z)
        `).toEqual([{symbol: '*'}, 3, 5, 7]);
    });
    it("$defmacro 0c", function() {
        expect(lisp`
            ($let x '(3 5))
            ($let y '(7 11))
            ($let z '(13 17))
            ($backquote (* ,x ,y ,z))
        `).toEqual([{symbol: '*'}, [3, 5], [7, 11], [13, 17]]);
    });
    it("$defmacro 0d", function() {
        expect(lisp`
            ($let x '(3 5))
            ($let y '(7 11))
            ($let z '(13 17))
            \`(* ,x ,y ,z)
        `).toEqual([{symbol: '*'}, [3, 5], [7, 11], [13, 17]]);
    });
    it("$defmacro 0e", function() {
        expect(lisp`
            ($let x '(3 5))
            ($let y '(7 11))
            ($let z '(13 17))
            ($backquote (* ,@x ,@y ,@z))
        `).toEqual([{symbol: '*'}, 3, 5, 7, 11, 13, 17]);
    });
    it("$defmacro 0f", function() {
        expect(lisp`
            ($let x '(3 5))
            ($let y '(7 11))
            ($let z '(13 17))
            \`(* ,@x ,@y ,@z)
        `).toEqual([{symbol: '*'}, 3, 5, 7, 11, 13, 17]);
    });
    /*
    it("$defmacro 0g", function() {
        expect(lisp`
            ($let x '(3 5))
            ($let y '(7 11))
            ($let z '(13 17))
            ($eval \`(* ,@x ,@y ,@z))
        `).toEqual(3 * 5 * 7 * 11 * 13 * 17);
    });
    it("$defmacro 1a", function() {
        expect(lisp`
            ($defmacro foo (x y z)
                ($backquote (* ,x ,y ,z))
            )
            (foo (+ 1 2) (+ 2 3) (+ 3 4))
        `).toEqual(3 * 5 * 7);
    });
    it("$defmacro 1b", function() {
        expect(lisp`
            ($defmacro foo (x y z)
                \`(* ,x ,y ,z)
            )
            (foo (+ 1 2) (+ 2 3) (+ 3 4))
        `).toEqual(3 * 5 * 7);
    });
    */
});


describe("operator.core.$apply", function() {
    it("$apply", function() {
        expect(() => lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply))
            (fn2)
        `).toThrow();
    });
    it("$apply", function() {
        expect(() => lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply (+ 3) (+ 5) (+ 7) (+ 11)))
            (fn2)
        `).toThrow();
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn (+ 3) (+ 5) (+ 7) (+ 11)))
            (fn2)
        `).toEqual([3, 5, 7, 11]);
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn 3 5 7 11))
            (fn2)
        `).toEqual([3, 5, 7, 11]);
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn 3 5 7))
            (fn2 11)
        `).toEqual([3, 5, 7, 11]);
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn 3 5))
            (fn2 7 11)
        `).toEqual([3, 5, 7, 11]);
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn 3))
            (fn2 5 7 11)
        `).toEqual([3, 5, 7, 11]);
    });
    it("$apply", function() {
        expect(lisp`
            ($let fn ($lambda (a b c d)
                ($list a b c d)
            ))
            ($let fn2 ($apply fn))
            (fn2 3 5 7 11)
        `).toEqual([3, 5, 7, 11]);
    });
});


describe("operator.core.$call", function() {
    it("$call -> throw", function() {
        expect(() => lisp`
            ($call)
        `).toThrow();
    });
    it("$call a -> throw", function() {
        expect(() => lisp`
            ($call ${'abcdefgh'})
        `).toThrow();
    });
    it("$call a b -> throw", function() {
        expect(() => lisp`
            ($call ${'abcdefgh'} qwerty)
        `).toThrow();
    });
    it("$call a b -> throw", function() {
        expect(() => lisp`
            ($call null toUpperCase)
        `).toThrow();
    });
    it("$call a b -> throw", function() {
        expect(() => lisp`
            ($call undefined toUpperCase)
        `).toThrow();
    });
    it("$call a b -> value", function() {
        expect(lisp`
            ($call ${'abcdefgh'} toUpperCase)
        `).toEqual('ABCDEFGH');
    });
    it("$call a b -> value", function() {
        expect(lisp`
            ($call ${'abcdefgh'} ($concat "toUpper" "Case"))
        `).toEqual('ABCDEFGH');
    });
    it("$call a b -> value", function() {
        expect(lisp`
            ($call ${'abcdefgh'} slice 3)
        `).toEqual('defgh');
    });
    it("$call a b c -> value", function() {
        expect(lisp`
            ($call ${'abcdefgh'} slice 3 5)
        `).toEqual('de');
    });
    it("$call a b c -> value", function() {
        expect(lisp`
            ($let foo ${'abcdefgh'})
            ($call foo slice 3 6)
        `).toEqual('def');
    });
});


describe("operator.core.$try", function() {
    it("$try throwing-expr catch-expr -> catch-expr", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn)
                (+ 3 5 7)
            )
        `).toEqual(15);
    });
    it("$try throwing-expr catch-expr -> catch-expr", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn)
                11
            )
        `).toEqual(11);
    });
    it("$try throwing-expr catch-expr c -> catch-expr", function() {
        expect(() => lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn)
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toThrow();
    });
    it("$try no-throw-expr catch-expr -> no-throw-expr", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn 3 5 7)
                (+ 3 5 7)
            )
        `).toEqual([3, [5, 7]]);
    });
    it("$try no-throw-expr catch-expr c -> throw", function() {
        expect(() => lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn 3 5 7)
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toThrow();
    });
    it("$try no-throw-expr catch-expr -> no-throw-expr", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn 3 5 7)
            )
        `).toEqual([3, [5, 7]]);
    });
    it("$try throwing-expr -> null", function() {
        expect(lisp`
            ($defun fn (a ...b)
                ($list a b)
            )
            ($try
                (fn)
            )
        `).toEqual(null);
    });
});


describe("operator.core.$raise", function() {
    it("$raise a -> throw a", function() {
        expect(() => lisp`
            ($raise 13)
        `).toThrow(13);
    });
    it("$raise a -> throw a", function() {
        expect(() => lisp`
            ($raise "abcde")
        `).toThrow("abcde");
    });
    it("$raise -> throw null", function() {
        expect(() => lisp`
            ($raise)
        `).toThrow(null);
    });
});


describe("operator.core.$if", function() {
    it("$if true a -> a", function() {
        expect(lisp`
            ($if true
                (+ 3 5 7)
            )
        `).toEqual(15);
    });
    it("$if true a b -> a", function() {
        expect(lisp`
            ($if true
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if true a b c -> throw", function() {
        expect(() => lisp`
            ($if true
                (+ 3 5 7)
                (+ 11 13 17)
                (+ 19 23 29)
            )
        `).toThrow();
    });
    it("$if false a -> null", function() {
        expect(lisp`
            ($if false
                (+ 3 5 7)
            )
        `).toEqual(null);
    });
    it("$if false a b -> b", function() {
        expect(lisp`
            ($if false
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if false a b c -> throw", function() {
        expect(() => lisp`
            ($if false
                (+ 3 5 7)
                (+ 11 13 17)
                (+ 19 23 29)
            )
        `).toThrow();
    });
    it("$if undefined a b -> b", function() {
        expect(lisp`
            ($if undefined
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if null a b -> b", function() {
        expect(lisp`
            ($if null
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if nil a b -> b", function() {
        expect(lisp`
            ($if nil
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if () a b -> b", function() {
        expect(lisp`
            ($if ()
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if 0 a b -> b", function() {
        expect(lisp`
            ($if 0
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if (0) a b -> a", function() {
        expect(lisp`
            ($if '(0)
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if (1) a b -> a", function() {
        expect(lisp`
            ($if '(1)
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if 1 a b -> a", function() {
        expect(lisp`
            ($if 1
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if -1 a b -> a", function() {
        expect(lisp`
            ($if -1
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if NaN a b -> a", function() {
        expect(lisp`
            ($if NaN
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if +Infinity a b -> a", function() {
        expect(lisp`
            ($if +Infinity
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if -Infinity a b -> a", function() {
        expect(lisp`
            ($if -Infinity
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if \"\" a b -> a", function() {
        expect(lisp`
            ($if ""
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(41);
    });
    it("$if \" \" a b -> a", function() {
        expect(lisp`
            ($if " "
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if \"0\" a b -> a", function() {
        expect(lisp`
            ($if "0"
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
    it("$if \"1\" a b -> a", function() {
        expect(lisp`
            ($if "1"
                (+ 3 5 7)
                (+ 11 13 17)
            )
        `).toEqual(15);
    });
});


describe("operator.core.??", function() {
    it("?? 3 -> 0", function() {
        expect(lisp`(?? "3" 11)`).toEqual("3");
    });
    it("?? 3 -> 0", function() {
        expect(lisp`(?? 3 11)`).toEqual(3);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? 0 11)`).toEqual(0);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? null 11)`).toEqual(11);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? "null" 11)`).toEqual("null");
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? nil 11)`).toEqual(11);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? undefined 11)`).toEqual(11);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? "undefined" 11)`).toEqual("undefined");
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? NaN 11)`).toEqual(NaN);
    });
    it("?? 0 -> 0", function() {
        expect(lisp`(?? "NaN" 11)`).toEqual("NaN");
    });
});


describe("operator.core.$cond", function() {
    it("x=A; $cond A a B b C c -> a", function() {
        expect(lisp`
            ($let x 3)
            ($cond
                (== x 3) (+ 3 5 7)
                (== x 5) (+ 11 13 17)
                (== x 7) (+ 19 23 29)
            )
        `).toEqual(15);
    });
    it("x=A; $cond A a B b C c -> a", function() {
        expect(lisp`
            ($let x "3")
            ($cond
                (== x 3) (+ 3 5 7)
                (== x 5) (+ 11 13 17)
                (== x 7) (+ 19 23 29)
            )
        `).toEqual(15);
    });
    it("x=B; $cond A a B b C c -> b", function() {
        expect(lisp`
            ($let x 5)
            ($cond
                (== x 3) (+ 3 5 7)
                (== x 5) (+ 11 13 17)
                (== x 7) (+ 19 23 29)
            )
        `).toEqual(41);
    });
    it("x=B; $cond A a B b C c -> b", function() {
        expect(lisp`
            ($let x 5)
            ($cond
                (== x 3) (+ 3 5 7)
                (== x "5") (+ 11 13 17)
                (== x 7) (+ 19 23 29)
            )
        `).toEqual(41);
    });
    it("x=C; $cond A a B b C c -> c", function() {
        expect(lisp`
            ($let x "7")
            ($cond
                (== x 3) (+ 3 5 7)
                (== x 5) (+ 11 13 17)
                (== x "7") (+ 19 23 29)
            )
        `).toEqual(71);
    });
    it("x=D; $cond A a B b C c -> null", function() {
        expect(lisp`
            ($let x 11)
            ($cond
                (== x 3) (+ 3 5 7)
                (== x 5) (+ 11 13 17)
                (== x 7) (+ 19 23 29)
            )
        `).toEqual(null);
    });
});


describe("operator.core.$while", function() {
    it("$while 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($while (< x 100)
                ($set y x)
                ($set x (+ x 1))
                y
            )
        `).toEqual(99);
    });
    it("$while 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($while (< x 100)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(99);
    });
    it("$while 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($while (< x 1)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$while 0 times -> null", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($while (< x 0)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(null);
    });
    it("$while 0 times -> null", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($while (< x -1)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(null);
    });
});


describe("operator.core.$do-while", function() {
    it("$do-while 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-while (< x 100)
                ($set y x)
                ($set x (+ x 1))
                y
            )
        `).toEqual(99);
    });
    it("$do-while 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-while (< x 100)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(99);
    });
    it("$do-while 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-while (< x 1)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$do-while 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-while (< x 0)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$do-while 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-while (< x -1)
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
});


describe("operator.core.$until", function() {
    it("$until 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($until ($not (< x 100))
                ($set y x)
                ($set x (+ x 1))
                y
            )
        `).toEqual(99);
    });
    it("$until 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($until ($not (< x 100))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(99);
    });
    it("$until 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($until ($not (< x 1))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$until 0 times -> null", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($until ($not (< x 0))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(null);
    });
    it("$until 0 times -> null", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($until ($not (< x -1))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(null);
    });
});


describe("operator.core.$do-until", function() {
    it("$do-until 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-until ($not (< x 100))
                ($set y x)
                ($set x (+ x 1))
                y
            )
        `).toEqual(99);
    });
    it("$do-until 100 times -> 99", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-until ($not (< x 100))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(99);
    });
    it("$do-until 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-until ($not (< x 1))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$do-until 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-until ($not (< x 0))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
    it("$do-until 1 time -> 0", function() {
        expect(lisp`
            ($let x 0)
            ($let y null)
            ($do-until ($not (< x -1))
                ($set y x)
                ($set x (+ x 1))
            )
            ($get y)
        `).toEqual(0);
    });
});


describe("operator.core.$repeat", function() {
    it("$repeat w/o symbol -> throw", function() {
        expect(() => lisp`
            ($let y null)
            ($let z null)
            ($repeat "i" of (+ 100)
                ($set y i)
                ($set z i)
            )
        `).toThrow();
    });
    it("$repeat 100 times -> 99", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ 100)
                ($set y i)
                ($set z i)
            )
        `).toEqual(99);
    });
    it("$repeat 100 times -> 99", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ 100)
                ($set y i)
                ($set z (+ i 1))
            )
            ($list y z)
        `).toEqual([99, 100]);
    });
    it("$repeat 100 times -> 99", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ 100)
                ($set y i)
                ($set z i)
            )
            ($get y)
        `).toEqual(99);
    });
    it("$repeat 1 time -> 0", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ 1)
                ($set y i)
                ($set z i)
            )
            ($get y)
        `).toEqual(0);
    });
    it("$repeat 0 times -> null", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ 0)
                ($set y i)
                ($set z i)
            )
            ($get y)
        `).toEqual(null);
    });
    it("$repeat 0 times -> null", function() {
        expect(lisp`
            ($let y null)
            ($let z null)
            ($repeat i of (+ -1)
                ($set y i)
                ($set z i)
            )
            ($get y)
        `).toEqual(null);
    });
});


describe("operator.core.$for", function() {
    it("$for w/o symbol -> throw", function() {
        expect(() => lisp`
            ($let y 0)
            ($let z null)
            ($for "x" of ($list 3 5 7 11)
                ($set y i)
                ($set z i)
            )
        `).toThrow();
    });
    it("$for w/o list -> throw", function() {
        expect(() => lisp`
            ($let y 0)
            ($let z null)
            ($for x of 3
                ($set y i)
                ($set z i)
            )
        `).toThrow();
    });
    it("$for w/o list -> throw", function() {
        expect(() => lisp`
            ($let y 0)
            ($let z null)
            ($for x of "3"
                ($set y i)
                ($set z i)
            )
        `).toThrow();
    });
    it("$for w/o list -> throw", function() {
        expect(() => lisp`
            ($let y 0)
            ($let z null)
            ($for x of null
                ($set y i)
                ($set z i)
            )
        `).toThrow();
    });
    it("$for 4 times -> 11", function() {
        expect(lisp`
            ($let y 0)
            ($let z null)
            ($for x of ($list 3 5 7 11)
                ($set y (+ y x))
                ($set z x)
            )
        `).toEqual(11);
    });
    it("$for 4 times -> 26", function() {
        expect(lisp`
        ($let y 0)
            ($let z null)
            ($for x of ($list 3 5 7 11)
                ($set y (+ y x))
                ($set z x)
            )
            ($get y)
        `).toEqual(26);
    });
    it("$for 1 time -> 3", function() {
        expect(lisp`
            ($let y 0)
            ($let z null)
            ($for x of ($list 3)
                ($set y (+ y x))
                ($set z x)
            )
            ($get y)
        `).toEqual(3);
    });
    it("$for 0 times -> 0", function() {
        expect(lisp`
            ($let y 0)
            ($let z null)
            ($for x of ()
                ($set y (+ y x))
                ($set z x)
            )
            ($get y)
        `).toEqual(0);
    });
});


describe("operator.core.$pipe", function() {
    it("$pipe -> throw", function() {
        expect(() => lisp`($pipe)`).toThrow();
    });
    it("$pipe a pipe ... pipe -> value", function() {
        expect(lisp`
            ($pipe '(3 5 7 11) (-> (x) ($[ 2 ] x)) (-> (x) (+ x 30)) (-> (x) (+ x 100)))
        `).toEqual(137);
    });
    it("$pipe a pipe ... pipe -> value", function() {
        expect(lisp`
            ($pipe ($list 3 5 7 11) (-> (x) ($[ 3 ] x)) (-> (x) (+ x 30)) (-> (x) (+ x 100)))
        `).toEqual(141);
    });
    it("$pipe a pipe ... pipe -> value", function() {
        expect(lisp`
            ($pipe ($list 3 5 7 11) (-> (x) ($[ 3 ] x)) ${(x: any) => x + 40} (-> (x) (+ x 100)))
        `).toEqual(151);
    });
});


describe("operator.core.$get", function() {
    it("$get -> throw", function() {
        expect(() => lisp`($get)`).toThrow();
    });
    it("$get a -> throw", function() {
        expect(() => lisp`($get foo)`).toThrow();
    });
    it("$get a -> throw", function() {
        expect(() => lisp`($get "foo")`).toThrow();
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo 3)
            ($get foo)
        `).toEqual(3);
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo 3)
            ($get "foo")
        `).toEqual(3);
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo "5")
            ($get foo)
        `).toEqual('5');
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo null)
            ($get foo)
        `).toEqual(null);
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo nil)
            ($get foo)
        `).toEqual([]);
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo '(7))
            ($get foo)
        `).toEqual([7]);
    });
    it("$get a -> value", function() {
        expect(lisp`
            ($let foo (#))
            ($get foo)
        `).toEqual({} as any);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar "3")
                    (baz 5)
                )
            )
            ($get foo bar)
        `).toEqual('3');
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let bar "baz")
            ($let foo
                (#
                    (bar "3")
                    (baz 5)
                )
            )
            ($get foo bar)
        `).toEqual('3');
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar "3")
                    (baz 5)
                )
            )
            ($get foo baz)
        `).toEqual(5);
    });
    it("$get a path ... path -> undefined", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar "3")
                    (baz 5)
                )
            )
            ($get foo qwerty)
        `).toEqual((void 0) as any);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar 0)
        `).toEqual(7);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar 1 qwe)
        `).toEqual(11);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar 1 asd)
        `).toEqual(13);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar -1 asd)
        `).toEqual(13);
    });
    it("$get a path ... path -> value", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar -2)
        `).toEqual(7);
    });
    it("$get a path ... path -> undefined", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar -3)
        `).toEqual((void 0) as any);
    });
    it("$get a path ... path -> undefined", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar 2)
        `).toEqual((void 0) as any);
    });
    it("$get a path ... path -> throw", function() {
        expect(() => lisp`
            ($let foo
                (#
                    (bar ($list
                        7
                        (#
                            (qwe 11)
                            (asd 13)
                        )
                    ))
                    (baz 5)
                )
            )
            ($get foo bar 2 asd)
        `).toThrow();
    });
    it("$get a path ... path -> throw", function() {
        expect(lisp`
            ($let foo
                ${{
                    bar: [7, {qwe: 11, asd: 13}],
                    baz: 5,
                }}
            )
            ($get foo bar 1 asd)
        `).toEqual(13);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 0)
        `).toEqual(3);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 1)
        `).toEqual(5);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 2)
        `).toEqual(7);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 3)
        `).toEqual(11);
    });
    it("$get a index -> undefined", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 4)
        `).toEqual((void 0) as any);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo -1)
        `).toEqual(11);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo -2)
        `).toEqual(7);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo -3)
        `).toEqual(5);
    });
    it("$get a index -> value", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo -4)
        `).toEqual(3);
    });
    it("$get a index -> undefined", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo -5)
        `).toEqual((void 0) as any);
    });
    it("$get a path ... path -> value; pipe", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($get foo 1 (-> (x) (+ x 30)) (-> (x) (+ x 100)))
        `).toEqual(135);
    });
    it("$get a path ... path -> value; pipe", function() {
        expect(lisp`
            ($get '(3 5 7 11) 2 (-> (x) (+ x 30)) (-> (x) (+ x 100)))
        `).toEqual(137);
    });
    it("$get a path ... path -> value; pipe", function() {
        expect(lisp`
            ($get ($list 3 5 7 11) 3 (-> (x) (+ x 30)) (-> (x) (+ x 100)))
        `).toEqual(141);
    });
    it("$get a path ... path -> value; pipe", function() {
        expect(lisp`
            ($get ($list 3 5 7 11) 3 ${(x: any) => x + 40} (-> (x) (+ x 100)))
        `).toEqual(151);
    });
});


describe("operator.core.$let", function() {
    it("$let -> throw", function() {
        expect(() => lisp`($let)`).toThrow();
    });
    it("$let a -> throw", function() {
        expect(() => lisp`($let foo)`).toThrow();
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo 3)`).toEqual(3);
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo 3)($get foo)`).toEqual(3);
    });
    it("$let a b -> b", function() {
        expect(lisp`($let "foo" 5)`).toEqual(5);
    });
    it("$let a b -> b", function() {
        expect(lisp`($let "foo" 5)($get foo)`).toEqual(5);
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo "7")`).toEqual("7");
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo "7")($get foo)`).toEqual("7");
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo (+ 11 13))`).toEqual(24);
    });
    it("$let a b -> b", function() {
        expect(lisp`($let foo (+ 11 13))($get foo)`).toEqual(24);
    });
});


describe("operator.core.$set", function() {
    it("$set -> throw", function() {
        expect(() => lisp`($set)`).toThrow();
    });
    it("$set a -> throw", function() {
        expect(() => lisp`($set foo)`).toThrow();
    });
    it("$set a -> throw", function() {
        expect(() => lisp`($let foo 3)($set foo)`).toThrow();
    });
    it("$set a -> throw", function() {
        expect(() => lisp`($set foo 5)`).toThrow();
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo 5)`).toEqual(5);
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo 5)($get foo)`).toEqual(5);
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set "foo" 5)`).toEqual(5);
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set "foo" 5)($get foo)`).toEqual(5);
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo "5")`).toEqual("5");
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo "5")($get foo)`).toEqual("5");
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo (+ 5 7))`).toEqual(12);
    });
    it("$set a b -> b", function() {
        expect(lisp`($let foo 3)($set foo (+ 5 7))($get foo)`).toEqual(12);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar 1 asd) (+ 13 17))
        `).toEqual(30);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar 1 asd) (+ 13 17))
            ($get foo bar 1 asd)
        `).toEqual(30);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar 1 asd) (+ 13 17))
            ($get foo)
        `).toEqual({
            bar: [
                3,
                {
                    qwe: 5,
                    asd: 30,
                },
            ],
            baz: 11,
        } as any);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let bar "baz")
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar 1 asd) (+ 13 17))
        `).toEqual(30);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar 1 zxc) (+ 13 17))
            ($get foo)
        `).toEqual({
            bar: [
                3,
                {
                    qwe: 5,
                    asd: 7,
                    zxc: 30,
                },
            ],
            baz: 11,
        } as any);
    });
    it("$set a b -> b", function() {
        expect(() => lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar -2 zxc) (+ 13 17))
            ($get foo)
        `).toThrow();
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar ($list
                        3
                        (#
                            (qwe 5)
                            (asd 7)
                        )
                    ))
                    (baz 11)
                )
            )
            ($set (foo bar -1 zxc) (+ 13 17))
            ($get foo)
        `).toEqual({
            bar: [
                3,
                {
                    qwe: 5,
                    asd: 7,
                    zxc: 30,
                },
            ],
            baz: 11,
        } as any);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 0) (+ 13 17))
            ($get foo)
        `).toEqual([30, 5, 7, 11]);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 0) (+ 13 17))
            ($get foo 0)
        `).toEqual(30);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 3) (+ 13 17))
            ($get foo)
        `).toEqual([3, 5, 7, 30]);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 3) (+ 13 17))
            ($get foo 3)
        `).toEqual(30);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo -1) (+ 13 17))
            ($get foo)
        `).toEqual([3, 5, 7, 30]);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo -4) (+ 13 17))
            ($get foo)
        `).toEqual([30, 5, 7, 11]);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 4) (+ 13 17))
            ($get foo)
        `).toEqual([3, 5, 7, 11, 30]);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 5) (+ 13 17))
            ($get foo)
        `).toEqual([3, 5, 7, 11, void 0, 30] as any);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo 5) (+ 13 17))
            ($length foo)
        `).toEqual(6);
    });
    it("$set a b -> b", function() {
        const r = [3, 5, 7, 11];
        r["-1"] = 30;
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo -5) (+ 13 17))
            ($get foo)
        `).toEqual(r);
    });
    it("$set a b -> b", function() {
        expect(lisp`
            ($let foo
                '(3 5 7 11)
            )
            ($set (foo -5) (+ 13 17))
            ($length foo)
        `).toEqual(4);
    });
    it("$set a path ... path -> value; pipe", function() {
        expect(lisp`
            ($let foo
                (#
                    (bar (#
                        (baz (#
                            (qwe 5)
                            (asd 7)
                        ))
                    ))
                )
            )
            ($set (
                foo
                (-> (x) ($get x bar))
                (-> (x) ($get x baz))
                asd
            ) (+ 13 17))
            ($get foo)
        `).toEqual({
            bar: {
                baz: {
                    qwe: 5,
                    asd: 30,
                },
            },
        } as any);
    });
    it("$set a path ... path -> value; pipe", function() {
        expect(() => lisp`
            ($let foo
                (#
                    (bar (#
                        (baz (#
                            (qwe 5)
                            (asd 7)
                        ))
                    ))
                )
            )
            ($set (
                foo
                (-> (x) ($get x bar))
                (-> (x) ($get x baz asd))
            ) (+ 13 17))
            ($get foo)
        `).toThrow();
    });
});


describe("operator.core.$boolean", function() {
    it("$boolean -> throw", function() {
        expect(() => lisp`($boolean)`).toThrow();
    });
    it("$boolean undefined -> false", function() {
        expect(lisp`($boolean undefined)`).toEqual(false);
    });
    it("$boolean null -> false", function() {
        expect(lisp`($boolean null)`).toEqual(false);
    });
    it("$boolean nil -> false", function() {
        expect(lisp`($boolean nil)`).toEqual(false);
    });
    it("$boolean () -> false", function() {
        expect(lisp`($boolean ())`).toEqual(false);
    });
    it("$boolean (0) -> false", function() {
        expect(lisp`($boolean '(0))`).toEqual(true);
    });
    it("$boolean 0 -> false", function() {
        expect(lisp`($boolean 0)`).toEqual(false);
    });
    it("$boolean -1 -> true", function() {
        expect(lisp`($boolean -1)`).toEqual(true);
    });
    it("$boolean 1 -> true", function() {
        expect(lisp`($boolean 1)`).toEqual(true);
    });
    it("$boolean NaN -> true", function() {
        expect(lisp`($boolean NaN)`).toEqual(false);
    });
    it("$boolean +Infinity -> true", function() {
        expect(lisp`($boolean +Infinity)`).toEqual(true);
    });
    it("$boolean -Infinity -> true", function() {
        expect(lisp`($boolean -Infinity)`).toEqual(true);
    });
    it("$boolean \"\" -> true", function() {
        expect(lisp`($boolean "")`).toEqual(false);
    });
    it("$boolean \"0\" -> true", function() {
        expect(lisp`($boolean "0")`).toEqual(true);
    });
    it("$boolean \"1\" -> true", function() {
        expect(lisp`($boolean "1")`).toEqual(true);
    });
    it("$boolean \"false\" -> true", function() {
        expect(lisp`($boolean "false")`).toEqual(true);
    });
    it("$boolean (#) -> true", function() {
        expect(lisp`($boolean (#))`).toEqual(true);
    });
});


describe("operator.core.$not", function() {
    it("$not -> throw", function() {
        expect(() => lisp`($not)`).toThrow();
    });
    it("$not $boolean undefined -> false", function() {
        expect(lisp`($not ($boolean undefined))`).toEqual(true);
    });
    it("$not $boolean null -> false", function() {
        expect(lisp`($not ($boolean null))`).toEqual(true);
    });
    it("$not $boolean nil -> false", function() {
        expect(lisp`($not ($boolean nil))`).toEqual(true);
    });
    it("$not $boolean () -> false", function() {
        expect(lisp`($not ($boolean ()))`).toEqual(true);
    });
    it("$not $boolean (0) -> false", function() {
        expect(lisp`($not ($boolean '(0)))`).toEqual(false);
    });
    it("$not $boolean 0 -> false", function() {
        expect(lisp`($not ($boolean 0))`).toEqual(true);
    });
    it("$not $boolean -1 -> true", function() {
        expect(lisp`($not ($boolean -1))`).toEqual(false);
    });
    it("$not $boolean 1 -> true", function() {
        expect(lisp`($not ($boolean 1))`).toEqual(false);
    });
    it("$not $boolean NaN -> true", function() {
        expect(lisp`($not ($boolean NaN))`).toEqual(true);
    });
    it("$not $boolean +Infinity -> true", function() {
        expect(lisp`($not ($boolean +Infinity))`).toEqual(false);
    });
    it("$not $boolean -Infinity -> true", function() {
        expect(lisp`($not ($boolean -Infinity))`).toEqual(false);
    });
    it("$not $boolean \"\" -> true", function() {
        expect(lisp`($not ($boolean ""))`).toEqual(true);
    });
    it("$not $boolean \"0\" -> true", function() {
        expect(lisp`($not ($boolean "0"))`).toEqual(false);
    });
    it("$not $boolean \"1\" -> true", function() {
        expect(lisp`($not ($boolean "1"))`).toEqual(false);
    });
    it("$not $boolean \"false\" -> true", function() {
        expect(lisp`($not ($boolean "false"))`).toEqual(false);
    });
    it("$not $boolean (#) -> true", function() {
        expect(lisp`($not ($boolean (#)))`).toEqual(false);
    });
});


describe("operator.core.$and", function() {
    it("$and -> throw", function() {
        expect(() => lisp`($and)`).toThrow();
    });
    it("$and true -> true", function() {
        expect(lisp`($and true)`).toEqual(true);
    });
    it("$and false -> false", function() {
        expect(lisp`($and false)`).toEqual(false);
    });
    it("$and true false -> false", function() {
        expect(lisp`($and true false)`).toEqual(false);
    });
    it("$and false true -> false", function() {
        expect(lisp`($and false true)`).toEqual(false);
    });
    it("$and false false -> false", function() {
        expect(lisp`($and false false)`).toEqual(false);
    });
    it("$and true true -> true", function() {
        expect(lisp`($and true true)`).toEqual(true);
    });
    it("$and false true true -> false", function() {
        expect(lisp`($and false true true)`).toEqual(false);
    });
    it("$and true true false -> false", function() {
        expect(lisp`($and true true false)`).toEqual(false);
    });
    it("$and true true true -> true", function() {
        expect(lisp`($and true true true)`).toEqual(true);
    });
    it("$and 1 0 ? -> 0", function() {
        expect(lisp`
            ($let x 2)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
        `).toEqual(0);
    });
    it("$and 1 0 ? -> 0", function() {
        expect(lisp`
            ($let x 2)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
            ($get x)
        `).toEqual(0);
    });
    it("$and 2 1 0 -> 0", function() {
        expect(lisp`
            ($let x 3)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
        `).toEqual(0);
    });
    it("$and 2 1 0 -> 0", function() {
        expect(lisp`
            ($let x 3)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
            ($get x)
        `).toEqual(0);
    });
    it("$and 3 2 1 -> 1", function() {
        expect(lisp`
            ($let x 4)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
        `).toEqual(1);
    });
    it("$and 3 2 1 -> 1", function() {
        expect(lisp`
            ($let x 4)
            ($and
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
            ($get x)
        `).toEqual(1);
    });
});


describe("operator.core.$or", function() {
    it("$or -> throw", function() {
        expect(() => lisp`($or)`).toThrow();
    });
    it("$or true -> true", function() {
        expect(lisp`($or true)`).toEqual(true);
    });
    it("$or false -> false", function() {
        expect(lisp`($or false)`).toEqual(false);
    });
    it("$or true false -> false", function() {
        expect(lisp`($or true false)`).toEqual(true);
    });
    it("$or false true -> false", function() {
        expect(lisp`($or false true)`).toEqual(true);
    });
    it("$or false false -> false", function() {
        expect(lisp`($or false false)`).toEqual(false);
    });
    it("$or true true -> true", function() {
        expect(lisp`($or true true)`).toEqual(true);
    });
    it("$or false true true -> false", function() {
        expect(lisp`($or false true true)`).toEqual(true);
    });
    it("$or true true false -> false", function() {
        expect(lisp`($or true true false)`).toEqual(true);
    });
    it("$or true true true -> true", function() {
        expect(lisp`($or true true true)`).toEqual(true);
    });
    it("$or 2 ? ? -> 2", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
        `).toEqual(2);
    });
    it("$or 2 ? ? -> 2", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x (- x 1))
                ($set x (- x 1))
                ($set x (- x 1))
            )
            ($get x)
        `).toEqual(2);
    });
    it("$or 0 \"\" 1 -> 1", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x 0)
                ($set x "")
                ($set x 1)
            )
        `).toEqual(1);
    });
    it("$or 0 \"\" 1 -> 1", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x 0)
                ($set x "")
                ($set x 1)
            )
            ($get x)
        `).toEqual(1);
    });
    it("$or 0 \"\" () -> ()", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x 0)
                ($set x "")
                ($set x ())
            )
        `).toEqual([]);
    });
    it("$or 0 \"\" () -> ()", function() {
        expect(lisp`
            ($let x 3)
            ($or
                ($set x 0)
                ($set x "")
                ($set x ())
            )
            ($get x)
        `).toEqual([]);
    });
});


describe("operator.core.==", function() {
    it("== -> throw", function() {
        expect(() => lisp`(==)`).toThrow();
    });
    it("== a -> throw", function() {
        expect(() => lisp`(== 1)`).toThrow();
    });
    it("== a a -> true", function() {
        expect(lisp`(== 1 1)`).toEqual(true);
    });
    it("== a a -> true", function() {
        expect(lisp`(== "1" "1")`).toEqual(true);
    });
    it("== a a -> true", function() {
        expect(lisp`(== 1 "1")`).toEqual(true);
    });
    it("== a a -> true", function() {
        expect(lisp`(== true true)`).toEqual(true);
    });
    it("== a a -> true", function() {
        expect(lisp`(== false false)`).toEqual(true);
    });
    it("== a a -> true", function() {
        expect(lisp`($let x (#)) (== x x)`).toEqual(true);
    });
    it("== null null -> true", function() {
        expect(lisp`(== null null)`).toEqual(true);
    });
    it("== undefined undefined -> true", function() {
        expect(lisp`(== undefined undefined)`).toEqual(true);
    });
    it("== +Infinity +Infinity -> true", function() {
        expect(lisp`(== +Infinity +Infinity)`).toEqual(true);
    });
    it("== -Infinity -Infinity -> true", function() {
        expect(lisp`(== -Infinity -Infinity)`).toEqual(true);
    });
    it("== +Infinity -Infinity -> false", function() {
        expect(lisp`(== +Infinity -Infinity)`).toEqual(false);
    });
    it("== NaN NaN -> false", function() {
        expect(lisp`(== NaN NaN)`).toEqual(false);
    });
    it("== null null -> true", function() {
        expect(lisp`(== null null)`).toEqual(true);
    });
    it("== nil nil -> true", function() {
        expect(lisp`(== nil nil)`).toEqual(true);
    });
    it("== () () -> true", function() {
        expect(lisp`(== () ())`).toEqual(true);
    });
    it("== () nil -> true", function() {
        expect(lisp`(== () nil)`).toEqual(true);
    });
    it("== () null -> true", function() {
        expect(lisp`(== () null)`).toEqual(true);
    });
    it("== (a) (a) -> false", function() {
        expect(lisp`(== '(1) '(1))`).toEqual(false);
    });
    it("== a b -> false", function() {
        expect(lisp`(== 1 -1)`).toEqual(false);
    });
    it("== a b -> false", function() {
        expect(lisp`(== (#) (#))`).toEqual(false);
    });
});


describe("operator.core.!=", function() {
    it("!= -> throw", function() {
        expect(() => lisp`(!=)`).toThrow();
    });
    it("!= a -> throw", function() {
        expect(() => lisp`(!= 1)`).toThrow();
    });
    it("!= a a -> false", function() {
        expect(lisp`(!= 1 1)`).toEqual(false);
    });
    it("!= a a -> false", function() {
        expect(lisp`(!= "1" "1")`).toEqual(false);
    });
    it("!= a a -> false", function() {
        expect(lisp`(!= 1 "1")`).toEqual(false);
    });
    it("!= a a -> false", function() {
        expect(lisp`(!= true true)`).toEqual(false);
    });
    it("!= a a -> false", function() {
        expect(lisp`(!= false false)`).toEqual(false);
    });
    it("!= a a -> false", function() {
        expect(lisp`($let x (#)) (!= x x)`).toEqual(false);
    });
    it("!= null null -> false", function() {
        expect(lisp`(!= null null)`).toEqual(false);
    });
    it("!= undefined undefined -> false", function() {
        expect(lisp`(!= undefined undefined)`).toEqual(false);
    });
    it("!= +Infinity +Infinity -> false", function() {
        expect(lisp`(!= +Infinity +Infinity)`).toEqual(false);
    });
    it("!= -Infinity -Infinity -> false", function() {
        expect(lisp`(!= -Infinity -Infinity)`).toEqual(false);
    });
    it("!= +Infinity -Infinity -> true", function() {
        expect(lisp`(!= +Infinity -Infinity)`).toEqual(true);
    });
    it("!= NaN NaN -> true", function() {
        expect(lisp`(!= NaN NaN)`).toEqual(true);
    });
    it("!= null null -> false", function() {
        expect(lisp`(!= null null)`).toEqual(false);
    });
    it("!= nil nil -> false", function() {
        expect(lisp`(!= nil nil)`).toEqual(false);
    });
    it("!= () () -> false", function() {
        expect(lisp`(!= () ())`).toEqual(false);
    });
    it("!= () nil -> false", function() {
        expect(lisp`(!= () nil)`).toEqual(false);
    });
    it("!= () null -> false", function() {
        expect(lisp`(!= () null)`).toEqual(false);
    });
    it("!= (a) (a) -> true", function() {
        expect(lisp`(!= '(1) '(1))`).toEqual(true);
    });
    it("!= a b -> true", function() {
        expect(lisp`(!= 1 -1)`).toEqual(true);
    });
    it("!= a b -> true", function() {
        expect(lisp`(!= (#) (#))`).toEqual(true);
    });
});


describe("operator.core.<", function() {
    it("< -> throw", function() {
        expect(() => lisp`(<)`).toThrow();
    });
    it("< a -> throw", function() {
        expect(() => lisp`(< 1)`).toThrow();
    });
    it("< 0 1 -> true", function() {
        expect(lisp`(< 0 1)`).toEqual(true);
    });
    it("< \"0\" \"1\" -> true", function() {
        expect(lisp`(< "0" "1")`).toEqual(true);
    });
    it("< 1 1 -> false", function() {
        expect(lisp`(< 1 1)`).toEqual(false);
    });
    it("< \"1\" \"1\" -> false", function() {
        expect(lisp`(< "1" "1")`).toEqual(false);
    });
    it("< 0 -1 -> false", function() {
        expect(lisp`(< 0 -1)`).toEqual(false);
    });
    it("< \"0\" \"-1\" -> false", function() {
        expect(lisp`(< "0" "-1")`).toEqual(false);
    });
    it("< NaN NaN -> false", function() {
        expect(lisp`(< NaN NaN)`).toEqual(false);
    });
    it("< NaN 0 -> false", function() {
        expect(lisp`(< NaN 0)`).toEqual(false);
    });
    it("< 0 NaN -> false", function() {
        expect(lisp`(< 0 NaN)`).toEqual(false);
    });
    it("< -Infinity +Infinity -> true", function() {
        expect(lisp`(< -Infinity +Infinity)`).toEqual(true);
    });
    it("< 0 +Infinity -> true", function() {
        expect(lisp`(< 0 +Infinity)`).toEqual(true);
    });
    it("< +Infinity 0 -> false", function() {
        expect(lisp`(< +Infinity 0)`).toEqual(false);
    });
    it("< 0 -Infinity -> false", function() {
        expect(lisp`(< 0 -Infinity)`).toEqual(false);
    });
    it("< -Infinity 0 -> true", function() {
        expect(lisp`(< -Infinity 0)`).toEqual(true);
    });
});


describe("operator.core.<=", function() {
    it("<= -> throw", function() {
        expect(() => lisp`(<=)`).toThrow();
    });
    it("<= a -> throw", function() {
        expect(() => lisp`(<= 1)`).toThrow();
    });
    it("<= 0 1 -> true", function() {
        expect(lisp`(<= 0 1)`).toEqual(true);
    });
    it("<= \"0\" \"1\" -> true", function() {
        expect(lisp`(<= "0" "1")`).toEqual(true);
    });
    it("<= 1 1 -> true", function() {
        expect(lisp`(<= 1 1)`).toEqual(true);
    });
    it("<= \"1\" \"1\" -> true", function() {
        expect(lisp`(<= "1" "1")`).toEqual(true);
    });
    it("<= 0 -1 -> false", function() {
        expect(lisp`(<= 0 -1)`).toEqual(false);
    });
    it("<= \"0\" \"-1\" -> false", function() {
        expect(lisp`(<= "0" "-1")`).toEqual(false);
    });
    it("<= NaN NaN -> false", function() {
        expect(lisp`(<= NaN NaN)`).toEqual(false);
    });
    it("<= NaN 0 -> false", function() {
        expect(lisp`(<= NaN 0)`).toEqual(false);
    });
    it("<= 0 NaN -> false", function() {
        expect(lisp`(<= 0 NaN)`).toEqual(false);
    });
    it("<= -Infinity +Infinity -> true", function() {
        expect(lisp`(<= -Infinity +Infinity)`).toEqual(true);
    });
    it("<= 0 +Infinity -> true", function() {
        expect(lisp`(<= 0 +Infinity)`).toEqual(true);
    });
    it("<= +Infinity 0 -> false", function() {
        expect(lisp`(<= +Infinity 0)`).toEqual(false);
    });
    it("<= 0 -Infinity -> false", function() {
        expect(lisp`(<= 0 -Infinity)`).toEqual(false);
    });
    it("<= -Infinity 0 -> true", function() {
        expect(lisp`(<= -Infinity 0)`).toEqual(true);
    });
});


describe("operator.core.>", function() {
    it("> -> throw", function() {
        expect(() => lisp`(>)`).toThrow();
    });
    it("> a -> throw", function() {
        expect(() => lisp`(> 1)`).toThrow();
    });
    it("> 0 1 -> false", function() {
        expect(lisp`(> 0 1)`).toEqual(false);
    });
    it("> \"0\" \"1\" -> false", function() {
        expect(lisp`(> "0" "1")`).toEqual(false);
    });
    it("> 1 1 -> false", function() {
        expect(lisp`(> 1 1)`).toEqual(false);
    });
    it("> \"1\" \"1\" -> false", function() {
        expect(lisp`(> "1" "1")`).toEqual(false);
    });
    it("> 0 -1 -> true", function() {
        expect(lisp`(> 0 -1)`).toEqual(true);
    });
    it("> \"0\" \"-1\" -> true", function() {
        expect(lisp`(> "0" "-1")`).toEqual(true);
    });
    it("> NaN NaN -> false", function() {
        expect(lisp`(> NaN NaN)`).toEqual(false);
    });
    it("> NaN 0 -> false", function() {
        expect(lisp`(> NaN 0)`).toEqual(false);
    });
    it("> 0 NaN -> false", function() {
        expect(lisp`(> 0 NaN)`).toEqual(false);
    });
    it("> +Infinity -Infinity -> true", function() {
        expect(lisp`(> +Infinity -Infinity)`).toEqual(true);
    });
    it("> 0 +Infinity -> false", function() {
        expect(lisp`(> 0 +Infinity)`).toEqual(false);
    });
    it("> +Infinity 0 -> true", function() {
        expect(lisp`(> +Infinity 0)`).toEqual(true);
    });
    it("> 0 -Infinity -> true", function() {
        expect(lisp`(> 0 -Infinity)`).toEqual(true);
    });
    it("> -Infinity 0 -> false", function() {
        expect(lisp`(> -Infinity 0)`).toEqual(false);
    });
});


describe("operator.core.>=", function() {
    it(">= -> throw", function() {
        expect(() => lisp`(>=)`).toThrow();
    });
    it(">= a -> throw", function() {
        expect(() => lisp`(>= 1)`).toThrow();
    });
    it(">= 0 1 -> false", function() {
        expect(lisp`(>= 0 1)`).toEqual(false);
    });
    it(">= \"0\" \"1\" -> false", function() {
        expect(lisp`(>= "0" "1")`).toEqual(false);
    });
    it(">= 1 1 -> true", function() {
        expect(lisp`(>= 1 1)`).toEqual(true);
    });
    it(">= \"1\" \"1\" -> true", function() {
        expect(lisp`(>= "1" "1")`).toEqual(true);
    });
    it(">= 0 -1 -> true", function() {
        expect(lisp`(>= 0 -1)`).toEqual(true);
    });
    it(">= \"0\" \"-1\" -> true", function() {
        expect(lisp`(>= "0" "-1")`).toEqual(true);
    });
    it(">= NaN NaN -> false", function() {
        expect(lisp`(>= NaN NaN)`).toEqual(false);
    });
    it(">= NaN 0 -> false", function() {
        expect(lisp`(>= NaN 0)`).toEqual(false);
    });
    it(">= 0 NaN -> false", function() {
        expect(lisp`(>= 0 NaN)`).toEqual(false);
    });
    it(">= +Infinity -Infinity -> true", function() {
        expect(lisp`(>= +Infinity -Infinity)`).toEqual(true);
    });
    it(">= 0 +Infinity -> false", function() {
        expect(lisp`(>= 0 +Infinity)`).toEqual(false);
    });
    it(">= +Infinity 0 -> true", function() {
        expect(lisp`(>= +Infinity 0)`).toEqual(true);
    });
    it(">= 0 -Infinity -> true", function() {
        expect(lisp`(>= 0 -Infinity)`).toEqual(true);
    });
    it(">= -Infinity 0 -> false", function() {
        expect(lisp`(>= -Infinity 0)`).toEqual(false);
    });
});


describe("operator.core.$symbol", function() {
    it("$symbol -> throw", function() {
        expect(() => lisp`($symbol)`).toThrow();
    });
    it("$symbol 1", function() {
        expect(lisp`
            ($symbol "foo")
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 2", function() {
        expect(lisp`
            ($let foo 3)
            ($symbol "foo")
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 3", function() {
        expect(lisp`
            ($let foo 3)
            ($eval ($symbol "foo"))
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 4", function() {
        expect(lisp`
            ($let foo 5)
            ($get ($symbol "foo"))
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 5", function() {
        expect(lisp`
            ($let foo 7)
            ($get ($eval ($symbol "foo")))
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 6", function() {
        expect(lisp`
            ($let foo 11)
            ($list ($eval ($symbol "foo")))
        `).toEqual([{symbol: 'foo'}]);
    });
    it("$symbol 7", function() {
        expect(lisp`
            ($let foo 3)
            ($eval ($eval ($symbol "foo")))
        `).toEqual({symbol: 'foo'});
    });
    it("$symbol 8", function() {
        expect(lisp`
            ($let foo 3)
            ($__get ($symbol "foo"))
        `).toEqual(3);
    });
});


describe("operator.core.$gensym", function() {
    it("$gensym -> throw", function() {
        expect(() => lisp`($gensym foo bar)`).toThrow();
    });
    it("$gensym 1", function() {
        const v = lisp`
            ($gensym)
        `;
        expect(isSymbol(v) && true).toEqual(true as any);
    });
});


describe("operator.core.$is-symbol", function() {
    it("$is-symbol -> throw", function() {
        expect(() => lisp`($is-symbol)`).toThrow();
    });
    it("$is-symbol -> throw", function() {
        expect(() => lisp`($is-symbol 1 2)`).toThrow();
    });
    it("$is-symbol 1", function() {
        expect(lisp`
            ($let foo 3)
            ($is-symbol ($symbol "foo"))
        `).toEqual(true);
    });
    it("$is-symbol 2", function() {
        expect(lisp`
            ($let foo 3)
            ($is-symbol foo)
        `).toEqual(false);
    });
    it("$is-symbol 3", function() {
        expect(lisp`
            ($is-symbol foo)
        `).toEqual(false);
    });
    it("$is-symbol 4", function() {
        expect(lisp`
            ($let foo 3)
            ($is-symbol 'foo)
        `).toEqual(true);
    });
    it("$is-symbol 5", function() {
        expect(lisp`
            ($is-symbol 'foo)
        `).toEqual(true);
    });
    it("$is-symbol 6a", function() {
        expect(lisp`
            ($let foo ($symbol "bar"))
            ($is-symbol foo)
        `).toEqual(true);
    });
    it("$is-symbol 6b", function() {
        expect(lisp`
            ($let foo ($gensym))
            ($is-symbol foo)
        `).toEqual(true);
    });
    it("$is-symbol 6c", function() {
        expect(lisp`
            ($gensym foo)
            ($is-symbol foo)
        `).toEqual(true);
    });
    it("$is-symbol 6d", function() {
        expect(lisp`
            ($gensym "foo")
            ($is-symbol foo)
        `).toEqual(true);
    });
    it("$is-symbol 7", function() {
        expect(lisp`
            ($is-symbol null)
        `).toEqual(false);
    });
    it("$is-symbol 8", function() {
        expect(lisp`
            ($is-symbol nil)
        `).toEqual(false);
    });
    it("$is-symbol 9", function() {
        expect(lisp`
            ($is-symbol undefined)
        `).toEqual(false);
    });
    it("$is-symbol 10", function() {
        expect(lisp`
            ($is-symbol 5)
        `).toEqual(false);
    });
    it("$is-symbol 11", function() {
        expect(lisp`
            ($is-symbol "")
        `).toEqual(false);
    });
    it("$is-symbol 12", function() {
        expect(lisp`
            ($is-symbol '(7))
        `).toEqual(false);
    });
});


describe("operator.core.$is-list", function() {
    it("$is-list -> throw", function() {
        expect(() => lisp`($is-list)`).toThrow();
    });
    it("$is-list undefined -> false", function() {
        expect(lisp`($is-number undefined)`).toEqual(false);
    });
    it("$is-list null -> false", function() {
        expect(lisp`($is-list null)`).toEqual(false);
    });
    it("$is-list nil -> true", function() {
        expect(lisp`($is-list nil)`).toEqual(true);
    });
    it("$is-list () -> true", function() {
        expect(lisp`($is-list ())`).toEqual(true);
    });
    it("$is-list (a) -> true", function() {
        expect(lisp`($is-list ($list 1))`).toEqual(true);
    });
    it("$is-list true -> false", function() {
        expect(lisp`($is-list true)`).toEqual(false);
    });
    it("$is-list false -> false", function() {
        expect(lisp`($is-list false)`).toEqual(false);
    });
    it("$is-list number -> false", function() {
        expect(lisp`($is-list 0)`).toEqual(false);
    });
    it("$is-list number -> false", function() {
        expect(lisp`($is-list 1)`).toEqual(false);
    });
    it("$is-list number -> false", function() {
        expect(lisp`($is-list -1)`).toEqual(false);
    });
    it("$is-list NaN -> false", function() {
        expect(lisp`($is-list NaN)`).toEqual(false);
    });
    it("$is-list +Infinity -> false", function() {
        expect(lisp`($is-list +Infinity)`).toEqual(false);
    });
    it("$is-list -Infinity -> false", function() {
        expect(lisp`($is-list -Infinity)`).toEqual(false);
    });
    it("$is-list string -> false", function() {
        expect(lisp`($is-list "")`).toEqual(false);
    });
    it("$is-list string -> false", function() {
        expect(lisp`($is-list "0")`).toEqual(false);
    });
    it("$is-list string -> false", function() {
        expect(lisp`($is-list "1")`).toEqual(false);
    });
    it("$is-list string -> false", function() {
        expect(lisp`($is-list "-1")`).toEqual(false);
    });
    it("$is-list (#) -> false", function() {
        expect(lisp`($is-list (#))`).toEqual(false);
    });
});


describe("operator.core.$is-string", function() {
    it("$is-string -> throw", function() {
        expect(() => lisp`($is-string)`).toThrow();
    });
    it("$is-string undefined -> false", function() {
        expect(lisp`($is-number undefined)`).toEqual(false);
    });
    it("$is-string null -> false", function() {
        expect(lisp`($is-string null)`).toEqual(false);
    });
    it("$is-string nil -> false", function() {
        expect(lisp`($is-string nil)`).toEqual(false);
    });
    it("$is-string () -> false", function() {
        expect(lisp`($is-string ())`).toEqual(false);
    });
    it("$is-string (a) -> false", function() {
        expect(lisp`($is-string ($list 1))`).toEqual(false);
    });
    it("$is-string true -> false", function() {
        expect(lisp`($is-string true)`).toEqual(false);
    });
    it("$is-string false -> false", function() {
        expect(lisp`($is-string false)`).toEqual(false);
    });
    it("$is-string number -> false", function() {
        expect(lisp`($is-string 0)`).toEqual(false);
    });
    it("$is-string number -> false", function() {
        expect(lisp`($is-string 1)`).toEqual(false);
    });
    it("$is-string number -> false", function() {
        expect(lisp`($is-string -1)`).toEqual(false);
    });
    it("$is-string NaN -> false", function() {
        expect(lisp`($is-string NaN)`).toEqual(false);
    });
    it("$is-string +Infinity -> false", function() {
        expect(lisp`($is-string +Infinity)`).toEqual(false);
    });
    it("$is-string -Infinity -> false", function() {
        expect(lisp`($is-string -Infinity)`).toEqual(false);
    });
    it("$is-string string -> true", function() {
        expect(lisp`($is-string "")`).toEqual(true);
    });
    it("$is-string string -> true", function() {
        expect(lisp`($is-string "0")`).toEqual(true);
    });
    it("$is-string string -> true", function() {
        expect(lisp`($is-string "1")`).toEqual(true);
    });
    it("$is-string string -> true", function() {
        expect(lisp`($is-string "-1")`).toEqual(true);
    });
    it("$is-string (#) -> false", function() {
        expect(lisp`($is-string (#))`).toEqual(false);
    });
});


describe("operator.core.$is-number", function() {
    it("$is-number -> throw", function() {
        expect(() => lisp`($is-number)`).toThrow();
    });
    it("$is-number undefined -> false", function() {
        expect(lisp`($is-number undefined)`).toEqual(false);
    });
    it("$is-number null -> false", function() {
        expect(lisp`($is-number null)`).toEqual(false);
    });
    it("$is-number nil -> false", function() {
        expect(lisp`($is-number nil)`).toEqual(false);
    });
    it("$is-number () -> false", function() {
        expect(lisp`($is-number ())`).toEqual(false);
    });
    it("$is-number (a) -> false", function() {
        expect(lisp`($is-number ($list 1))`).toEqual(false);
    });
    it("$is-number true -> false", function() {
        expect(lisp`($is-number true)`).toEqual(false);
    });
    it("$is-number false -> false", function() {
        expect(lisp`($is-number false)`).toEqual(false);
    });
    it("$is-number number -> true", function() {
        expect(lisp`($is-number 0)`).toEqual(true);
    });
    it("$is-number number -> true", function() {
        expect(lisp`($is-number 1)`).toEqual(true);
    });
    it("$is-number number -> true", function() {
        expect(lisp`($is-number -1)`).toEqual(true);
    });
    it("$is-number NaN -> true", function() {
        expect(lisp`($is-number NaN)`).toEqual(true);
    });
    it("$is-number +Infinity -> true", function() {
        expect(lisp`($is-number +Infinity)`).toEqual(true);
    });
    it("$is-number -Infinity -> true", function() {
        expect(lisp`($is-number -Infinity)`).toEqual(true);
    });
    it("$is-number string -> false", function() {
        expect(lisp`($is-number "")`).toEqual(false);
    });
    it("$is-number string -> false", function() {
        expect(lisp`($is-number "0")`).toEqual(false);
    });
    it("$is-number string -> false", function() {
        expect(lisp`($is-number "1")`).toEqual(false);
    });
    it("$is-number string -> false", function() {
        expect(lisp`($is-number "-1")`).toEqual(false);
    });
    it("$is-number (#) -> false", function() {
        expect(lisp`($is-number (#))`).toEqual(false);
    });
});


describe("operator.core.$is-NaN", function() {
    it("$is-NaN -> throw", function() {
        expect(() => lisp`($is-NaN)`).toThrow();
    });
    it("$is-NaN undefined -> false", function() {
        expect(lisp`($is-NaN undefined)`).toEqual(false);
    });
    it("$is-NaN null -> false", function() {
        expect(lisp`($is-NaN null)`).toEqual(false);
    });
    it("$is-NaN nil -> false", function() {
        expect(lisp`($is-NaN nil)`).toEqual(false);
    });
    it("$is-NaN () -> false", function() {
        expect(lisp`($is-NaN ())`).toEqual(false);
    });
    it("$is-NaN (a) -> false", function() {
        expect(lisp`($is-NaN ($list 1))`).toEqual(false);
    });
    it("$is-NaN true -> false", function() {
        expect(lisp`($is-NaN true)`).toEqual(false);
    });
    it("$is-NaN false -> false", function() {
        expect(lisp`($is-NaN false)`).toEqual(false);
    });
    it("$is-NaN number -> false", function() {
        expect(lisp`($is-NaN 0)`).toEqual(false);
    });
    it("$is-NaN number -> false", function() {
        expect(lisp`($is-NaN 1)`).toEqual(false);
    });
    it("$is-NaN number -> false", function() {
        expect(lisp`($is-NaN -1)`).toEqual(false);
    });
    it("$is-NaN NaN -> true", function() {
        expect(lisp`($is-NaN NaN)`).toEqual(true);
    });
    it("$is-NaN +Infinity -> false", function() {
        expect(lisp`($is-NaN +Infinity)`).toEqual(false);
    });
    it("$is-NaN -Infinity -> false", function() {
        expect(lisp`($is-NaN -Infinity)`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "a")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "NaN")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "Infinity")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "0")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "1")`).toEqual(false);
    });
    it("$is-NaN string -> false", function() {
        expect(lisp`($is-NaN "-1")`).toEqual(false);
    });
    it("$is-NaN (#) -> false", function() {
        expect(lisp`($is-NaN (#))`).toEqual(false);
    });
});


describe("operator.core.$is-finite", function() {
    it("$is-finite -> throw", function() {
        expect(() => lisp`($is-finite)`).toThrow();
    });
    it("$is-finite undefined -> false", function() {
        expect(lisp`($is-finite undefined)`).toEqual(false);
    });
    it("$is-finite null -> false", function() {
        expect(lisp`($is-finite null)`).toEqual(false);
    });
    it("$is-finite nil -> false", function() {
        expect(lisp`($is-finite nil)`).toEqual(false);
    });
    it("$is-finite () -> false", function() {
        expect(lisp`($is-finite ())`).toEqual(false);
    });
    it("$is-finite (a) -> false", function() {
        expect(lisp`($is-finite ($list 1))`).toEqual(false);
    });
    it("$is-finite true -> false", function() {
        expect(lisp`($is-finite true)`).toEqual(false);
    });
    it("$is-finite false -> false", function() {
        expect(lisp`($is-finite false)`).toEqual(false);
    });
    it("$is-finite number -> true", function() {
        expect(lisp`($is-finite 0)`).toEqual(true);
    });
    it("$is-finite number -> true", function() {
        expect(lisp`($is-finite 1)`).toEqual(true);
    });
    it("$is-finite number -> true", function() {
        expect(lisp`($is-finite -1)`).toEqual(true);
    });
    it("$is-finite number -> true", function() {
        expect(lisp`($is-finite 0.1)`).toEqual(true);
    });
    it("$is-finite number -> true", function() {
        expect(lisp`($is-finite (/ 1 3))`).toEqual(true);
    });
    it("$is-finite number -> false", function() {
        expect(lisp`($is-finite (/ 1 0))`).toEqual(false);
    });
    it("$is-finite number -> false", function() {
        expect(lisp`($is-finite (/ 1 0))`).toEqual(false);
    });
    it("$is-finite NaN -> false", function() {
        expect(lisp`($is-finite NaN)`).toEqual(false);
    });
    it("$is-finite +Infinity -> false", function() {
        expect(lisp`($is-finite +Infinity)`).toEqual(false);
    });
    it("$is-finite -Infinity -> false", function() {
        expect(lisp`($is-finite -Infinity)`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "a")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "NaN")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "Infinity")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "0")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "1")`).toEqual(false);
    });
    it("$is-finite string -> false", function() {
        expect(lisp`($is-finite "-1")`).toEqual(false);
    });
    it("$is-finite (#) -> false", function() {
        expect(lisp`($is-finite (#))`).toEqual(false);
    });
});


describe("operator.core.$is-integer", function() {
    it("$is-integer -> throw", function() {
        expect(() => lisp`($is-integer)`).toThrow();
    });
    it("$is-integer undefined -> false", function() {
        expect(lisp`($is-integer undefined)`).toEqual(false);
    });
    it("$is-integer null -> false", function() {
        expect(lisp`($is-integer null)`).toEqual(false);
    });
    it("$is-integer nil -> false", function() {
        expect(lisp`($is-integer nil)`).toEqual(false);
    });
    it("$is-integer () -> false", function() {
        expect(lisp`($is-integer ())`).toEqual(false);
    });
    it("$is-integer (a) -> false", function() {
        expect(lisp`($is-integer ($list 1))`).toEqual(false);
    });
    it("$is-integer true -> false", function() {
        expect(lisp`($is-integer true)`).toEqual(false);
    });
    it("$is-integer false -> false", function() {
        expect(lisp`($is-integer false)`).toEqual(false);
    });
    it("$is-integer number -> true", function() {
        expect(lisp`($is-integer 0)`).toEqual(true);
    });
    it("$is-integer number -> true", function() {
        expect(lisp`($is-integer 1)`).toEqual(true);
    });
    it("$is-integer number -> true", function() {
        expect(lisp`($is-integer -1)`).toEqual(true);
    });
    it("$is-integer number -> true", function() {
        expect(lisp`($is-integer 1.0e-0)`).toEqual(true);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer 1.0e-1)`).toEqual(false);
    });
    it("$is-integer number -> true", function() {
        expect(lisp`($is-integer 0.1e+1)`).toEqual(true);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer 0.1e+0)`).toEqual(false);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer 0.1e-1)`).toEqual(false);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer 0.1)`).toEqual(false);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer (/ 1 3))`).toEqual(false);
    });
    it("$is-integer number -> false", function() {
        expect(lisp`($is-integer (/ 1 0))`).toEqual(false);
    });
    it("$is-integer NaN -> false", function() {
        expect(lisp`($is-integer NaN)`).toEqual(false);
    });
    it("$is-integer +Infinity -> false", function() {
        expect(lisp`($is-integer +Infinity)`).toEqual(false);
    });
    it("$is-integer -Infinity -> false", function() {
        expect(lisp`($is-integer -Infinity)`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "a")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "NaN")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "Infinity")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "0")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "1")`).toEqual(false);
    });
    it("$is-integer string -> false", function() {
        expect(lisp`($is-integer "-1")`).toEqual(false);
    });
    it("$is-integer (#) -> false", function() {
        expect(lisp`($is-integer (#))`).toEqual(false);
    });
});


describe("operator.core.$to-string", function() {
    it("$to-string -> throw", function() {
        expect(() => lisp`($to-string)`).toThrow();
    });
});


describe("operator.core.$to-number", function() {
    it("$to-number -> throw", function() {
        expect(() => lisp`($to-number)`).toThrow();
    });
    it("$to-number undefined -> NaN", function() {
        expect(lisp`($to-number undefined)`).toEqual(NaN);
    });
    it("$to-number null -> NaN", function() {
        expect(lisp`($to-number null)`).toEqual(NaN);
    });
    it("$to-number nil -> NaN", function() {
        expect(lisp`($to-number nil)`).toEqual(NaN);
    });
    it("$to-number () -> NaN", function() {
        expect(lisp`($to-number ())`).toEqual(NaN);
    });
    it("$to-number (a) -> NaN", function() {
        expect(lisp`($to-number ($list 1))`).toEqual(NaN);
    });
    it("$to-number true -> 1", function() {
        expect(lisp`($to-number true)`).toEqual(1);
    });
    it("$to-number false -> 0", function() {
        expect(lisp`($to-number false)`).toEqual(0);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 0)`).toEqual(0);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 1)`).toEqual(1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number -1)`).toEqual(-1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 1.0e-0)`).toEqual(1.0e-0);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 1.0e-1)`).toEqual(1.0e-1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 0.1e+1)`).toEqual(0.1e+1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 0.1e+0)`).toEqual(0.1e+0);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 0.1e-1)`).toEqual(0.1e-1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number 0.1)`).toEqual(0.1);
    });
    it("$to-number number -> number", function() {
        expect(lisp`($to-number (/ 1 3))`).toEqual(1 / 3);
    });
    it("$to-number number -> Infinity", function() {
        expect(lisp`($to-number (/ 1 0))`).toEqual(Infinity);
    });
    it("$to-number number -> -Infinity", function() {
        expect(lisp`($to-number (/ 1 -0))`).toEqual(-Infinity);
    });
    it("$to-number number -> -Infinity", function() {
        expect(lisp`($to-number (/ -1 0))`).toEqual(-Infinity);
    });
    it("$to-number NaN -> NaN", function() {
        expect(lisp`($to-number NaN)`).toEqual(NaN);
    });
    it("$to-number +Infinity -> +Infinity", function() {
        expect(lisp`($to-number +Infinity)`).toEqual(+Infinity);
    });
    it("$to-number -Infinity -> -Infinity", function() {
        expect(lisp`($to-number -Infinity)`).toEqual(-Infinity);
    });
    it("$to-number string -> 0", function() {
        expect(lisp`($to-number "")`).toEqual(0);
    });
    it("$to-number string -> NaN", function() {
        expect(lisp`($to-number "a")`).toEqual(NaN);
    });
    it("$to-number string -> NaN", function() {
        expect(lisp`($to-number "NaN")`).toEqual(NaN);
    });
    it("$to-number string -> NaN", function() {
        expect(lisp`($to-number "Infinity")`).toEqual(Infinity);
    });
    it("$to-number string -> number", function() {
        expect(lisp`($to-number "0")`).toEqual(0);
    });
    it("$to-number string -> number", function() {
        expect(lisp`($to-number "1")`).toEqual(1);
    });
    it("$to-number string -> number", function() {
        expect(lisp`($to-number "-1")`).toEqual(-1);
    });
    it("$to-number (#) -> NaN", function() {
        expect(lisp`($to-number (#))`).toEqual(NaN);
    });
    it("$to-number (# (foo 1)) -> NaN", function() {
        expect(lisp`($to-number (# (foo 1)))`).toEqual(NaN);
    });
});


describe("operator.core.#", function() {
    it("# -> {}", function() {
        expect(lisp`(#)`).toEqual({} as any);
    });
    it("# -> throw; syntax error", function() {
        expect(() => lisp`(# foo 3)`).toThrow();
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo 3))`).toEqual({foo: 3} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo "5"))`).toEqual({foo: "5"} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo true))`).toEqual({foo: true} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo false))`).toEqual({foo: false} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo null))`).toEqual({foo: null} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo nil))`).toEqual({foo: []} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo ()))`).toEqual({foo: []} as any);
    });
    it("# -> {}", function() {
        expect(lisp`(# (foo '(7)))`).toEqual({foo: [7]} as any);
    });

    // TODO:
    //
    // it("# -> {}; embedded fn", function() {
    //     expect((lisp`
    //         (#
    //             (foo $concat)
    //         )
    //     ` as any).foo("abc", "def")).toEqual("abcdef");
    // });
    // it("# -> {}; defun", function() {
    //     expect((lisp`
    //         ($defun fn (x y) ($concat x y))
    //         (#
    //             (foo fn)
    //         )
    //     ` as any).foo("abc", "def")).toEqual("abcdef");
    // });

    it("# -> {}; let lambda", function() {
        expect((lisp`
            ($let fn ($lambda (x y) ($concat x y)))
            (#
                (foo fn)
            )
        ` as any).foo("abc", "def")).toEqual("abcdef");
    });
    it("# -> {}; lambda", function() {
        expect((lisp`
            (#
                (foo ($lambda (x y) ($concat x y)))
            )
        ` as any).foo("abc", "def")).toEqual("abcdef");
    });
    it("# -> {}", function() {
        expect(lisp`
            (#
                (foo "abc")
                (bar 17)
                (baz (+ 5 3))
            )
        `).toEqual({
            foo: "abc",
            bar: 17,
            baz: 8,
        } as any);
    });
    it("# -> {}", function() {
        expect(lisp`
            (#
                (foo "abc" "def")
                (bar 3 "qwe" "rty")
            )
        `).toEqual({
            foo: ["abc", "def"],
            bar: [3, "qwe", "rty"],
        } as any);
    });
    it("# -> {}", function() {
        expect(lisp`
            ($let X "baz")
            (#
                (X "abc" "def")
                ("bar" 3 "qwe" "rty")
                (987 '(5 "asd" "fgh"))
                (lkjhg)
            )
        `).toEqual({
            X: ["abc", "def"],
            bar: [3, "qwe", "rty"],
            987: [5, "asd", "fgh"],
            lkjhg: true,
        } as any);
    });
    it("# -> {}", function() {
        expect(lisp`
            ($let X "zxc")
            (#
                (foo X)
                (baz '(5 "asd" "fgh"))
            )
        `).toEqual({
            foo: "zxc",
            baz: [5, "asd", "fgh"],
        } as any);
    });
    it("# -> {}", function() {
        expect(lisp`
            ($let X "baz")
            (#
                (($get X) '(5 "asd" "fgh"))
            )
        `).toEqual({
            baz: [5, "asd", "fgh"],
        } as any);
    });
});


describe("operator.core.$object-assign", function() {
    it("$object-assign -> throw", function() {
        expect(() => lisp`($object-assign)`).toThrow();
    });
    it("$object-assign -> {}", function() {
        expect(lisp`($object-assign (#))`).toEqual({} as any);
    });
    it("$object-assign -> {}", function() {
        expect(lisp`($object-assign (# (a 3)) (# (b 5)) (# (c 7)) )`).toEqual({
            a: 3,
            b: 5,
            c: 7,
        } as any);
    });
    it("$object-assign -> {}", function() {
        expect(lisp`($object-assign (# (a 3) (d 11)) (# (b 5)) (# (c 7)) (# (a 13)) )`).toEqual({
            a: 13,
            b: 5,
            c: 7,
            d: 11,
        } as any);
    });
});


describe("operator.core.$json-stringify", function() {
    it("$json-stringify -> throw", function() {
        expect(() => lisp`($json-stringify)`).toThrow();
    });
    it("$json-stringify -> {}", function() {
        expect(lisp`($json-stringify (#))`).toEqual("{}");
    });
    it("$json-stringify -> {}", function() {
        expect(lisp`($json-stringify ())`).toEqual("[]");
    });
});


describe("operator.core.$json-parse", function() {
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse)`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse 3)`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse null)`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse nil)`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse undefined)`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse ())`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse (#))`).toThrow();
    });
    it("$json-parse -> throw", function() {
        expect(() => lisp`($json-parse "")`).toThrow();
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "{}")`).toEqual({} as any);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "{\\"foo\\": 3}")`).toEqual({foo: 3} as any);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "{\\"foo\\": \\"5\\"}")`).toEqual({foo: "5"} as any);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "[]")`).toEqual([]);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "[5]")`).toEqual([5]);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "7")`).toEqual(7);
    });
    it("$json-parse -> {}", function() {
        expect(lisp`($json-parse "\\"11\\"")`).toEqual("11");
    });
});


describe("operator.core.$now", function() {
    it("$now -> number", function() {
        expect(typeof lisp`($now)`).toEqual('number');
    });
});


describe("operator.core.$datetime-from-iso", function() {
    const tzoffset = new Date('2010-01-01T00:00:00').getTime() - new Date('2010-01-01T00:00:00Z').getTime();
    it("$datetime-from-iso -> throw", function() {
        expect(() => lisp`($datetime-from-iso)`).toThrow();
    });
    it("$datetime-from-iso -> throw", function() {
        expect(() => lisp`($datetime-from-iso "2000-01-01" 1)`).toThrow();
    });
    it("$datetime-from-iso -> throw", function() {
        expect(() => lisp`($datetime-from-iso "1-01-01")`).toThrow();
    });
    it("$datetime-from-iso -> throw", function() {
        expect(() => lisp`($datetime-from-iso "-0001-01-01")`).toThrow();
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-01-01")`).toEqual(new Date('2010-01-01T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31")`).toEqual(new Date('2010-12-31T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2000-01-01")`).toEqual(new Date('2000-01-01T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2000-12-31")`).toEqual(new Date('2000-12-31T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "0001-01-01")`).toEqual(new Date('0001-01-01T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "0001-12-31")`).toEqual(new Date('0001-12-31T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "0000-01-01")`).toEqual(new Date('0000-01-01T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "0000-12-31")`).toEqual(new Date('0000-12-31T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "-000001-01-01")`).toEqual(new Date('-000001-01-01T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "-000001-12-31")`).toEqual(new Date('-000001-12-31T00:00:00Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T00:00")`).toEqual(new Date('2010-12-31T00:00Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59")`).toEqual(new Date('2010-12-31T23:59Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59Z")`).toEqual(new Date('2010-12-31T23:59Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T00:00:00")`).toEqual(new Date('2010-12-31T00:00:00Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59")`).toEqual(new Date('2010-12-31T23:59:59Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59Z")`).toEqual(new Date('2010-12-31T23:59:59Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T00:00:00.0")`).toEqual(new Date('2010-12-31T00:00:00.000Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.9")`).toEqual(new Date('2010-12-31T23:59:59.900Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.9Z")`).toEqual(new Date('2010-12-31T23:59:59.900Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T00:00:00.000")`).toEqual(new Date('2010-12-31T00:00:00.000Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999")`).toEqual(new Date('2010-12-31T23:59:59.999Z').getTime() + tzoffset);
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999Z")`).toEqual(new Date('2010-12-31T23:59:59.999Z').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(() => lisp`($datetime-from-iso "2010-12-31T23:59:59.999+07")`).toThrow();
    });
    it("$datetime-from-iso -> number", function() {
        expect(() => lisp`($datetime-from-iso "2010-12-31T23:59:59.999-07")`).toThrow();
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999+0715")`).toEqual(new Date('2010-12-31T23:59:59.999+07:15').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999-0715")`).toEqual(new Date('2010-12-31T23:59:59.999-07:15').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999+07:15")`).toEqual(new Date('2010-12-31T23:59:59.999+0715').getTime());
    });
    it("$datetime-from-iso -> number", function() {
        expect(lisp`($datetime-from-iso "2010-12-31T23:59:59.999-07:15")`).toEqual(new Date('2010-12-31T23:59:59.999-0715').getTime());
    });
});


describe("operator.core.$datetime", function() {
    it("$datetime -> throw", function() {
        expect(() => lisp`($datetime)`).toThrow();
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2000 1 1)`).toEqual(new Date('2000-01-01').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 1 1)`).toEqual(new Date('2010-01-01T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 12 31)`).toEqual(new Date('2010-12-31T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2000 1 1)`).toEqual(new Date('2000-01-01T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2000 12 31)`).toEqual(new Date('2000-12-31T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 1 1 1)`).toEqual(new Date('0001-01-01T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 1 12 31)`).toEqual(new Date('0001-12-31T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 0 1 1)`).toEqual(new Date('0000-01-01T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 0 12 31)`).toEqual(new Date('0000-12-31T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime -1 1 1)`).toEqual(new Date('-000001-01-01T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime -1 12 31)`).toEqual(new Date('-000001-12-31T00:00:00Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 12 31 23 59)`).toEqual(new Date('2010-12-31T23:59Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 12 31 23 59 59)`).toEqual(new Date('2010-12-31T23:59:59Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 12 31 23 59 59 9000)`).toEqual(new Date('2010-12-31T23:59:59.900Z').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime 2010 12 31 23 59 59 999)`).toEqual(new Date('2010-12-31T23:59:59.999Z').getTime());
    });
});


describe("operator.core.$datetime-lc", function() {
    it("$datetime -> throw", function() {
        expect(() => lisp`($datetime-lc)`).toThrow();
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2000 1 1)`).toEqual(new Date('2000-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 1 1)`).toEqual(new Date('2010-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 12 31)`).toEqual(new Date('2010-12-31T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2000 1 1)`).toEqual(new Date('2000-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2000 12 31)`).toEqual(new Date('2000-12-31T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 1 1 1)`).toEqual(new Date('0001-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 1 12 31)`).toEqual(new Date('0001-12-31T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 0 1 1)`).toEqual(new Date('0000-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 0 12 31)`).toEqual(new Date('0000-12-31T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc -1 1 1)`).toEqual(new Date('-000001-01-01T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc -1 12 31)`).toEqual(new Date('-000001-12-31T00:00:00').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 12 31 23 59)`).toEqual(new Date('2010-12-31T23:59').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 12 31 23 59 59)`).toEqual(new Date('2010-12-31T23:59:59').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 12 31 23 59 59 9000)`).toEqual(new Date('2010-12-31T23:59:59.900').getTime());
    });
    it("$datetime -> number", function() {
        expect(lisp`($datetime-lc 2010 12 31 23 59 59 999)`).toEqual(new Date('2010-12-31T23:59:59.999').getTime());
    });
});


describe("operator.core.$datetime-to-iso-string", function() {
    it("$datetime-to-iso-string -> throw", function() {
        expect(() => lisp`($datetime-to-iso-string)`).toThrow();
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 1 1))`).toEqual('2000-01-01T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31))`).toEqual('2000-12-31T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 1 1 1))`).toEqual('0001-01-01T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 1 12 31))`).toEqual('0001-12-31T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 0 1 1))`).toEqual('0000-01-01T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 0 12 31))`).toEqual('0000-12-31T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime -1 1 1))`).toEqual('-000001-01-01T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime -1 12 31))`).toEqual('-000001-12-31T00:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23))`).toEqual('2000-12-31T23:00:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23 59))`).toEqual('2000-12-31T23:59:00.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23 58 59))`).toEqual('2000-12-31T23:58:59.000Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23 58 59 1))`).toEqual('2000-12-31T23:58:59.001Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23 58 59 999))`).toEqual('2000-12-31T23:58:59.999Z');
    });
    it("$datetime-to-iso-string -> string", function() {
        expect(lisp`($datetime-to-iso-string ($datetime 2000 12 31 23 58 59 1234))`).toEqual('2000-12-31T23:58:59.123Z');
    });
});


describe("operator.core.$datetime-to-components", function() {
    it("$datetime-to-components -> throw", function() {
        expect(() => lisp`($datetime-to-components)`).toThrow();
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2000 1 1))`).toEqual([2000, 1, 1, 0, 0, 0, 0, 0, 6]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2000 12 31))`).toEqual([2000, 12, 31, 0, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 1 1 1))`).toEqual([1, 1, 1, 0, 0, 0, 0, 0, 1]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 1 12 31))`).toEqual([1, 12, 31, 0, 0, 0, 0, 0, 1]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 0 1 1))`).toEqual([0, 1, 1, 0, 0, 0, 0, 0, 6]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 0 12 31))`).toEqual([0, 12, 31, 0, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime -1 1 1))`).toEqual([-1, 1, 1, 0, 0, 0, 0, 0, 5]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime -1 12 31))`).toEqual([-1, 12, 31, 0, 0, 0, 0, 0, 5]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23))`).toEqual([2130, 12, 31, 23, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23 59))`).toEqual([2130, 12, 31, 23, 59, 0, 0, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23 58 59))`).toEqual([2130, 12, 31, 23, 58, 59, 0, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23 58 59 1))`).toEqual([2130, 12, 31, 23, 58, 59, 1, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23 58 59 999))`).toEqual([2130, 12, 31, 23, 58, 59, 999, 0, 0]);
    });
    it("$datetime-to-components -> array", function() {
        expect(lisp`($datetime-to-components ($datetime 2130 12 31 23 58 59 1234))`).toEqual([2130, 12, 31, 23, 58, 59, 123, 0, 0]);
    });
});


describe("operator.core.$datetime-to-components-lc", function() {
    it("$datetime-to-components-lc -> throw", function() {
        expect(() => lisp`($datetime-to-components-lc)`).toThrow();
    });
    const fn = (ar: any) => {
        ar[7] = 0; // TZ
        return ar;
    };
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2000 1 1))`)).toEqual([2000, 1, 1, 0, 0, 0, 0, 0, 6]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2000 12 31))`)).toEqual([2000, 12, 31, 0, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 1 1 1))`)).toEqual([1, 1, 1, 0, 0, 0, 0, 0, 1]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 1 12 31))`)).toEqual([1, 12, 31, 0, 0, 0, 0, 0, 1]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 0 1 1))`)).toEqual([0, 1, 1, 0, 0, 0, 0, 0, 6]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 0 12 31))`)).toEqual([0, 12, 31, 0, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc -1 1 1))`)).toEqual([-1, 1, 1, 0, 0, 0, 0, 0, 5]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc -1 12 31))`)).toEqual([-1, 12, 31, 0, 0, 0, 0, 0, 5]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23))`)).toEqual([2130, 12, 31, 23, 0, 0, 0, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23 59))`)).toEqual([2130, 12, 31, 23, 59, 0, 0, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23 58 59))`)).toEqual([2130, 12, 31, 23, 58, 59, 0, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23 58 59 1))`)).toEqual([2130, 12, 31, 23, 58, 59, 1, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23 58 59 999))`)).toEqual([2130, 12, 31, 23, 58, 59, 999, 0, 0]);
    });
    it("$datetime-to-components-lc -> array", function() {
        expect(fn(lisp`($datetime-to-components-lc ($datetime-lc 2130 12 31 23 58 59 1234))`)).toEqual([2130, 12, 31, 23, 58, 59, 123, 0, 0]);
    });
});


describe("operator.core.$match", function() {
    it("$match -> ", function() {
        expect(() => lisp`($match)`).toThrow();
    });
    it("$match -> ", function() {
        expect(() => lisp`($match @"[a-z]+\\d+[a-z]+")`).toThrow();
    });
    it("$match -> ", function() {
        expect(() => lisp`($match @"[a-z]+\\d+[a-z]+" "" "" "")`).toThrow();
    });
    it("$match -> ", function() {
        expect((lisp`
            ($match @"[a-z]+(\\d+)[a-z]+" "abc1234def")
        ` as string[]).slice(0)).toEqual(['abc1234def', '1234']);
    });
    it("$match -> ", function() {
        expect(lisp`
            ($match @"[a-z]+(\\d+)[a-z]+" "abC1234Def")
        `).toEqual(null);
    });
    it("$match -> ", function() {
        expect((lisp`
            ($match @"[a-z]+(\\d+)[a-z]+" "i" "abC1234Def")
        ` as string[]).slice(0)).toEqual(['abC1234Def', '1234']);
    });
});


describe("operator.core.$console-log", function() {
    it("$console-log -> null", function() {
        expect(lisp`($console-log)`).toEqual(null);
    });
    it("$console-log a -> null", function() {
        expect(lisp`($console-log undefined)`).toEqual(null);
    });
    it("$console-log a -> null", function() {
        expect(lisp`($console-log "hello")`).toEqual(null);
    });
    it("$console-log a b c -> null", function() {
        expect(lisp`($console-log "hello" "world" 11)`).toEqual(null);
    });
});


describe("operator.core.$console-error", function() {
    it("$console-error -> null", function() {
        expect(lisp`($console-error)`).toEqual(null);
    });
    it("$console-error a -> null", function() {
        expect(lisp`($console-error undefined)`).toEqual(null);
    });
    it("$console-error a -> null", function() {
        expect(lisp`($console-error "hello")`).toEqual(null);
    });
    it("$console-error a b c -> null", function() {
        expect(lisp`($console-error "hello" "world" 11)`).toEqual(null);
    });
});


describe("operator.core.$console-trace", function() {
    it("$console-trace -> null", function() {
        expect(lisp`($console-trace)`).toEqual(null);
    });
    it("$console-trace a -> null", function() {
        expect(lisp`($console-trace undefined)`).toEqual(null);
    });
    it("$console-trace a -> null", function() {
        expect(lisp`($console-trace "hello")`).toEqual(null);
    });
    it("$console-trace a b c -> null", function() {
        expect(lisp`($console-trace "hello" "world" 11)`).toEqual(null);
    });
});


describe("operator.core.$console-time", function() {
    it("$console-time -> null", function() {
        expect(lisp`
            ($console-time)
            ;; ($console-time-log)  ;; console.timeLog: Node>=10
            ;; ($console-time-log)
            ($console-time-end)
        `).toEqual(null);
    });
    it("$console-time a -> null", function() {
        expect(lisp`
            ($console-time "hello")
            ;; ($console-time-log "hello" 11)  ;; console.timeLog: Node>=10
            ;; ($console-time-log "hello" 13)
            ($console-time-end "hello")
        `).toEqual(null);
    });
});
