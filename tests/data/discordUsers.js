const discordUsers = [
  {
    discord_id: 'testDiscordId1',
    wallet_address: 'testDiscordWalletAddress1',
  },
  {
    discord_id: 'testDiscordId2',
    wallet_address: 'testDiscordWalletAddress2',
  },
  {
    // 아무 NFT도 가지고 있지 않은 사용자
    discord_id: 'testDiscordId3',
    wallet_address: 'testDiscordWalletAddress3',
  },
  {
    // NFT를 가지고 있으나 참석할 수 있는 이벤트가 없는 사용자
    discord_id: 'testDiscordId9',
    wallet_address: 'testDiscordWalletAddress9',
  },
];

module.exports = { discordUsers };
