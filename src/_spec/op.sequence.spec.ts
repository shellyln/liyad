

import { S, lisp, LM, LSX } from '../';



describe("operator.core.$range", function() {
    it("$range -> throw", function() {
        expect(() => lisp`($range)`).toThrow();
    });
    it("$range a -> throw", function() {
        expect(() => lisp`($range 3)`).toThrow();
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 7)`).toEqual([3, 4, 5, 6, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 -7)`).toEqual([3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 7)`).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -7)`).toEqual([-3, -4, -5, -6, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 7 0)`).toEqual([3, 4, 5, 6, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 -7 0)`).toEqual([3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 7 0)`).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -7 0)`).toEqual([-3, -4, -5, -6, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 8 2)`).toEqual([3, 5, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 7 2)`).toEqual([3, 5, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 -7 2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 7 2)`).toEqual([-3, -1, 1, 3, 5, 7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -7 2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -8 2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 8 -2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 7 -2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range 3 -7 -2)`).toEqual([3, 1, -1, -3, -5, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 7 -2)`).toEqual([]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -7 -2)`).toEqual([-3, -5, -7]);
    });
    it("$range a b -> list", function() {
        expect(lisp`($range -3 -8 -2)`).toEqual([-3, -5, -7]);
    });
});


describe("operator.core.$length", function() {
    it("$length -> throw", function() {
        expect(() => lisp`($length)`).toThrow();
    });
    it("$length a b -> throw", function() {
        expect(() => lisp`($length () ())`).toThrow();
    });
    it("$length a -> value", function() {
        expect(lisp`($length nil)`).toEqual(0);
    });
    it("$length a -> value", function() {
        expect(lisp`($length ())`).toEqual(0);
    });
    it("$length a -> value", function() {
        expect(lisp`($length '(3))`).toEqual(1);
    });
    it("$length a -> value", function() {
        expect(lisp`($length '(3 5))`).toEqual(2);
    });
    it("$length a -> value", function() {
        expect(lisp`($length '(3 5 7))`).toEqual(3);
    });
    it("$length a -> value", function() {
        expect(lisp`($length ($list ($list 3) 5 7))`).toEqual(3);
    });
    it("$length a -> value", function() {
        expect(lisp`($length "")`).toEqual(0);
    });
    it("$length a -> value", function() {
        expect(lisp`($length "a")`).toEqual(1);
    });
    it("$length a -> value", function() {
        expect(lisp`($length "ab")`).toEqual(2);
    });
    it("$length a -> value", function() {
        expect(lisp`($length "abc")`).toEqual(3);
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length 0)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length +Infinity)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length -Infinity)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length NaN)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length null)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length undefined)`).toThrow();
    });
    it("$length a -> throw", function() {
        expect(() => lisp`($length (#))`).toThrow();
    });
});


describe("operator.core.$trim", function() {
    it("$trim -> throw", function() {
        expect(() => lisp`($trim)`).toThrow();
    });
    it("$trim a b -> throw", function() {
        expect(() => lisp`($trim () ())`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim nil)`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim ())`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim '(3))`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim '(3 5))`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim '(3 5 7))`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(() => lisp`($trim ($list ($list 3) 5 7))`).toThrow();
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "")`).toEqual('');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "a")`).toEqual('a');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "ab")`).toEqual('ab');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "abc")`).toEqual('abc');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "    ")`).toEqual('');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "  a  ")`).toEqual('a');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "  ab  ")`).toEqual('ab');
    });
    it("$trim a -> value", function() {
        expect(lisp`($trim "  abc  ")`).toEqual('abc');
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim 0)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim +Infinity)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim -Infinity)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim NaN)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim null)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim undefined)`).toThrow();
    });
    it("$trim a -> throw", function() {
        expect(() => lisp`($trim (#))`).toThrow();
    });
});


describe("operator.core.$trim-head", function() {
    it("$trim-head -> throw", function() {
        expect(() => lisp`($trim-head)`).toThrow();
    });
    it("$trim-head a b -> throw", function() {
        expect(() => lisp`($trim-head () ())`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head nil)`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head ())`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head '(3))`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head '(3 5))`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head '(3 5 7))`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(() => lisp`($trim-head ($list ($list 3) 5 7))`).toThrow();
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "")`).toEqual('');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "a")`).toEqual('a');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "ab")`).toEqual('ab');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "abc")`).toEqual('abc');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "    ")`).toEqual('');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "  a  ")`).toEqual('a  ');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "  ab  ")`).toEqual('ab  ');
    });
    it("$trim-head a -> value", function() {
        expect(lisp`($trim-head "  abc  ")`).toEqual('abc  ');
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head 0)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head +Infinity)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head -Infinity)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head NaN)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head null)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head undefined)`).toThrow();
    });
    it("$trim-head a -> throw", function() {
        expect(() => lisp`($trim-head (#))`).toThrow();
    });
});


