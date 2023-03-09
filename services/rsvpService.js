const rsvpDao = require('../models/rsvpDao');

const getQrCode = async (discordId, eventId) => {
  return await rsvpDao.getQrCode(discordId, eventId);
};

const getRsvpList = async (discordId, timestamp) => {
  return await rsvpDao.getRsvpList(discordId, timestamp);
};

const postRsvp = async (discordId, eventId) => {
  return await rsvpDao.postRsvp(discordId, eventId);
};

const deleteRsvp = async (discordId, eventId) => {
  return await rsvpDao.deleteRsvp(discordId, eventId);
};

module.exports = {
  postRsvp,
  getRsvpList,
  getQrCode,
  deleteRsvp,
};
