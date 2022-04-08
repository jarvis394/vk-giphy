import { Theme } from '@emotion/react'
import { ThemeType } from 'src/styles/theme'

const PREFIX = 'THEME_'
export const THEME_SET = PREFIX + 'SET'

export interface State {
  themeType: ThemeType
  theme: Theme
}
