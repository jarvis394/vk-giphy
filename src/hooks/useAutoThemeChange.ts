import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme } from 'src/store/actions/theme'
import useMediaQuery from './useMediaQuery'

const preferDarkQuery = '(prefers-color-scheme: dark)'
const useAutoThemeChange = () => {
  const match = useMediaQuery(preferDarkQuery)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTheme(match ? 'dark' : 'light'))
  }, [match])
}

export default useAutoThemeChange
