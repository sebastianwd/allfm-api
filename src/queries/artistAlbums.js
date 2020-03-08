import { GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql'
import { AlbumType } from 'types'
import { requestLastFM, requestAudioDB } from 'utils'
import { get, toLower, isEmpty, clone, sortBy, parseInt } from 'lodash'

export default {
  type: new GraphQLList(AlbumType),
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    limit: { type: GraphQLInt },
    page: { type: GraphQLInt }
  },
  resolve: async (_, args) => {
    let response = await requestLastFM('artist.getTopAlbums', args)

    const lastFMAlbums = get(response.data, 'topalbums.album')

    response = await requestAudioDB('searchalbum', args)

    const theAudioDBAlbums = get(response.data, 'album')

    const filteredAlbums = []

    await Promise.all(
      lastFMAlbums.map(async item => {
        const album = clone(item)
        const artistName = get(album, 'artist.name')

        const albumArgs = {
          artist: artistName,
          album: item.name
        }

        const albumInfo = await requestLastFM('album.getInfo', albumArgs)

        let tracks = get(albumInfo.data, 'album.tracks.track')

        if (isEmpty(tracks)) {
          return
        }

        tracks = tracks.map(track => track.name)

        const image = item.image.find(x => x.size === 'extralarge')

        const foundAlbum = theAudioDBAlbums.find(
          // eslint-disable-next-line eqeqeq
          x => toLower(x.strAlbum) == toLower(album.name)
        )

        if (foundAlbum) {
          if (!foundAlbum.strAlbumThumb) {
            foundAlbum.strAlbumThumb = image['#text']
          }
          foundAlbum.tracks = tracks
          filteredAlbums.push(foundAlbum)
          return
        }

        album.strAlbumThumb = image['#text']
        album.strArtist = artistName
        album.tracks = tracks
        filteredAlbums.push(album)
      })
    )

    return sortBy(filteredAlbums, item => {
      if (!item.intYearReleased) {
        return 0
      }
      return parseInt(item.intYearReleased)
    }).reverse()
  }
}
