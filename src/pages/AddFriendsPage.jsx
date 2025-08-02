import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { fetchUsersForFriends, sendFriendRequest } from "../api/friends";

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

const UserCard = ({ user, onAddFriend }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 mb-2">
        {user?.username.charAt(0).toUpperCase()}
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{user?.username}</h3>
      <p className="text-gray-600 text-sm">{user?.email}</p>
      <button
        onClick={() => onAddFriend(user._id)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300 shadow-md"
      >
        Add Friend
      </button>
    </div>
  );
};

function AddFriendsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const getUsers = async () => {
        setLoadingUsers(true);
        setError(null);
        try {
          const fetchedUsers = await fetchUsersForFriends();
          setUsers(fetchedUsers);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      getUsers();
    }
  }, [isAuthenticated, authLoading]);

  const handleAddFriend = async (recipientId) => {
    setSendingRequest(true);
    setError(null);
    try {
      await sendFriendRequest(recipientId);
      // After sending request, remove user from the list to prevent duplicates
      setUsers(users.filter((user) => user._id !== recipientId));
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingRequest(false);
    }
  };

  if (authLoading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">Loading users...</h1>
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
              Add New Friends
            </h2>
            <button
              onClick={() => navigate("/friends")}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onAddFriend={handleAddFriend}
                />
              ))
            ) : (
              <div className="lg:col-span-4 text-center text-gray-600 text-lg">
                No new users to add!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFriendsPage;
