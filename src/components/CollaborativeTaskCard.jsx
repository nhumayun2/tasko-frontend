import React from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import TaskDetailsLogo from "../assets/TaskDetailsLogo.png";

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

// Updated SVG for the Collaborate icon
const GroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    className="h-5 w-5 text-gray-500 mr-2"
  >
    <path d="M176 120C189.3 120 200 130.7 200 144C200 157.3 189.3 168 176 168C162.7 168 152 157.3 152 144C152 130.7 162.7 120 176 120zM208.4 217.2C236.4 204.8 256 176.7 256 144C256 99.8 220.2 64 176 64C131.8 64 96 99.8 96 144C96 176.8 115.7 205 144 217.3L144 422.6C115.7 435 96 463.2 96 496C96 540.2 131.8 576 176 576C220.2 576 256 540.2 256 496C256 463.2 236.3 435 208 422.7L208 336.1C234.7 356.2 268 368.1 304 368.1L390.7 368.1C403 396.4 431.2 416.1 464 416.1C508.2 416.1 544 380.3 544 336.1C544 291.9 508.2 256.1 464 256.1C431.2 256.1 403 275.8 390.7 304.1L304 304C254.1 304 213 265.9 208.4 217.2zM176 472C189.3 472 200 482.7 200 496C200 509.3 189.3 520 176 520C162.7 520 152 509.3 152 496C152 482.7 162.7 472 176 472zM440 336C440 322.7 450.7 312 464 312C477.3 312 488 322.7 488 336C488 349.3 477.3 360 464 360C450.7 360 440 349.3 440 336z" />
  </svg>
);

function CollaborativeTaskCard({ task, onDelete }) {
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

      <div className="flex flex-col space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <CalendarIcon />
          <span>
            {task.dueDate
              ? format(new Date(task.dueDate), "PPP")
              : "No Due Date"}
          </span>
        </div>
        <div className="flex items-center">
          <GroupIcon />
          <span>
            Collaborators:{" "}
            {task.collaborators.map((c) => c.username).join(", ")}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold">Owned by: {task.user.username}</span>
        <span className={`font-semibold ${getStatusColor(task.status)}`}>
          &bull; {task.status}
        </span>
      </div>
    </div>
  );
}

export default CollaborativeTaskCard;