describe("operator.core.$trim-tail", function() {
    it("$trim-tail -> throw", function() {
        expect(() => lisp`($trim-tail)`).toThrow();
    });
    it("$trim-tail a b -> throw", function() {
        expect(() => lisp`($trim-tail () ())`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail nil)`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail ())`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail '(3))`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail '(3 5))`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail '(3 5 7))`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(() => lisp`($trim-tail ($list ($list 3) 5 7))`).toThrow();
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "")`).toEqual('');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "a")`).toEqual('a');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "ab")`).toEqual('ab');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "abc")`).toEqual('abc');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "    ")`).toEqual('');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "  a  ")`).toEqual('  a');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "  ab  ")`).toEqual('  ab');
    });
    it("$trim-tail a -> value", function() {
        expect(lisp`($trim-tail "  abc  ")`).toEqual('  abc');
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail 0)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail +Infinity)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail -Infinity)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail NaN)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail null)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail undefined)`).toThrow();
    });
    it("$trim-tail a -> throw", function() {
        expect(() => lisp`($trim-tail (#))`).toThrow();
    });
});


describe("operator.core.$replace-all", function() {
    it("$replace-all -> throw", function() {
        expect(() => lisp`($replace-all)`).toThrow();
    });
    it("$replace-all -> throw", function() {
        expect(() => lisp`($replace-all "")`).toThrow();
    });
    it("$replace-all -> throw", function() {
        expect(() => lisp`($replace-all "" "")`).toThrow();
    });
    it("$replace-all -> string", function() {
        expect(lisp`($replace-all "" "" "")`).toEqual('');
    });
    it("$replace-all -> string", function() {
        expect(lisp`($replace-all "abc" "abc" "XYZ")`).toEqual('XYZ');
    });
    it("$replace-all -> string", function() {
        expect(lisp`($replace-all "abcdefghabcdefghabcdefgh" "abc" "XYZ")`).toEqual('XYZdefghXYZdefghXYZdefgh');
    });
    it("$replace-all -> string", function() {
        expect(lisp`($replace-all "abcdefghabcdefghabcdefgh" "fgh" "XYZ")`).toEqual('abcdeXYZabcdeXYZabcdeXYZ');
    });
    it("$replace-all -> string", function() {
        expect(lisp`($replace-all "abcdefghabcdefghabcdefgh" "defghabcdefghabcde" "XYZ")`).toEqual('abcXYZfgh');
    });
});


describe("operator.core.$split", function() {
    it("$split -> throw", function() {
        expect(() => lisp`($split)`).toThrow();
    });
    it("$split -> throw", function() {
        expect(() => lisp`($split "")`).toThrow();
    });
    it("$split -> array", function() {
        expect(lisp`($split "" "")`).toEqual([]);
    });
    it("$split -> array", function() {
        expect(lisp`($split "abc" "abc")`).toEqual(['', '']);
    });
    it("$split -> array", function() {
        expect(lisp`($split "abcdefghabcdefghabcdefgh" "abc")`).toEqual(['', 'defgh', 'defgh', 'defgh']);
    });
    it("$split -> array", function() {
        expect(lisp`($split "abcdefghabcdefghabcdefgh" "fgh")`).toEqual(['abcde', 'abcde', 'abcde', '']);
    });
    it("$split -> array", function() {
        expect(lisp`($split "abcdefghabcdefghabcdefgh" "defghabcdefghabcde")`).toEqual(['abc', 'fgh']);
    });
});


describe("operator.core.$join", function() {
    it("$join -> throw", function() {
        expect(() => lisp`($join)`).toThrow();
    });
    it("$join -> throw", function() {
        expect(() => lisp`($join "")`).toThrow();
    });
    it("$join -> string", function() {
        expect(lisp`($join '("") )`).toEqual('');
    });
    it("$join -> string", function() {
        expect(lisp`($join '("123" "456" "789") )`).toEqual('123,456,789');
    });
    it("$join -> string", function() {
        expect(lisp`($join '("123" "456" "789") "")`).toEqual('123456789');
    });
    it("$join -> string", function() {
        expect(lisp`($join '("123" "456" "789") ";")`).toEqual('123;456;789');
    });
});


