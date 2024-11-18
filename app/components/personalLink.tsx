"use client";

import React from "react";

export default function PersonalLink() {
  return (
    <button
      onClick={() => window.location.href = "/personal"}
      className="flex justify-center items-center absolute left-1/2 transform -translate-x-1/2 z-50"
    >
      <img 
        src="/images/logon.png" 
        alt="logo" 
        className="h-24 w-auto cursor-pointer transition-all duration-300 hover:opacity-80"
      />
	   <div className="text-lg font-semibold">
    Pontos: <span className="text-blue-500">120</span>
  </div>
    </button>
  );
}