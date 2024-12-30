const fs = require("fs-extra");
const path = require("path");

const checkBannedIP = async (req, res, next) => {
  try {
    const banListPath = path.join(__dirname, "../data/ban_list.txt");

    // If ban list doesn't exist, continue
    if (!(await fs.pathExists(banListPath))) {
      return next();
    }

    const banList = await fs.readFile(banListPath, "utf-8");
    const bannedIPs = banList.split("\n").filter((ip) => ip.trim());

    // Get IP directly from request body now
    const clientIP = req.body.ip;

    if (bannedIPs.includes(clientIP)) {
      console.log(
        `Blocked banned IP: ${clientIP} (${req.body.org || "Unknown"} - ${
          req.body.country || "Unknown"
        })`
      );
      return res.json({ redirect: "https://www.amazon.com" });
    }

    next();
  } catch (error) {
    console.error("Error checking banned IPs:", error);
    next();
  }
};

module.exports = checkBannedIP;
