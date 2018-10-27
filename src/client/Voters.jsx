import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Votee = ({ userId, upvotes, downvotes }) => (
  <tr>
    <td>{userId}</td>
    <td>{upvotes + downvotes}</td>
    <td>{upvotes}</td>
    <td>{downvotes}</td>
    <td>{`${Math.floor((upvotes / (upvotes + downvotes)) * 100)} %`}</td>
  </tr>
);

Votee.propTypes = {
  userId: PropTypes.string.isRequired,
  upvotes: PropTypes.number.isRequired,
  downvotes: PropTypes.number.isRequired,
};

class Voters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voters: [],
    };
  }

  componentWillMount() {
    this.getVoters();
  }

  getVoters = () => {
    fetch('/api/voters')
      .then(response => response.json())
      .then((voters) => {
        this.setState({ voters });
      });
  };

  render() {
    const { voters } = this.state;

    return (
      <table id="tracks">
        <thead>
          <tr>
            <th className="sort" data-sort="user">
              User
            </th>
            <th className="sort" data-sort="votes">
              Number of Votes
            </th>
            <th className="sort" data-sort="upvotes">
              Upvotes
            </th>
            <th className="sort" data-sort="downvotes">
              Downvotes
            </th>
            <th className="sort" data-sort="rating">
              +/-
            </th>
            <th />
          </tr>
        </thead>
        <tbody className="list">
          {voters.map(votee => (
            <Votee key={votee.userId} {...votee} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default Voters;
