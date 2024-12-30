import React from "react";

const DateInput = ({ value, onChange, error, label = "Date of Birth" }) => {
  const handleChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (input.length > 0) {
      formatted = input.slice(0, 2);
      if (parseInt(formatted) > 12) formatted = "12";

      if (input.length > 2) {
        formatted += "/" + input.slice(2, 4);
        if (parseInt(input.slice(2, 4)) > 31) {
          formatted = formatted.slice(0, 3) + "31";
        }
      }

      if (input.length > 4) {
        formatted += "/" + input.slice(4, 8);
      }
    }

    onChange({
      target: {
        name: "dateOfBirth",
        value: formatted,
      },
    });
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#0F1111] mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={handleChange}
        placeholder="MM/DD/YYYY"
        maxLength="10"
        className={`w-full border rounded text-sm text-[#0F1111] bg-white ${
          error
            ? "border-[#c40000] focus:border-[#c40000] focus:shadow-[0_0_3px_2px_rgba(196,0,0,0.5)]"
            : "border-[#D5D9D9] focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)]"
        } outline-none`}
        style={{
          height: "40px",
          padding: "0 10px",
        }}
      />
      {error && <p className="text-[#c40000] text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DateInput;
