export const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/'

export const COMMAND_PREFIX = '/'

/** Holds all supported keywords for commands */
export const COMMAND_KEYWORDS = new Set(['gif'])

export const APP_MAX_WIDTH = 500
export const MESSAGE_ATTACHMENT_VERTICAL_MAX_WIDTH = 256
export const MESSAGE_ATTACHMENT_HORIZONTAL_MAX_WIDTH = 348
export const POPUP_MAX_WIDTH = 428
export const POPUP_HEIGHT = 248
export const TEXTAREA_MAX_LINES = 10

// TODO: Probably can be dynamic to enhance UX, but who cares.
//       Load a small amount at the beginning and a lot afterwards.
/** Amount of gifs being fetched at once */
export const GIPHY_FETCH_GIFS_COUNT = 50
export const GIPHY_MAX_QUERY_LENGTH = 50

/** Time before data in store revalidates */
export const DEFAULT_UPDATE_INTERVAL = 3600

export const EMOJI_LIST = ['единорог', 'любовь', 'привет', 'обезьянка']
