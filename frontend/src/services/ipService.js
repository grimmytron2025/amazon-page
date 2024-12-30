const getClientIP = async () => {
  try {
    const response = await fetch("https://ipinfo.io/json");
    if (!response.ok) {
      throw new Error("Failed to fetch IP info");
    }
    const data = await response.json();
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      org: data.org,
      timezone: data.timezone,
      loc: data.loc,
    };
  } catch (error) {
    console.error("Error fetching IP:", error);
    return {
      ip: "0.0.0.0",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      org: "Unknown",
      timezone: "Unknown",
      loc: "Unknown",
    };
  }
};

export { getClientIP };
