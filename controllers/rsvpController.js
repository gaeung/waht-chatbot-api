const rsvpService = require('../services/rsvpService');
const log = require('../config/logger');

const getQrCode = async (req, res) => {
  try {
    const discordId = req.query.id;
    const { eventId } = req.query;

    if (!discordId || !eventId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    const data = await rsvpService.getQrCode(discordId, eventId);

    return res.status(200).json({ qrKey: data });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const getRsvpList = async (req, res) => {
  try {
    const discordId = req.query.id;
    const timestamp = req.query.timestamp;

    if (!discordId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    const list = await rsvpService.getRsvpList(discordId, timestamp);

    if (list.length == 0) {
      const error = new Error('NOT_FOUND');
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ list });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const postRsvp = async (req, res) => {
  try {
    const discordId = req.query.id;
    const { eventId } = req.query;

    if (!discordId || !eventId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    await rsvpService.postRsvp(discordId, eventId);

    return res.status(200).json({ message: 'posted' });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const deleteRsvp = async (req, res) => {
  try {
    const discordId = req.query.id;
    const { eventId } = req.query;
    if (!discordId || !eventId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    await rsvpService.deleteRsvp(discordId, eventId);

    return res.status(200).json({ message: 'deleted' });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};
module.exports = {
  getRsvpList,
  postRsvp,
  getQrCode,
  deleteRsvp,
};
