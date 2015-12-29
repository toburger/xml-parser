import { parse } from './parser'
import Xml from './parser/xml'
import R from 'ramda'
import S from 'sanctuary'

const getText = R.curry((acc, xml) => xml.cata({
    Text: R.identity,
    Comment: _ => acc,
    Element: (name, attrs, els) =>
        R.concat(acc, R.unnest(R.map(getText(acc), els)))
}))

const run = input =>
    S.either(error => {
        console.error(error.error, error.pos, '\n' + error.text + '\n')
    },
     xml => {
         console.log(getText([], xml))
         //console.log(JSON.stringify(xml, undefined, 4))
     },
     parse(Xml.parser, input)
)

// run(`<hello world="asdf"></hello>`)
//
// run(`<hello world="asdf">text</hello>`)
//
// run(`<hello world="asdf"/>`)
//
// run(`<hello world="asdf">
//     <world id="asdf"></world>
// </hello>`)
//
// run(`<hello world="asdf">
//     <world id="asdf">hallou</world>
// </hello>`)
//
// run(`<hello world="asdf">
//     <world id="asdf"></world>
//     <test/>
// </hello>`)
//
// run(`<hello world="asdf"><world id="asdf">hallou</world><test>test</test></hello>`)

// run(`<hello world="asdf">
//     <!-- comment -->
//     <world id="asdf">hallou</world>
//     <test>test</test>
//     <person>
//         <name>tobias</name>
//     </person>
//     <person>
//         <name attrib:id='hello'>david</name>
//     </person>
// </hello>`)

run(`
    <div id="readme" class="boxed-group clearfix announce instapaper_body md">
        <h3>
          <span class="octicon octicon-book "></span>
          README.md
        </h3>

          <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-daggy" class="anchor" href="#daggy" aria-hidden="true"><span class="octicon octicon-link"></span></a>Daggy</h1>

    <p>Library for creating tagged constructors.</p>

    <h2><a id="user-content-daggytaggedarguments" class="anchor" href="#daggytaggedarguments" aria-hidden="true"><span class="octicon octicon-link"></span></a><code>daggy.tagged(arguments)</code></h2>

    <p>Creates a new constructor with the given field names as
    arguments and properties. Allows <code>instanceof</code> checks with
    returned constructor.</p>

    <div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> Tuple3 <span class="pl-k">=</span> <span class="pl-smi">daggy</span>.<span class="pl-en">tagged</span>(<span class="pl-s"><span class="pl-pds">'</span>x<span class="pl-pds">'</span></span>, <span class="pl-s"><span class="pl-pds">'</span>y<span class="pl-pds">'</span></span>, <span class="pl-s"><span class="pl-pds">'</span>z<span class="pl-pds">'</span></span>);

    <span class="pl-k">var</span> _123 <span class="pl-k">=</span> <span class="pl-en">Tuple3</span>(<span class="pl-c1">1</span>, <span class="pl-c1">2</span>, <span class="pl-c1">3</span>); <span class="pl-c">// optional new keyword</span>
    <span class="pl-smi">_123</span>.<span class="pl-c1">x</span> <span class="pl-k">==</span> <span class="pl-c1">1</span> <span class="pl-k">&amp;&amp;</span> <span class="pl-smi">_123</span>.<span class="pl-c1">y</span> <span class="pl-k">==</span> <span class="pl-c1">2</span> <span class="pl-k">&amp;&amp;</span> <span class="pl-smi">_123</span>.<span class="pl-c1">z</span> <span class="pl-k">==</span> <span class="pl-c1">3</span>; <span class="pl-c">// true</span>
    _123 <span class="pl-k">instanceof</span> Tuple3; <span class="pl-c">// true</span></pre></div>

    <h2><a id="user-content-daggytaggedsumconstructors" class="anchor" href="#daggytaggedsumconstructors" aria-hidden="true"><span class="octicon octicon-link"></span></a><code>daggy.taggedSum(constructors)</code></h2>

    <p>Creates a constructor for each key in <code>constructors</code>. Returns a
    function with each constructor as a property. Allows
    <code>instanceof</code> checks for each constructor and the returned
    function.</p>

    <div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-c1">Option</span> <span class="pl-k">=</span> <span class="pl-smi">daggy</span>.<span class="pl-en">taggedSum</span>({
        Some<span class="pl-k">:</span> [<span class="pl-s"><span class="pl-pds">'</span>x<span class="pl-pds">'</span></span>],
        None<span class="pl-k">:</span> []
    });

    <span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>) <span class="pl-k">instanceof</span> <span class="pl-smi">Option</span>.<span class="pl-smi">Some</span>; <span class="pl-c">// true</span>
    <span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>) <span class="pl-k">instanceof</span> <span class="pl-c1">Option</span>; <span class="pl-c">// true</span>
    <span class="pl-smi">Option</span>.<span class="pl-smi">None</span> <span class="pl-k">instanceof</span> <span class="pl-c1">Option</span>; <span class="pl-c">// true</span>

    <span class="pl-k">function</span> <span class="pl-en">incOrZero</span>(<span class="pl-smi">o</span>) {
        <span class="pl-k">return</span> <span class="pl-smi">o</span>.<span class="pl-en">cata</span>({
            <span class="pl-en">Some</span><span class="pl-k">:</span> <span class="pl-k">function</span>(<span class="pl-smi">x</span>) {
                <span class="pl-k">return</span> x <span class="pl-k">+</span> <span class="pl-c1">1</span>;
            },
            <span class="pl-en">None</span><span class="pl-k">:</span> <span class="pl-k">function</span>() {
                <span class="pl-k">return</span> <span class="pl-c1">0</span>;
            }
        });
    }
    <span class="pl-en">incOrZero</span>(<span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>)); <span class="pl-c">// 2</span>
    <span class="pl-en">incOrZero</span>(<span class="pl-smi">Option</span>.<span class="pl-smi">None</span>); <span class="pl-c">// 0</span></pre></div>
    </article>
      </div>
`)
