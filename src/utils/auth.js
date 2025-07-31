import Cookies from "js-cookie";

const TOKEN_NAME = "mern_task_token";
const USER_INFO_NAME = "mern_task_user_info";

// Set the token and user info in cookies
export const setAuthData = (token, user, rememberMe = false) => {
  const expires = rememberMe ? 30 : 7; // 30 days if "remember me", else 7 days (or session for un-checked)
  // For "session" behavior (token expires when browser closes), you'd omit the 'expires' option.
  // For this example, we'll use 7 days as a shorter duration for non-remembered sessions.

  Cookies.set(TOKEN_NAME, token, {
    expires,
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  });
  Cookies.set(USER_INFO_NAME, JSON.stringify(user), {
    expires,
    secure: window.location.protocol === "https:",
    sameSite: "Strict",
  });
};

// Get the token from cookies
export const getToken = () => {
  return Cookies.get(TOKEN_NAME);
};

// Get user info from cookies
export const getUserInfo = () => {
  const userInfo = Cookies.get(USER_INFO_NAME);
  return userInfo ? JSON.parse(userInfo) : null;
};

// Remove the token and user info from cookies
export const removeAuthData = () => {
  Cookies.remove(TOKEN_NAME);
  Cookies.remove(USER_INFO_NAME);
};
