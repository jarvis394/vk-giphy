import produce from 'immer'
import { THEME_KEY, AUTO_THEME_CHANGE_KEY } from 'src/config/constants'
import { generateTheme, isThemeType } from 'src/styles/theme'
import { THEME_SET, THEME_AUTO_CHANGE_SET, State } from './types'

const preferDarkQuery = '(prefers-color-scheme: dark)'
const preferredThemeType = global?.matchMedia(preferDarkQuery)?.matches
  ? 'dark'
  : 'light'
const localStorageThemeType = localStorage.getItem(THEME_KEY)
const localStorageAutoThemeChange = localStorage.getItem(AUTO_THEME_CHANGE_KEY) === 'true'
const themeType = isThemeType(localStorageThemeType)
  ? localStorageThemeType
  : preferredThemeType
const initialState: State = {
  theme: generateTheme(themeType),
  themeType,
  autoThemeChange: localStorageAutoThemeChange
}

export default produce((draft, { type, payload }) => {
  switch (type) {
    case THEME_SET:
      draft.themeType = payload
      draft.theme = generateTheme(payload)
      localStorage.setItem(THEME_KEY, payload)
      break
    case THEME_AUTO_CHANGE_SET:
      draft.autoThemeChange = payload
      localStorage.setItem(AUTO_THEME_CHANGE_KEY, payload.toString())
      break
    default:
      break
  }
}, initialState)
