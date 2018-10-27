import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ListJs from 'list.js';
import debounce from 'debounce-promise';
import {
  hasRefreshToken,
  hasAccessToken,
  authorize,
  refreshToken,
  getPlaylistTracks,
} from './spotify';
import { unique } from '../server/utils';
import Track from './Track';

class Tracks extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  debounce = debounce(() => {
    this.initListJs();
  }, 200);

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      tracks: [],
    };
  }

  componentWillMount() {
    const { cookies } = this.props;
    const accessToken = cookies.get('access_token');

    if (hasAccessToken(cookies)) {
      // Get playlists
      fetch('/api/playlists')
        .then((response) => {
          if (response.status !== 200) {
            refreshToken();
            return Promise.reject(Error('Unauthorized'));
          }
          return response;
        })
        .then(response => response.text())
        .then((playlist) => {
          // Get Tracks
          getPlaylistTracks(playlist, accessToken, (data) => {
            // Populate state
            this.setState((previousState) => {
              // Merge previous state and new tracks
              let newState = [...previousState.tracks, ...data.items];

              // Remove duplicates
              newState = unique(newState, item => item.track.id);

              return {
                tracks: newState,
              };
            });

            this.debounce();
          });
        })
        .catch(error => Error(error));
    } else if (!hasAccessToken(cookies) && hasRefreshToken(cookies)) {
      refreshToken();
    } else {
      authorize();
    }
  }

  initListJs = () => {
    const options = {
      valueNames: ['title', 'artist', 'vote', 'user'],
    };

    // eslint-disable-next-line no-new
    new ListJs('tracks', options);
  };

  render() {
    const { error, tracks } = this.state;

    if (error) {
      return (
        <div>
          Error:
          {error.message}
        </div>
      );
    }

    if (tracks.length < 1) {
      return <div>Loading...</div>;
    }

    return (
      <table id="tracks">
        <thead>
          <tr>
            <th className="sort" data-sort="title">
              Title
            </th>
            <th className="sort" data-sort="artist">
              Artist
            </th>
            <th className="sort vote-column" data-sort="vote">
              Vote
            </th>
            <th className="sort" data-sort="user">
              Added by
            </th>
            <th />
          </tr>
        </thead>
        <tbody className="list">
          {tracks.map(item => (
            <Track key={item.track.id} item={item} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default withCookies(Tracks);