describe("operator.core.$concat", function() {
    it("$concat -> throw", function() {
        expect(() => lisp`($concat)`).toThrow();
    });
    it("$concat -> list", function() {
        expect(lisp`($concat '(3 5))`).toEqual([3, 5]);
    });
    it("$concat -> list", function() {
        expect(lisp`($concat '(3 5) '(7 11))`).toEqual([3, 5, 7, 11]);
    });
    it("$concat -> list", function() {
        expect(lisp`($concat '(3 5) '(7 11) '(13 15))`).toEqual([3, 5, 7, 11, 13, 15]);
    });
    it("$concat -> list", function() {
        expect(lisp`($concat '(3 5) '(7 11) '(13 15) 17)`).toEqual([3, 5, 7, 11, 13, 15, 17]);
    });
    it("$concat -> list", function() {
        expect(lisp`($concat '(3 5) '(7 11) '(13 15) 17 '(19))`).toEqual([3, 5, 7, 11, 13, 15, 17, 19]);
    });
    it("$concat -> list", function() {
        expect(() => lisp`($concat '23 (3 5) '(7 11) '(13 15) 17 '(19))`).toThrow();
    });
    it("$concat -> string", function() {
        expect(lisp`($concat "ab")`).toEqual("ab");
    });
    it("$concat -> string", function() {
        expect(lisp`($concat "ab" "cd")`).toEqual("abcd");
    });
    it("$concat -> string", function() {
        expect(lisp`($concat "ab" "cd" "ef")`).toEqual("abcdef");
    });
    it("$concat -> string", function() {
        expect(lisp`($concat "ab" "cd" "ef" 3 "gh")`).toEqual("abcdef3gh");
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat 0)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat +Infinity)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat -Infinity)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat NaN)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat null)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat undefined)`).toThrow();
    });
    it("$concat a -> throw", function() {
        expect(() => lisp`($concat (#))`).toThrow();
    });
});


describe("operator.core.$slice", function() {
    it("$slice -> throw", function() {
        expect(() => lisp`($slice)`).toThrow();
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 -1 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 0 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 1 '(3 5 7 11 13))`).toEqual([3]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 4 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 5 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 0 6 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 1 '(3 5 7 11 13))`).toEqual([5, 7, 11, 13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 1 -1 '(3 5 7 11 13))`).toEqual([5, 7, 11]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 1 0 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 1 1 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 1 2 '(3 5 7 11 13))`).toEqual([5]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 4 '(3 5 7 11 13))`).toEqual([13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 4 4 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 4 5 '(3 5 7 11 13))`).toEqual([13]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 5 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 5 5 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> list", function() {
        expect(lisp`($slice 5 6 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 "357ab")`).toEqual('357ab');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 -1 "357ab")`).toEqual('357a');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 0 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 1 "357ab")`).toEqual('3');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 4 "357ab")`).toEqual('357a');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 5 "357ab")`).toEqual('357ab');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 0 6 "357ab")`).toEqual('357ab');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 1 "357ab")`).toEqual('57ab');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 1 -1 "357ab")`).toEqual('57a');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 1 0 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 1 1 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 1 2 "357ab")`).toEqual('5');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 4 "357ab")`).toEqual('b');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 4 4 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 4 5 "357ab")`).toEqual('b');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 5 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 5 5 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice 5 6 "357ab")`).toEqual('');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice NaN "357ab")`).toEqual('357ab');
    });
    it("$slice -> string", function() {
        expect(lisp`($slice NaN NaN "357ab")`).toEqual('');
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 0)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 +Infinity)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 -Infinity)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 NaN)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 null)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 undefined)`).toThrow();
    });
    it("$slice a -> throw", function() {
        expect(() => lisp`($slice 0 (#))`).toThrow();
    });
});


