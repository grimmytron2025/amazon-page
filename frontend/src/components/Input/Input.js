const Input = ({ label, type, value, onChange, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded outline-none transition-all ${
          error
            ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_3px_2px_rgba(239,68,68,0.5)]"
            : "border-gray-300 focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)]"
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
