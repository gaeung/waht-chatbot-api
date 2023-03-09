const express = require('express');
const checkRouter = require('./checkRouter');
const eventRouter = require('./eventRouter');
const rsvpRouter = require('./rsvpRouter');
const router = express.Router();

router.use('/check', checkRouter);
router.use('/events', eventRouter);
router.use('/rsvp', rsvpRouter);

module.exports = router;
