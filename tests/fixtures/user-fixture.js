const appDataSource = require('../../models/dataSource');

const createUsers = (userList) => {
  const userData = [];

  for (const user of userList) {
    userData.push([user.name, user.wallet_address, user.wallet_type]);
  }

  return appDataSource.query(
    `
      INSERT INTO User 
        (
          name,
          wallet_address,
          wallet_type
        ) 
      VALUES ?
    `,
    [userData]
  );
};

module.exports = { createUsers };
