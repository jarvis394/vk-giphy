import { GiphyFetch } from '@giphy/js-fetch-api'
import { GIPHY_API_TOKEN } from 'src/config/keys'

const gf = new GiphyFetch(GIPHY_API_TOKEN)

export default gf
