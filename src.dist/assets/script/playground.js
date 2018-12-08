// Copyright (c) 2018, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

{

var lsxDemo = null;
var AppState = {};



const exampleCodes = [

//// [0] ////
{name: "Example1: factorial",
 code:
`($concat "abc" "def")

($defun fac (n)
    ($if (== n 0)
        1
        (* n ($self (- n 1))) ) )

($defun multipy (x y)
    (* x y) )

(multipy 4 (fac 3))`},

//// [1] ////
{name: "Example2: Lsx Hello, World!",
 code:
`;; const Hello = (props) =>
;;     React.createElement('div', {},
;;         \`Hello, \${props.name}, and Lisp!\`,
;;         ...(Array.isArray(props.children) ? props.children : [props.children])
;;     );

($=for ($list 1 2 3 4 5)
    (Hello (@ (key $data)
        (name ($concat "Jane Doe " $data)) ))
)`},

//// [2] ////
{name: "Example3: tarai (compile)",
 code:
`($$defun tarai(x y z)
    ($if (<= x y)
        y
        ($self ($self (- x 1) y z)
               ($self (- y 1) z x)
               ($self (- z 1) x y))))
           
(tarai 13 6 0)`},

//// [3] ////
{name: "Example4: tarai (interpret)",
 code:
`($defun tarai(x y z)
    ($if (<= x y)
        y
        (tarai (tarai (- x 1) y z)
               (tarai (- y 1) z x)
               (tarai (- z 1) x y))))
           
; (tarai 12 6 0)
(tarai 9 6 0)`},

//// [4] ////
{name: "Example5: tarai (count)",
 code:
`($local (c) ($capture (c)
    ($$defun tarai(x y z)
        ($set c (+ c 1))
        ($if (<= x y)
            y
            ($self ($self (- x 1) y z)
                   ($self (- y 1) z x)
                   ($self (- z 1) x y))))
    ($list (tarai 13 6 0) c) ))`},

//// [5] ////
{name: "Example6: Fibonacci number (compile)",
 code:
`($local ()
    ($let fib-sub (=> (n a b)
        ($if (< n 3)
            ($cond (=== n 2) (+ a b)
                   (=== n 1) a
                   true      0)
            ($self (- n 1) (+ a b) a) ) ))
    ($capture (fib-sub)
        ($$defun fib (n) (fib-sub n 1 0)) ) )

($map ($range 0 10000) (<- fib))`},

//// [6] ////
{name: "Example7: Fibonacci number (interpret)",
 code:
`($local ()
    ($let fib-sub (-> (n a b)
        ($if (< n 3)
            ($cond (=== n 2) (+ a b)
                   (=== n 1) a
                   true      0)
            ($self (- n 1) (+ a b) a) ) ))
    ($capture (fib-sub)
        ($defun fib (n) (fib-sub n 1 0)) ) )

($map ($range 0 20) (<- fib))`},

//// [7] ////
{name: "Example8: Factorial (compile)",
 code:
`($local ()
    ($let fac-sub (=> (n a)
        ($if (< n 2)
            ($cond (=== n 1) a
                   (=== n 0) 1
                   true      0)
            ($self (- n 1) (* n a)) )) )
    ($capture (fac-sub)
        ($$defun fac (n) (fac-sub n 1)) ))

($map ($range 0 10000) (<- fac))`},

//// [8] ////
{name: "Example9: Factorial (interpret)",
 code:
`($local ()
    ($let fac-sub (-> (n a)
        ($if (< n 2)
            ($cond (=== n 1) a
                   (=== n 0) 1
                   true      0)
            ($self (- n 1) (* n a)) )) )
    ($capture (fac-sub)
        ($defun fac (n) (fac-sub n 1)) ))

($map ($range 0 20) (<- fac))`},

//// [9] ////
{name: "Example10: Macro",
 code:
`($defmacro FOR (!i <[> <FROM> s <TO> e <]> ...body)
    \`($last
        ($local ((,i ,s))
            ($while (<= ,i ,e)
                ,@body
                ($set ,i (+ ,i 1)) ))))


($let c1   0)
($let c2 100)
(FOR p [ FROM (+ 1) TO (+ 6 -3) ]
    ($set c1 (+ c1 p))
    ($set c2 (+ c2 p)) )

($list c1 c2 p i s e)`}

];



const Hello = (props) =>
    React.createElement('div', {},
        `Hello, ${props.name}, and Lisp!`,
        ...(Array.isArray(props.children) ? props.children : [props.children])
    );


class AceEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
        this.editor = null;
    }

    componentDidMount() {
        this.editor = ace.edit('editor');
        this.editor.setTheme('ace/theme/monokai');
        this.editor.session.setMode('ace/mode/lisp');

        AppState.AceEditor = AppState.AceEditor || {};
        AppState.AceEditor[this.props.id] = this.editor;

        this.props.loadExample(0);
    }

    render() {
        return (lsx`
        (div (@ (className "AceEditorOuterWrap"))
            (div (@ (id ${this.props.id})
                    (className "AceEditorDiv") )))`);
    }
}


