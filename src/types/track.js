import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import ytSearch from 'yt-search'
import youtubedl from 'youtube-dl'
import { requestLastFM, requestAudioDB } from 'utils'
import Axios from 'axios'

const getYoutubeUrl = async query => {
  try {
    const searchResults = await Axios.get(
      `${process.env.YOUTUBE_ENDPOINT}${query}`
    )
    const { items } = searchResults.data
    const [video] = items
    const { id } = video

    return id.videoId
  } catch {
    return new Promise((resolve, reject) => {
      ytSearch({ query }, (err, results) => {
        if (err) reject(err)

        const { videos } = results

        resolve(videos[0].videoId)
      })
    })
  }
}

const getMP3Url = async query => {
  const videoId = await getYoutubeUrl(query)

  const url = `https://www.youtube.com/watch?v=${videoId}`
  return new Promise((resolve, reject) => {
    youtubedl.exec(
      url,
      ['-f', 'bestaudio', '-g', '--geo-bypass'],
      {},
      (err, output) => {
        if (err) reject(err)
        resolve(output)
      }
    )
  })
}

const TrackType = new GraphQLObjectType({
  name: 'Track',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: response =>
        toGlobalId('Track', `${response.artist?.name}${response.name}`)
    },
    name: {
      type: GraphQLString,
      resolve: response => response.name
    },
    playcount: {
      type: GraphQLString,
      resolve: response => response.playcount
    },
    artist: {
      type: GraphQLString,
      resolve: response => response.artist?.name
    },
    album_img: {
      type: GraphQLString,
      resolve: async response => {
        const trackArgs = {
          track: response.name,
          name: response.artist?.name
        }
        const trackResponse = await requestLastFM('track.getInfo', trackArgs)

        const { track } = trackResponse.data

        const albumArgs = {
          name: response.artist?.name,
          album: track?.album?.title
        }
        const albumResponse = await requestAudioDB('searchalbum', albumArgs)

        const [album] = albumResponse.data?.album || [null]

        return album?.strAlbumThumb
      }
    },
    album: {
      type: GraphQLString,

      resolve: async response => {
        const args = {
          track: response.name,
          name: response.artist?.name
        }
        const trackResponse = await requestLastFM('track.getInfo', args)

        const { track } = trackResponse.data

        return track?.album?.title
      }
    },
    youtube_id: {
      type: GraphQLString,
      resolve: async response => {
        const query = `${response.artist?.name} ${response.name}`

        try {
          const videoId = await getYoutubeUrl(query)

          return videoId
        } catch (err) {
          console.warn(err)
          return new Error(err)
        }
      }
    },
    mp3_url: {
      type: GraphQLString,
      resolve: async response => {
        const query = `${response.artist?.name} ${response.name}`

        try {
          const url = await getMP3Url(query)
          const [item] = url
          return item
        } catch (err) {
          console.warn(err)
          return new Error("Couldn't get mp3 url for this track")
        }
      }
    }
  })
})

export default TrackType
