import { checkISP } from "./ispCheck";

const performSecurityCheck = async () => {
  try {
    // Run checks in parallel for better performance
    const [ispCheck, deviceCheck, browserCheck] = await Promise.all([
      checkISP(),
      checkDeviceType(),
      checkBrowserSecurity(),
    ]);

    // Log device info in development
    if (process.env.NODE_ENV === "development") {
      console.log("Security Check:", {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        isp: ispCheck,
        device: deviceCheck,
        browser: browserCheck,
      });
    }

    // Check results in order of importance
    if (!ispCheck.isAllowed) {
      return {
        blocked: true,
        reason: ispCheck.ispInfo.reason,
      };
    }

    if (!deviceCheck.allowed) {
      return {
        blocked: true,
        reason: deviceCheck.reason,
      };
    }

    if (!browserCheck.allowed) {
      return {
        blocked: true,
        reason: browserCheck.reason,
      };
    }

    return { blocked: false };
  } catch (error) {
    console.error("Security check error:", error);
    return {
      blocked: true,
      reason: "Security verification failed",
    };
  }
};

const checkDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  // Add Telegram browser detection
  const isTelegram = /telegram/i.test(userAgent);

  // Comprehensive mobile detection
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipad/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /opera mini/i,
    /mobile/i,
    /tablet/i,
    /telegram/i, // Add Telegram pattern
  ];

  const isMobile =
    mobilePatterns.some((pattern) => pattern.test(userAgent)) || isTelegram;

  return {
    allowed: true, // Remove mobile-only restriction or set to isMobile if you want to keep it
    reason: "Allowed",
  };
};

const checkBrowserSecurity = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileDevice = /mobile|iphone|ipad|android|telegram/i.test(userAgent); // Add Telegram detection

  // Basic feature checks
  const checks = {
    storage: "localStorage" in window && "sessionStorage" in window,
    json: "JSON" in window,
    promise: "Promise" in window,
    fetch: "fetch" in window,
  };

  // Only check automation on non-mobile devices
  if (!isMobileDevice) {
    checks.automation = !(
      "webdriver" in navigator ||
      "_phantom" in window ||
      "__nightmare" in window
    );
  }

  // Modify bot detection to exclude Telegram
  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "headless",
    "selenium",
    "puppeteer",
  ].filter((pattern) => pattern !== "telegram"); // Ensure Telegram isn't treated as a bot

  const isBot = botPatterns.some((pattern) => userAgent.includes(pattern));

  if (isBot) {
    return {
      allowed: false,
      reason: "Automated access not allowed",
    };
  }

  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([check]) => check);

  return {
    allowed: failed.length === 0,
    reason:
      failed.length > 0
        ? `Unsupported browser features: ${failed.join(", ")}`
        : "Allowed",
  };
};

export { performSecurityCheck };
