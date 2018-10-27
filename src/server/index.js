const express = require('express');
const cookieParser = require('cookie-parser');
const Spotify = require('./spotify');
const Voting = require('./voting');
const Database = require('./database');
const config = require('../../config.json');

const database = new Database('./database.db');
const {
  vote, votes, voters, stats, top,
} = new Voting(database);

Spotify.event.on('authorization', ({ accessToken, expiresIn }) => {
  // When user is authorized, get user id
  Spotify.getUser(accessToken).then((userId) => {
    database.updateUser(userId, accessToken, expiresIn);
  });
});

const app = express();
app.use(cookieParser());

app.get('/service-worker.js', (request, response, next) => {
  response.set({ 'cache-control': 'public, max-age=0, immutable' });
  next();
});

app.use(express.static('dist'));

app.get('/api/authorize', Spotify.authorize);
app.get('/api/callback', Spotify.apiToken);
app.get('/api/refreshToken', Spotify.refreshToken);
app.get('/api/vote', vote);
app.get('/api/votes', votes);
app.get('/api/voters', voters);
app.get('/api/stats', stats);
app.get('/api/top', top);
app.get('/api/playlists', (request, response) => {
  const accessToken = request.cookies.access_token;

  // When user is authorized, get playlists to see if user is a subscriber
  Spotify.getPlaylists(accessToken)
    .then((playlists) => {
      // Find our playlists
      const playlist = playlists.find(item => item.id === config.playlist);

      if (playlist) {
        response.send(config.playlist);
      } else {
        response.sendStatus(401);
      }
    })
    .catch(() => response.sendStatus(401));
});

app.listen(8080, () => console.log('Listening on port 8080!'));
