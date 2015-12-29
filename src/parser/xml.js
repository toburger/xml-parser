import P from 'parsimmon'
import R from 'ramda'
import S from 'sanctuary'
import { parse } from '../parser'
import daggy from 'daggy'

const Xml = daggy.taggedSum({
    Element: ['name', 'attribs', 'elements'],
    Text: ['text'],
    Comment: ['comment']
})

const lexeme = p => p.skip(P.optWhitespace)

const tagName =
    P.regex(/[a-z][a-z0-9-:]*/i)
     .desc('invalid tag name')

const attributeName =
    P.regex(/[a-z][a-z0-9-_:]*/i)
     .desc('invalid attribute name')

const between = R.curry((p1, p2, p) =>
    p1.then(p)
      .skip(p2))

const betweenSingleQuotes =
    between(P.string('\''),
            P.string('\''),
            P.takeWhile(c => c !== '\''))

const betweenDoubleQuotes =
    between(P.string('"'),
            P.string('"'),
            P.takeWhile(c => c !== '"'))

const attributeValue =
    betweenDoubleQuotes
        .or(betweenSingleQuotes)

const attribute =
    attributeName
        .skip(P.string("="))
        .chain(name =>
            attributeValue.chain(value =>
                P.succeed({name, value})))
        .desc('invalid attribute')

const attributes =
    attribute.skip(P.optWhitespace).many()

const openTagFirstPart =
    P.string("<")
     .skip(P.optWhitespace)
     .then(tagName)
     .skip(P.optWhitespace)
     .chain(tagName =>
         attributes.map(attribs =>
             [tagName, attribs]))
     .skip(P.optWhitespace)

const openTag =
     lexeme(openTagFirstPart)
        .skip(P.string(">"))
        .desc('invalid open tag')

const closingTag = tagName =>
    P.seq(P.string("</"),
          P.optWhitespace,
          P.string(tagName),
          P.optWhitespace,
          P.string(">"))
     .desc(`could not find closing tag for '${tagName}'`)

const tagWithChildren =
    P.seq(lexeme(openTag), P.lazy(() => children))
     .chain(([[tagName, attribs], children]) =>
        P.succeed(Xml.Element(tagName, attribs, children))
         .skip(lexeme(closingTag(tagName))))

const tagWithoutChildren =
    lexeme(openTagFirstPart)
        .skip(P.string("/>"))
        .map(([tagName, attribs]) =>
            Xml.Element(tagName, attribs, []))

const comment =
    P.regex(/<!--.*-->/)
     .map(R.compose(Xml.Comment,
                    cmt => cmt.substring(4, cmt.length - 3).trim()))

const text =
    P.regex(/[^<]+/)
     .map(R.compose(Xml.Text, R.trim))
     .desc('invalid text')

const xmlTag =
    P.alt(tagWithChildren, tagWithoutChildren)
     .desc('invalid xml tag')

const children =
    lexeme(P.alt(xmlTag, text, comment)).many()

const parser =
    P.optWhitespace.then(lexeme(tagWithChildren.or(tagWithoutChildren))).skip(P.eof)

export default { Xml, parser }
