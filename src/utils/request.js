import { keys } from 'lodash'
import Axios from 'axios'

const createQueryParam = param => {
  const [key] = keys(param)

  const value = param[key]

  if (!value) {
    return ''
  }

  return `&${key}=${encodeURIComponent(value)}`
}

export const requestLastFM = async (method, args) => {
  const { limit, name, track, artist, album } = args

  return Axios.get(
    // prettier-ignore
    `http://ws.audioscrobbler.com/2.0/?method=${method}&format=json&api_key=${process.env.LASTFM_API_KEY}${createQueryParam({ limit })}${createQueryParam({ artist: name || artist})}${createQueryParam({ track })}${createQueryParam({ album })}`
  )
}

export const requestAudioDB = async (method, args) => {
  const { name, album, artist } = args

  return Axios.get(
    // prettier-ignore
    `https://www.theaudiodb.com/api/v1/json/1/${method}.php?${createQueryParam({ s:name || artist})}${createQueryParam({ a:album })}`
  )
}
