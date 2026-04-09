import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";  
import { toggleRecordBookPopup } from "./popUpSlice";

const API_URL = import.meta.env.VITE_API_URL;

const borrowSlice = createSlice({

    name: "borrow",
    initialState: {
        loading: false,
        error: null,
        userBorrowedBooks: [],
        allBorrowedBooks: [],
        message: null,
    },
reducers: {
    fetchUserBorrowedBooksRequest(state) {
        state.loading = true;
        state.error = null;
        state.message = null;
    },
    fetchUserBorrowedBooksSucess(state, action) {
        state.loading = false;
        state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed(state, action) {
        state.loading=false;
        state.error = action.payload;
    },
    recordBookRequest(state){
        state.loading = true,
        state.error = null;
        state.message = null;
    },
    recordBookSuccess(state,action) {
        state.loading = false;
        state.message = action.payload;

    },
    recordBookFailed(state,action) {
        state.loading = false;
        state.error =  action.payload;
        state.message= null;
    },
    fetchAllBorrowedBooksRequest(state) {
        state.loading = true;
        state.error = null;
        state.message = null;
    },
    fetchAllBorrowedBooksSucess(state, action) {
        state.loading = false;
        state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed(state, action) {
        state.loading=false;
        state.error = action.payload;
    },
     returnBookReuest(state){
        state.loading = true,
        state.error = null;
        state.message = null;
    },
    returnBookSuccess(state,action) {
        state.loading = false;
        state.message = action.payload;

    },
    returnBookFailed(state,action) {
        state.loading = false;
        state.error =  action.payload;
        state.message= null;
    },
    resetBorrowSlice(state){
        state.loading = false;
        state.error = null;
        state.message = null;
    },
},

});

 export const fetchUserBorrowedBooks = () => async(dispatch) => {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
 await axios.get(`${API_URL}/borrow/my-borrowed-books`,
     {withCredentials: true })
.then((res) => { dispatch(
    borrowSlice.actions.fetchUserBorrowedBooksSucess(res.data.borrowedBooks));
}).catch((err) => {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(err.response.data.message))
});

};


export const fetchAllBorrowedBooks = () => async(dispatch) => {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
 await axios.get(`${API_URL}/borrow/borrowed-books-by-users`, 
    {withCredentials: true })
.then((res) => { dispatch(
    borrowSlice.actions.fetchAllBorrowedBooksSucess(res.data.borrowedBooks));
}).catch((err) => {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(err.response.data.message))
});

};

export const recordBorrowBook = (email, id) => async(dispatch) => {
    dispatch(borrowSlice.actions.recordBookRequest());
 await axios.post(`${API_URL}/borrow/record-borrow-book/${id}`, 
    {email},{withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
     })
.then((res) => { 
    dispatch(
    borrowSlice.actions.recordBookSuccess(res.data.message));
}).catch((err) => {
    // The 3 books limit error message is caught here
    dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message))
    dispatch(toggleRecordBookPopup());
});

};


export const returnBook = (email, id) => async(dispatch) => {
    dispatch(borrowSlice.actions.returnBookReuest());
 await axios.put(`${API_URL}/borrow/return-borrowed-book/${id}`, 
    {email},{withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
     })
.then((res) => { 
    dispatch(
    borrowSlice.actions.returnBookSuccess(res.data.message));
}).catch((err) => {
    dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message))
});

};


export const resetBorrowSlice = () => async(dispatch) => {
    dispatch(borrowSlice.actions.resetBorrowSlice());
};

export default borrowSlice.reducer;
