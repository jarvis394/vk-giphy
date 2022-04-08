import { Theme } from '@emotion/react'

const isDarkTheme = (theme: Theme) => theme.palette.type === 'dark'

export default isDarkTheme
