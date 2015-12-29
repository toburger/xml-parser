import P from 'parsimmon';
import daggy from 'daggy';
import R from 'ramda';

const { curry, compose, identity, reduce, ifElse } = R

const Symbol = daggy.taggedSum({
    Add: [],
    Mul: [],
    Sub: [],
    Div: []
})

const Val = daggy.taggedSum({
    Expr: ['els'],
    Symbol: ['op'],
    Integer: ['x']
})

const addls = reduce(R.add, 0)
const mulls = reduce(R.multiply, 1)
const subls = ifElse(xs => xs.length > 0, xs => xs.reduce(R.subtract), _ => 0)
const divls = ifElse(xs => xs.length > 0, xs => xs.reduce(R.divide), _ => 0)

export const interpret = sexp =>
    sexp.cata({
        Expr: ([op, ...xs]) => interpret(op)(xs.map(interpret)),
        Symbol: op => op.cata({
            Add: _ => addls,
            Mul: _ => mulls,
            Sub: _ => subls,
            Div: _ => divls
        }),
        Integer: identity
    })

// const expr = Val.Expr
// const op = Val.Symbol
// const val = Val.Integer
//
// const x = expr([op('add'), expr([op('mul'), val(2), val(20)]), val(2)])
// console.log(x)
// const y = interpret(x);
// console.log(y)

const mapSymbol = op => {
    switch (op) {
        case 'add': return P.succeed(Symbol.Add)
        case 'mul': return P.succeed(Symbol.Mul)
        case 'sub': return P.succeed(Symbol.Sub)
        case 'div': return P.succeed(Symbol.Div)
        default: return P.fail(`unknown operation: '${op}'`)
    }
}

const lexeme = p => p.skip(P.optWhitespace)

const lparen = lexeme(P.string('('))
const rparen = lexeme(P.string(')')).desc('inclomplete s-expression')

// expr :: Parser Val
export const expr = P.lazy('an s-expression', () => form.or(atom))

const number = lexeme(P.regex(/[0-9]+/).map(compose(Val.Integer, parseInt)))
const id = lexeme(P.regex(/[a-z_]\w*/i).chain(mapSymbol).map(Val.Symbol))

const atom = number.or(id)
const form = lparen.then(expr.many().map(Val.Expr)).skip(rparen)
