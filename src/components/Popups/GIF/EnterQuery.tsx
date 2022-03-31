import React from 'react'
import { keyframes } from '@emotion/react/macro'
import styled from '@emotion/styled/macro'
import { EMOJI_LIST } from 'src/config/constants'

const emojisCarousel = keyframes`
  0% {
    background-position-y: 0px;
  }
  20% {
    background-position-y: 0px;
  }
  25% {
    background-position-y: 56px;
  }
  45% {
    background-position-y: 56px;
  }
  50% {
    background-position-y: 112px;
  }
  70% {
    background-position-y: 112px;
  }
  75% {
    background-position-y: 168px;
  }
  95% {
    background-position-y: 168px;
  }
  100% {
    background-position-y: 224px;
  }
`

const textCarousel = keyframes`
  0% {
    top: -76px;
  }
  20% {
    top: -76px;
  }
  25% {
    top: -57px;
  }
  45% {
    top: -57px;
  }
  50% {
    top: -38px;
  }
  70% {
    top: -38px;
  }
  75% {
    top: -19px;
  }
  95% {
    top: -19px;
  }
  100% {
    top: 0px;
  }
`

const widthAnimation = keyframes`
  0% {
    width: 70.53px;
  }
  20% {
    width: 70.53px;
  }
  25% {
    width: 58.1px;
  }
  45% {
    width: 58.1px;
  }
  50% {
    width: 52.66px;
  }
  70% {
    width: 52.66px;
  }
  75% {
    width: 78.61px;
  }
  95% {
    width: 78.61px;
  }
  100% {
    width: 70.53px;
  }
`

const Centered = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
})

const Title = styled('h1')({
  fontSize: 16,
  margin: 0,
  marginBottom: 6,
  fontWeight: 600,
  color: '#868B8F',
})

const Subtitle = styled('span')({
  fontSize: 13,
  margin: 0,
  fontWeight: 400,
  color: '#B0B5BA',
})

const Emoji = styled('div')({
  width: 56,
  height: 56,
  background: 'url(/emojis-sprite.png)',
  backgroundSize: '56px 224px',
  backgroundPositionY: 0,
  marginBottom: 12,
  borderRadius: '50%',
  animation: `${emojisCarousel} 15s cubic-bezier(1, 0, 0, 1) infinite`,
})

const EmojiTextBox = styled('span')({
  display: 'inline-flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: 19,
  marginLeft: 4,
  lineHeight: '19px',
  animation: `${widthAnimation} 15s cubic-bezier(1, 0, 0, 1) infinite`,
  '& span': {
    lineHeight: '19px',
    position: 'relative',
    background: 'linear-gradient(135deg, #2EE6A8, #3399FF, #9933FF, #FF3399)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${textCarousel} 15s cubic-bezier(1, 0, 0, 1) infinite`,
  },
})

const EnterQuery = () => {
  return (
    <Centered>
      <Emoji />
      <Title>
        Попробуй написать
        <EmojiTextBox>
          <span>{EMOJI_LIST[0]}</span>
          {[...EMOJI_LIST].reverse().map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </EmojiTextBox>
      </Title>
      <Subtitle>Поиск гифок на сервисе GIPHY</Subtitle>
    </Centered>
  )
}

export default React.memo(EnterQuery)
