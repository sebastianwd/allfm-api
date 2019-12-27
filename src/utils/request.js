import { keys } from 'lodash'
import Axios from 'axios'

const createQueryParam = param => {
  const [key] = keys(param)

  const value = param[key]

  if (!value) {
    return ''
  }

  return `&${key}=${value}`
}

export const requestLastFM = async (method, args) => {
  const { limit, name } = args

  return Axios.get(
    // prettier-ignore
    `http://ws.audioscrobbler.com/2.0/?method=${method}&format=json&api_key=${process.env.LASTFM_API_KEY}${createQueryParam({ limit })}${createQueryParam({ artist: name })}`
  )
}

export const requestAudioDB = async (method, args) => {
  const { name, album } = args

  return Axios.get(
    // prettier-ignore
    `https://www.theaudiodb.com/api/v1/json/1/${method}.php?${createQueryParam({ s:name })}${createQueryParam({ a:album })}`
  )
}
