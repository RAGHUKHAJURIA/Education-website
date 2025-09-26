import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  const companies = [
    { logo: assets.microsoft_logo, alt: "Microsoft" },
    { logo: assets.walmart_logo, alt: "Walmart" },
    { logo: assets.accenture_logo, alt: "Accenture" },
    { logo: assets.adobe_logo, alt: "Adobe" },
    { logo: assets.paypal_logo, alt: "PayPal" },
    { logo: assets.microsoft_logo, alt: "Google" },
    { logo: assets.walmart_logo, alt: "Apple" },
    { logo: assets.accenture_logo, alt: "Amazon" },
    { logo: assets.adobe_logo, alt: "Meta" },
    { logo: assets.paypal_logo, alt: "Netflix" },
  ];

  // Triple the array to create seamless continuous loop
  const continuousCompanies = [...companies, ...companies, ...companies];

  return (
    <div className="pt-16 overflow-hidden">
      <p className="text-base text-gray-500 text-center mb-8 animate-fade-in-up">Trusted by learners from</p>

      {/* Continuous scrolling carousel */}
      <div className="relative">
        <div className="flex animate-scroll gap-8 md:gap-16 items-center">
          {continuousCompanies.map((company, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-110"
            >
              <img
                src={company.logo}
                alt={company.alt}
                className="w-20 md:w-28 h-auto transition-all duration-500 hover:brightness-110 hover:drop-shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* Enhanced gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10"></div>
      </div>
    </div>
  );
};

export default Companies;
