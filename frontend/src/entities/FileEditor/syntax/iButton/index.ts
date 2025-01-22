import { parser } from './parser'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const FlipperIButtonLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'Filetype Version Protocol Rom Sram Eeprom Data': t.keyword,
        'FiletypeValue ProtocolValue': t.className,
        'Integer DataIButton': t.atom,
        String: t.string,
        LineComment: t.lineComment
      })
    ]
  }),
  languageData: {
    commentTokens: { line: '#' }
  }
})

export function FlipperIButton() {
  return new LanguageSupport(FlipperIButtonLanguage)
}
