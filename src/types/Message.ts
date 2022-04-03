export interface MessageAttachment {
  width: number
  height: number
  webp: string
  url: string
  title?: string
}

export interface Message {
  attachment?: MessageAttachment
  text?: string
  timestamp: number
}
