import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql'
import { requestLastFM } from 'utils'
import { map } from 'lodash'

export default {
  type: new GraphQLList(GraphQLString),
  args: {
    name: { type: GraphQLString },
    limit: { type: GraphQLInt }
  },
  resolve: async (_, args) => {
    const response = await requestLastFM('artist.search', args)
    const artists = map(
      response.data?.results?.artistmatches?.artist,
      artist => artist?.name
    )

    return artists
  }
}
