const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/list', eventController.getEventList);
router.get('/detail', eventController.getEventDetail);

module.exports = router;
