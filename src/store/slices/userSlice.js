import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toggleAddNewAdminPopup } from './popUpSlice';

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        loading: false,
        error: null, // Error handle panna
        isUpdated: false, // Update success-ai track panna
    },

    reducers: {
        // --- FETCH ALL USERS ---
        fetchAllUsersRequest: (state) => {
            state.loading = true;
        },
        fetchAllUsersSuccess: (state, action) => {
            state.users = action.payload;
            state.loading = false;
        },
        fetchAllUsersFailed: (state) => {
            state.loading = false;
        },

        // --- ADD NEW ADMIN ---
        addNewAdminRequest: (state) => {
            state.loading = true;
        },
        addNewAdminSuccess: (state) => {
            state.loading = false;
        },
        addNewAdminFailed: (state) => {
            state.loading = false;
        },


        updateProfileRequest: (state) => {
            state.loading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess: (state) => {
            state.loading = false;
            state.isUpdated = true;
        },
        updateProfileFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileReset: (state) => {
            state.isUpdated = false;
            state.error = null;
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
});

// Actions-ai export panrom
export const { 
    updateProfileReset, 
    clearErrors 
} = userSlice.actions;

// --- API ACTIONS ---

export const fetchAllUsers = () => async (dispatch) => {
    dispatch(userSlice.actions.fetchAllUsersRequest());
    await axios.get("http://localhost:4000/api/v1/user/all", { withCredentials: true })
        .then((res) => {
            dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
        })
        .catch((err) => {
            dispatch(userSlice.actions.fetchAllUsersFailed(err.response.data.message));
        });
};

export const addNewAdmin = (data) => async (dispatch) => {
    dispatch(userSlice.actions.addNewAdminRequest());
    await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data,
        {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
            dispatch(userSlice.actions.addNewAdminSuccess());
            toast.success(res.data.message);
            dispatch(toggleAddNewAdminPopup());
        })
        .catch((err) => {
            dispatch(userSlice.actions.addNewAdminFailed());
            toast.error(err.response.data.message);
        });
};


export const updateProfile = (data) => async (dispatch) => {
    dispatch(userSlice.actions.updateProfileRequest());
    await axios.put("http://localhost:4000/api/v1/user/update/profile", data,
        {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
            dispatch(userSlice.actions.updateProfileSuccess());
           
        })
        .catch((err) => {
            dispatch(userSlice.actions.updateProfileFailed(err.response.data.message));
        });
};

export default userSlice.reducer;