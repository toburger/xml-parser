import { Either, Maybe } from 'ramda-fantasy';
import { curry } from 'ramda';

// parse :: Parser SExpr -> String -> Either Err SExpr
export const parse = curry((parser, input) => {
    const res = parser.parse(input)
    if (res.status === true) {
        return Either.Right(res.value)
    } else {
        return Either.Left({error: res.expected, pos: res.index})
    }
})
