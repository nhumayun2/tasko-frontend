import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import TaskDetailsLogo from "../assets/TaskDetailsLogo.png"; // Import the new logo

// Placeholder for Calendar icon SVG
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Placeholder for Trash icon SVG
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-500 hover:text-red-700 transition duration-200 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

function TaskCard({ task, onDelete }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "In Progress":
      case "Ongoing":
        return "text-orange-600";
      case "Done":
        return "text-green-600";
      case "To Do":
      default:
        return "text-blue-600";
    }
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task._id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition duration-200"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img
            src={TaskDetailsLogo} // Use the imported image
            alt="Task Icon"
            className="h-8 w-8 mr-2"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/32x32/14b8a6/ffffff?text=T";
            }} // Fallback
          />
          <h3 className="text-xl font-semibold text-gray-800 ml-2">
            {task.title}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
        >
          <TrashIcon />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon />
          <span>
            {task.dueDate
              ? format(new Date(task.dueDate), "PPP")
              : "No Due Date"}
          </span>
        </div>
        <span className={`font-semibold ${getStatusColor(task.status)}`}>
          &bull; {task.status}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
