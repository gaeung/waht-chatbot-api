const checkDao = require('../models/checkDao');
const { getNFTs } = require('../utils/alchemy');

const checkDiscordUser = async (discordId) => {
  return await checkDao.checkDiscordUser(discordId);
};

const createDiscordUser = async (discordId, walletAddress) => {
  await checkDao.createDiscordUser(discordId, walletAddress);

  const nfts = await getNFTs(walletAddress);

  let info;
  if (nfts.totalCount) {
    info = nfts.ownedNfts.map((x) => {
      return [walletAddress, x.contract.address, x.tokenId];
    });
    await checkDao.createDiscordNFT(info);
  }

  return;
};

const updateDiscordUser = async (discordId) => {
  const oldNFTs = await checkDao.getOldNFTs(discordId);

  const walletAddress = oldNFTs.walletAddress.wa;

  const newNFTs = await getNFTs(walletAddress);

  let newNFTsMap = newNFTs.ownedNfts.reduce((acc, cur) => {
    acc.set(walletAddress + '_' + cur.contract.address + '_' + cur.tokenId, 1);
    return acc;
  }, new Map());

  let oldNFTsMap = oldNFTs.oldNFTs.reduce((acc, cur) => {
    acc.set(walletAddress + '_' + cur.sca + '_' + cur.ti, 1);
    return acc;
  }, new Map());

  const addedNFTsMap = new Map(newNFTsMap);
  for (const [key, value] of oldNFTsMap) {
    if (addedNFTsMap.has(key)) {
      addedNFTsMap.delete(key);
    }
  }

  let addedNFTs = [];
  for (const [key, value] of addedNFTsMap) {
    let temp = key.split('_');
    addedNFTs.push([temp[0], temp[1], temp[2]]);
  }

  const removedNFTsMap = new Map(oldNFTsMap);
  for (const [key, value] of newNFTsMap) {
    if (removedNFTsMap.has(key)) {
      removedNFTsMap.delete(key);
    }
  }

  let removedNFTs = [];
  for (const [key, value] of removedNFTsMap) {
    let temp = key.split('_');
    removedNFTs.push([temp[0], temp[1], temp[2]]);
  }

  if (addedNFTs.length > 0) {
    await checkDao.insertNewDiscordNFT(addedNFTs);
  }

  if (removedNFTs.length > 0) {
    await checkDao.deleteOldDiscordNFT(removedNFTs);
  }

  return;
};

module.exports = {
  checkDiscordUser,
  createDiscordUser,
  updateDiscordUser,
};