describe("operator.core.$top", function() {
    it("$top -> throw", function() {
        expect(() => lisp`($top)`).toThrow();
    });
    it("$top -> list", function() {
        expect(lisp`($top -1 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11]);
    });
    it("$top -> list", function() {
        expect(lisp`($top 0 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$top -> list", function() {
        expect(lisp`($top 1 '(3 5 7 11 13))`).toEqual([3]);
    });
    it("$top -> list", function() {
        expect(lisp`($top 4 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11]);
    });
    it("$top -> list", function() {
        expect(lisp`($top 5 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$top -> list", function() {
        expect(lisp`($top 6 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$top -> string", function() {
        expect(lisp`($top -1 "357ab")`).toEqual('357a');
    });
    it("$top -> string", function() {
        expect(lisp`($top 0 "357ab")`).toEqual('');
    });
    it("$top -> string", function() {
        expect(lisp`($top 1 "357ab")`).toEqual('3');
    });
    it("$top -> string", function() {
        expect(lisp`($top 4 "357ab")`).toEqual('357a');
    });
    it("$top -> string", function() {
        expect(lisp`($top 5 "357ab")`).toEqual('357ab');
    });
    it("$top -> string", function() {
        expect(lisp`($top 6 "357ab")`).toEqual('357ab');
    });
    it("$top -> string", function() {
        expect(lisp`($top NaN "357ab")`).toEqual('');
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 0)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 +Infinity)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 -Infinity)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 NaN)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 null)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 undefined)`).toThrow();
    });
    it("$top a -> throw", function() {
        expect(() => lisp`($top 0 (#))`).toThrow();
    });
});


describe("operator.core.$tail", function() {
    it("$tail -> throw", function() {
        expect(() => lisp`($tail)`).toThrow();
    });
    it("$tail -> list", function() {
        expect(lisp`($tail -1 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$tail -> list", function() {
        expect(lisp`($tail 0 '(3 5 7 11 13))`).toEqual([]);
    });
    it("$tail -> list", function() {
        expect(lisp`($tail 1 '(3 5 7 11 13))`).toEqual([13]);
    });
    it("$tail -> list", function() {
        expect(lisp`($tail 4 '(3 5 7 11 13))`).toEqual([5, 7, 11, 13]);
    });
    it("$tail -> list", function() {
        expect(lisp`($tail 5 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$tail -> list", function() {
        expect(lisp`($tail 6 '(3 5 7 11 13))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$tail -> string", function() {
        expect(lisp`($tail -1 "357ab")`).toEqual('');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail 0 "357ab")`).toEqual('');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail 1 "357ab")`).toEqual('b');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail 4 "357ab")`).toEqual('57ab');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail 5 "357ab")`).toEqual('357ab');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail 6 "357ab")`).toEqual('357ab');
    });
    it("$tail -> string", function() {
        expect(lisp`($tail NaN "357ab")`).toEqual('');
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 0)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 +Infinity)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 -Infinity)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 NaN)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 null)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 undefined)`).toThrow();
    });
    it("$tail a -> throw", function() {
        expect(() => lisp`($tail 0 (#))`).toThrow();
    });
});


describe("operator.core.$push", function() {
    it("$push -> throw", function() {
        expect(() => lisp`($push)`).toThrow();
    });
    it("$push -> throw", function() {
        expect(() => lisp`($push ($list))`).toThrow();
    });
    it("$push -> throw", function() {
        expect(() => lisp`($push "" 3)`).toThrow();
    });
    it("$push -> list", function() {
        expect(lisp`($push ($list) 3)`).toEqual([3]);
    });
    it("$push -> list", function() {
        expect(lisp`($push ($push ($list) 3) 5)`).toEqual([3, 5]);
    });
    it("$push -> list", function() {
        expect(lisp`
            ($let x ($list))
            ($push ($push x 3) 5)
            ($get x)
        `).toEqual([3, 5]);
    });
});


describe("operator.core.$pop", function() {
    it("$pop -> throw", function() {
        expect(() => lisp`($pop)`).toThrow();
    });
    it("$pop -> throw", function() {
        expect(() => lisp`($pop ($list) 3)`).toThrow();
    });
    it("$pop -> throw", function() {
        expect(() => lisp`($pop "")`).toThrow();
    });
    it("$pop -> list", function() {
        expect(lisp`($pop ($list))`).toEqual((void 0) as any);
    });
    it("$pop -> list", function() {
        expect(lisp`($pop ($list 3))`).toEqual(3);
    });
    it("$pop -> value", function() {
        expect(lisp`($pop ($list 3 5))`).toEqual(5);
    });
    it("$pop -> value", function() {
        expect(lisp`
            ($let x ($list 3 5))
            ($pop x)
            ($get x)
        `).toEqual([3]);
    });
});


describe("operator.core.$[]", function() {
    it("$[] -> throw", function() {
        expect(() => lisp`($[)`).toThrow();
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ ])`).toThrow();
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ 0 ])`).toThrow();
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ ] '(3 5 7 11 13))`).toThrow();
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ 0 '(3 5 7 11 13))`).toThrow();
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 0 ] '(3 5 7 11 13))`).toEqual(3);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 1 ] '(3 5 7 11 13))`).toEqual(5);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 4 ] '(3 5 7 11 13))`).toEqual(13);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 5 ] '(3 5 7 11 13))`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ -1 ] '(3 5 7 11 13))`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 0 ] "357ab")`).toEqual('3');
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 1 ] "357ab")`).toEqual('5');
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 4 ] "357ab")`).toEqual('b');
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 5 ] "357ab")`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ -1 ] "357ab")`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($["foo"] (# (foo 11) (bar 13)))`).toEqual(11);
    });
    it("$[] -> value", function() {
        expect(lisp`($["bar"] (# (foo 11) (bar 13)))`).toEqual(13);
    });
    it("$[] -> value", function() {
        expect(lisp`($["baz"] (# (foo 11) (bar 13)))`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 0 ] 0)`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 0 ] true)`).toEqual((void 0) as any);
    });
    it("$[] -> value", function() {
        expect(lisp`($[ 0 ] false)`).toEqual((void 0) as any);
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ 0 ] null)`).toThrow();
    });
    it("$[] -> throw", function() {
        expect(() => lisp`($[ 0 ] undefined)`).toThrow();
    });
});


describe("operator.core.$reverse", function() {
    it("$reverse -> throw", function() {
        expect(() => lisp`($reverse)`).toThrow();
    });
    it("$reverse -> throw", function() {
        expect(lisp`($reverse '())`).toEqual([]);
    });
    it("$reverse -> throw", function() {
        expect(lisp`($reverse '(3 5 7 11 13))`).toEqual([13, 11, 7, 5, 3]);
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse "abcde")`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse 0)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse +Infinity)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse -Infinity)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse NaN)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse null)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse undefined)`).toThrow();
    });
    it("$reverse a -> throw", function() {
        expect(() => lisp`($reverse (#))`).toThrow();
    });
});


