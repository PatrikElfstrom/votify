const sqlite3 = require('sqlite3');

module.exports = class Database {
  constructor(databaseFile) {
    this.db = new sqlite3.Database(databaseFile);
    // Create database if not exist
    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS 
        votes (
          id VARCHAR PRIMARY KEY, 
          date DATETIME DEFAULT CURRENT_TIMESTAMP, 
          userId VARCHAR, 
          trackId VARCHAR, 
          vote INT
        )
      `);

      this.db.run(`CREATE TABLE IF NOT EXISTS 
        users (
          userId VARCHAR PRIMARY KEY, 
          expiresIn DATETIME, 
          accessToken VARCHAR
        )
      `);
    });
  }

  updateUser(userId, accessToken, expiresIn) {
    this.db.run(
      `INSERT OR IGNORE INTO users (userId, expiresIn, accessToken) VALUES("${userId}", datetime("now", "+${expiresIn} seconds"), "${accessToken}")`,
      (error) => {
        if (error) {
          throw Error(error);
        }

        this.db.run(
          `UPDATE users SET accessToken="${accessToken}", expiresIn=datetime("now", "+${expiresIn} seconds") WHERE userId="${userId}"`,
          (error2) => {
            if (error2) {
              throw Error(error2);
            }
          },
        );
      },
    );
  }

  getUser(accessToken) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT userId FROM users WHERE accessToken="${accessToken}" AND expiresIn > datetime()`,
        (err, row) => {
          if (err || !row) {
            reject(new Error(err || 'Unauthorized'));
            return;
          }

          resolve(row.userId);
        },
      );
    });
  }
};
