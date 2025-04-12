import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from '~/locales/en-US.json'
import zhCN from '~/locales/zh-CN.json'
import zhHK from '~/locales/zh-HK.json'

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,

    resources: {
      'en': {
        translation: enUS,
      },
      'zh-Hant': {
        translation: zhHK,
      },
      'zh': {
        translation: zhCN,
      },
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

const locales = getLocales()

i18n.changeLanguage(locales[0].languageTag)

export default i18n

export { t } from 'i18next'
