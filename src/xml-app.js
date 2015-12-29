import { parse } from './parser'
import Xml from './parser/xml'
import R from 'ramda'
import S from 'sanctuary'
import React from 'react'
import { render } from 'react-dom'

const getText = R.curry((acc, xml) => xml.cata({
    Text: R.identity,
    Comment: _ => acc,
    Element: (name, attrs, els) =>
        R.concat(acc, R.unnest(R.map(getText(acc), els)))
}))

const timer = f => {
    const before = new Date()
    const res = f();
    const after = new Date();
    return [after - before, res];
}

const App = React.createClass({
    getInitialState() {
        return {
            input: '',
            time: 0,
            result: S.Nothing(),
            error: S.Nothing()
        }
    },
    updateXmlInput(e) {
        const input = e.target.value
        const [time, xml] = timer(() => parse(Xml.parser, input))
        const [result, error] =
            S.either(
                error => [S.Nothing(), S.Just(error)],
                xml => [S.Just(xml), S.Nothing()],
                xml
            )
        this.setState({
            input,
            time,
            result,
            error
        })
    },
    render() {
        const result =
            S.fromMaybe(
                null,
                this.state.result
                    .map(r =>
                        JSON.stringify(r, undefined, 4)
                    ).map(r =>
                        (<pre>{r}</pre>)
                    )
            )

        const texts =
            S.fromMaybe(
                null,
                R.map(lis => (<ul>{lis}</ul>),
                    R.map(
                        R.compose(
                            R.addIndex(R.map)((el, i) =>
                                (<li key={`text-${i}`}>{el}</li>)
                            ),
                            getText([])
                        ),
                        this.state.result
                    )
                )
            )

        const error =
            S.fromMaybe(
                null,
                this.state.error.map(({error, text}) => (
                    <div style={{color: 'red'}}>
                        <ul>{error.map((msg, i) =>
                            <li key={`error-${i}`}>{msg}</li>)}</ul>
                        <pre>{text}</pre>
                    </div>
                )
            )
        )

        const time = <div>{`${this.state.time} ms`}</div>

        return (
            <div>
                <textarea cols="60" rows="10" onChange={this.updateXmlInput} value={this.state.input}></textarea>
                {time}
                {result}
                {texts}
                {error}
            </div>
        )
    }
})

render(<App />, document.getElementById('app'))
