const checkDao = require('../models/checkDao');
const eventDao = require('../models/eventDao');

const getEventList = async (discordId, timestamp) => {
  try {
    const getNFTs = await checkDao.getSmartContractAddresses(discordId);
    const smartContractAddresses = getNFTs.map((x) => x.sca);

    if (smartContractAddresses.length == 0) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    const result = await eventDao.getEventList(
      smartContractAddresses,
      timestamp
    );

    if (result.length === 0) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    return result;
  } catch (err) {
    throw err;
  }
};

const getEventDetail = async (id, eventId) => {
  try {
    const result = await eventDao.getEventDetail(eventId);
    const check = await eventDao.checkEvent(id, eventId);

    if (result.length === 0) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    return { result, check };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getEventList,
  getEventDetail,
};
