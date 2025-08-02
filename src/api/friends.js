import { getToken } from "../utils/auth";

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUsersForFriends = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/friends/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const sendFriendRequest = async (recipientId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/friends/request/${recipientId}`,
      { method: "POST", headers: getAuthHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send friend request");
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const fetchFriendsList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/friends/list`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch friends list");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching friends list:", error);
    throw error;
  }
};

export const fetchFriendRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/friends/requests`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch friend requests");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/friends/accept/${requestId}`,
      { method: "PUT", headers: getAuthHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to accept friend request");
    }
    return await response.json();
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

// New API function to reject a friend request
export const rejectFriendRequest = async (requestId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/friends/reject/${requestId}`,
      { method: "DELETE", headers: getAuthHeaders() }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reject friend request");
    }
    return await response.json();
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error;
  }
};
