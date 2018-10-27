import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Vote = ({
  trackId, score, votes, voters,
}) => (
  <tr>
    <td>
      <a href={`spotify:track:${trackId}`}>{trackId}</a>
    </td>
    <td>{score}</td>
    <td>{votes}</td>
    <td>{voters}</td>
  </tr>
);

Vote.propTypes = {
  trackId: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  voters: PropTypes.string.isRequired,
};

class Votes extends Component {
  constructor(props) {
    super(props);

    this.table = React.createRef();

    this.state = {
      votes: [],
    };
  }

  componentWillMount() {
    this.getVoters();
  }

  getVoters = () => {
    fetch('/api/top')
      .then(response => response.json())
      .then((votes) => {
        this.setState({ votes });
      });
  };

  copyAll = () => {
    navigator.clipboard.writeText(this.table.current.innerText);
  };

  render() {
    const { votes } = this.state;

    return (
      <>
        <button type="button" onClick={this.copyAll} onKeyPress={this.copyAll}>
          Copy all
        </button>
        <table ref={this.table}>
          <tbody>
            {votes.map(vote => (
              <tr key={vote.trackId}>
                <td>{`spotify:track:${vote.trackId}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
}

export default Votes;
