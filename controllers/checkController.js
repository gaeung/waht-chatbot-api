const checkService = require('../services/checkService');
const log = require('../config/logger');

const checkDiscordUser = async (req, res) => {
  try {
    const discordId = req.query.id;

    if (!discordId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    const check = await checkService.checkDiscordUser(discordId);

    if (!check) {
      return res.status(401).json({ message: 'Need to create user' });
    }

    return res.status(200).json({ message: 'User checked' });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const createDiscordUser = async (req, res) => {
  try {
    const discordId = req.query.id;
    const { walletAddress } = req.body;

    if (!discordId || !walletAddress) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    await checkService.createDiscordUser(discordId, walletAddress);

    return res.status(201).json({ message: 'Discord User Created!' });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

const updateDiscordUser = async (req, res) => {
  try {
    const discordId = req.query.id;

    if (!discordId) {
      const error = new Error('KEY_ERROR');
      error.statusCode = 400;
      throw error;
    }

    await checkService.updateDiscordUser(discordId);

    return res.status(200).json({ message: 'Discord User Updated!' });
  } catch (err) {
    log.error(err);
    return res.status(err.statusCode || 500).json(err.message);
  }
};

module.exports = {
  checkDiscordUser,
  createDiscordUser,
  updateDiscordUser,
};
