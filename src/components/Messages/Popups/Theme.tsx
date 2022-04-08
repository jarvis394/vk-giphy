import styled from '@emotion/styled/macro'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Popup from 'src/components/blocks/Popup'
import { COMMAND_PREFIX, THEME_NAMES, THEME_TYPES } from 'src/config/constants'
import useMessagesContext from 'src/hooks/useMessagesContext'
import { ThemeType } from 'src/styles/theme'
import { alpha } from 'src/utils/colorManipulation'
import getArgsFromMessagesContext from 'src/utils/getArgsFromMessagesContext'

const SELECTED_CLASS_NAME = 'themes__item--selected'
const NAVIGATION = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
}

const StyledPopup = styled(Popup)({
  height: 'auto !important',
  maxWidth: 'auto',
  width: 'auto',
  '&:focus': {
    outline: 'none',
  },
  [`&:not(:focus) .${SELECTED_CLASS_NAME}`]: {
    background: 'transparent',
  },
})

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
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.02),
  },
  '&:focus': {
    background: alpha(theme.palette.text.primary, 0.05),
  },
  [`&.${SELECTED_CLASS_NAME}`]: {
    background: alpha(theme.palette.text.primary, 0.05),
  },
}))

const ThemeTypeSpan = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
}))

const ThemePopup = () => {
  const [messagesContext, setMessagesContext] = useMessagesContext()
  const [query, setQuery] = useState(
    getArgsFromMessagesContext(messagesContext)?.trim()
  )
  const [selected, setSelected] = useState(0)
  const listRef = useRef<HTMLDivElement>()
  const filteredThemes = useMemo(
    () => THEME_TYPES.filter((e) => e.startsWith(query)),
    [query]
  )

  const handleItemClick = (item: ThemeType) => {
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
        setSelected((prev) => Math.abs((prev - 1) % filteredThemes.length))
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
      setQuery(getArgsFromMessagesContext(messagesContext)?.trim())
    }
  }, [messagesContext.message])

  return (
    <StyledPopup
      ref={listRef}
      active={
        messagesContext.command === 'theme' && filteredThemes.length !== 0
      }
      tabIndex={messagesContext.command === 'theme' ? 0 : -1}
    >
      <List>
        {filteredThemes.map((e, i) => (
          <ThemeItem
            role="button"
            tabIndex={-1}
            onClick={() => handleItemClick(e)}
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
