import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
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

function TaskModal({ isOpen, onClose, onSave, taskToEdit, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setStatus(taskToEdit.status || "To Do");
      setPriority(taskToEdit.priority || "Medium");
      setCategory(
        figmaCategories.includes(taskToEdit.category)
          ? taskToEdit.category
          : "General"
      );
      setPoints(taskToEdit.points || 0);
      setDueDate(
        taskToEdit.dueDate
          ? format(new Date(taskToEdit.dueDate), "yyyy-MM-dd")
          : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
      setCategory("General");
      setPoints(0);
      setDueDate("");
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    if (points < 0) {
      setError("Points cannot be negative.");
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
    onSave(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg relative p-8 md:p-12">
        <button onClick={onClose} className="absolute top-4 right-4">
          <CloseIcon />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Task
        </h2>

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
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="0"
            />
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            {loading ? "Saving..." : "Update Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
