import { parser } from './parser.cjs'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const FlipperIRLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'Filetype Version name type protocol address command frequency duty_cycle data':
          t.keyword,
        'FiletypeValue TypeValue ProtocolValue': t.className,
        'Hex Integer Float DataIr': t.atom,
        String: t.string,
        LineComment: t.lineComment
      })
    ]
  }),
  languageData: {
    commentTokens: { line: '#' }
  }
})

export function FlipperIR() {
  return new LanguageSupport(FlipperIRLanguage)
}
