import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { requestLastFM, requestAudioDB } from 'utils'

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
    }
  })
})

export default TrackType
