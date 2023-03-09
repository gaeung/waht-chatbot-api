const eventService = require('../services/eventService');
const log = require('../config/logger');

const getEventList = async (req, res) => {
  try {
    const discordId = req.query.id;
    const { timestamp } = req.query;

    if (!discordId || !timestamp) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    const list = await eventService.getEventList(discordId, timestamp);

    return res.status(200).json({ data: list });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const getEventDetail = async (req, res) => {
  try {
    const eventId = req.query.eventId;
    const id = req.query.id;

    if (!eventId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    const data = await eventService.getEventDetail(id, eventId);

    return res.status(200).json(data);
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

module.exports = {
  getEventList,
  getEventDetail,
};
