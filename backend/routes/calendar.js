const express = require('express');
const router = express.Router();
const calendarService = require('../services/calendarService');

router.post('/create-event', async (req, res) => {
  try {
    const event = req.body;
    const result = await calendarService.createEvent(event);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    const events = await calendarService.getEvents(timeMin, timeMax);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

module.exports = router;
