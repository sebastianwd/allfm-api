import {
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql'
import { ArtistType } from 'types'
import { requestLastFM, requestAudioDB } from 'utils'

export default {
  type: new GraphQLList(ArtistType),
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    limit: { type: GraphQLInt },
    completeInfo: { type: GraphQLBoolean, defaultValue: true }
  },
  resolve: async (parent, args) => {
    const { completeInfo } = args

    let response = await requestLastFM('artist.getSimilar', args)

    const similarArtists = response.data?.similarartists.artist

    if (!completeInfo) {
      return similarArtists
    }

    const similarArtistsWithInfo = []

    await Promise.all(
      similarArtists.map(async similarArtist => {
        response = await requestAudioDB('search', { name: similarArtist.name })
        const { artists } = response.data
        const [artist] = artists || [null]
        similarArtistsWithInfo.push(artist || similarArtist)
      })
    )

    return similarArtistsWithInfo
  }
}