describe("operator.core.$reverse!", function() {
    it("$reverse! -> throw", function() {
        expect(() => lisp`($reverse!)`).toThrow();
    });
    it("$reverse! -> throw", function() {
        expect(lisp`($reverse! '())`).toEqual([]);
    });
    it("$reverse! -> throw", function() {
        expect(lisp`($reverse! '(3 5 7 11 13))`).toEqual([13, 11, 7, 5, 3]);
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! "abcde")`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! 0)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! +Infinity)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! -Infinity)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! NaN)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! null)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! undefined)`).toThrow();
    });
    it("$reverse! a -> throw", function() {
        expect(() => lisp`($reverse! (#))`).toThrow();
    });
});


describe("operator.core.$find", function() {
    it("$find -> throw", function() {
        expect(() => lisp`($find)`).toThrow();
    });
    it("$find -> throw", function() {
        expect(() => lisp`($find '())`).toThrow();
    });
    it("$find -> value", function() {
        expect(lisp`($find '() (-> (v index array) (> v 4)) )`).toEqual((void 0) as any);
    });
    it("$find -> value", function() {
        expect(lisp`($find '(-29 3 0 1 11 7 13 5) (-> (v) (> v 4)) )`).toEqual(11);
    });
    it("$find -> value", function() {
        expect(lisp`($find '(-29 3 0 1 11 7 13 5) (-> (v) (> v 100)) )`).toEqual((void 0) as any);
    });
    it("$find -> value", function() {
        expect(lisp`($find '(11 7 13 3 5) (-> (v index array) (!== 0 (% index 2))) )`).toEqual(7);
    });
    it("$find -> value", function() {
        expect(lisp`($find '(11 7 13 3 5) (-> (v index array) (=== 0 (% index 2))) )`).toEqual(11);
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find "abcde")`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find 0)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find +Infinity)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find -Infinity)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find NaN)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find null)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find undefined)`).toThrow();
    });
    it("$find a -> throw", function() {
        expect(() => lisp`($find (#))`).toThrow();
    });
});


describe("operator.core.$filter", function() {
    it("$filter -> throw", function() {
        expect(() => lisp`($filter)`).toThrow();
    });
    it("$filter -> throw", function() {
        expect(() => lisp`($filter '())`).toThrow();
    });
    it("$filter -> list", function() {
        expect(lisp`($filter '() (-> (v index array) (> v 4)) )`).toEqual([]);
    });
    it("$filter -> list", function() {
        expect(lisp`($filter '(11 7 13 3 5) (-> (v) (> v 4)) )`).toEqual([11, 7, 13, 5]);
    });
    it("$filter -> list", function() {
        expect(lisp`($filter '(11 7 13 3 5) (-> (v) (> v 100)) )`).toEqual([]);
    });
    it("$filter -> list", function() {
        expect(lisp`($filter '(11 7 13 3 5) (-> (v index array) (=== 0 (% index 2))) )`).toEqual([11, 13, 5]);
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter "abcde")`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter 0)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter +Infinity)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter -Infinity)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter NaN)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter null)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter undefined)`).toThrow();
    });
    it("$filter a -> throw", function() {
        expect(() => lisp`($filter (#))`).toThrow();
    });
});


describe("operator.core.$map", function() {
    it("$map -> throw", function() {
        expect(() => lisp`($map)`).toThrow();
    });
    it("$map -> throw", function() {
        expect(() => lisp`($map '())`).toThrow();
    });
    it("$map -> list", function() {
        expect(lisp`($map '() (-> (v index array) (- v 2)) )`).toEqual([]);
    });
    it("$map -> list", function() {
        expect(lisp`($map '(11 7 13 3 5) (-> (v) (+ v 2)) )`).toEqual([13, 9, 15, 5, 7]);
    });
    it("$map -> list", function() {
        expect(lisp`($map '(11 7 13 3 5) (-> (v index array) (+ v index)) )`).toEqual([11, 8, 15, 6, 9]);
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map "abcde")`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map 0)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map +Infinity)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map -Infinity)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map NaN)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map null)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map undefined)`).toThrow();
    });
    it("$map a -> throw", function() {
        expect(() => lisp`($map (#))`).toThrow();
    });
});


