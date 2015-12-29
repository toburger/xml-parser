import { parse } from './parser';
import { expr, interpret } from './parser/sexpression';
import { compose, curry, identity, map, defaultTo } from 'ramda';
import S from 'sanctuary';
import React from 'react';
import { render } from 'react-dom';

const App = React.createClass({
  getInitialState() {
    return {
      sexpr: '',
      result: '',
      error: ''
    }
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
    })
  }),
  updateInput(e) {
    const sexpr = e.target.value;
    const result = parse(expr, sexpr);
    S.either(
      this.onError(sexpr).bind(this),
      this.onSuccess(sexpr).bind(this),
      map(interpret, result)
    )
  },
  render() {
    return (
      <div>
        <textarea onChange={this.updateInput} value={this.state.sexpr} rows="4" cols="40"></textarea>
        {!this.state.error ?
          (<div>{this.state.result}</div>) :
          (<div style={{color:'red'}}>{this.state.error}</div>)}
      </div>
    )
  }
})

render(<App />, document.getElementById('app'))
