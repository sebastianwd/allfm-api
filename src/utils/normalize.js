const normalizeArtist = data => {
  return data.map(item => {
    return {
      id: item.idArtist,
      name: item.strArtist,
      formedYear: item.intFormedYear,
      thumb_img: item.strArtistThumb,
      logo_img: item.strArtistLogo,
      fanart_img: item.strArtistFanart,
      style: item.strStyle,
      genre: item.strGenre,
      website: item.strWebsite,
      facebook: item.strFacebook,
      twitter: item.strTwitter,
      biography: item.strBiographyEN,
      memberQuantity: item.intMembers,
      location: item.strCountry,
      disbanded: item.strDisbanded ? true : false,
      disbandedYear: item.intDiedYear
    }
  })
}

export { normalizeArtist }
