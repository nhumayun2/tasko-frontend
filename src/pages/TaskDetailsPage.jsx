import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "../components/Header";
// Remove: import TaskModal from "../components/TaskModal";
import CongratsModal from "../components/CongratsModal";
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

const formatDateSimple = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return format(date, "PPP");
};

function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCongratsModalOpen, setIsCongratsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

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
        setCurrentStatus(fetchedTask.status);
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
      setCurrentStatus(updatedTask.status);
      if (updatedTask.status === "Done") {
        setIsCongratsModalOpen(true);
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async () => {
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
      navigate("/dashboard");
      return;
    }

    let updateSuccessful = true;
    if (currentStatus !== task.status) {
      updateSuccessful = await handleUpdateTask({
        ...task,
        status: currentStatus,
      });
    }

    if (updateSuccessful) {
      if (currentStatus !== "Done") {
        navigate("/dashboard");
      }
    }
  };

  const handleCloseCongratsModal = () => {
    setIsCongratsModalOpen(false);
    navigate("/dashboard");
  };

  const handleEditTaskClick = () => {
    navigate(`/tasks/edit/${id}`); // Navigate to the new EditTaskPage
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
      <div className="relative flex-grow -mt-8 md:-mt-6 z-20">
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Task Details
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={handleEditTaskClick}
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
          <hr className="border-t border-gray-300 mb-6" />
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
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            <div className="flex flex-col space-y-4 pr-2 md:pr-4 md:ml-16">
              <div className="flex items-center text-gray-700">
                <CalendarIcon />
                <span className="font-semibold mr-2">End Date:</span>
                <span>{formatDateSimple(task.dueDate)}</span>
              </div>
            </div>

            <div className="hidden md:block w-px bg-gray-300 h-16 mx-4"></div>

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
              className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value)}
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
              onClick={handleSubmitChanges}
              className="flex items-center px-6 py-3 bg-[#60E5AE] text-black rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <CongratsModal
        isOpen={isCongratsModalOpen}
        onClose={handleCloseCongratsModal}
      />
    </div>
  );
}

export default TaskDetailsPage;
