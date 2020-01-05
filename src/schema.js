import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import {
  ArtistQuery,
  searchArtistQuery,
  similarArtistsQuery,
  artistTracksQuery
} from 'queries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    artist: ArtistQuery,
    searchArtist: searchArtistQuery,
    similarArtist: similarArtistsQuery,
    artistTracks: artistTracksQuery
  }
})

export default new GraphQLSchema({
  query: RootQuery
})
