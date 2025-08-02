import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import {
  fetchFriendsList,
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest, // Import the new reject API function
} from "../api/friends";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 mr-4 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.98 5.98 0 0110 16a5.979 5.979 0 01-5.454-2.084A5 5 0 0010 11z"
      clipRule="evenodd"
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

const FriendsPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFriendsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const friendsList = await fetchFriendsList();
      const requestsList = await fetchFriendRequests();
      setFriends(friendsList);
      setRequests(requestsList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      getFriendsData();
    }
  }, [isAuthenticated, authLoading]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      // Refresh friends data
      getFriendsData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectFriendRequest(requestId);
      // Refresh friends data
      getFriendsData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600">Loading friends...</h1>
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
              Friends
            </h2>
            <Link
              to="/friends/add"
              className="flex items-center px-4 py-2 bg-[#60E5AE] text-black rounded-lg font-light hover:bg-green-600 transition duration-300 shadow-md"
            >
              <BackIcon />
              Add New Friend
            </Link>
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

          {/* Friends List Section */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Friends List
          </h3>
          {friends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="bg-gray-50 rounded-xl p-4 flex items-center shadow-sm"
                >
                  <UserIcon />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {friend.username}
                    </h4>
                    <p className="text-sm text-gray-600">
                      You are now friends!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mb-8">
              You have no friends yet.
            </p>
          )}

          {/* Friends Requests Section */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Friend Requests
          </h3>
          {requests.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-gray-50 rounded-xl p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center">
                    <UserIcon />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {request.sender.username}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Sent a friend request.
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-300"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No new friend requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
