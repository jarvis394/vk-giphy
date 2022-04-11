import styled from '@emotion/styled/macro'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Popup from 'src/components/blocks/Popup'
import {
  APP_MAX_WIDTH,
  COMMAND_PREFIX,
  THEME_NAMES as CONFIG_THEME_NAMES,
  THEME_TYPES as CONFIG_THEME_TYPES,
} from 'src/config/constants'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { AutoThemeType, ThemeType } from 'src/styles/theme'
import { alpha } from 'src/utils/colorManipulation'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'

const THEME_TYPES: (ThemeType | AutoThemeType)[] = [...CONFIG_THEME_TYPES, 'auto']
const THEME_NAMES: Record<ThemeType | AutoThemeType, string> = {
  ...CONFIG_THEME_NAMES,
  auto: 'Как в системе',
}
const SELECTED_CLASS_NAME = 'themes__item--selected'
const NAVIGATION = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
}

const StyledPopup = styled(Popup)(({ theme }) => ({
  height: 'auto !important',
  maxWidth: 'auto',
  width: 'auto',
  '&:focus': {
    outline: 'none',
    border: '1px solid ' + alpha(theme.palette.text.primary, 0.12),
    [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
      border: 'none',
      borderTop: '1px solid ' + alpha(theme.palette.text.primary, 0.12),
    },
  },
  [`&:not(:focus) .${SELECTED_CLASS_NAME}`]: {
    background: 'transparent',
    '&:hover': {
      background: alpha(theme.palette.text.primary, 0.02),
    },
  },
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    width: '100%',
  },
}))

const List = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 0',
})

const ThemeItem = styled('button')(({ theme }) => ({
  padding: '8px 16px',
  fontSize: 13,
  minWidth: 196,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  color: theme.palette.text.primary,
  gap: 8,
  cursor: 'pointer',
  border: 'none',
  background: 'transparent',
  WebkitTapHighlightColor: alpha(theme.palette.text.primary, 0.05),
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.02),
  },
  '&:focus': {
    background: alpha(theme.palette.text.primary, 0.05),
  },
  [`&.${SELECTED_CLASS_NAME}`]: {
    background: alpha(theme.palette.text.primary, 0.05),
  },
  [`@media (max-width: ${APP_MAX_WIDTH}px)`]: {
    minWidth: '100%',
  },
}))

const ThemeTypeSpan = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}))

const ThemePopup = () => {
  const [messagesContext, setMessagesContext] = useMessagesContext()
  const [query, setQuery] = useState(
    getArgsFromMessagesContext(messagesContext)
  )
  const [selected, setSelected] = useState(0)
  const [filteredThemes, setFilteredThemes] = useState(
    THEME_TYPES.filter((e) => e.startsWith(query?.trim()))
  )
  const [shouldAnimateOut, setShouldAnimateOut] = useState(
    filteredThemes.length === 0
  )
  const isActive = useMemo(
    () => messagesContext.command === 'theme' && !shouldAnimateOut,
    [shouldAnimateOut, messagesContext.command]
  )
  const listRef = useRef<HTMLDivElement>()

  const handleItemClick = (item: ThemeType | AutoThemeType) => {
    const message = COMMAND_PREFIX + 'theme ' + item
    setSelected(THEME_TYPES.findIndex((e) => e === item))
    setMessagesContext({
      lastSelection: [message.length, message.length],
      message,
      command: 'theme',
    })
  }

  /** Handles keyboard arrow presses to navigate through list */
  const handleListKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === NAVIGATION.Up) {
        setSelected((prev) => prev - 1 < 0 ? filteredThemes.length - 1 : prev - 1)
      } else if (e.key === NAVIGATION.Down) {
        setSelected((prev) => (prev + 1) % filteredThemes.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleItemClick(THEME_TYPES[selected])
      }
    },
    [selected, filteredThemes]
  )

  /** Registers list arrow navigation handler */
  useEffect(() => {
    listRef.current?.addEventListener('keydown', handleListKeyboardNavigation)
    return () => {
      listRef.current?.removeEventListener(
        'keydown',
        handleListKeyboardNavigation
      )
    }
  }, [listRef.current, selected, filteredThemes])

  /** Drops selected on every change of filter */
  useEffect(() => setSelected(0), [filteredThemes])

  /** Remembers query to make seamless show/hide transition */
  useEffect(() => {
    if (messagesContext.command === 'theme') {
      setQuery(getArgsFromMessagesContext(messagesContext))
    }
  }, [messagesContext.message])

  useEffect(() => {
    const newFilteredThemes = THEME_TYPES.filter((e) =>
      e.startsWith(query?.trim())
    )
    if (newFilteredThemes.length === 0) {
      setShouldAnimateOut(true)
    } else {
      setShouldAnimateOut(false)
      setFilteredThemes(newFilteredThemes)
    }
  }, [query])

  return (
    <StyledPopup ref={listRef} active={isActive} tabIndex={isActive ? 0 : -1}>
      <List>
        {filteredThemes.map((e, i) => (
          <ThemeItem
            role="button"
            tabIndex={-1}
            onClick={() => handleItemClick(e)}
            onMouseDown={(event) => event.preventDefault()}
            key={i}
            {...(selected === i && {
              className: SELECTED_CLASS_NAME,
            })}
          >
            {THEME_NAMES[e]}
            <ThemeTypeSpan>{e}</ThemeTypeSpan>
          </ThemeItem>
        ))}
      </List>
    </StyledPopup>
  )
}

export default React.memo(ThemePopup)
