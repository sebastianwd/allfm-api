import { GraphQLString, GraphQLInt, GraphQLList } from 'graphql'
import { TrackType } from 'types'
import { requestLastFM } from 'utils'

export default {
  type: new GraphQLList(TrackType),
  args: {
    name: { type: GraphQLString },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt }
  },
  resolve: async (_, args) => {
    const response = await requestLastFM('artist.getTopTracks', args)

    const { track } = response.data?.toptracks

    return track
  }
}
