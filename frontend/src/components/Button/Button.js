const Button = ({ children, disabled, className = "", ...props }) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`bg-[#FFD814] hover:bg-[#F7CA00] p-3 rounded-full font-medium 
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-[#FFD814]" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
