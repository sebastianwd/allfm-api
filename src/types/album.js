import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { requestLastFM } from 'utils'
import { get } from 'lodash'

const AlbumType = new GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: response => {
        return toGlobalId('Album', response.strAlbum || response.name)
      }
    },
    name: {
      type: GraphQLString,
      resolve: response => response.strAlbum || response.name
    },
    artist: {
      type: GraphQLString,
      resolve: response => response.strArtist || response.artist
    },
    genre: {
      type: GraphQLString,
      resolve: response => response.strGenre
    },
    description: {
      type: GraphQLString,
      resolve: response => response.strDescriptionEN
    },
    thumb_img: {
      type: GraphQLString,
      resolve: response => response.strAlbumThumb
    },
    year: {
      type: GraphQLString,
      resolve: response => response.intYearReleased
    },
    tracks: {
      type: new GraphQLList(GraphQLString),
      resolve: async response => {
        if (response.tracks) {
          return response.tracks
        }
        const args = {
          artist: response.strArtist || response.name,
          album: response.strAlbum || response.name
        }

        const albumResponse = await requestLastFM('album.getInfo', args)

        const { album } = albumResponse.data

        const tracks = get(album, 'tracks.track')

        return tracks && tracks.map(x => x.name)
      }
    }
  })
})

export default AlbumType
