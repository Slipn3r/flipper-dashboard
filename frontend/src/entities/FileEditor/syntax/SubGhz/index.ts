import { parser } from './parser.cjs'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const FlipperSubGhzLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'Filetype Version Frequency Preset Custom_preset_name Custom_preset_module Custom_preset_data Protocol Bit Key TE RAW_Data Bit_RAW Data_RAW Encryption Add_standard_frequencies Default_frequency Hopper_frequency':
          t.keyword,
        'FiletypeValue PresetValue ProtocolValue': t.className,
        'Integer Hex DataSubGhz EncryptionValue': t.atom,
        AddStandardFrequenciesValue: t.bool,
        String: t.string,
        LineComment: t.lineComment
      })
    ]
  }),
  languageData: {
    commentTokens: { line: '#' }
  }
})

export function FlipperSubGhz() {
  return new LanguageSupport(FlipperSubGhzLanguage)
}
