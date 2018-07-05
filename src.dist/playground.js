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
        (div (@ (style (width "calc(50% - 10px)")
                       (minWidth "400px")
                       (margin "8px 4px 4px 4px") ))
            (div (@ (id ${this.props.id})
                    (style (width "100%")
                           (height "calc(100vh - 64px - 220px - 55px - 15px)")
                           (minHeight "300px")
                           (fontSize "12pt") )))
        )`);
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


class EvaluteButtons extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    handleParseSExpressionClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.parseSExpression(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleEvaluteAsLispClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.evaluteLisp(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleEvaluteAsLsxClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.evaluteLsx(editor.getValue(),
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
                       (onClick ${(e) => this.handleEvaluteAsLispClick(e)}) ) "Evalute as Lisp")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleEvaluteAsLsxClick(e)}) ) "Evalute as Lsx")
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

    evaluteLisp(code, outputElement) {
        let r = '';

        try {
            r = liyad.lisp(code);
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

    evaluteLsx(code, lsxRootElement, outputElement) {
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
                (EvaluteButtons (@ (editorId "editor")
                                   (lsxRootId "root")
                                   (outputId "root")
                                   (parseSExpression ${(code, outputElement) =>
                                       this.parseSExpression(code, outputElement)})
                                   (evaluteLisp ${(code, outputElement) =>
                                       this.evaluteLisp(code, outputElement)})
                                   (evaluteLsx ${(code, lsxRootElement, outputElement) =>
                                       this.evaluteLsx(code, lsxRootElement, outputElement)}) ))
            )
            (div (@ (style (display "flex")
                           (flexWrap "wrap") ))
                (AceEditor (@ (id "editor")
                              (loadExample ${(i) => this.loadExample(i)}) ))
                (div (@ (id "root")
                        (className "grey")
                        (style (width "calc(50% - 10px)")
                               (minWidth "400px")
                               (height "calc(100vh - 64px - 220px - 55px - 15px)")
                               (minHeight "300px")
                               (margin "8px 4px 4px 4px")
                               (overflow "auto") )))
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
        EvaluteButtons,
        App,
    },
});


}
