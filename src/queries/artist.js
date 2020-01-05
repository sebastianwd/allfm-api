import { GraphQLString } from 'graphql'
import { ArtistType } from 'types'
import { requestAudioDB, requestLastFM } from 'utils'

export default {
  type: ArtistType,
  args: {
    name: { type: GraphQLString }
  },
  resolve: async (parent, args) => {
    let response = await requestAudioDB('search', args)

    const { artists } = response.data

    if (!artists) {
      response = await requestLastFM('artist.getinfo', args)

      const { artist } = response.data
      return artist
    }

    const [artist] = artists
    return artist
  }
}
