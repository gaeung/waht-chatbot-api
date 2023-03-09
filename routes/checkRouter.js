const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkController');

router.get('', checkController.checkDiscordUser);
router.post('', checkController.createDiscordUser);
router.patch('', checkController.updateDiscordUser);

module.exports = router;
