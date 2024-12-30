const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const authRoutes = require("./routes/auth");
const telegramRoutes = require("./routes/telegram");
const axios = require("axios");

require("dotenv").config();

const app = express();

// CORS configuration - allow all origins
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Ensure logs directory exists
const LOG_DIR = process.env.LOG_DIR || "logs";
fs.ensureDirSync(LOG_DIR);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/telegram", telegramRoutes);

// Set webhook for Telegram
const setWebhook = async () => {
  try {
    const webhookUrl = `${process.env.SERVER_URL}/api/telegram/webhook`;
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        url: webhookUrl,
      }
    );
    console.log("Telegram webhook set successfully");
  } catch (error) {
    console.error("Failed to set webhook:", error);
  }
};

setWebhook();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Logs being written to ${LOG_DIR} directory`);
});
