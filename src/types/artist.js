import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { requestLastFM } from '../utils/request'

const ArtistType = new GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: response => toGlobalId('Artist', response.idArtist)
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
      resolve: response => (response.strDisbanded ? true : false)
    },
    disbandedYear: {
      type: GraphQLString,
      resolve: response => response.intDiedYear
    },
    similarArtists: {
      type: new GraphQLList(ArtistType),
      resolve: async response => {
        const args = {
          name: response.name,
          limit: 12
        }
        var asdasd
        const similar = await requestLastFM('artist.getsimilar', args)
        const { artist } = similar.data?.similarartists

        return artist
      }
    }
  })
})

export default ArtistType
