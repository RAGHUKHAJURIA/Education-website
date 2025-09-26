import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      action=""
      className="max-w-xl w-full md:h-16 h-14 flex items-center bg-white border-2 border-gray-200 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-300/40 hover:border-blue-500 hover:scale-105 hover-glow animate-scale-in-bounce"
    >
      <img
        src={assets.search_icon}
        alt="search bar"
        className="md:w-auto w-10 px-3 transition-all duration-500 hover:scale-125 hover:rotate-12 animate-pulse-subtle"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        name=""
        id=""
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80 transition-all duration-300 focus:text-gray-800 focus:scale-105 focus:animate-pulse-subtle"
      />

      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white md:px-10 px-7 md:py-3 py-2 mx-1 transition-all duration-500 hover:from-blue-700 hover:to-blue-800 hover:scale-110 hover:shadow-xl hover:animate-pulse-glow hover:rotate-1"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
