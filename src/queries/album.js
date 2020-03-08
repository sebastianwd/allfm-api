/* eslint-disable no-param-reassign */
import { GraphQLString, GraphQLNonNull } from 'graphql'
import { requestLastFM, requestAudioDB } from 'utils'
import { get } from 'lodash'
import { AlbumType } from 'types'

export default {
  type: AlbumType,
  args: {
    artist: { type: new GraphQLNonNull(GraphQLString) },
    album: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (_, args) => {
    let response = await requestLastFM('album.getInfo', args)

    const { album } = response.data

    response = await requestAudioDB('searchalbum', args)

    const albumInfo = get(response.data, 'album[0]')

    const images = get(album, 'image')

    const image = images && images.find(x => x.size === 'extralarge')

    const tracks = get(album, 'tracks.track')

    const normalizedTracks = tracks && tracks.map(x => x.name)

    const normalize = item => {
      if (albumInfo) {
        if (!albumInfo.strAlbumThumb) {
          albumInfo.strAlbumThumb = image['#text']
        }
        albumInfo.tracks = normalizedTracks

        return albumInfo
      }

      item.strAlbumThumb = image['#text']
      item.tracks = normalizedTracks
      return item
    }

    const normalizedAlbums = normalize(album)

    return normalizedAlbums
  }
}
