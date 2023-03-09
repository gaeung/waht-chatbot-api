const appDataSource = require('./dataSource');
const log = require('../config/logger');

const postRsvp = async (discordId, eventId) => {
  try {
    const [userWalletAddress] = await appDataSource.query(
      `
        SELECT 
          wallet_address AS wa 
        FROM 
          Discord_User 
        WHERE 
          discord_id=?;
      `,
      [discordId]
    );

    return await appDataSource.query(
      `
        INSERT INTO RSVP 
          (
            wallet_address,
            event_id
          ) 
        VALUES 
          (
            ?,
            ?
          )
        `,
      [userWalletAddress.wa, eventId]
    );
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const getRsvpList = async (discordId, timestamp) => {
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

    const list = await appDataSource.query(
      `
        SELECT
          e.id                  AS event_id,
          e.name                AS event_name,
          e.start_date_time     AS start_time,
          e.end_date_time       AS end_time
        FROM
          Event e
        INNER JOIN
          RSVP r ON e.id = r.event_id
        WHERE
          r.wallet_address = ?
        AND
          e.start_date_time > ?
        ORDER BY 
          e.start_date_time
      `,
      [walletAddress.wa, timestamp]
    );

    return list;
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const getQrCode = async (discordId, eventId) => {
  try {
    const [data] = await appDataSource.query(
      `
        SELECT
          e.smart_contract_address          AS smartContractAddress,
          r.event_id                        AS id,
          r.wallet_address                  AS walletAddress,
          CURRENT_TIMESTAMP()               AS timestamp
        FROM 
          RSVP r
        INNER JOIN 
          Discord_User AS du                ON du.wallet_address=r.wallet_address
        INNER JOIN 
          Event e                           ON e.id=r.event_id
        WHERE 
          r.event_id = ?
        AND 
          du.discord_id = ?
      `,
      [eventId, discordId]
    );
    return data;
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

const deleteRsvp = async (discordId, eventId) => {
  try {
    const [userWalletAddress] = await appDataSource.query(
      `
        SELECT 
          wallet_address AS wa 
        FROM 
          Discord_User 
        WHERE 
          discord_id = ?;
      `,
      [discordId]
    );

    return await appDataSource.query(
      `
        DELETE FROM 
          RSVP 
        WHERE 
          wallet_address = ? 
        AND 
          event_id = ?
      `,
      [userWalletAddress.wa, eventId]
    );
  } catch (err) {
    log.error(err);
    const error = new Error('DATABASE_ERROR');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  getRsvpList,
  postRsvp,
  getQrCode,
  deleteRsvp,
};
