import api from "../utils/api"

// Set auth token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
  } else {
    delete api.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
  }
}

// Initialize auth token from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem("token")
  if (token) {
    setAuthToken(token)
  }
  return token
}

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData)
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token)
    }
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials)
    if (response.data.success && response.data.data.token) {
      setAuthToken(response.data.data.token)
    }
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

// Logout user
export const logout = () => {
  setAuthToken(null)
}

// Get user profile
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile")
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile")
  }
}

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}
