const express = require('express');
const VoiceFlowProxyHandler = require("../handler/voice-flow-proxy-handler");
const router = express.Router();

// Define routes
router.post('/interact/:projectId/:userId', async (req, res) => {
    await VoiceFlowProxyHandler.interact(req, res);
});

router.get('/test', (req, res) => {
    res.send('This is the about page.');
});

module.exports = router;
