import { parse } from './parser';
import { expr, interpret } from './parser/sexpr';
import { compose, curry, identity, map, defaultTo } from 'ramda';
import React from 'react';
import { render } from 'react-dom';

// //console.debug(P);
//
// // const parseRes1 = parse(expr, '3')
// const parseRes2 = parse(expr, '(add (mul 10 (add 3 4)) (add 7 8))')
//
const bimap = curry((error, success, either) =>
  either.bimap(error, success))
//
// const out = bimap(
//   ({error, pos}) => console.error(`err: ${error}, pos: ${pos}`),
//   res => console.log(res)
// )
//
// // run :: Either Err SExpr -> unit
// const run = compose(out, map(interpret))
//
// run(parseRes2)

const App = React.createClass({
  getInitialState() {
    return {
      sexpr: '',
      result: '',
      error: ''
    };
  },
  onError: curry(function(sexpr, {error, pos}) {
     this.setState({
       error: `err: ${error}, pos: ${pos}`,
       result: '',
       sexpr
     });
  }),
  onSuccess: curry(function(sexpr, result) {
    this.setState({
      result,
      sexpr,
      error: ''
    });
  }),
  updateInput(e) {
    const sexpr = e.target.value;
    const result = parse(expr, sexpr);
    bimap(
      this.onError(sexpr).bind(this),
      this.onSuccess(sexpr).bind(this),
      map(interpret, result)
    );
  },
  render() {
    return (
      <div>
        <input onChange={this.updateInput} value={this.state.sexpr} />
        {!this.state.error ?
          (<div>{this.state.result}</div>) :
          (<div style={{color:'red'}}>{this.state.error}</div>)}
      </div>
    );
  }
})

render(<App />, document.getElementById('app'))
