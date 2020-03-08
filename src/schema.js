import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import {
  ArtistQuery,
  searchArtistQuery,
  similarArtistsQuery,
  artistTracksQuery,
  artistAlbumsQuery,
  albumQuery
} from 'queries'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    artist: ArtistQuery,
    searchArtist: searchArtistQuery,
    similarArtist: similarArtistsQuery,
    artistTracks: artistTracksQuery,
    artistAlbums: artistAlbumsQuery,
    album: albumQuery
  }
})

export default new GraphQLSchema({
  query: RootQuery
})