describe("operator.core.$reduce", function() {
    it("$reduce -> throw", function() {
        expect(() => lisp`($reduce)`).toThrow();
    });
    it("$reduce -> throw", function() {
        expect(() => lisp`($reduce '())`).toThrow();
    });
    it("$reduce -> throw", function() {
        expect(() => lisp`($reduce '() (-> (acc v index array) (+ acc v)) )`).toThrow();
    });
    it("$reduce -> value", function() {
        expect(lisp`($reduce '() (-> (acc v index array) (+ acc v)) 11)`).toEqual(11);
    });
    it("$reduce -> value", function() {
        expect(lisp`($reduce '(3 5) (-> (acc v) (+ acc v)) 11)`).toEqual(19);
    });
    it("$reduce -> value", function() {
        expect(lisp`($reduce '(7 3 5) (-> (acc v index) (+ acc (* (+ index 1) v) )) )`).toEqual(28);
    });
    it("$reduce -> value", function() {
        expect(lisp`($reduce '(7 3 5) (-> (acc v index array) (+ acc (* (+ index 1) v) )) )`).toEqual(28); // 7+3*2+5*3=7+6+15
    });
    it("$reduce -> value", function() {
        expect(lisp`($reduce '(7 3 5) (-> (acc v index array) (+ acc (* (+ index 1) v) )) 11)`).toEqual(39); // 11+7*1+3*2+5*3=11+7+6+15
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce "abcde")`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce 0)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce +Infinity)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce -Infinity)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce NaN)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce null)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce undefined)`).toThrow();
    });
    it("$reduce a -> throw", function() {
        expect(() => lisp`($reduce (#))`).toThrow();
    });
});


describe("operator.core.$reduce-from-tail", function() {
    it("$reduce-from-tail -> throw", function() {
        expect(() => lisp`($reduce-from-tail)`).toThrow();
    });
    it("$reduce-from-tail -> throw", function() {
        expect(() => lisp`($reduce-from-tail '())`).toThrow();
    });
    it("$reduce-from-tail -> throw", function() {
        expect(() => lisp`($reduce-from-tail '() (-> (acc v index array) (+ acc v)) )`).toThrow();
    });
    it("$reduce-from-tail -> value", function() {
        expect(lisp`($reduce-from-tail '() (-> (acc v index array) (+ acc v)) 11)`).toEqual(11);
    });
    it("$reduce-from-tail -> value", function() {
        expect(lisp`($reduce-from-tail '(3 5) (-> (acc v) (+ acc v)) 11)`).toEqual(19);
    });
    it("$reduce-from-tail -> value", function() {
        expect(lisp`($reduce-from-tail '(7 3 5) (-> (acc v index) (+ acc (* (+ index 1) v) )) )`).toEqual(18);
    });
    it("$reduce-from-tail -> value", function() {
        expect(lisp`($reduce-from-tail '(7 3 5) (-> (acc v index array) (+ acc (* (+ index 1) v) )) )`).toEqual(18); // 5+3*2+7=5+6+7
    });
    it("$reduce-from-tail -> value", function() {
        expect(lisp`($reduce-from-tail '(7 3 5) (-> (acc v index array) (+ acc (* (+ index 1) v) )) 11)`).toEqual(39); // 11+5*3+3*2+7=11+15+6+7
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail "abcde")`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail 0)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail +Infinity)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail -Infinity)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail NaN)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail null)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail undefined)`).toThrow();
    });
    it("$reduce-from-tail a -> throw", function() {
        expect(() => lisp`($reduce-from-tail (#))`).toThrow();
    });
});


describe("operator.core.$sort", function() {
    it("$sort -> throw", function() {
        expect(() => lisp`($sort)`).toThrow();
    });
    it("$sort -> throw", function() {
        expect(() => lisp`($sort '())`).toThrow();
    });
    it("$sort -> list", function() {
        expect(lisp`($sort '() (-> (x y) (- x y)) )`).toEqual([]);
    });
    it("$sort -> list", function() {
        expect(lisp`($sort '(11 7 13 3 5) (-> (x y) (- x y)) )`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$sort -> list", function() {
        expect(lisp`($sort '(11 7 13 3 5) (-> (x y) (- y x)) )`).toEqual([13, 11, 7, 5, 3]);
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort "abcde")`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort 0)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort +Infinity)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort -Infinity)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort NaN)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort null)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort undefined)`).toThrow();
    });
    it("$sort a -> throw", function() {
        expect(() => lisp`($sort (#))`).toThrow();
    });
});


