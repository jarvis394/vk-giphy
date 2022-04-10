import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme } from 'src/store/actions/theme'
import useMediaQuery from './useMediaQuery'
import useSelector from './useSelector'

const preferDarkQuery = '(prefers-color-scheme: dark)'
const useAutoThemeChange = () => {
  const autoThemeChange = useSelector((store) => store.theme.autoThemeChange)
  const themeType = useSelector((store) => store.theme.themeType)
  const match = useMediaQuery(preferDarkQuery)
  const dispatch = useDispatch()

  useEffect(() => {
    const newThemeType = match ? 'dark' : 'light'
    if (autoThemeChange && newThemeType !== themeType) {
      dispatch(setTheme(newThemeType))
    }
  }, [match, autoThemeChange, themeType])
}

export default useAutoThemeChange
