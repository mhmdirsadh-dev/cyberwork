/* eslint-disable react-refresh/only-export-components */
"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { initializeAuth, logout as logoutService } from "../services/authService"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Initialize auth on app start
    const token = initializeAuth()
    if (token) {
      // In a real app, you'd validate the token with the server
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: { name: "User" }, token },
      })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = (userData) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: userData,
    })
  }

  const logout = () => {
    logoutService()
    dispatch({ type: "LOGOUT" })
  }

  const setLoading = (loading) => {
    dispatch({ type: "SET_LOADING", payload: loading })
  }

  const setError = (error) => {
    dispatch({ type: "SET_ERROR", payload: error })
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    logout,
    setLoading,
    setError,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
