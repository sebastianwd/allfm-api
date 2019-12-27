import { requestAudioDB, requestLastFM } from '../utils/request'
import { ArtistType } from 'types'
import { GraphQLString } from 'graphql'

export default {
  type: ArtistType,
  args: {
    name: { type: GraphQLString }
  },
  resolve: async (parent, args) => {
    const response = await requestAudioDB('search', args)

    const { artists } = response.data

    if (!artists) {
      const response = await requestLastFM('artist.getinfo', args)

      const { artist } = response.data
      return artist
    }
    console.log('wasdd')
    const [artist] = artists
    return artist
  }
}
