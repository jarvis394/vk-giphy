import { ThemeType } from 'src/styles/theme'
import { RootState } from '..'
import { THEME_SET, THEME_AUTO_CHANGE_SET } from '../reducers/theme/types'

export const setTheme = (themeType: ThemeType) => async (dispatch) => {
  dispatch({ type: THEME_SET, payload: themeType })
}

export const changeAutoTheme = () => async (dispatch, getState: () => RootState) => {
  dispatch({ type: THEME_AUTO_CHANGE_SET, payload: !getState().theme.autoThemeChange })
}
