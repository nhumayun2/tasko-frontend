import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { createTaskApi } from "../api/tasks";
import { format } from "date-fns"; // Required for formatDateSimple

// ... (Icon components remain the same) ...
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

const formatDateSimple = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return format(date, "PPP");
};

const AddNewTaskPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const figmaCategories = [
    "General",
    "Arts and Craft",
    "Nature",
    "Family",
    "Sport",
    "Friends",
    "Meditation",
    "Collaborative Task",
  ];
  const allValidStatuses = [
    "To Do",
    "In Progress",
    "Done",
    "Pending",
    "Ongoing",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!title.trim()) {
      setError("Task title cannot be empty.");
      setLoading(false);
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      category,
      points: Number(points),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    try {
      await createTaskApi(taskData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Header />
      <div className="relative flex-grow -mt-8 md:-mt-6 z-20">
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          {/* Page Header and Back Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Add New Task
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center px-4 py-2 bg-[#60E5AE] text-black rounded-lg font-light hover:bg-green-600 transition duration-300 shadow-md"
            >
              <BackIcon />
              Back
            </button>
          </div>
          <hr className="border-t border-gray-300 mb-6" />

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
                htmlFor="title"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Task description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Two-column layout for Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {allValidStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Two-column layout for Category and Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {figmaCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="points"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Points
                </label>
                <input
                  type="number"
                  id="points"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  placeholder="0"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="mm/dd/yyyy"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewTaskPage;
