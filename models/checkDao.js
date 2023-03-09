const appDataSource = require('./dataSource');
const log = require('../config/logger');

const checkDiscordUser = async (discordId) => {
  try {
    const [result] = await appDataSource.query(
      `
        SELECT EXISTS 
        (
          SELECT
            wallet_address
          FROM 
            Discord_User
          WHERE 
            discord_id = ?
        ) 
        AS registerd
      `,
      [discordId]
    );

    return !!parseInt(result.registerd);
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const createDiscordUser = async (discordId, walletAddress) => {
  try {
    return appDataSource.query(
      `
        INSERT INTO 
          Discord_User
          (
            discord_id, 
            wallet_address
          )
        VALUES
          (
            ?, 
            ?
          )
      `,
      [discordId, walletAddress]
    );
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const getSmartContractAddresses = async (discordId) => {
  try {
    return appDataSource.query(
      `
        SELECT
          smart_contract_address      AS sca
        FROM 
          Discord_NFT dn
        INNER JOIN Discord_User du    ON du.wallet_address = dn.user_wallet_address
        WHERE du.discord_id = ?
      `,
      [discordId]
    );
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const createDiscordNFT = async (info) => {
  try {
    return appDataSource.query(
      `
      INSERT INTO 
        Discord_NFT
        (
          user_wallet_address, 
          smart_contract_address, 
          token_id
        )
      VALUES ?
      `,
      [info]
    );
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const getOldNFTs = async (discordId) => {
  try {
    const [walletAddress] = await appDataSource.query(
      `
        SELECT
          wallet_address        AS wa
        FROM
          Discord_User
        WHERE
          discord_id = ?
      `,
      [discordId]
    );

    const oldNFTs = await appDataSource.query(
      `
        SELECT
          smart_contract_address    AS sca,
          token_id                  AS ti
        FROM
          Discord_NFT
        WHERE
          User_wallet_address = ?
      
      `,
      [walletAddress.wa]
    );

    return { walletAddress, oldNFTs };
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const insertNewDiscordNFT = async (addedNFTs) => {
  const queryRunner = appDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.query(
      `
      INSERT INTO Discord_NFT 
        (
          user_wallet_address, 
          smart_contract_address, 
          token_id
        )
      VALUES ?
      `,
      [addedNFTs]
    );

    await queryRunner.commitTransaction();

    return;
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;

    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};

const deleteOldDiscordNFT = async (removedNFTs) => {
  const queryRunner = appDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.query(
      `
        DELETE FROM 
          Discord_NFT 
        WHERE 
        (
          user_wallet_address,
          smart_contract_address,
          token_id
        )
        IN (?)
      `,
      [removedNFTs]
    );

    await queryRunner.commitTransaction();

    return;
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;

    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  checkDiscordUser,
  createDiscordUser,
  getSmartContractAddresses,
  createDiscordNFT,
  getOldNFTs,
  insertNewDiscordNFT,
  deleteOldDiscordNFT,
};
