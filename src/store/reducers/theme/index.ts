import produce from 'immer'
import { THEME_KEY } from 'src/config/constants'
import { generateTheme, isThemeType } from 'src/styles/theme'
import { THEME_SET, State } from './types'

const preferDarkQuery = '(prefers-color-scheme: dark)'
const preferredThemeType = global?.matchMedia(preferDarkQuery)?.matches
  ? 'dark'
  : 'light'
const localStorageThemeType = localStorage.getItem(THEME_KEY)
const themeType = isThemeType(localStorageThemeType)
  ? localStorageThemeType
  : preferredThemeType
const initialState: State = {
  theme: generateTheme(themeType),
  themeType,
}

export default produce((draft, { type, payload }) => {
  switch (type) {
    case THEME_SET:
      draft.themeType = payload
      draft.theme = generateTheme(payload)
      localStorage.setItem(THEME_KEY, payload)
      break
    default:
      break
  }
}, initialState)
