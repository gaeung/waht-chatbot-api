const appDataSource = require('../../models/dataSource');

const createDiscordUsers = (discordUserList) => {
  const discordUserData = [];

  for (const discordUser of discordUserList) {
    discordUserData.push([discordUser.discord_id, discordUser.wallet_address]);
  }

  return appDataSource.query(
    `
      INSERT INTO Discord_User 
        (
          discord_id,
          wallet_address
        )
      VALUES ? 
    `,
    [discordUserData]
  );
};

module.exports = { createDiscordUsers };
