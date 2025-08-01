import React from "react";

// Close Icon SVG
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// This component will have the congratulations text and an SVG of fireworks.
const FireworksSVG = () => (
  <svg
    className="w-48 h-48 mx-auto mb-4"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" strokeWidth="2">
      {/* Small firework bursts */}
      <circle
        cx="20"
        cy="80"
        r="3"
        stroke="#ff4500"
        className="animate-pulse"
      />
      <path
        d="M20,80 L20,70 M15,80 L25,80"
        stroke="#ff4500"
        className="animate-fade-in-up"
      />
      <circle
        cx="80"
        cy="20"
        r="4"
        stroke="#ff8c00"
        className="animate-pulse"
      />
      <path
        d="M80,20 L80,10 M75,20 L85,20"
        stroke="#ff8c00"
        className="animate-fade-in-up"
      />
      <circle
        cx="50"
        cy="50"
        r="5"
        stroke="#90ee90"
        className="animate-pulse"
      />
      <path
        d="M50,50 L50,40 M45,50 L55,50"
        stroke="#90ee90"
        className="animate-fade-in-up"
      />

      {/* Larger firework bursts with animated lines */}
      <g stroke="#ffd700" transform="translate(50, 50)">
        <path d="M0,0 L0,-10" className="animate-firework-burst delay-100" />
        <path d="M0,0 L7,-7" className="animate-firework-burst delay-200" />
        <path d="M0,0 L10,0" className="animate-firework-burst delay-300" />
        <path d="M0,0 L7,7" className="animate-firework-burst delay-400" />
        <path d="M0,0 L0,10" className="animate-firework-burst delay-500" />
        <path d="M0,0 L-7,7" className="animate-firework-burst delay-600" />
        <path d="M0,0 L-10,0" className="animate-firework-burst delay-700" />
        <path d="M0,0 L-7,-7" className="animate-firework-burst delay-800" />
      </g>
    </g>
  </svg>
);

function CongratsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[100] p-4 font-inter">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-lg relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4">
          <CloseIcon />
        </button>
        <div className="p-8 md:p-12">
          <FireworksSVG />
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-xl text-gray-600">
            Successfully Completed the Task!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CongratsModal;
