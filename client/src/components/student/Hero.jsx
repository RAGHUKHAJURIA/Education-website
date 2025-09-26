import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-8 text-center bg-white">
      <h1 className="md:text-5xl text-[34px] relative font-bold text-gray-800 max-w-3xl mx-auto animate-fade-in-up">
        Empower your Future with the courses designed to{" "}
        <span className="text-blue-600 transition-all duration-500 hover:text-blue-700 hover:scale-105 inline-block animate-pulse-glow relative">
          fit your choice
          <img
            src={assets.sketch}
            alt="sketch"
            className="hidden md:block absolute -right-8 -top-2 transition-all duration-500 hover:scale-110 hover:rotate-12 animate-float-slow"
          />
        </span>
      </h1>

      <p className="md:block hidden text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up animate-stagger-2">
        An interactive education platform designed to make learning easy and
        engaging. Explore courses, track progress, and grow your knowledge
        anytime, anywhere.
      </p>

      <p className="md:hidden text-gray-600 max-w-sm mx-auto text-base leading-relaxed animate-fade-in-up animate-stagger-2">
        An interactive education platform designed to make learning easy and
        engaging.
      </p>

      <div className="animate-slide-in-up animate-stagger-4">
        <SearchBar />
      </div>
    </div>
  );
};

export default Hero;
