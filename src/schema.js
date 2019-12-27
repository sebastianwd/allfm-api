import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList
} from 'graphql'
import { ArtistQuery } from './queries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    artist: ArtistQuery,
    searchArtist: {
      type: new GraphQLList(GraphQLString),
      args: {
        name: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        return ['artist', 'asdasd']
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery
})