describe("operator.core.$sort!", function() {
    it("$sort! -> throw", function() {
        expect(() => lisp`($sort!)`).toThrow();
    });
    it("$sort! -> throw", function() {
        expect(() => lisp`($sort! '())`).toThrow();
    });
    it("$sort! -> list", function() {
        expect(lisp`($sort! '() (-> (x y) (- x y)) )`).toEqual([]);
    });
    it("$sort! -> list", function() {
        expect(lisp`($sort! '(11 7 13 3 5) (-> (x y) (- x y)) )`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$sort! -> list", function() {
        expect(lisp`($sort! '(11 7 13 3 5) (-> (x y) (- y x)) )`).toEqual([13, 11, 7, 5, 3]);
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! "abcde")`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! 0)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! +Infinity)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! -Infinity)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! NaN)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! null)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! undefined)`).toThrow();
    });
    it("$sort! a -> throw", function() {
        expect(() => lisp`($sort! (#))`).toThrow();
    });
});


describe("operator.core.$group-every", function() {
    it("$group-every -> throw", function() {
        expect(() => lisp`($group-every)`).toThrow();
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every 5
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13], [17, 19, 23, 29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every 9
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13, 17, 19, 23, 29], [31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every 10
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13, 17, 19, 23, 29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every 11
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13, 17, 19, 23, 29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 10) (intermediate 8))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13, 17, 19, 23, 29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (intermediate 8))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7, 11, 13, 17, 19, 23], [29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (first 3) (intermediate 6) (last 2))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7], [11, 13, 17, 19, 23, 29], [31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (first 3) (intermediate 5) (last 2))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7], [11, 13, 17, 19, 23], [29, 31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (first 3) (intermediate 4) (last 2))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7], [11, 13, 17, 19], [23, 29, 31], []] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (first 3) (intermediate 3) (last 2))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[3, 5, 7], [11, 13, 17], [19, 23, 29], [31]] as any);
    });
    it("$group-every -> list", function() {
        expect(lisp`
            ($group-every (# (single 9) (first 0) (intermediate 3) (last 0))
                ($list
                    3 5 7 11 13 17 19 23 29 31
                )
            )`).toEqual([[], [3, 5, 7], [11, 13, 17], [19, 23, 29], [31], []] as any);
    });
});


describe("operator.core.$group-by", function() {
    it("$group-by -> throw", function() {
        expect(() => lisp`($group-by)`).toThrow();
    });
    it("$group-by -> list", function() {
        expect(lisp`
            ($group-by ($list "foo")
                ($list
                    (# (foo 23) (bar 7) (baz 1))
                    (# (foo 23) (bar 5) (baz 2))
                    (# (foo 29) (bar 13) (baz 1))
                    (# (foo 29) (bar 11) (baz 2))
                    (# (foo 29) (bar 3) (baz 2))
                )
            )`).toEqual([[
                { foo: 23, bar: 7, baz: 1 },
                { foo: 23, bar: 5, baz: 2 },
            ], [
                { foo: 29, bar: 13, baz: 1 },
                { foo: 29, bar: 11, baz: 2 },
                { foo: 29, bar: 3, baz: 2 },
            ]] as any
        );
    });
    it("$group-by -> list", function() {
        expect(lisp`
            ($group-by ($list "foo" "baz")
                ($list
                    (# (foo 23) (bar 7) (baz 1))
                    (# (foo 23) (bar 5) (baz 2))
                    (# (foo 29) (bar 13) (baz 1))
                    (# (foo 29) (bar 11) (baz 2))
                    (# (foo 29) (bar 3) (baz 2))
                )
            )`).toEqual([[
                { foo: 23, bar: 7, baz: 1 },
            ], [
                { foo: 23, bar: 5, baz: 2 },
            ], [
                { foo: 29, bar: 13, baz: 1 },
            ], [
                { foo: 29, bar: 11, baz: 2 },
                { foo: 29, bar: 3, baz: 2 },
            ]] as any
        );
    });
    it("$group-by -> list", function() {
        expect(lisp`
            ($group-by (-> (a b) ($and (=== ($get a foo) ($get b foo)) (=== ($get a baz) ($get b baz)) ))
                ($list
                    (# (foo 23) (bar 7) (baz 1))
                    (# (foo 23) (bar 5) (baz 2))
                    (# (foo 29) (bar 13) (baz 1))
                    (# (foo 29) (bar 11) (baz 2))
                    (# (foo 29) (bar 3) (baz 2))
                )
            )`).toEqual([[
                { foo: 23, bar: 7, baz: 1 },
            ], [
                { foo: 23, bar: 5, baz: 2 },
            ], [
                { foo: 29, bar: 13, baz: 1 },
            ], [
                { foo: 29, bar: 11, baz: 2 },
                { foo: 29, bar: 3, baz: 2 },
            ]] as any
        );
    });
});


