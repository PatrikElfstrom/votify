export function hasRefreshToken(cookies) {
  const refreshTokenCookie = cookies.get('refresh_token');
  return !!refreshTokenCookie;
}

export function hasAccessToken(cookies) {
  const accessTokenCookie = cookies.get('access_token');
  return !!accessTokenCookie;
}

export function authorize() {
  window.location.href = '/api/authorize';
}

export function refreshToken() {
  window.location.href = '/api/refreshToken';
}

export function getPlaylistTracks(playlistId, accessToken, callback, nextUrl) {
  const fields = 'total,next,items(added_by.id,track(id,name,artists(name),uri,preview_url))';
  const url = nextUrl
    || `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=0&limit=100&fields=${fields}`;

  fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        console.warn(data.error);
      } else {
        callback(data);
      }

      if (data.next) {
        getPlaylistTracks(playlistId, accessToken, callback, data.next);
      }
    });
}
