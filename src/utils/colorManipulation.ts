/**
 * Adapted from @mui/material-ui at v4.12.3
 * https://github.com/mui/material-ui/blob/v4.12.3/packages/material-ui/src/styles/colorManipulator.js
 */

/** Color object */
export interface Color {
  type: string
  values: number[]
}

/** Return a number which value is limited to the given range */
const clamp = (value: number, min = 0, max = 1) => {
  if (value < min || value > max) {
    throw new Error(`Value ${value} is out of range [${min}-${max}]`)
  }

  return Math.min(Math.max(min, value), max)
}

/** Convert color from CSS hex format to CSS rgb format */
export const hexToRgb = (color: string): string => {
  color = color.slice(1)

  const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, 'g')

  let colors = color.match(re)
  if (!colors) return ''

  if (colors[0].length === 1) {
    colors = colors.map((n) => n + n)
  }

  const prefix = `rgb${colors.length === 4 ? 'a' : ''}`
  const parsedColor = colors
    .map((n, index) => {
      return index < 3
        ? parseInt(n, 16)
        : Math.round((parseInt(n, 16) / 255) * 1000) / 1000
    })
    .join(', ')

  return colors ? `${prefix}(${parsedColor})` : ''
}

/** Makes Color object from a string */
export const decomposeColor = (color: string) => {
  const supportedColors = ['rgb', 'rgba', 'hsl', 'hsla']

  if (color.charAt(0) === '#') {
    return decomposeColor(hexToRgb(color))
  }

  const marker = color.indexOf('(')
  const type = color.slice(0, marker)

  if (!supportedColors.some((e) => e === type)) {
    throw new Error(
      `Unsupported color (got "${type}", expected one of: ${supportedColors.join(
        ', '
      )})`
    )
  }

  const values = color.slice(marker + 1, color.length - 1).split(',')
  const parsedValues = values.map((value) => parseFloat(value))

  return { type, values: parsedValues }
}

/** Convert color object with type and values to a string */
export const recomposeColor = (color: Color): string => {
  const { type } = color
  let values: (string | number)[] = color.values
  const isStringColor = (d: unknown[]): d is string[] =>
    typeof d[0] === 'string'

  if (type.indexOf('rgb') !== -1 && isStringColor(values)) {
    // Only convert the first 3 values to int (i.e. not alpha)
    values = values.map((n, i) => (i < 3 ? parseInt(n, 10) : n))
  } else if (type.indexOf('hsl') !== -1) {
    values[1] = `${values[1]}%`
    values[2] = `${values[2]}%`
  }

  return `${type}(${values.join(', ')})`
}

/** Set given color transparency */
export const alpha = (color: string, value: number): string => {
  const parsedColor = decomposeColor(color)
  value = clamp(value)

  if (parsedColor.type === 'rgb' || parsedColor.type === 'hsl') {
    parsedColor.type += 'a'
  }
  parsedColor.values[3] = value

  return recomposeColor(parsedColor)
}