class ExampleLoader extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    handleExampleSelected(i) {
        this.props.loadExample(i);
    }

    render() {
        return (lsx`
        (Template
            (select (@ (style (display "inline-block")
                              (width "300px") )
                       (onChange ${(e) => this.handleExampleSelected(e.target.value)}) )
                ($=for ${exampleCodes}
                    (option (@ (value $index)) ($get $data "name") )
                )
            )
        )`);
    }
}


class EvaluateButtons extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    handleParseSExpressionClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.parseSExpression(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleEvaluateAsLispClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.evaluateLisp(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleEvaluateAsLsxClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.evaluateLsx(editor.getValue(),
            document.getElementById(this.props.lsxRootId),
            document.getElementById(this.props.outputId));
    };

    render() {
        return (lsx`
        (Template
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleParseSExpressionClick(e)}) ) "Parse S expression")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleEvaluateAsLispClick(e)}) ) "Evaluate as Lisp")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleEvaluateAsLsxClick(e)}) ) "Evaluate as Lsx")
        )`);
    }
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    loadExample(i) {
        const editor = AppState.AceEditor['editor'];
        editor.setValue(exampleCodes[i].code);
        editor.clearSelection();
    }

    parseSExpression(code, outputElement) {
        let r = '';

        try {
            r = JSON.stringify(liyad.S(code));
        } catch (e) {
            r = e.toString();
        }

        let x = document.createElement('div');
        x.innerText = r;

        ReactDOM.unmountComponentAtNode(outputElement);
        while (outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        outputElement.appendChild(x);
    }

    evaluateLisp(code, outputElement) {
        let r = '';

        try {
            r = JSON.stringify(liyad.lisp(code));
        } catch (e) {
            r = e.toString();
        }

        let x = document.createElement('div');
        x.innerText = r;

        ReactDOM.unmountComponentAtNode(outputElement);
        while (outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        outputElement.appendChild(x);
    }

    evaluateLsx(code, lsxRootElement, outputElement) {
        let r = '';

        try {
            ReactDOM.unmountComponentAtNode(lsxRootElement);
            while (lsxRootElement.firstChild) {
                lsxRootElement.removeChild(lsxRootElement.firstChild);
            }
            ReactDOM.render(lsxDemo(code), lsxRootElement);
        } catch (e) {
            r = e.toString();
            let x = document.createElement('div');
            x.innerText = r;

            ReactDOM.unmountComponentAtNode(outputElement);
            while (outputElement.firstChild) {
                outputElement.removeChild(outputElement.firstChild);
            }
            outputElement.appendChild(x);
        }
    }

    render() {
        return (lsx`
        (Template
            (div (@ (style (margin "4px")))
                (ExampleLoader  (@ (loadExample ${(i) => this.loadExample(i)}) ))
                " "
                (EvaluateButtons (@ (editorId "editor")
                                   (lsxRootId "root")
                                   (outputId "root")
                                   (parseSExpression ${(code, outputElement) =>
                                       this.parseSExpression(code, outputElement)})
                                   (evaluateLisp ${(code, outputElement) =>
                                       this.evaluateLisp(code, outputElement)})
                                   (evaluateLsx ${(code, lsxRootElement, outputElement) =>
                                       this.evaluateLsx(code, lsxRootElement, outputElement)}) ))
            )
            (div (@ (style (display "flex")
                           (flexWrap "wrap") ))
                (AceEditor (@ (id "editor")
                              (loadExample ${(i) => this.loadExample(i)}) ))
                (div (@ (id "root")
                        (className "grey OutletDiv") ))
            )
        )`);
    }
}



lsxDemo = liyad.LSX({
    jsx: React.createElement,
    jsxFlagment: React.Fragment,
    components: {
        Hello,
    },
});

window.lsx = liyad.LSX({
    jsx: React.createElement,
    jsxFlagment: React.Fragment,
    components: {
        AceEditor,
        ExampleLoader,
        EvaluateButtons,
        App,
    },
});


}
