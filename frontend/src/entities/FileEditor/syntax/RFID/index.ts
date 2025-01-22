import { parser } from './parser'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const FlipperRFIDLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'Filetype Version Key type Data': t.keyword,
        'FiletypeValue TypeValue': t.className,
        'Hex Integer DataRfid': t.atom,
        String: t.string,
        LineComment: t.lineComment
      })
    ]
  }),
  languageData: {
    commentTokens: { line: '#' }
  }
})

export function FlipperRFID() {
  return new LanguageSupport(FlipperRFIDLanguage)
}
