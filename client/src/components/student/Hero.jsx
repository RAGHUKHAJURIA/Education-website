import React from "react";
import { assets } from "../../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-5xl text-[34px] relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your Feature with the courses design to {" "}
        <span className="text-blue-600">fir your choice</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="hidden md:block absolute right-0"
        />
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">An interactive education platform designed to make learning easy and engaging. Explore courses, track progress, and grow your knowledge anytime, anywhere.</p>

      <p className="md:hidden text-gray-500 max-w-sm mx-auto">An interactive education platform designed to make learning easy and engaging.</p>
    </div>
  );
};

export default Hero;