describe("operator.core.$order-by", function() {
    it("$order-by -> throw", function() {
        expect(() => lisp`($order-by)`).toThrow();
    });
    it("$order-by -> throw", function() {
        expect(() => lisp`($order-by '())`).toThrow();
    });
    it("$order-by -> list", function() {
        expect(lisp`($order-by (-> (a b) (- a b)) '(11 7 13 3 5))`).toEqual([3, 5, 7, 11, 13]);
    });
    it("$order-by -> list", function() {
        expect(lisp`($order-by (-> (a b) (- b a)) '(11 7 13 3 5))`).toEqual([13, 11, 7, 5, 3]);
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by ($list "foo")
                ($list
                    (# (foo 11))
                    (# (foo 7))
                    (# (foo 13))
                    (# (foo 3))
                    (# (foo 5))
                )
            )`).toEqual([
                { foo: 3 },
                { foo: 5 },
                { foo: 7 },
                { foo: 11 },
                { foo: 13 },
            ] as any
        );
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by ($list '("foo"))
                ($list
                    (# (foo 11))
                    (# (foo 7))
                    (# (foo 13))
                    (# (foo 3))
                    (# (foo 5))
                )
            )`).toEqual([
                { foo: 3 },
                { foo: 5 },
                { foo: 7 },
                { foo: 11 },
                { foo: 13 },
            ] as any
        );
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by ($list '("foo" "desc"))
                ($list
                    (# (foo 11))
                    (# (foo 7))
                    (# (foo 13))
                    (# (foo 3))
                    (# (foo 5))
                )
            )`).toEqual([
                { foo: 13 },
                { foo: 11 },
                { foo: 7 },
                { foo: 5 },
                { foo: 3 },
            ] as any
        );
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by ($list '("foo") '("bar" "desc"))
                ($list
                    (# (foo 29) (bar 11))
                    (# (foo 23) (bar 7))
                    (# (foo 29) (bar 13))
                    (# (foo 29) (bar 3))
                    (# (foo 23) (bar 5))
                )
            )`).toEqual([
                { foo: 23, bar: 7 },
                { foo: 23, bar: 5 },
                { foo: 29, bar: 13 },
                { foo: 29, bar: 11 },
                { foo: 29, bar: 3 },
            ] as any
        );
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by (-> (a b) ($if (!== ($get a foo) ($get b foo))
                                    (- ($get a foo) ($get b foo))
                                    (- ($get b bar) ($get a bar)) ))
                ($list
                    (# (foo 29) (bar 11))
                    (# (foo 23) (bar 7))
                    (# (foo 29) (bar 13))
                    (# (foo 29) (bar 3))
                    (# (foo 23) (bar 5))
                )
            )`).toEqual([
                { foo: 23, bar: 7 },
                { foo: 23, bar: 5 },
                { foo: 29, bar: 13 },
                { foo: 29, bar: 11 },
                { foo: 29, bar: 3 },
            ] as any
        );
    });
    it("$order-by -> list", function() {
        expect(lisp`
            ($order-by ($list '("foo" "desc"))
                ($list
                    (# (foo "ddd"))
                    (# (foo "ccc"))
                    (# (foo "eee"))
                    (# (foo "aaa"))
                    (# (foo "bbb"))
                )
            )`).toEqual([
                { foo: "eee" },
                { foo: "ddd" },
                { foo: "ccc" },
                { foo: "bbb" },
                { foo: "aaa" },
            ] as any
        );
    });
});


describe("operator.core.$where", function() {
    it("$where -> throw", function() {
        expect(() => lisp`($where)`).toThrow();
    });
    it("$where -> throw", function() {
        expect(() => lisp`($where '())`).toThrow();
    });
    it("$where -> list", function() {
        expect(lisp`($where (-> (v index array) (> v 4)) '() )`).toEqual([]);
    });
    it("$where -> list", function() {
        expect(lisp`($where (-> (v) (> v 4)) '(11 7 13 3 5) )`).toEqual([11, 7, 13, 5]);
    });
    it("$where -> list", function() {
        expect(lisp`($where (-> (v) (> v 100)) '(11 7 13 3 5) )`).toEqual([]);
    });
    it("$where -> list", function() {
        expect(lisp`($where (-> (v index array) (=== 0 (% index 2))) '(11 7 13 3 5) )`).toEqual([11, 13, 5]);
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where "abcde")`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where 0)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where +Infinity)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where -Infinity)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where NaN)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where null)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where undefined)`).toThrow();
    });
    it("$where a -> throw", function() {
        expect(() => lisp`($where (#))`).toThrow();
    });
});
