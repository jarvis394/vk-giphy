import { THEME_TYPES } from 'src/config/constants'

declare module '@emotion/react' {
  export interface Theme {
    palette: {
      type: ThemeType
      background: {
        default: string
        paper: string
        wrapper: string
        input: string
      }
      border: {
        main: string
        light: string
        paper: string
      }
      text: {
        primary: string
        secondary: string
        subtitle: string
        hint: string
        hintHover: string
      }
      icon: {
        main: string
        disabledOpacity: CSSStyleRule['style']['opacity']
        hoverOpacity: CSSStyleRule['style']['opacity']
        opacity: CSSStyleRule['style']['opacity']
      }
      skeleton: {
        background: string
        waveOpacity: string
      }
      scrollbar: {
        main: string
        active: string
      }
      rainbowGradient: string
    }
    shadows: {
      popup: string
    }
  }
}

export type ThemeType = 'light' | 'dark'

export const isThemeType = (s: string): s is ThemeType =>
  THEME_TYPES.some((e) => e === s)

const PAPER_BACKGROUND_COLOR: Record<ThemeType, string> = {
  light: '#ffffff',
  dark: '#19191a',
}

const INPUT_BACKGROUND_COLOR: Record<ThemeType, string> = {
  light: '#ffffff',
  dark: '#2d2d2e',
}

const DEFAULT_BACKGROUND_COLOR: Record<ThemeType, string> = {
  light: '#edeef0',
  dark: '#0a0a0a',
}

const WRAPPER_BACKGROUND_COLOR: Record<ThemeType, string> = {
  light: '#FAFBFC',
  dark: '#19191a',
}

const MAIN_BORDER: Record<ThemeType, string> = {
  light: '#D3D9DE',
  dark: '#222222',
}

const LIGHT_BORDER: Record<ThemeType, string> = {
  light: '#dce1e5',
  dark: '#777777',
}

const PAPER_BORDER: Record<ThemeType, string> = {
  light: '#F0F4F6',
  dark: '#222222',
}

const PRIMARY_TEXT: Record<ThemeType, string> = {
  light: '#000000',
  dark: '#e0e3e6',
}

const SECONDARY_TEXT: Record<ThemeType, string> = {
  light: '#99A2AD',
  dark: '#777777',
}

const SUBTITLE_TEXT: Record<ThemeType, string> = {
  light: '#B0B5BA',
  dark: '#74797f',
}

const HINT_TEXT: Record<ThemeType, string> = {
  light: '#828282',
  dark: '#777777',
}

const HINT_HOVER_TEXT: Record<ThemeType, string> = {
  light: '#B2B2B2',
  dark: '#777777',
}

const SKELETON_COLOR: Record<ThemeType, string> = {
  light: '#E9ECEF',
  dark: '#444444',
}

const POPUP_SHADOW: Record<ThemeType, string> = {
  light: '0 4px 16px 0 rgba(0, 0, 0, 0.07)',
  dark: '0 4px 16px 0 rgba(100, 100, 100, 0.07)',
}

const ICON_COLOR: Record<ThemeType, string> = {
  light: '#818c99',
  dark: '#777',
}

const MAIN_SCROLLBAR: Record<ThemeType, string> = {
  light: '#DAE2EA',
  dark: '#3b3d3e',
}

const ACTIVE_SCROLLBAR: Record<ThemeType, string> = {
  light: '#D0D8DF',
  dark: '#505354',
}

const RAINBOW_GRADIENT: Record<ThemeType, string> = {
  light: 'linear-gradient(135deg, #2EE6A8, #3399FF, #9933FF, #FF3399)',
  dark: 'linear-gradient(135deg, #4eff89, #4bceff, #c84cff, #ff0e87)',
}

export const generateTheme = (type: ThemeType = 'light') => {
  if (!isThemeType(type))
    throw new Error(
      `\`type\` must be one of keys, typed as ThemeType: ${THEME_TYPES.join(
        ', '
      )}`
    )
  return {
    palette: {
      type,
      background: {
        default: DEFAULT_BACKGROUND_COLOR[type],
        paper: PAPER_BACKGROUND_COLOR[type],
        wrapper: WRAPPER_BACKGROUND_COLOR[type],
        input: INPUT_BACKGROUND_COLOR[type],
      },
      border: {
        main: MAIN_BORDER[type],
        light: LIGHT_BORDER[type],
        paper: PAPER_BORDER[type],
      },
      text: {
        primary: PRIMARY_TEXT[type],
        secondary: SECONDARY_TEXT[type],
        subtitle: SUBTITLE_TEXT[type],
        hint: HINT_TEXT[type],
        hintHover: HINT_HOVER_TEXT[type],
      },
      skeleton: {
        background: SKELETON_COLOR[type],
        waveOpacity: type === 'dark' ? '0.2' : '0.6',
      },
      icon: {
        main: ICON_COLOR[type],
        disabledOpacity: '0.5',
        hoverOpacity: '1',
        opacity: '0.7',
      },
      scrollbar: {
        main: MAIN_SCROLLBAR[type],
        active: ACTIVE_SCROLLBAR[type],
      },
      rainbowGradient: RAINBOW_GRADIENT[type],
    },
    shadows: {
      popup: POPUP_SHADOW[type],
    },
  }
}
