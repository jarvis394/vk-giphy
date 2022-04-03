import { GifResult } from '@giphy/js-fetch-api'

type GifImage = GifResult['data']['images']['original']

const isVerticalImage = (
  image: Partial<GifImage> & { width: number; height: number }
) => {
  return image.width / image.height <= 1
}

export default isVerticalImage
