import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginIllustrationImage from "../assets/loginPage-Illustration.png";
import NavbarTaskIcon from "../assets/navbar-task.png";
import NavbarSpinIcon from "../assets/navbar-spin.png";
import NavbarFriendsIcon from "../assets/navbar-friends.png";

// Placeholder for a simple Tasko logo icon SVG
const TaskoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

// Bell Icon (Notifications) - Re-used from Dashboard for consistency
const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.001 2.001 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
    />
  </svg>
);

// Level Badge Icon (Re-used from Dashboard for consistency)
const LevelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4M18 17v4M17 6h4M3 12h18M3 12l-1.414 1.414M21 12l1.414 1.414M12 3v18"
    />
  </svg>
);

// Hamburger Icon for mobile menu
const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

// Close Icon for mobile menu
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white cursor-pointer"
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

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  // Determine if the current page is the dashboard
  const isDashboardPage = location.pathname === "/dashboard";

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false); // Close dropdown after logout
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  // Format username for display (e.g., "Thomas M.")
  const formatUserName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    if (parts.length === 1) {
      return fullName;
    }
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  };

  return (
    <header
      className={`text-white p-4 shadow-md relative overflow-hidden transition-all duration-300
        ${isDashboardPage ? "min-h-[12rem] md:min-h-[16rem]" : "min-h-[8rem]"}
      `}
      style={{
        backgroundColor: "#1a202c",
        // Radial gradients as per Figma design for the header background
        background: `
          radial-gradient(circle at 10% 50%, rgba(52, 211, 153, 0.3) 0%, rgba(52, 211, 153, 0) 40%),
          radial-gradient(circle at 90% 50%, rgba(52, 211, 153, 0.5) 0%, rgba(52, 211, 153, 0) 40%),
          #1a202c
        `,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        overflow: "visible", // Ensure content like dropdowns can overflow
      }}
    >
      {/* Illustration on the right side of the navigation bar, now as a background element */}
      <img
        src={LoginIllustrationImage}
        alt="Header Illustration"
        className="absolute right-0 bottom-0 h-full w-auto object-cover hidden md:block z-0"
        style={{ maxHeight: isDashboardPage ? "16rem" : "8rem", width: "auto" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x160/1a202c/ffffff?text=Header+Illus";
        }}
      />

      <div className="container mx-auto flex flex-col h-full">
        {/* Top row of the header (logo, nav links, rightmost elements) */}
        <div className="flex items-center justify-between w-full h-24">
          {/* Leftmost: Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center text-2xl font-bold"
            >
              <TaskoIcon />
              Tasko
            </Link>
          </div>

          {/* Hamburger Icon for mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

          {/* Middle: Navigation Links (Hidden on small screens, shown on md and up) */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              <img
                src={NavbarTaskIcon}
                alt="Task List Icon"
                className="h-5 w-5 mr-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/20x20";
                }}
              />
              Task List
            </Link>
            <Link
              to="/spin-wheel"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              <img
                src={NavbarSpinIcon}
                alt="Spin Icon"
                className="h-5 w-5 mr-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/20x20";
                }}
              />
              Spin
            </Link>
            <Link
              to="/friends"
              className="flex items-center px-3 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              <img
                src={NavbarFriendsIcon}
                alt="Friends Icon"
                className="h-5 w-5 mr-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/20x20";
                }}
              />
              Friends
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* Bell Icon (Notifications) */}
            <div className="relative cursor-pointer">
              <BellIcon />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </div>

            {/* Level Badge */}
            <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
              <LevelIcon />
              <span>Level 2</span>
            </div>

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative z-50">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-semibold">
                    {formatUserName(user.username)}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      See Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(52, 211, 153, 0.8)" }}
          >
            <nav className="flex flex-col items-center w-full px-4">
              <Link
                to="/dashboard"
                className="flex items-center justify-center w-full py-4 rounded-lg transition duration-200 hover:bg-emerald-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={NavbarTaskIcon}
                  alt="Task List Icon"
                  className="h-6 w-6 mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/24x24";
                  }}
                />
                <span className="text-white text-xl font-semibold">
                  Task List
                </span>
              </Link>
              <hr className="border-t border-emerald-300 w-full my-2" />
              <Link
                to="/spin-wheel"
                className="flex items-center justify-center w-full py-4 rounded-lg transition duration-200 hover:bg-emerald-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={NavbarSpinIcon}
                  alt="Spin Icon"
                  className="h-6 w-6 mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/24x24";
                  }}
                />
                <span className="text-white text-xl font-semibold">Spin</span>
              </Link>
              <hr className="border-t border-emerald-300 w-full my-2" />
              <Link
                to="/friends"
                className="flex items-center justify-center w-full py-4 rounded-lg transition duration-200 hover:bg-emerald-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img
                  src={NavbarFriendsIcon}
                  alt="Friends Icon"
                  className="h-6 w-6 mr-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/24x24";
                  }}
                />
                <span className="text-white text-xl font-semibold">
                  Friends
                </span>
              </Link>
              <hr className="border-t border-emerald-300 w-full my-2" />
            </nav>

            {user && (
              <div className="flex flex-col items-center w-full px-4 mt-8">
                <div className="flex items-center space-x-2 text-white py-4 w-full justify-center">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xl font-semibold">
                    {formatUserName(user.username)}
                  </span>
                </div>
                <hr className="border-t border-emerald-300 w-full my-2" />
                <div className="bg-purple-600 text-white text-base font-bold px-4 py-2 rounded-full flex items-center space-x-2 my-2">
                  <LevelIcon className="h-5 w-5" />
                  <span>Level 2</span>
                </div>
                <hr className="border-t border-emerald-300 w-full my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold transition duration-300 shadow-md my-2 hover:bg-emerald-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {isDashboardPage && (
          <div className="relative z-10 pl-4 mt-auto pb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Hi {user?.username},
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-white">
              Welcome to Dashboard
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
