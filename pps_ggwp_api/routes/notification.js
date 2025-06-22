const express = require('express');
const router = express.Router();

// 🟣 Service dummy langsung di sini
function send(userId, message, type = 'info') {
  console.log(`[NOTIF][${type.toUpperCase()}] To User: ${userId} | ${message}`);
}

// 🟢 Endpoint POST /v1/notificationSender
router.post('/', (req, res) => {
  const { userId, message, type } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ status: 'FAIL', message: 'Missing userId or message' });
  }

  send(userId, message, type || 'info');

  res.json({ status: 'sent', timestamp: new Date().toISOString() });
});

module.exports = router;
