import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-inter p-4">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops... Page Not Found</p>
      <img
        src="https://placehold.co/300x300/ffffff/000000?text=404+Cat"
        alt="404 Illustration"
        className="w-64 h-64 mb-8"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x300/ffffff/000000?text=404+Cat";
        }}
      />
      <Link
        to="/"
        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 text-lg font-semibold"
      >
        Back To Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
