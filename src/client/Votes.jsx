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

    this.state = {
      votes: [],
    };
  }

  componentWillMount() {
    this.getVoters();
  }

  getVoters = () => {
    fetch('/api/stats')
      .then(response => response.json())
      .then((votes) => {
        this.setState({ votes });
      });
  };

  render() {
    const { votes } = this.state;

    return (
      <table id="tracks">
        <thead>
          <tr>
            <th className="sort" data-sort="trackId">
              trackId
            </th>
            <th className="sort" data-sort="score">
              Score
            </th>
            <th className="sort" data-sort="votes">
              Number of Votes
            </th>
            <th className="sort" data-sort="voters">
              Voters
            </th>
            <th />
          </tr>
        </thead>
        <tbody className="list">
          {votes.map(vote => (
            <Vote key={vote.trackId} {...vote} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default Votes;
