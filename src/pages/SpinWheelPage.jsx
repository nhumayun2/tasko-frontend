import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchTasks } from "../api/tasks";
import { useAuth } from "../context/AuthContext";

// Placeholder for Spin icon
const SpinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 12a8 8 0 00-8-8V1m2 2V.5M12 22v-5m-2-6h.01M16 16h.01M18 10h.01M4 12h.01M6 18h.01"
    />
  </svg>
);

// SVG for the pointer at the bottom (from Figma)
const PointerSVG = () => (
  <svg
    width="143"
    height="134"
    viewBox="0 0 143 134"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30"
  >
    <g filter="url(#filter0_d_17929_6556)">
      <path
        d="M64.5754 17.0725C67.5678 11.8896 75.0488 11.8896 78.0411 17.0725L115.072 81.2116C118.064 86.3946 114.324 92.8733 108.339 92.8733H34.2775C28.2928 92.8733 24.5523 86.3946 27.5447 81.2116L64.5754 17.0725Z"
        fill="#2F911E"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_17929_6556"
        x="-0.0078125"
        y="0.685318"
        width="142.633"
        height="132.688"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="14" />
        <feGaussianBlur stdDeviation="13.25" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.184314 0 0 0 0 0.568627 0 0 0 0 0.117647 0 0 0 0.5 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_17929_6556"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_17929_6556"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

// Helper function for polar to cartesian coordinates
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  // Adjust angle so 0 degrees is visually "up" (90 degrees in standard math unit circle)
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// Helper function to create SVG path for a pie slice
const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
  return d;
};

function SpinWheelPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Family");
  const [spinning, setSpinning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelContainerRef = useRef(null);

  const figmaCategories = [
    "Family",
    "Arts and Craft",
    "Nature",
    "Sport",
    "Friends",
    "Meditation",
    "Collaborative Task",
    "General",
  ];

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const getTasks = async () => {
        setLoadingTasks(true);
        setError(null);
        try {
          const fetchedTasks = await fetchTasks();
          setTasks(fetchedTasks);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingTasks(false);
        }
      };
      getTasks();
    }
  }, [isAuthenticated, authLoading]);

  const tasksForWheel = tasks.filter(
    (task) => task.category === selectedCategory
  );

  const handleSpin = () => {
    if (spinning || tasksForWheel.length === 0) return;

    setSpinning(true);
    setSelectedTask(null);

    const randomIndex = Math.floor(Math.random() * tasksForWheel.length);
    const selected = tasksForWheel[randomIndex];

    const degreesPerSlice = 360 / tasksForWheel.length;

    // Calculate the start angle of the selected slice relative to the wheel's 0-degree (top)
    const startAngleOfSelectedSlice = randomIndex * degreesPerSlice;

    // Add a small random offset within the slice to ensure it doesn't land exactly on a boundary.
    // This offset will be a random value between 10% and 90% of the slice's width.
    const randomOffsetWithinSlice =
      degreesPerSlice * (0.1 + Math.random() * 0.8);

    // The absolute angle on the wheel that we want to align with the pointer.
    // The pointer is at the visual bottom, which is 180 degrees from the visual top (0 degrees).
    const desiredLandingAngleOnWheel =
      startAngleOfSelectedSlice + randomOffsetWithinSlice;

    // Calculate the rotation needed to bring 'desiredLandingAngleOnWheel' to the pointer's position (180 degrees).
    // The wheel rotates clockwise for positive degrees.
    let targetDegree = 180 - desiredLandingAngleOnWheel;

    // Add multiple full rotations for a smooth spinning effect.
    // We add enough full rotations to ensure the wheel spins visibly before stopping.
    const fullRotations = 5; // You can adjust this number for more or less spin
    const finalRotation = fullRotations * 360 + targetDegree;

    setRotation(finalRotation);

    // Set the selected task after the spin animation completes
    setTimeout(() => {
      setSelectedTask(selected);
      setSpinning(false);
    }, 5000); // Matches the CSS transition duration
  };

  const handleGoToTask = () => {
    if (selectedTask) {
      navigate(`/tasks/${selectedTask._id}`);
    }
  };

  const dynamicSliceColors = [
    "#1F77B4", // Blue
    "#AEC7E8", // Light Blue
    "#FF7F0E", // Orange
    "#FFBB78", // Light Orange
    "#2CA02C", // Green
    "#98DF8A", // Light Green
    "#CE3816", // Red
    "#D62728", // Dark Red
    "#9467BD", // Purple
    "#8C564B", // Brown
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">
          Loading authentication...
        </h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const svgSize = 593;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  const innerCircleRadius = 234.529;

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      {" "}
      {/* Added flex-col */}
      <Header />
      {/* Main content area, adjusted for the overlapping container */}
      <div className="relative flex-grow -mt-8 md:-mt-6 z-20">
        {" "}
        {/* Apply floating container styles */}
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          {" "}
          {/* Apply floating container styles */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Spin Wheel</h1>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="categoryFilter" className="sr-only">
                Select Task Category
              </label>
              <select
                id="categoryFilter"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedTask(null);
                }}
                disabled={spinning}
              >
                {figmaCategories
                  .filter((cat) => cat !== "All Task")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {tasksForWheel.length === 0 && !loadingTasks && (
              <p className="text-gray-600 text-lg">
                No tasks available for this category. Add some tasks first!
              </p>
            )}
          </div>
          {loadingTasks ? (
            <div className="text-center text-gray-600 text-lg mt-10">
              Loading tasks for wheel...
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {/* Main Wheel Container */}
              <div
                ref={wheelContainerRef}
                className="relative w-80 h-80 md:w-96 md:h-96 rounded-full shadow-lg overflow-hidden mb-8 flex items-center justify-center"
                style={{ backgroundColor: "#CE3816" }}
              >
                {/* Spinning SVG Container */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${svgSize} ${svgSize}`}
                  className="absolute inset-0 transition-transform duration-5000 ease-out z-10"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Outer Red Border */}
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={innerCircleRadius + 10}
                    fill="#CE3816"
                  />
                  {/* Inner White Circle */}
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={innerCircleRadius}
                    fill="white"
                  />

                  {/* Dynamically generated slices */}
                  {tasksForWheel.length > 0 ? (
                    tasksForWheel.map((task, index) => {
                      const numberOfSlices = tasksForWheel.length;
                      const anglePerSlice = 360 / numberOfSlices;
                      // Slices are drawn clockwise, with 0 degrees being visually "up" due to polarToCartesian adjustment
                      const startAngle = index * anglePerSlice;
                      const endAngle = startAngle + anglePerSlice;

                      const pathData = describeArc(
                        centerX,
                        centerY,
                        innerCircleRadius,
                        startAngle,
                        endAngle
                      );
                      const fillColor =
                        dynamicSliceColors[index % dynamicSliceColors.length];

                      // Calculate text position and rotation for each slice
                      const textRadiusOffset = innerCircleRadius * 0.6;
                      const textAngle = startAngle + anglePerSlice / 2;

                      const textX =
                        centerX +
                        textRadiusOffset *
                          Math.cos((textAngle - 90) * (Math.PI / 180));
                      const textY =
                        centerY +
                        textRadiusOffset *
                          Math.sin((textAngle - 90) * (Math.PI / 180));

                      let textContentRotation = textAngle;
                      // Adjust text rotation to ensure it's always readable (not upside down)
                      if (
                        textContentRotation > 90 &&
                        textContentRotation < 270
                      ) {
                        textContentRotation += 180;
                      }
                      // This rotation counteracts the wheel's rotation to keep text upright relative to the viewer
                      const finalTextRotation = -rotation + textContentRotation;

                      return (
                        <g key={task._id}>
                          <path
                            d={pathData}
                            fill={fillColor}
                            stroke={
                              selectedTask?._id === task._id ? "gold" : "white"
                            }
                            strokeWidth={
                              selectedTask?._id === task._id ? "4" : "2"
                            }
                          />
                          <text
                            x={textX}
                            y={textY}
                            fill="black"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${finalTextRotation} ${textX} ${textY})`}
                          >
                            {task.title.length > 10
                              ? task.title.substring(0, 8) + "..."
                              : task.title}
                          </text>
                        </g>
                      );
                    })
                  ) : (
                    <text
                      x={centerX}
                      y={centerY}
                      fill="gray"
                      fontSize="16"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      No tasks to spin!
                    </text>
                  )}

                  {/* Middle White Circle */}
                  <circle cx={centerX} cy={centerY} r="30" fill="white" />
                </svg>

                {/* Wheel Pointer */}
                <PointerSVG />
              </div>

              {selectedTask && (
                <div className="text-center mt-4 mb-6">
                  <p className="text-xl font-semibold text-gray-800">
                    Selected Task:
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {selectedTask.title}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleSpin}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={spinning || tasksForWheel.length === 0}
                >
                  <SpinIcon />
                  {spinning ? "Spinning..." : "Spin"}
                </button>
                <button
                  onClick={handleGoToTask}
                  className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedTask || spinning}
                >
                  Go To Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpinWheelPage;
