import P from 'parsimmon';
import daggy from 'daggy';
import { tap, curry, compose, identity, when, any, reduce, ifElse } from 'ramda';

const SOperation = daggy.taggedSum({
    Add: [],
    Mul: [],
    Sub: [],
    Div: []
})

const SExpr = daggy.taggedSum({
    Expr: ['els'],
    Operation: ['op'],
    Integer: ['x']
})

const add = curry((x, y) => x + y)
const addls = reduce(add, 0)
const mul = curry((x, y) => x * y)
const mulls = reduce(mul, 1)
const sub = curry((x, y) => x - y)
const subls = ifElse(xs => xs.length > 0, xs => xs.reduce(sub), _ => 0)
const div = curry((x, y) => x / y)
const divls = ifElse(xs => xs.length > 0, xs => xs.reduce(div), _ => 0)

export const interpret = sexp =>
    sexp.cata({
        Expr: ([op, ...xs]) => interpret(op)(xs.map(interpret)),
        Operation: op =>
            op.cata({
                Add: _ => addls,
                Mul: _ => mulls,
                Sub: _ => subls,
                Div: _ => divls
            }),
        Integer: identity
    })

// const expr = SExpr.Expr
// const op = SExpr.Operation
// const val = SExpr.Integer
//
// const x = expr([op('add'), expr([op('mul'), val(2), val(20)]), val(2)])
// console.log(x)
// const y = interpret(x);
// console.log(y)

const mapOperation = op => {
    switch (op) {
        case 'add': return P.succeed(SOperation.Add)
        case 'mul': return P.succeed(SOperation.Mul)
        case 'sub': return P.succeed(SOperation.Sub)
        case 'div': return P.succeed(SOperation.Div)
        default: return P.fail("unknown operation: " + op)
    }
}

const lexeme = p => p.skip(P.optWhitespace)

const lparen = lexeme(P.string('('))
const rparen = lexeme(P.string(')')).desc('inclomplete s-expression')

// expr :: Parser SExpr
export const expr = P.lazy('an s-expression', () => form.or(atom))

const number = lexeme(P.regex(/[0-9]+/).map(compose(SExpr.Integer, parseInt)))
const id = lexeme(P.regex(/[a-z_]\w*/i).chain(mapOperation).map(SExpr.Operation))

const atom = number.or(id)
const form = lparen.then(expr.many().map(SExpr.Expr)).skip(rparen)
