import React, { Component } from 'react';
import { shape } from 'prop-types';
import { refreshToken } from './spotify';

export default class Track extends Component {
  static propTypes = {
    item: shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.trackId = props.item.track.id;

    this.state = {
      voteStatus: {},
    };
  }

  componentWillMount() {
    this.getVote(this.trackId).then(data => data && this.setVoteStatus(data.vote));
  }

  getVote = trackId => fetch(`/api/votes?trackId=${trackId}`)
    .then(response => response.json())
    .then(data => data[0]);

  setVoteStatus = (status) => {
    this.setState({ voteStatus: status });
  };

  previewAudio = previewUrl => (
    <audio controls preload="none" src={previewUrl}>
      <track kind="captions" />
    </audio>
  );

  handleClick = (button) => {
    const trackId = button.currentTarget.parentElement.parentElement.dataset.trackid;
    const voteDirection = button.currentTarget.id;

    if (button.currentTarget.nextElementSibling) {
      button.currentTarget.nextElementSibling.classList.remove('clicked');
    }
    if (button.currentTarget.previousElementSibling) {
      button.currentTarget.previousElementSibling.classList.remove('clicked');
    }

    button.currentTarget.classList.remove('clicked');
    button.currentTarget.classList.add('clicked');

    fetch(`/api/vote?direction=${voteDirection}&trackId=${trackId}`)
      .then((response) => {
        if (response.status !== 200) {
          refreshToken();
        }
      })
      .catch(error => Error(error));

    return false;
  };

  render() {
    const { item } = this.props;
    const { voteStatus } = this.state;

    return (
      <tr data-trackid={item.track.id}>
        <td>
          <a className="title" href={item.track.uri}>
            {item.track.name}
          </a>
        </td>
        <td className="artist">{item.track.artists.map(artist => artist.name).join(', ')}</td>
        <td className="vote-column">
          <button
            onClick={this.handleClick}
            type="button"
            id="down"
            className={voteStatus === -1 ? 'clicked' : ''}
          >
            <span role="img" aria-label="Vote down">
              👎
            </span>
          </button>
          <button
            onClick={this.handleClick}
            type="button"
            id="up"
            className={voteStatus === 1 ? 'clicked' : ''}
          >
            <span role="img" aria-label="Vote up">
              👍
            </span>
          </button>
          <span className="vote" />
        </td>
        <td className="user">{item.added_by.id}</td>
        <td>{item.track.preview_url && this.previewAudio(item.track.preview_url)}</td>
      </tr>
    );
  }
}
