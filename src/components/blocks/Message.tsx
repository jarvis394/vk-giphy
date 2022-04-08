import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'
import {
  MESSAGE_ATTACHMENT_HORIZONTAL_MAX_WIDTH,
  MESSAGE_ATTACHMENT_VERTICAL_MAX_WIDTH,
} from 'src/config/constants'
import { Message as MessageType } from 'src/types'
import { formatNewLine } from 'src/utils/formatNewLine'
import isVerticalImage from 'src/utils/isVerticalImage'

const Root = styled('div')({
  display: 'flex',
  gap: 8,
  flexDirection: 'row',
  position: 'relative',
  alignItems: 'flex-end',
})

const Timestamp = styled('span')(({ theme }) => ({
  fontSize: 13,
  lineHeight: '17px',
  fontWeight: 400,
  color: theme.palette.text.secondary,
}))

const Attachment = styled('picture', {
  shouldForwardProp: (p) =>
    !['width', 'height', 'maxWidth'].some((e) => e === p),
})<{
  width: number
  height: number
  maxWidth: number
}>(({ theme, width, height, maxWidth }) => ({
  aspectRatio: `${width} / ${height}`,
  maxWidth,
  width: 'calc(100% - 32px)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 64,
  maxHeight: 500,
  backgroundColor: theme.palette.skeleton.background,
  position: 'relative',
  borderRadius: 6,
  overflow: 'hidden',
  '& img': {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}))

const Text = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: 13,
  lineHeight: '17px',
  fontWeight: 400,
  color: theme.palette.text.primary,
}))

const Message: React.FC<{
  data: MessageType
}> = ({ data }) => {
  const attachmentMaxWidth = useMemo(
    () =>
      data.attachment &&
      Math.min(
        data.attachment.width,
        isVerticalImage(data.attachment)
          ? MESSAGE_ATTACHMENT_VERTICAL_MAX_WIDTH
          : MESSAGE_ATTACHMENT_HORIZONTAL_MAX_WIDTH
      ),
    []
  )
  const timestamp = useMemo(
    () =>
      new Date(data.timestamp).toLocaleTimeString(navigator?.language || [], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [data.timestamp]
  )

  return (
    <Root>
      {data.attachment && (
        <Attachment
          width={data.attachment.width}
          height={data.attachment.height}
          maxWidth={attachmentMaxWidth}
        >
          <source type="image/webp" srcSet={data.attachment.webp} />
          <img src={data.attachment.url} alt={data.attachment.title} />
        </Attachment>
      )}
      {data.text && <Text>{formatNewLine(data.text)}</Text>}
      <Timestamp>{timestamp}</Timestamp>
    </Root>
  )
}

export default React.memo(Message)
