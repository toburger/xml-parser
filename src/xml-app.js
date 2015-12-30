import { parse } from './parser'
import Xml from './parser/xml'
import R from 'ramda'
import S from 'sanctuary'
import React from 'react'
import { render } from 'react-dom'
import TextAreaAutosize from 'react-textarea-autosize'

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

        const toElement = maybe =>
            S.fromMaybe(undefined, maybe)

        const input =
            (<TextAreaAutosize
                style={{boxSizing: 'border-box', width: '100%'}}
                minRows={8}
                maxRows={20}
                onChange={this.updateXmlInput}
                value={this.state.input} />)

        const toTextArea = s =>
            (<TextAreaAutosize
                readOnly
                style={{boxSizing: 'border-box', width: '100%'}}
                minRows={8}
                maxRows={20}
                value={s} />)
        const asJson = r => JSON.stringify(r, undefined, 4)
        const result =
            toElement(
                R.map(
                    R.compose(toTextArea, asJson),
                    this.state.result
                )
            )

        const toUl = lis =>
            (<ul>{lis}</ul>)
        const toLi = (el, i) =>
            (<li key={`text-${i}`}>{el}</li>)
        const texts =
            toElement(
                R.map(
                    R.compose(toUl, R.addIndex(R.map)(toLi), getText([])),
                    this.state.result
                )
            )

        const error =
            toElement(
                this.state.error.map(({error, text}) => (
                    <div style={{color: 'red'}}>
                        <ul>{error.map((msg, i) =>
                            <li key={`error-${i}`}>{msg}</li>)}</ul>
                        <pre>{text}</pre>
                    </div>
                )
            )
        )

        const time = (<div>{`${this.state.time} ms`}</div>)

        return (
            <div>
                {input}
                {time}
                {result}
                {texts}
                {error}
            </div>
        )
    }
})

render(<App />, document.getElementById('app'))
