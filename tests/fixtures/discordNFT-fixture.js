const appDataSource = require('../../models/dataSource');

const createDiscordNFTs = (discordNFTList) => {
  const discordNFTData = [];

  for (const discordNFT of discordNFTList) {
    discordNFTData.push([
      discordNFT.id,
      discordNFT.user_wallet_address,
      discordNFT.smart_contract_address,
      discordNFT.token_id,
    ]);

    return appDataSource.query(
      `
        INSERT INTO Discord_NFT 
          (
            id,
            user_wallet_address,
            smart_contract_address,
            token_id
          )
        VALUES ? 
      `,
      [discordNFTData]
    );
  }
};

module.exports = { createDiscordNFTs };
