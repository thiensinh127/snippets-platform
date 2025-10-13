import 'server-only'
import {getRequestConfig} from 'next-intl/server'
import {defaultLocale, isLocale, Locale} from '../lib/i18n'
import {cookies} from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
  const locale: Locale = isLocale(cookieLocale) ? (cookieLocale as Locale) : defaultLocale

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    timeZone: 'UTC',
  }
})
