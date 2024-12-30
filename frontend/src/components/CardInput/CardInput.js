import React, { useState } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb,
  FaCreditCard,
} from "react-icons/fa";

const CARD_TYPES = {
  visa: {
    pattern: /^4/,
    icon: <FaCcVisa size={32} className="text-[#1A1F71]" />,
  },
  mastercard: {
    pattern: /^(5[1-5]|2[2-7])/,
    icon: <FaCcMastercard size={32} className="text-[#EB001B]" />,
  },
  amex: {
    pattern: /^3[47]/,
    icon: <FaCcAmex size={32} className="text-[#2E77BB]" />,
  },
  discover: {
    pattern: /^6(?:011|5)/,
    icon: <FaCcDiscover size={32} className="text-[#FF6000]" />,
  },
  dinersclub: {
    pattern: /^3(?:0[0-5]|[68])/,
    icon: <FaCcDinersClub size={32} className="text-[#0079BE]" />,
  },
  jcb: {
    pattern: /^35/,
    icon: <FaCcJcb size={32} className="text-[#1F286F]" />,
  },
  default: {
    pattern: /^$/,
    icon: <FaCreditCard size={28} className="text-[#565959]" />,
  },
};

const CardInput = ({ value, onChange, error }) => {
  const [cardType, setCardType] = useState("default");

  const handleChange = (e) => {
    if (!e || !e.target) return;

    const input = e.target.value.replace(/\D/g, "");
    const formatted = input.replace(/(\d{4})/g, "$1 ").trim();

    // Detect card type
    const detectedType =
      Object.keys(CARD_TYPES).find((type) =>
        CARD_TYPES[type].pattern.test(input)
      ) || "default";

    setCardType(detectedType);
    onChange({
      target: {
        name: "cardNumber",
        value: formatted,
      },
    });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#0F1111] mb-1">
        Card number
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {CARD_TYPES[cardType].icon}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={handleChange}
          className={`w-full p-2 pl-14 border rounded text-base text-[#0F1111] bg-white ${
            error
              ? "border-[#c40000] focus:border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]"
              : "border-[#D5D9D9] focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)]"
          } outline-none`}
          placeholder="XXXX XXXX XXXX XXXX"
          maxLength="19"
          autoComplete="cc-number"
          style={{
            letterSpacing: "0.5px",
            caretColor: "#0F1111",
          }}
        />
      </div>
      {error && <p className="text-[#c40000] text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CardInput;
