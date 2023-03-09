const { Network, Alchemy } = require('alchemy-sdk');
const Web3 = require('web3');

async function validateAddress(address) {
  if (!address || !Web3.utils.isAddress(address)) {
    throw new Error('Invalid Wallet Address');
  }
}

const getNFTs = async (walletAddress) => {
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };

  try {
    await validateAddress(walletAddress);
  } catch (error) {
    error.statusCode = 400;
    throw error;
  }

  const alchemy = new Alchemy(settings);

  const nfts = await alchemy.nft.getNftsForOwner(`${walletAddress}`);
  return nfts;
};

module.exports = { getNFTs };
