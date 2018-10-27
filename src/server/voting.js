const { base64 } = require('./utils.js');

module.exports = function Voting(database) {
  this.vote = async (request, response) => {
    const { trackId, direction } = request.query;
    const accessToken = request.cookies.access_token;
    const vote = direction === 'up' ? 1 : -1;
    const userId = await database.getUser(accessToken).catch(error => new Error(error));
    const id = base64(userId + trackId);

    // check if user is authorized
    if (!userId || !trackId || userId instanceof Error) {
      response.sendStatus(401);
      return;
    }

    database.db.run(
      `INSERT OR IGNORE INTO votes (id, userId, trackId, vote) VALUES("${id}", "${userId}", "${trackId}", ${vote})`,
      (err) => {
        if (err) {
          console.log(err);
        }

        database.db.run(`UPDATE votes SET vote="${vote}" WHERE id="${id}"`, (_err) => {
          if (_err) {
            console.log(err);
          }
          response.send('success');
        });
      },
    );
  };

  this.votes = async (request, response) => {
    const { trackId } = request.query;
    const accessToken = request.cookies.access_token;
    const userId = await database.getUser(accessToken).catch(error => new Error(error));

    database.db.all(
      `
      SELECT vote
      FROM votes
      WHERE trackId
      LIKE "%${trackId}"
      AND userId = "${userId}"
      `,
      (err, data) => {
        if (err) {
          console.log(err);
        }

        response.send(JSON.stringify(data));
      },
    );
  };

  this.voters = async (request, response) => {
    database.db.all(
      `
      SELECT
        v1.userId, 
        (
          SELECT count(userId) 
          FROM votes
          WHERE vote > 0 AND userId = v1.userId
        ) as "upvotes", 
        (
          SELECT count(userId) 
          FROM votes
          WHERE vote < 0 AND userId = v1.userId
        ) as "downvotes" 
      FROM votes AS v1 
      GROUP BY userId
      `,
      (err, data) => {
        if (err) {
          console.log(err);
        }

        response.send(JSON.stringify(data));
      },
    );
  };

  this.stats = async (request, response) => {
    database.db.all(
      `
      SELECT 
        v1.trackId, 
        SUM(v1.vote) AS score, 
        COUNT(v1.vote) AS "votes", 
        (
          SELECT group_concat(v2.userId, ", ") 
          FROM votes AS v2 
          WHERE v2.trackId=v1.trackId
        ) AS "voters" 
      FROM votes AS v1 
      GROUP BY trackId 
      ORDER BY score DESC
      `,
      (err, data) => {
        if (err) {
          console.log(err);
        }

        response.send(JSON.stringify(data));
      },
    );
  };

  this.top = async (request, response) => {
    database.db.all(
      `SELECT *, SUM(vote) AS votes 
      FROM votes 
      GROUP BY trackId 
      HAVING SUM(vote) > 0`,
      (err, data) => {
        if (err) {
          console.log(err);
        }

        response.send(JSON.stringify(data));
      },
    );
  };
};
