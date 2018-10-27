const { EventEmitter } = require('events');
const httpRequest = require('request-promise');
const { random, base64 } = require('./utils.js');
const { clientId, clientSecret } = require('../../config.json');

const SpotifyEvent = new EventEmitter();

exports.event = SpotifyEvent;

exports.authorize = (request, response) => {
  const scope = 'playlist-modify-private';
  const state = random();

  const props = [
    `client_id=${clientId}`,
    'response_type=code',
    `redirect_uri=${request.protocol}://${request.get('host')}/api/callback`,
    `scope=${scope}`,
    `state=${state}`,
  ];

  response.redirect(`https://accounts.spotify.com/authorize?${props.join('&')}`);
};

exports.refreshToken = (request, response) => {
  const refreshToken = request.cookies.refresh_token;
  const authorization = base64(`${clientId}:${clientSecret}`);
  const grantType = 'refresh_token';

  // Refresh access token
  httpRequest
    .post({
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${authorization}`,
      },
      form: {
        grant_type: grantType,
        refresh_token: refreshToken,
      },
    })
    .catch(error => new Error(error))
    .then(body => JSON.parse(body))
    .then((data) => {
      if (data.error) {
        console.error(data.error);
      }

      const accessToken = data.access_token;
      const expiresIn = data.expires_in;

      // Update access token cookie
      response.cookie('access_token', accessToken, {
        maxAge: expiresIn * 1000, // maxAge is in ms
      });

      response.redirect('/');

      SpotifyEvent.emit('authorization', { accessToken, expiresIn });
    });
};

exports.apiToken = (request, response) => {
  const { code } = request.query;
  const authorization = base64(`${clientId}:${clientSecret}`);
  const grantType = 'authorization_code';

  // Request tokens
  httpRequest
    .post({
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${authorization}`,
      },
      form: {
        grant_type: grantType,
        code,
        redirect_uri: `${request.protocol}://${request.get('host')}/api/callback`,
      },
    })
    .catch(error => new Error(error))
    .then(body => JSON.parse(body))
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const expiresIn = data.expires_in;

      // Set access token cookie
      response.cookie('access_token', accessToken, {
        maxAge: expiresIn * 1000, // maxAge is in ms
      });

      // Set refresh token cookie
      response.cookie('refresh_token', refreshToken);

      response.redirect('/');

      SpotifyEvent.emit('authorization', { accessToken, expiresIn });
    });
};

exports.getUser = accessToken => httpRequest({
  url: 'https://api.spotify.com/v1/me',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
  .catch(error => new Error(error))
  .then(body => JSON.parse(body))
  .then((data) => {
    if (data.error) {
      throw new Error(data.error);
    }

    return data.id;
  });

exports.getPlaylists = (accessToken) => {
  const playlists = [];

  const getPlaylists = (resolve, reject, nextUrl) => {
    httpRequest({
      url: nextUrl || 'https://api.spotify.com/v1/me/playlists?limit=50',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .catch(error => new Error(error))
      .then(body => JSON.parse(body))
      .then((data) => {
        if (data.error) {
          reject(Error(data.error));
        }

        playlists.push(...data.items);

        if (data.next) {
          getPlaylists(resolve, reject, data.next);
        } else {
          resolve(playlists);
        }
      });
  };

  return new Promise(getPlaylists);
};
