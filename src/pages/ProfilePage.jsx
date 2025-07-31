import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { fetchTasks } from "../api/tasks"; // To calculate points and progress

function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [totalPoints, setTotalPoints] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [error, setError] = useState(null);

  // Define badge thresholds and names
  const badgeTiers = [
    { name: "Newbie", threshold: 0 },
    { name: "Fan", threshold: 100 },
    { name: "Talented", threshold: 250 },
    { name: "Expert", threshold: 500 },
    { name: "Pro", threshold: 1000 },
  ];

  // Function to determine current level and points to next level
  const getUserLevelAndProgress = (points) => {
    let currentLevel = 0;
    let pointsToNextLevel = 0;
    let nextLevelThreshold = 0;
    let currentLevelThreshold = 0;

    for (let i = 0; i < badgeTiers.length; i++) {
      if (points >= badgeTiers[i].threshold) {
        currentLevel = i + 1; // Level is 1-indexed
        currentLevelThreshold = badgeTiers[i].threshold;
      } else {
        nextLevelThreshold = badgeTiers[i].threshold;
        break;
      }
    }

    if (currentLevel === badgeTiers.length) {
      // Max level achieved
      pointsToNextLevel = 0;
      nextLevelThreshold = badgeTiers[badgeTiers.length - 1].threshold; // Set to max threshold
    } else {
      pointsToNextLevel = nextLevelThreshold - points;
    }

    return {
      level: currentLevel,
      pointsToNextLevel,
      nextLevelThreshold,
      currentLevelThreshold,
    };
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      const calculateProgress = async () => {
        setLoadingProgress(true);
        setError(null);
        try {
          const allTasks = await fetchTasks();
          let calculatedPoints = 0;
          let completedCount = 0;
          allTasks.forEach((task) => {
            if (task.status === "Done" && typeof task.points === "number") {
              calculatedPoints += task.points;
              completedCount++;
            }
          });
          setTotalPoints(calculatedPoints);
          setTasksCompleted(completedCount);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingProgress(false);
        }
      };
      calculateProgress();
    }
  }, [isAuthenticated, authLoading, user]);

  const {
    level,
    pointsToNextLevel,
    nextLevelThreshold,
    currentLevelThreshold,
  } = getUserLevelAndProgress(totalPoints);
  const progressPercentage =
    nextLevelThreshold > currentLevelThreshold
      ? ((totalPoints - currentLevelThreshold) /
          (nextLevelThreshold - currentLevelThreshold)) *
        100
      : 100;

  if (authLoading || loadingProgress) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">Loading profile...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter p-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error: {error}</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Header />
      <div className="relative flex-grow -mt-6 z-20">
        {" "}
        {/* Adjusted margin-top for overlap */}
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile</h2>
          <hr className="border-t border-gray-300 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1 bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-5xl font-bold text-gray-600 mb-4">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {user?.username}
              </h3>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>

            {/* Middle Column: Progress Section */}
            <div className="lg:col-span-1 bg-gray-100 rounded-xl p-6 flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Progress
              </h3>
              <div className="flex flex-col items-center justify-center flex-grow">
                {/* Progress Circle (simplified) */}
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center mb-4">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#34d399 ${progressPercentage}%, transparent ${progressPercentage}%)`,
                      transform: "rotate(-90deg)", // Start from top
                    }}
                  ></div>
                  <span className="text-3xl font-bold text-gray-800 relative z-10">
                    {totalPoints}
                  </span>
                  <span className="text-sm text-gray-600 absolute bottom-8">
                    Earn Point
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-800">
                  Level {level}
                </h4>
                {pointsToNextLevel > 0 ? (
                  <p className="text-gray-600 text-sm">
                    You Need {pointsToNextLevel} Point to go to Next Level
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    You've reached the max level!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Badges and "Complete Your Task!" */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
              {/* Badges Section */}
              <div className="bg-gray-100 rounded-xl p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Badges
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {badgeTiers.map((badge, index) => (
                    <div
                      key={badge.name}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2
                                      ${
                                        totalPoints >= badge.threshold
                                          ? "bg-green-500 border-green-700"
                                          : "bg-gray-300 border-gray-400"
                                      }`}
                      >
                        {/* Placeholder for badge icon */}
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
                            d="M9 12l2 2 4-4M7.828 17.172A4 4 0 0012 21h0a4 4 0 004.172-4.828L18 14l-2-2 1.414-1.414L16 9l-2-2-1.414 1.414L10 6l-2 2-1.414-1.414L6 5l-2 2-1.414-1.414L2 4l-2 2 1.414 1.414z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete Your Task! Section */}
              <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Complete Your Task!
                </h3>
                <p className="text-gray-600 text-sm">
                  Unlock achievements and earn point to go to your level up
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
