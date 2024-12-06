import { parser } from './parser.cjs'
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

const FlipperNFCLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        'Filetype Version DeviceType UID ATQA SAK ApplicationData ProtocolInfo ATS DataFormatVersion NtagUltralightType Signature MifareVersion CounterN TearingN PagesTotal PagesRead PageN FailedAuthenticationAttempts MifareClassicType BlockN DSFID AFI ICReference LockDSFID LockAFI BlockCount BlockSize DataContent SecurityStatus Capabilities PasswordPrivacy PasswordEAS PrivacyMode LockEAS PICCVersion PICCFreeMemory PICCChangeKeyID PICCConfigChangeable PICCFreeCreateDelete PICCFreeDirectoryList PICCKeyChangeable PICCMaxKeys PICCKeyNVersion ApplicationCount ApplicationIDs ApplicationNChangeKeyID ApplicationNConfigChangeable ApplicationNFreeCreateDelete ApplicationNFreeDirectoryList ApplicationNFreeCreateList ApplicationNKeyChangeable ApplicationNMaxKeys ApplicationNKeyNVersion ApplicationNFileIDs ApplicationNFileNType ApplicationNFileNCommunicationSettings ApplicationNFileNAccessRights ApplicationNFileNSize ApplicationNFileN EMVCurrency KeyNMap':
          t.keyword,
        'FiletypeValue DeviceTypeValue NtagUltralightTypeValue MifareClassicTypeValue CapabilitiesValue KeysMfocValue':
          t.className,
        'Integer Hex UnknownData OneByte TwoBytes ThreeBytes FourBytes SevenBytes EightBytes UIDValue ApplicationIDsValue EMVCurrency':
          t.atom,
        String: t.string,
        Boolean: t.bool,
        LineComment: t.lineComment
      })
    ]
  }),
  languageData: {
    commentTokens: { line: '#' }
  }
})

export function FlipperNFC() {
  return new LanguageSupport(FlipperNFCLanguage)
}
