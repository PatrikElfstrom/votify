# Votify

This is a shoddy little project that allows users that are subscribed to a collaborative playlist to upvote or downvote tracks.
It started as a plain js with a expressjs backend which I then rewrote to this React based thing to test and learn stuff.
This is not in any way a finished product or something that will be updated so... Don't use it.

## Technologies

It's based on [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack) and some stuff I pinched from [Create React App](https://github.com/facebook/create-react-app).

- [React](https://reactjs.org)
- [Babel](https://babeljs.io)
- [ESLint](https://eslint.org)
- [Airbnb's ESLint rules](https://github.com/airbnb/javascript)
- [Webpack](https://webpack.js.org)
- [Nodemon](https://nodemon.io/)
- [Express](https://expressjs.com)
- [Prettier](https://prettier.io)
- [Travis CI](https://travis-ci.org)
- [Jest](https://jestjs.io)
- [Enzyme](https://airbnb.io/enzyme)
- [Workbox](https://developers.google.com/web/tools/workbox/)
- [Sqlite3](https://sqlite.org/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

## Usage

Well first, don't.

Read [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack).

Then create a `config.json` file in the root containing your Spotify playlist id to load the tracks from and your Spotify Client Id and Client Secret:

`{ "playlist": "PLAYLIST_ID", "clientId": "CLIENT_ID", "clientSecret": "CLIENT_SECRET" }`

[![Build Status](https://travis-ci.org/PatrikElfstrom/votify.svg?branch=master)](https://travis-ci.org/PatrikElfstrom/votify)
