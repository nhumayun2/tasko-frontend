import React, { useState, useEffect } from "react";
import { fetchFriendsList } from "../api/friends";
import { useAuth } from "../context/AuthContext";

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

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-gray-500 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

function CollaborativeTaskModal({
  isOpen,
  onClose,
  onSave,
  initialCollaborators = [],
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriends, setSelectedFriends] = useState(
    initialCollaborators.map((friend) => friend._id)
  );

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const getFriends = async () => {
        setLoading(true);
        try {
          const friendsList = await fetchFriendsList();
          setFriends(friendsList);
        } catch (err) {
          console.error("Failed to fetch friends:", err);
        } finally {
          setLoading(false);
        }
      };
      getFriends();
    }
  }, [isAuthenticated, authLoading]);

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleSave = () => {
    onSave(selectedFriends);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 font-inter">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg relative p-8 md:p-12">
        <button onClick={onClose} className="absolute top-4 right-4">
          <CloseIcon />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add Collaborators
        </h2>
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            Loading friends...
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            You have no friends to collaborate with.
          </div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition duration-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">
                      {friend.username}
                    </p>
                    <p className="text-sm text-gray-600">{friend.email}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend._id)}
                  onChange={() => handleFriendToggle(friend._id)}
                  className="h-5 w-5 text-green-500 rounded focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition duration-300 shadow-md"
            disabled={loading}
          >
            Save Collaborators
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollaborativeTaskModal;
