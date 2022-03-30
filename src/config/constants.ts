export const COMMAND_PREFIX = '/'

/** Holds all supported keywords for commands */
export const COMMAND_KEYWORDS = new Set(['gif'])

export const APP_MAX_WIDTH = 500
export const TEXTAREA_MAX_LINES = 10

// TODO: Probably can be dynamic to enhance UX, but who cares.
//       Load 40 at the beginning and 25 afterwards.
/** Amount of gifs being fetched at once */
export const GIPHY_FETCH_GIFS_COUNT = 25

/** Time before data in store revalidates */
export const DEFAULT_UPDATE_INTERVAL = 3600
