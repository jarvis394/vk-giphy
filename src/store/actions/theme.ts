import { ThemeType } from 'src/styles/theme'
import { THEME_SET } from '../reducers/theme/types'

export const setTheme = (themeType: ThemeType) => async (dispatch) => {
  dispatch({ type: THEME_SET, payload: themeType })
}
