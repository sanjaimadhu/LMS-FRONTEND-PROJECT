import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API calls
const API_URL = import.meta.env.VITE_API_URL;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        message: null,
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        // --- Authentication Reducers ---
        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess: (state, action) => { 
            state.loading = false;
            state.message = action.payload.message;
        },
        registerFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        otpVerificationRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        otpVerificationSuccess: (state, action) => { 
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        otpVerificationFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        loginSuccess: (state, action) => { 
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        logoutSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        getUserRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        getUserSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        getUserFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        
        // --- Password Management ---
        forgotPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        forgotPasswordSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        resetPasswordSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        resetPasswordFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updatePasswordRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        updatePasswordSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload;
        },
        updatePasswordFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // --- Notification Reducers (Handling user-specific updates) ---
        markAllReadRequest: (state) => {
            state.loading = true;
        },
        markAllReadSuccess: (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            if (state.user && Array.isArray(state.user.notifications)) {
                state.user.notifications = state.user.notifications.map(n => ({
                    ...n,
                    status: "read"
                }));
            }
        },
        markAllReadFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        markSingleReadSuccess: (state, action) => {
            state.loading = false;
            const notificationId = action.payload; 
            if (state.user && Array.isArray(state.user.notifications)) {
                state.user.notifications = state.user.notifications.map(n => 
                    n._id === notificationId ? { ...n, status: "read" } : n
                );
            }
        },
        resetAuthSlice: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        }
    },
});

// Actions Export
export const { resetAuthSlice } = authSlice.actions;

// Helper to extract error messages
const getErrorMessage = (error) => error.response?.data?.message || "Something went wrong. Please try again.";

// --- Async Thunk Actions ---

export const register = (data) => async (dispatch) => {
    dispatch(authSlice.actions.registerRequest());
    try {
        const res = await axios.post(`${API_URL}/auth/register`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.registerSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.registerFailed(getErrorMessage(error)));
    }
};

export const otpVerification = (email, otp) => async (dispatch) => {
    dispatch(authSlice.actions.otpVerificationRequest());
    try {
        const res = await axios.post(`${API_URL}/auth/Verify-otp`, { email, otp }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.otpVerificationFailed(getErrorMessage(error)));
    }
};

export const login = (data) => async (dispatch) => {
    dispatch(authSlice.actions.loginRequest());
    try {
        const res = await axios.post(`${API_URL}/auth/login`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.loginSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.loginFailed(getErrorMessage(error)));
    }
};

export const logout = () => async (dispatch) => {
    dispatch(authSlice.actions.logoutRequest());
    try {
        const res = await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
        dispatch(authSlice.actions.logoutSuccess(res.data.message));
        dispatch(resetAuthSlice());
    } catch (error) {
        dispatch(authSlice.actions.logoutFailed(getErrorMessage(error)));
    }
};

export const getUser = () => async (dispatch) => {
    dispatch(authSlice.actions.getUserRequest());
    try {
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        dispatch(authSlice.actions.getUserSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.getUserFailed(getErrorMessage(error)));
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authSlice.actions.forgotPasswordRequest());
    try {
        const res = await axios.post(`${API_URL}/auth/password/forgot`, { email }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.forgotPasswordFailed(getErrorMessage(error)));
    }
};

export const resetPassword = (token, data) => async (dispatch) => {
    dispatch(authSlice.actions.resetPasswordRequest());
    try {
        const res = await axios.put(`${API_URL}/auth/password/reset/${token}`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.resetPasswordFailed(getErrorMessage(error)));
    }
};

export const updatePassword = (data) => async (dispatch) => {
    dispatch(authSlice.actions.updatePasswordRequest());
    try {
        const res = await axios.put(`${API_URL}/auth/password/update`, data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    } catch (error) {
        dispatch(authSlice.actions.updatePasswordFailed(getErrorMessage(error)));
    }
};

export const markAllNotificationsAsRead = () => async (dispatch) => {
    dispatch(authSlice.actions.markAllReadRequest());
    try {
        const res = await axios.put(`${API_URL}/notification/mark-all-read`, {}, {
            withCredentials: true,
        });
        dispatch(authSlice.actions.markAllReadSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.markAllReadFailed(getErrorMessage(error)));
    }
};

export const markNotificationAsRead = (id) => async (dispatch) => {
    try {
        await axios.put(`${API_URL}/notification/mark-read/${id}`, {}, {
            withCredentials: true,
        });
        dispatch(authSlice.actions.markSingleReadSuccess(id)); 
    } catch (error) {
        console.error("Notification single read error:", getErrorMessage(error));
    }
};

export default authSlice.reducer;