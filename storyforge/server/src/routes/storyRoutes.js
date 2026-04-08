const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.post('/start', storyController.startStory);
router.post('/next', storyController.nextStory);
router.get('/session/:sessionId', storyController.getSession);

module.exports = router;