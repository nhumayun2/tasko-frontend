import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Simple Header component for these pages (without logo/links)
const SimpleHeader = () => (
  <header
    className="text-white p-4 shadow-md relative overflow-hidden"
    style={{
      minHeight: "8rem", // Consistent height with main header
      backgroundColor: "#1a202c", // Base dark background color
      background: `
        radial-gradient(circle at 10% 50%, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0) 40%),
        radial-gradient(circle at 90% 50%, rgba(52, 211, 153, 0.5) 0%, rgba(52, 211, 153, 0) 40%),
        #1a202c
      `,
      backgroundSize: "100% 100%",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Content is intentionally empty as per Figma for this header */}
  </header>
);

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { API_BASE_URL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + `. Token: ${data.resetToken}`); // For testing: display token
      } else {
        setError(data.message || "Failed to request password reset");
      }
    } catch (err) {
      setError("Network error or server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-100">
      <SimpleHeader />

      {/* Main content area with floating container */}
      {/* Increased negative margin-top to pull it up more, and adjusted max-w */}
      <div className="flex-grow flex items-center justify-center p-4 -mt-32 z-10">
        {" "}
        {/* Adjusted margin-top */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-lg p-8 md:p-12">
          {" "}
          {/* Increased max-w */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              {/* Placeholder for clock icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Reset your Password
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Strong passwords include numbers, letters, and punctuation marks.
          </p>
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending Request..." : "Request Reset Link"}
            </button>
          </form>
          <div className="text-center mt-6 text-gray-600">
            <Link
              to="/login"
              className="text-green-600 hover:underline font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
