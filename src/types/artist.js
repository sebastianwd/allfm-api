import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { map } from 'lodash'
import { requestLastFM } from 'utils'

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: response =>
        toGlobalId('Artist', response.strArtist || response.name)
    },
    name: {
      type: GraphQLString,
      resolve: response => response.strArtist || response.name
    },
    formedYear: {
      type: GraphQLString,
      resolve: response => response.intFormedYear
    },
    thumb_img: {
      type: GraphQLString,
      resolve: response => response.strArtistThumb
    },
    logo_img: {
      type: GraphQLString,
      resolve: response => response.strArtistLogo
    },
    fanart_img: {
      type: GraphQLString,
      resolve: response => response.strArtistFanart
    },
    style: {
      type: GraphQLString,
      resolve: response => response.strStyle
    },
    genre: {
      type: GraphQLString,
      resolve: response => response.strGenre
    },
    website: {
      type: GraphQLString,
      resolve: response => response.strWebsite
    },
    facebook: {
      type: GraphQLString,
      resolve: response => response.strFacebook
    },
    twitter: {
      type: GraphQLString,
      resolve: response => response.strTwitter
    },
    biography: {
      type: GraphQLString,
      resolve: response => response.strBiographyEN || response.bio?.content
    },
    memberQuantity: {
      type: GraphQLInt,
      resolve: response => response.intMembers
    },
    location: {
      type: GraphQLString,
      resolve: response => response.strCountry
    },
    disbanded: {
      type: GraphQLBoolean,
      resolve: response => !!response.strDisbanded
    },
    disbandedYear: {
      type: GraphQLString,
      resolve: response => response.intDiedYear
    },
    similarArtists: {
      args: {
        limit: { type: GraphQLInt }
      },
      type: new GraphQLList(GraphQLString),
      resolve: async (response, args) => {
        const params = {
          name: response.strArtist || response.name,
          limit: args.limit
        }

        const similar = await requestLastFM('artist.getsimilar', params)

        const { artist } = similar.data?.similarartists

        return map(artist, item => item.name)
      }
    }
  })
})

export default ArtistType
