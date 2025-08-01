import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { fetchTasks, updateTaskApi, deleteTaskApi } from "../api/tasks";

const AddNewTaskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All Task");
  const [selectedStatus, setSelectedStatus] = useState("All Task");

  // IMPORTANT: This list MUST match the backend enum and TaskModal dropdown
  const figmaCategories = [
    "All Task",
    "General",
    "Arts and Craft",
    "Nature",
    "Family",
    "Sport",
    "Friends",
    "Meditation",
    "Collaborative Task",
  ];
  // Statuses from Figma's "All Task" filter dropdown, explicitly excluding 'Collaborative Task'
  const figmaStatuses = [
    "All Task",
    "Ongoing",
    "Pending",
    "Done",
    "To Do",
    "In Progress",
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

  const handleOpenNewTaskPage = () => {
    navigate("/tasks/new");
  };

  const handleOpenEditModal = async (taskId) => {
    setModalLoading(true);
    try {
      const task = await fetchTaskById(taskId);
      setTaskToEdit(task);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (taskData) => {
    setModalLoading(true);
    setError(null);
    try {
      let savedTask;
      if (taskToEdit) {
        savedTask = await updateTaskApi(taskToEdit._id, taskData);
        setTasks(
          tasks.map((task) => (task._id === savedTask._id ? savedTask : task))
        );
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      try {
        await deleteTaskApi(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory =
      selectedCategory === "All Task" || task.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Task" || task.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-gray-100 font-inter flex flex-col">
      <Header />
      <div className="relative flex-grow -mt-8 md:-mt-6 z-20">
        <div className="container mx-auto p-6 bg-white rounded-3xl shadow-lg min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-16rem)]">
          {/* Main layout row */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            {/* Left side: "All Task List" text */}
            <h2 className="text-2xl font-bold text-gray-800">All Task List</h2>

            {/* Right side: Filters and Add New Task button */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Select Task Category Filter */}
              <div className="w-full md:w-auto">
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {figmaCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* All Task (Status) Filter */}
              <div className="w-full md:w-auto">
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {figmaStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenNewTaskPage}
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
              >
                <AddNewTaskIcon />
                Add New Task
              </button>
            </div>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {loadingTasks ? (
            <div className="text-center text-gray-600 text-lg mt-10">
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center mt-10 p-8 bg-white rounded-xl shadow-md">
              <img
                src="https://placehold.co/300x200/ffffff/000000?text=No+Tasks"
                alt="No tasks available"
                className="mx-auto mb-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/300x200/ffffff/000000?text=No+Tasks";
                }}
              />
              <p className="text-xl font-semibold text-gray-700 mb-4">
                No Task is Available yet, Please Add your New Task
              </p>
              <button
                onClick={handleOpenNewTaskPage}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
              >
                Add Your New Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        loading={modalLoading}
      />
    </div>
  );
}

export default DashboardPage;
