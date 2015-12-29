import R from 'ramda';
import S from 'sanctuary';

// parse :: Parser Val -> String -> Either Err Val
export const parse = R.curry((parser, input) => {
    const res = parser.parse(input)
    if (res.status === true) {
        return S.Right(res.value)
    } else {
        let text =
            '...' + input.substring(res.index - 10, res.index + 10) + '...' +
            '\n             ^'
        return S.Left({error: res.expected, pos: res.index, text: text})
    }
})
