import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";
import { fetchTaskById, updateTaskApi, deleteTaskApi } from "../api/tasks";
import { useAuth } from "../context/AuthContext";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
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

const TaskoBigIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(""); // New state for dropdown

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

  useEffect(() => {
    const getTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTask = await fetchTaskById(id);
        setTask(fetchedTask);
        setCurrentStatus(fetchedTask.status); // Initialize currentStatus from fetched task
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getTask();
  }, [id]);

  const handleUpdateTask = async (updatedData) => {
    setModalLoading(true);
    setError(null);
    try {
      const updatedTask = await updateTaskApi(id, updatedData);
      setTask(updatedTask);
      setCurrentStatus(updatedTask.status); // Update dropdown state after successful save
      setIsEditModalOpen(false); // Close modal after successful update
      return true; // Indicate success
    } catch (err) {
      setError(err.message);
      return false; // Indicate failure
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    // Using window.confirm as a placeholder. In a real app, replace with a custom modal.
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskApi(id);
        navigate("/dashboard");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmitChanges = async () => {
    setError(null);
    if (!task) {
      navigate("/dashboard"); // If task somehow not loaded, just go back
      return;
    }

    let updateSuccessful = true;
    // Check if status has actually changed
    if (currentStatus !== task.status) {
      // Only update status if it's different. Pass all task data to satisfy backend validation.
      updateSuccessful = await handleUpdateTask({
        ...task,
        status: currentStatus,
      });
    }

    // Navigate to dashboard only if update was successful or no update was needed
    if (updateSuccessful) {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-inter">
        <h1 className="text-4xl font-bold text-blue-600">
          Loading task details...
        </h1>
      </div>
    );
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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter p-4">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">
          Task Not Found
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const allValidStatuses = [
    "To Do",
    "In Progress",
    "Done",
    "Pending",
    "Ongoing",
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Header />
      {/* Main content area, adjusted for the overlapping container */}
      <div className="relative flex-grow -mt-8 md:-mt-6 z-20">
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          {/* Task Details Header, Edit, and Back Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Task Details
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center px-4 py-2 bg-[#FFAB00]/10 text-black rounded-lg font-light hover:bg-yellow-600 transition duration-300 shadow-md"
              >
                <EditIcon />
                Edit Task
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center px-4 py-2 bg-[#60E5AE] text-black rounded-lg font-light hover:bg-green-600 transition duration-300 shadow-md"
              >
                <BackIcon />
                Back
              </button>
            </div>
          </div>
          <hr className="border-t border-gray-300 mb-6" />{" "}
          {/* Horizontal line */}
          {/* Task Icon, Title, and Description */}
          <div className="flex items-start mb-6">
            <TaskoBigIcon className="mt-0" />
            <div className="ml-4 flex-grow">
              <h3 className="text-2xl font-semibold text-gray-800">
                {task.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mt-1">
                {task.description}
              </p>
            </div>
          </div>
          {/* End Date, Status, Priority, Category Section - Using flex for precise alignment */}
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            {/* Left Section: End Date & Priority */}
            {/* Added ml-16 to align with task title text on md screens and up */}
            <div className="flex flex-col space-y-4 pr-2 md:pr-4 md:ml-16">
              <div className="flex items-center text-gray-700">
                <CalendarIcon />
                <span className="font-semibold mr-2">End Date:</span>
                <span>
                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : "N/A"}
                </span>
              </div>
            </div>

            {/* Vertical Separator Line (visible on md and up) */}
            <div className="hidden md:block w-px bg-gray-300 h-16 mx-4"></div>

            {/* Right Section: Status & Category */}
            <div className="flex flex-col space-y-4 pl-0 md:pl-4">
              <div className="flex items-center text-gray-700">
                <span
                  className={`font-bold text-xl ${getStatusColor(task.status)}`}
                >
                  &bull; {task.status}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-16 mb-8">
            <label
              htmlFor="changeStatus"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Change Status
            </label>
            <select
              id="changeStatus"
              // Changed width to w-full on small screens and w-1/4 on medium screens and up
              className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={currentStatus} // Bind to new local state
              onChange={(e) => setCurrentStatus(e.target.value)} // Only update local state
              disabled={modalLoading}
            >
              {allValidStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleDeleteTask}
              className="flex items-center px-6 py-3 bg-[#FF4C24]/15 text-[#FF4C24] rounded-lg font-semibold hover:bg-[#FF4C24]/10 transition duration-300 shadow-md"
            >
              <DeleteIcon />
              Delete Task
            </button>
            <button
              onClick={handleSubmitChanges} // New handler for submit button
              className="flex items-center px-6 py-3 bg-[#60E5AE] text-black rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateTask}
        taskToEdit={task}
        loading={modalLoading}
      />
    </div>
  );
}

export default TaskDetailsPage;
