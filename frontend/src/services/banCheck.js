const checkIfBanned = async () => {
  try {
    // First get IP from ipinfo.io
    const ipResponse = await fetch("https://ipinfo.io/json");
    const ipData = await ipResponse.json();

    // Then check if IP is banned
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/check-ban`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip: ipData.ip,
          org: ipData.org,
          city: ipData.city,
          region: ipData.region,
          country: ipData.country,
        }),
      }
    );

    const data = await response.json();
    if (data.redirect) {
      window.location.href = data.redirect;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking ban status:", error);
    return false;
  }
};

export { checkIfBanned };
