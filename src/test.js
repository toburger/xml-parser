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

const time = f => {
    const before = new Date()
    const res = f();
    const after = new Date();
    console.log(`${after - before} ms`);
    return res;
}

const run = input =>
    S.either(error => {
        console.error(error.error, error.pos, '\n' + error.text + '\n')
    },
    xml => {
    //  console.log(getText([], xml))
        console.log(JSON.stringify(xml, undefined, 4))
    },
    time(() => parse(Xml.parser, input))
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

// run(`
//     <div id="readme" class="boxed-group clearfix announce instapaper_body md">
//         <h3>
//           <span class="octicon octicon-book "></span>
//           README.md
//         </h3>
//
//           <article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-daggy" class="anchor" href="#daggy" aria-hidden="true"><span class="octicon octicon-link"></span></a>Daggy</h1>
//
//     <p>Library for creating tagged constructors.</p>
//
//     <h2><a id="user-content-daggytaggedarguments" class="anchor" href="#daggytaggedarguments" aria-hidden="true"><span class="octicon octicon-link"></span></a><code>daggy.tagged(arguments)</code></h2>
//
//     <p>Creates a new constructor with the given field names as
//     arguments and properties. Allows <code>instanceof</code> checks with
//     returned constructor.</p>
//
//     <div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> Tuple3 <span class="pl-k">=</span> <span class="pl-smi">daggy</span>.<span class="pl-en">tagged</span>(<span class="pl-s"><span class="pl-pds">'</span>x<span class="pl-pds">'</span></span>, <span class="pl-s"><span class="pl-pds">'</span>y<span class="pl-pds">'</span></span>, <span class="pl-s"><span class="pl-pds">'</span>z<span class="pl-pds">'</span></span>);
//
//     <span class="pl-k">var</span> _123 <span class="pl-k">=</span> <span class="pl-en">Tuple3</span>(<span class="pl-c1">1</span>, <span class="pl-c1">2</span>, <span class="pl-c1">3</span>); <span class="pl-c">// optional new keyword</span>
//     <span class="pl-smi">_123</span>.<span class="pl-c1">x</span> <span class="pl-k">==</span> <span class="pl-c1">1</span> <span class="pl-k">&amp;&amp;</span> <span class="pl-smi">_123</span>.<span class="pl-c1">y</span> <span class="pl-k">==</span> <span class="pl-c1">2</span> <span class="pl-k">&amp;&amp;</span> <span class="pl-smi">_123</span>.<span class="pl-c1">z</span> <span class="pl-k">==</span> <span class="pl-c1">3</span>; <span class="pl-c">// true</span>
//     _123 <span class="pl-k">instanceof</span> Tuple3; <span class="pl-c">// true</span></pre></div>
//
//     <h2><a id="user-content-daggytaggedsumconstructors" class="anchor" href="#daggytaggedsumconstructors" aria-hidden="true"><span class="octicon octicon-link"></span></a><code>daggy.taggedSum(constructors)</code></h2>
//
//     <p>Creates a constructor for each key in <code>constructors</code>. Returns a
//     function with each constructor as a property. Allows
//     <code>instanceof</code> checks for each constructor and the returned
//     function.</p>
//
//     <div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-c1">Option</span> <span class="pl-k">=</span> <span class="pl-smi">daggy</span>.<span class="pl-en">taggedSum</span>({
//         Some<span class="pl-k">:</span> [<span class="pl-s"><span class="pl-pds">'</span>x<span class="pl-pds">'</span></span>],
//         None<span class="pl-k">:</span> []
//     });
//
//     <span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>) <span class="pl-k">instanceof</span> <span class="pl-smi">Option</span>.<span class="pl-smi">Some</span>; <span class="pl-c">// true</span>
//     <span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>) <span class="pl-k">instanceof</span> <span class="pl-c1">Option</span>; <span class="pl-c">// true</span>
//     <span class="pl-smi">Option</span>.<span class="pl-smi">None</span> <span class="pl-k">instanceof</span> <span class="pl-c1">Option</span>; <span class="pl-c">// true</span>
//
//     <span class="pl-k">function</span> <span class="pl-en">incOrZero</span>(<span class="pl-smi">o</span>) {
//         <span class="pl-k">return</span> <span class="pl-smi">o</span>.<span class="pl-en">cata</span>({
//             <span class="pl-en">Some</span><span class="pl-k">:</span> <span class="pl-k">function</span>(<span class="pl-smi">x</span>) {
//                 <span class="pl-k">return</span> x <span class="pl-k">+</span> <span class="pl-c1">1</span>;
//             },
//             <span class="pl-en">None</span><span class="pl-k">:</span> <span class="pl-k">function</span>() {
//                 <span class="pl-k">return</span> <span class="pl-c1">0</span>;
//             }
//         });
//     }
//     <span class="pl-en">incOrZero</span>(<span class="pl-smi">Option</span>.<span class="pl-en">Some</span>(<span class="pl-c1">1</span>)); <span class="pl-c">// 2</span>
//     <span class="pl-en">incOrZero</span>(<span class="pl-smi">Option</span>.<span class="pl-smi">None</span>); <span class="pl-c">// 0</span></pre></div>
//     </article>
//       </div>
// `)

const mss = `<root>
  <header>
    <error>
      <code>0</code>
      <message>OK</message>
    </error>
    <result_id>2f96d68b9adb5a9f7eb52bc13c79245d</result_id>
    <source>widget</source>
    <paging>
      <count>2</count>
      <total>2</total>
    </paging>
    <time>8,972.11 ms</time>
  </header>
  <result>
    <hotel>
      <id>6002</id>
      <id_lts/>
      <bookable>1</bookable>
      <name>Testhotel Thomas</name>
      <type>1</type>
      <stars>0</stars>
      <language>de</language>
      <price_engine>0</price_engine>
      <price_from>80</price_from>
      <themes>0</themes>
      <features>0</features>
      <location>
        <id_city>0</id_city>
        <id_community>114</id_community>
        <id_region>100</id_region>
      </location>
      <location_name>
        <name_city/>
        <name_community>Eppan an der Weinstraße</name_community>
        <name_region>Südtirols Süden</name_region>
      </location_name>
      <geolocation>
        <latitude>0</latitude>
        <longitude>0</longitude>
        <altitude>0</altitude>
        <distance>0</distance>
      </geolocation>
      <address>
        <street>Andreas Hofer 9f</street>
        <zip/>
        <city/>
        <country>IT</country>
        <url_streetview/>
      </address>
      <contact>
        <email>info@easisoft.net</email>
        <phone/>
        <fax/>
        <web>easisoft.net</web>
      </contact>
      <check_in>
        <from/>
        <to/>
      </check_in>
      <check_out>
        <from/>
        <to/>
      </check_out>
      <headline/>
      <description/>
      <online_payment>
        <methods>61</methods>
        <prepayment>30</prepayment>
        <ccards>2</ccards>
        <bank>
          <name>Volksbank</name>
          <iban>IT88F0604511601000005005369</iban>
          <swift>BPAAIT2B051</swift>
        </bank>
      </online_payment>
      <hotel_payment>
        <methods>1992</methods>
      </hotel_payment>
      <matching>
        <id_lau>0</id_lau>
      </matching>
      <lts_data>
        <A0Ene>0</A0Ene>
        <A0MTV>0</A0MTV>
        <A0Rep>0</A0Rep>
      </lts_data>
      <source_data>
        <description/>
        <url/>
      </source_data>
      <logo>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=6002&amp;src=7dcaa743f39350cdf15b22f342592c5c.png</url>
          <time>0</time>
          <title/>
        </picture>
      </logo>
      <pictures>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=6002&amp;src=7fa6b690698620b655db2b999228c90e.jpg</url>
          <time>0</time>
          <title/>
        </picture>
      </pictures>
      <pos>
        <id_pos>widget</id_pos>
      </pos>
    </hotel>
    <hotel>
      <id>9000</id>
      <id_lts/>
      <bookable>0</bookable>
      <name>Hotel HGV (Testbetrieb / Alloggio test)</name>
      <type>1</type>
      <stars>3</stars>
      <language>de</language>
      <price_engine>0</price_engine>
      <price_from>40</price_from>
      <themes>1</themes>
      <features>67108863</features>
      <location>
        <id_city>293</id_city>
        <id_community>118</id_community>
        <id_region>100</id_region>
      </location>
      <location_name>
        <name_city>Bozen Zentrum</name_city>
        <name_community>Bozen</name_community>
        <name_region>Südtirols Süden</name_region>
      </location_name>
      <geolocation>
        <latitude>46.4941348</latitude>
        <longitude>11.359911799999963</longitude>
        <altitude>180</altitude>
        <distance>0</distance>
      </geolocation>
      <address>
        <street>Schlachthofstraße 59</street>
        <zip>39100</zip>
        <city>Bozen</city>
        <country>IT</country>
        <url_streetview>https://www.google.de/maps/place/Schlachthofstra%C3%9Fe,+59/@46.494111,11.360115,3a,75y,284.77h,103t/data=!3m4!1e1!3m2!1s-M9xtbkd8HY9oyjXWR-Ghg!2e0!4m2!3m1!1s0x47829e764428c973:0xf69c0b0c87dc71b2</url_streetview>
      </address>
      <contact>
        <email>info@bookingsuedtirol.com</email>
        <phone>+39 0471 317700</phone>
        <fax>+39 0471 317 701</fax>
        <web>www.bookingsuedtirol.com</web>
      </contact>
      <check_in>
        <from>14:00</from>
        <to>17:00</to>
      </check_in>
      <check_out>
        <from>09:00</from>
        <to>10:00</to>
      </check_out>
      <headline>&lt;p&gt;TESTBETRIEB!&lt;/p&gt;&#13;
</headline>
      <description>&lt;p&gt;TESTBETRIEB!&lt;/p&gt;&#13;
&#13;
&lt;p&gt;&amp;nbsp;&lt;/p&gt;&#13;
</description>
      <online_payment>
        <methods>32</methods>
        <prepayment>30</prepayment>
        <ccards>2</ccards>
        <bank>
          <name>Sparkasse</name>
          <iban>IT88F0604511601000005005369</iban>
          <swift>BPAAIT2B051</swift>
        </bank>
      </online_payment>
      <hotel_payment>
        <methods>0</methods>
      </hotel_payment>
      <matching>
        <id_lau>0</id_lau>
      </matching>
      <lts_data>
        <A0Ene>2</A0Ene>
        <A0MTV>2</A0MTV>
        <A0Rep>3</A0Rep>
      </lts_data>
      <source_data>
        <description/>
        <url/>
      </source_data>
      <logo>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=da1a995debf036ab7b02b6a976133606.jpg</url>
          <time>0</time>
          <title/>
        </picture>
      </logo>
      <gallery>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=432b141a54ce888d8b2608592af9ac74.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=880eeb353417d0801d1fbcde2565dff1.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=ef2696e70ccc8f137dfaadb82876d1ed.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=6d0ef023d7021ad7eb2ce57199dcffa8.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=cdc2e9ecea47c05e29db00d5ce41e858.PNG</url>
          <time>0</time>
          <title>Winterbild </title>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=350d3c7901b71b7e53211786ef3cd46a.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=f53ae8b06c52ad90e151623f583d95e6.jpg</url>
          <time>1382431183</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=391675b041cf32a025c924adefc71463.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=efc019197c5b5d6ee902c6c571e908a9.jpg</url>
          <time>0</time>
          <title/>
        </picture>
      </gallery>
      <pictures>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=cdc2e9ecea47c05e29db00d5ce41e858.PNG</url>
          <time>0</time>
          <title>Winterbild </title>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=efc019197c5b5d6ee902c6c571e908a9.jpg</url>
          <time>0</time>
          <title/>
        </picture>
        <picture>
          <url>http://www.easymailing.eu/mss/mss_renderimg.php?id=9000&amp;src=880eeb353417d0801d1fbcde2565dff1.jpg</url>
          <time>0</time>
          <title/>
        </picture>
      </pictures>
      <features_view>
        <feature>
          <id>12</id>
          <title>Barrierefrei</title>
        </feature>
        <feature>
          <id>8</id>
          <title>Garten</title>
        </feature>
        <feature>
          <id>36</id>
          <title>Freier Zugang zum See/Privatstrand</title>
        </feature>
        <feature>
          <id>37</id>
          <title>Raucherraum</title>
        </feature>
        <feature>
          <id>38</id>
          <title>Trockenraum</title>
        </feature>
        <feature>
          <id>3</id>
          <title>Aufzug/Lift</title>
        </feature>
        <feature>
          <id>39</id>
          <title>Öffentliche Bar</title>
        </feature>
        <feature>
          <id>21</id>
          <title>Hausbar</title>
        </feature>
        <feature>
          <id>18</id>
          <title>Restaurant</title>
        </feature>
        <feature>
          <id>40</id>
          <title>Weinkeller</title>
        </feature>
        <feature>
          <id>41</id>
          <title>Spielzimmer</title>
        </feature>
        <feature>
          <id>42</id>
          <title>Spielplatz</title>
        </feature>
        <feature>
          <id>24</id>
          <title>Kinderbetreuung</title>
        </feature>
        <feature>
          <id>10</id>
          <title>Überdachter Parkplatz</title>
        </feature>
        <feature>
          <id>2</id>
          <title>Offener Parkplatz</title>
        </feature>
        <feature>
          <id>15</id>
          <title>Garage</title>
        </feature>
        <feature>
          <id>43</id>
          <title>Surfpoint</title>
        </feature>
        <feature>
          <id>22</id>
          <title>WLAN</title>
        </feature>
        <feature>
          <id>44</id>
          <title>Internetanschluss im Zimmer/Apartment</title>
        </feature>
        <feature>
          <id>46</id>
          <title>Seminarraum</title>
        </feature>
        <feature>
          <id>47</id>
          <title>Hunde erlaubt</title>
        </feature>
        <feature>
          <id>16</id>
          <title>Kleine Haustiere erlaubt</title>
        </feature>
        <feature>
          <id>48</id>
          <title>Keine Haustiere</title>
        </feature>
        <feature>
          <id>49</id>
          <title>Sportanimation</title>
        </feature>
        <feature>
          <id>50</id>
          <title>Geführte Touren und Wanderungen</title>
        </feature>
        <feature>
          <id>51</id>
          <title>Geführte Radtouren</title>
        </feature>
        <feature>
          <id>52</id>
          <title>Tennisanlage</title>
        </feature>
        <feature>
          <id>53</id>
          <title>Eigener Reiterhof</title>
        </feature>
        <feature>
          <id>19</id>
          <title>Fitnessraum</title>
        </feature>
        <feature>
          <id>7</id>
          <title>Hallenbad</title>
        </feature>
        <feature>
          <id>9</id>
          <title>Freibad</title>
        </feature>
        <feature>
          <id>13</id>
          <title>Whirlpool</title>
        </feature>
        <feature>
          <id>54</id>
          <title>Fahrradverleih</title>
        </feature>
        <feature>
          <id>55</id>
          <title>Skiverleih</title>
        </feature>
        <feature>
          <id>56</id>
          <title>Schneeschuhverleih</title>
        </feature>
        <feature>
          <id>57</id>
          <title>Wanderausrüstung</title>
        </feature>
        <feature>
          <id>58</id>
          <title>Unterhaltungsabende</title>
        </feature>
        <feature>
          <id>59</id>
          <title>Animation</title>
        </feature>
        <feature>
          <id>25</id>
          <title>Diätküche/Schonkost</title>
        </feature>
        <feature>
          <id>26</id>
          <title>Frühstück kontinental/Gabelfrühstück</title>
        </feature>
        <feature>
          <id>27</id>
          <title>Frühstücksbuffet</title>
        </feature>
        <feature>
          <id>28</id>
          <title>Vegetarisches Menü</title>
        </feature>
        <feature>
          <id>29</id>
          <title>Menüwahl möglich</title>
        </feature>
        <feature>
          <id>1</id>
          <title>Beautyfarm</title>
        </feature>
        <feature>
          <id>20</id>
          <title>Wellness</title>
        </feature>
        <feature>
          <id>60</id>
          <title>Kurlizenz (Staatliche Lizenz/Abkommen)</title>
        </feature>
        <feature>
          <id>61</id>
          <title>Kuranwendungen</title>
        </feature>
        <feature>
          <id>62</id>
          <title>Natürliche, örtliche Kurmittel</title>
        </feature>
        <feature>
          <id>17</id>
          <title>Massagen</title>
        </feature>
        <feature>
          <id>14</id>
          <title>Sauna</title>
        </feature>
        <feature>
          <id>4</id>
          <title>Dampfbad</title>
        </feature>
        <feature>
          <id>63</id>
          <title>Solarium</title>
        </feature>
        <feature>
          <id>30</id>
          <title>Abholservice</title>
        </feature>
        <feature>
          <id>31</id>
          <title>Gepäcktransport</title>
        </feature>
        <feature>
          <id>23</id>
          <title>Shuttle-Dienst</title>
        </feature>
        <feature>
          <id>32</id>
          <title>Skibus</title>
        </feature>
        <feature>
          <id>33</id>
          <title>Wäscherei/Wäscheservice</title>
        </feature>
        <feature>
          <id>34</id>
          <title>Trockner</title>
        </feature>
        <feature>
          <id>35</id>
          <title>Waschmaschine</title>
        </feature>
        <feature>
          <id>5</id>
          <title>Direkt an der Piste</title>
        </feature>
        <feature>
          <id>45</id>
          <title>Direkt an der Loipe</title>
        </feature>
        <feature>
          <id>6</id>
          <title>Zentrale Lage</title>
        </feature>
        <feature>
          <id>11</id>
          <title>Ruhig gelegen</title>
        </feature>
        <feature>
          <id>154</id>
          <title>Schwimmbad (Außen-/Innenpool)</title>
        </feature>
        <feature>
          <id>155</id>
          <title>Skishuttle kostenlos</title>
        </feature>
        <feature>
          <id>156</id>
          <title>Barrierefreie Unterkunft</title>
        </feature>
        <feature>
          <id>157</id>
          <title>W-LAN kostenlos</title>
        </feature>
        <feature>
          <id>158</id>
          <title>Saunabenutzung</title>
        </feature>
        <feature>
          <id>159</id>
          <title>1 Flasche Mineralwasser</title>
        </feature>
        <feature>
          <id>160</id>
          <title>Fahrradverleih kostenlos</title>
        </feature>
        <feature>
          <id>161</id>
          <title>Obstteller</title>
        </feature>
        <feature>
          <id>162</id>
          <title>Welcome-Drink</title>
        </feature>
        <feature>
          <id>163</id>
          <title>Parkplatz/Garage</title>
        </feature>
        <feature>
          <id>164</id>
          <title>Kostenlose Kinderbetreuung</title>
        </feature>
        <feature>
          <id>165</id>
          <title>Shuttle-Service (Bahnhof)</title>
        </feature>
        <feature>
          <id>166</id>
          <title>W-LAN</title>
        </feature>
      </features_view>
      <ratings>
        <rating>
          <id>4ee61bc9e4b03a1b72a30123</id>
          <provider>hotelnavigator</provider>
          <value>78.9115</value>
          <count>113</count>
          <date>2014-10-27</date>
        </rating>
      </ratings>
      <pos>
        <id_pos>widget_lts</id_pos>
        <id_pos>hgv_crm</id_pos>
        <id_pos>widget</id_pos>
        <id_pos>widget_tripInv</id_pos>
        <id_pos>sbalance</id_pos>
        <id_pos>vinumhotels</id_pos>
      </pos>
    </hotel>
  </result>
  <debug/>
</root>`


run(mss)
