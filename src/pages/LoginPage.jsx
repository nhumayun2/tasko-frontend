import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginIllustrationImage from "../assets/loginPage-Illustration.png"; // Import the new illustration

// Eye icon for showing password (open eye)
const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Eye off icon for hiding password (closed eye)
const EyeOffIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.8 1.8 0 0 1 0-2.8M6 6l2 2m4 4 2 2m4 4 2 2M3 3l18 18" />
    <path d="M14.83 9.17A3 3 0 0 0 12 7a3 3 0 0 0-3 3c0 1.05.42 2.04 1.17 2.83" />
  </svg>
);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard if already authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password, rememberMe);

    if (result.success) {
      navigate("/dashboard"); // Redirect on successful login
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-inter">
      {/* Left Half - Illustration and Radial Gradient Background (Same as RegisterPage) */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
        style={{
          minHeight: "50vh", // For mobile, ensure it takes up some height
          backgroundColor: "#1a202c", // Base dark background color
          // Radial gradients as per Figma design, adjusted sizes and positions
          background: `
            radial-gradient(circle at calc(90% - 5rem) 90%, rgba(52, 211, 153, 0.5) 0%, rgba(52, 211, 153, 0) 30%), /* Smaller bottom-right emerald-300 glow, moved left */
            radial-gradient(circle at 10% 10%, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0) 25%), /* Top-left emerald-300 glow (reverted position, slightly reduced size) */
            #1a202c /* Base dark background */
          `,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome Back!</h2>{" "}
          {/* Text for Login Page */}
          <p className="text-lg md:text-xl mb-8">
            Please Enter your Details to Log In.
          </p>{" "}
          {/* Text for Login Page */}
        </div>
        {/* The actual illustration image */}
        <img
          src={LoginIllustrationImage} // Use the imported Login image
          alt="Login Illustration"
          className="relative z-10 w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain" // Adjust size as needed
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/1a202c/ffffff?text=Login+Illustration+Fallback";
          }} // Fallback
        />
      </div>

      {/* Right Half - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-white min-h-screen">
        <div className="w-full max-w-md">
          {" "}
          {/* Max width for the form content */}
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Login
          </h2>{" "}
          {/* Heading for Login Page */}
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
            {/* Password input with toggle */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 pr-10" // Added pr-10 for icon spacing
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-400 text-black py-3 rounded-lg font-normal text-lg hover:bg-green-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>
          {/* "Or" with horizontal lines */}
          <div className="relative flex items-center justify-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>{" "}
            {/* Left line */}
            <span className="mx-4 text-gray-600">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>{" "}
            {/* Right line */}
          </div>
          <div className="text-center mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
