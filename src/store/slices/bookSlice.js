import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice"; 
import { toast } from "react-toastify";

const bookSlice = createSlice({
    name: "book",
    initialState: {
        loading: false,
        error: null,
        message: null,
        books: [],
    },
    reducers: {
        fetchBooksRequest(state) { state.loading = true; state.error = null; },
        fetchBooksSuccess(state, action) { state.loading = false; state.books = action.payload; },
        fetchBooksFailed(state, action) { state.loading = false; state.error = action.payload; },

        addBookRequest(state) { state.loading = true; state.error = null; },
        addBookSuccess(state, action) { state.loading = false; state.message = action.payload; },
        addBookFailed(state, action) { state.loading = false; state.error = action.payload; },

        updateBookRequest(state) { state.loading = true; state.error = null; },
        updateBookSuccess(state, action) { state.loading = false; state.message = action.payload; },
        updateBookFailed(state, action) { state.loading = false; state.error = action.payload; },

        deleteBookRequest(state) { state.loading = true; state.error = null; },
        deleteBookSuccess(state, action) { state.loading = false; state.message = action.payload; },
        deleteBookFailed(state, action) { state.loading = false; state.error = action.payload; },
        
        resetBookSlice(state) { state.error = null; state.message = null; state.loading = false; },

        createReviewRequest(state) { state.loading = true; state.error = null; },
        createReviewSuccess(state, action) { state.loading = false; state.message = action.payload; },
        createReviewFailed(state, action) { state.loading = false; state.error = action.payload; },

        deleteReviewRequest(state) { state.loading = true; state.error = null; },
        deleteReviewSuccess(state, action) { state.loading = false; state.message = action.payload; },
        deleteReviewFailed(state, action) { state.loading = false; state.error = action.payload; },
    },
});

// --- Actions ---

export const fetchAllBooks = () => async (dispatch) => {
    dispatch(bookSlice.actions.fetchBooksRequest());
    try {
        const res = await axios.get("http://localhost:4000/api/v1/book/all", { withCredentials: true });
        dispatch(bookSlice.actions.fetchBooksSuccess(res.data.books));
    } catch (err) {
        dispatch(bookSlice.actions.fetchBooksFailed(err.response?.data?.message || "Failed to fetch books"));
    }
};

export const addBook = (data) => async (dispatch) => {
    dispatch(bookSlice.actions.addBookRequest());
    try {
        const res = await axios.post("http://localhost:4000/api/v1/book/admin/add", data, {
            withCredentials: true,
            // Header is handled automatically by Axios based on data type (JSON or FormData)
        });
        dispatch(bookSlice.actions.addBookSuccess(res.data.message));
        toast.success(res.data.message);
        dispatch(toggleAddBookPopup());
        dispatch(fetchAllBooks());
    } catch (err) {
        dispatch(bookSlice.actions.addBookFailed(err.response?.data?.message || "Failed to add book"));
        toast.error(err.response?.data?.message || "Failed to add book");
    }
};

export const updateBook = (id, data) => async (dispatch) => {
    dispatch(bookSlice.actions.updateBookRequest());
    try {
        // "Content-Type": "application/json" remove pannaachu. 
        // Ippo image update pannaalum pannalaalum Axios sariyaa data-vai anuppum.
        const res = await axios.put(`http://localhost:4000/api/v1/book/update/${id}`, data, {
            withCredentials: true,
        });
        dispatch(bookSlice.actions.updateBookSuccess(res.data.message));
        toast.success(res.data.message || "Updated Successfully!");
        dispatch(fetchAllBooks()); 
    } catch (err) {
        dispatch(bookSlice.actions.updateBookFailed(err.response?.data?.message || "Update Failed"));
        toast.error(err.response?.data?.message || "Update Failed");
    }
};

export const deleteBook = (id) => async (dispatch) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
        dispatch(bookSlice.actions.deleteBookRequest());
        try {
            const res = await axios.delete(`http://localhost:4000/api/v1/book/delete/${id}`, {
                withCredentials: true,
            });
            dispatch(bookSlice.actions.deleteBookSuccess(res.data.message));
            toast.success(res.data.message || "Book Deleted!");
            dispatch(fetchAllBooks());
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Delete Failed";
            dispatch(bookSlice.actions.deleteBookFailed(errorMsg));
            toast.error(errorMsg);
        }
    }
};

export const createBookReview = (id, reviewData) => async (dispatch) => {
    dispatch(bookSlice.actions.createReviewRequest());
    try {
        const res = await axios.put(`http://localhost:4000/api/v1/book/review/${id}`, reviewData, {
            withCredentials: true,
        });
        dispatch(bookSlice.actions.createReviewSuccess(res.data.message));
        toast.success(res.data.message || "Review Submitted!");
        dispatch(fetchAllBooks()); 
    } catch (err) {
        const errorMsg = err.response?.data?.message || "Failed to submit review";
        dispatch(bookSlice.actions.createReviewFailed(errorMsg));
        toast.error(errorMsg);
    }
};

export const deleteBookReview = (bookId, reviewId) => async (dispatch) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
        dispatch(bookSlice.actions.deleteReviewRequest());
        try {
            const res = await axios.delete(
                `http://localhost:4000/api/v1/book/reviews/delete?bookId=${bookId}&reviewId=${reviewId}`,
                { withCredentials: true }
            );
            dispatch(bookSlice.actions.deleteReviewSuccess(res.data.message));
            toast.success(res.data.message || "Review Deleted!");
            dispatch(fetchAllBooks()); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Delete Failed";
            dispatch(bookSlice.actions.deleteReviewFailed(errorMsg));
            toast.error(errorMsg);
        }
    }
};

export const resetBookSlice = () => (dispatch) => {
    dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;