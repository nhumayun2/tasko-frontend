import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CollaborativeTaskCard from "../components/CollaborativeTaskCard";
import { useAuth } from "../context/AuthContext";
import { fetchFriendsList } from "../api/friends";
import { fetchCollaborativeTasks, createTaskApi } from "../api/tasks";

// Back icon
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

// Add New Task Icon
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

// Updated SVG for the Collaborate icon
const CollaborateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    className="h-5 w-5 mr-1 text-gray-800"
  >
    <path d="M176 120C189.3 120 200 130.7 200 144C200 157.3 189.3 168 176 168C162.7 168 152 157.3 152 144C152 130.7 162.7 120 176 120zM208.4 217.2C236.4 204.8 256 176.7 256 144C256 99.8 220.2 64 176 64C131.8 64 96 99.8 96 144C96 176.8 115.7 205 144 217.3L144 422.6C115.7 435 96 463.2 96 496C96 540.2 131.8 576 176 576C220.2 576 256 540.2 256 496C256 463.2 236.3 435 208 422.7L208 336.1C234.7 356.2 268 368.1 304 368.1L390.7 368.1C403 396.4 431.2 416.1 464 416.1C508.2 416.1 544 380.3 544 336.1C544 291.9 508.2 256.1 464 256.1C431.2 256.1 403 275.8 390.7 304.1L304 304C254.1 304 213 265.9 208.4 217.2zM176 472C189.3 472 200 482.7 200 496C200 509.3 189.3 520 176 520C162.7 520 152 509.3 152 496C152 482.7 162.7 472 176 472zM440 336C440 322.7 450.7 312 464 312C477.3 312 488 322.7 488 336C488 349.3 477.3 360 464 360C450.7 360 440 349.3 440 336z" />
  </svg>
);

function CollaborativeTaskPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const friendsList = await fetchFriendsList();
          const collaborativeTasks = await fetchCollaborativeTasks();
          setFriends(friendsList);
          setTasks(collaborativeTasks);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, authLoading]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedFriend) {
      setError(
        "Please provide a title and select a friend to collaborate with."
      );
      return;
    }
    setSubmitting(true);
    setError(null);

    const taskData = {
      title: newTaskTitle,
      description: newTaskDesc,
      category: "Collaborative Task",
      status: "To Do",
      collaborators: [selectedFriend._id],
    };

    try {
      await createTaskApi(taskData);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setShowForm(false);
      // Refresh task list
      const updatedTasks = await fetchCollaborativeTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">Loading...</h1>
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              Collaborative Task
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

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Friends List - Left Column */}
            <div className="w-full lg:w-1/4 bg-gray-50 rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Friends list
              </h3>
              {friends.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  You have no friends to collaborate with.
                </p>
              ) : (
                <ul className="space-y-2">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        selectedFriend?._id === friend._id
                          ? "bg-green-200 text-green-800 font-semibold"
                          : "hover:bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-gray-600 mr-3">
                        {friend.username.charAt(0).toUpperCase()}
                      </div>
                      {friend.username}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => navigate("/friends/add")}
                className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
              >
                Add New Friend
              </button>
            </div>

            {/* Tasks and Form - Right Column */}
            <div className="w-full lg:w-3/4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
                >
                  <AddNewTaskIcon />
                  Add New Task
                </button>
              </div>

              {/* New Task Form */}
              {showForm && (
                <form
                  onSubmit={handleCreateTask}
                  className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-dashed border-gray-300"
                >
                  <h3 className="text-xl font-bold mb-4">
                    Create Collaborative Task
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-sm font-medium text-gray-700 mr-2">
                      Collaborator:
                    </span>
                    {selectedFriend ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                        {selectedFriend.username}
                      </span>
                    ) : (
                      <span className="text-xs text-red-500">
                        Please select a friend from the list on the left.
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Task"}
                  </button>
                </form>
              )}

              {/* Collaborative Task List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <CollaborativeTaskCard key={task._id} task={task} />
                  ))
                ) : (
                  <div className="text-center text-gray-600 text-lg md:col-span-2 mt-8">
                    No collaborative tasks found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollaborativeTaskPage;
