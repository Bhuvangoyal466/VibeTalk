import React, { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                token: null,
                loading: false,
                error: null,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                    token,
                    user: JSON.parse(user),
                },
            });
        }
    }, []);

    const login = async (email, password) => {
        dispatch({ type: "LOGIN_START" });

        try {
            // Simulate API call - replace with actual API
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: data,
            });

            return data;
        } catch (error) {
            dispatch({
                type: "LOGIN_FAILURE",
                payload: error.message,
            });
            throw error;
        }
    };

    const register = async (username, email, password) => {
        dispatch({ type: "LOGIN_START" });

        try {
            // Simulate API call - replace with actual API
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, email, password }),
                }
            );

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: data,
            });

            return data;
        } catch (error) {
            dispatch({
                type: "LOGIN_FAILURE",
                payload: error.message,
            });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
    };

    const value = {
        user: state.user,
        token: state.token,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
