import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
    name: "popup",
    initialState: {
        settingPopup: false,
        addBookPopup: false,
        readBookPopup: false,
        recordBookPopup: false,
        returnBookPopup: false, 
        addNewAdminPopup: false,
        updateBookPopup: false,
        addFinePopup: false, 
        updateProfilePopup: false,
        broadcastPopup: false, 
        fineNotificationPopup: false, 
    },
    reducers: {
        toggleSettingPopup: (state) => {
            state.settingPopup = !state.settingPopup;
        },
        toggleAddBookPopup: (state) => {
            state.addBookPopup = !state.addBookPopup;
        },
        toggleReadBookPopup: (state) => {
            state.readBookPopup = !state.readBookPopup;                
        },   
        toggleRecordBookPopup: (state) => {
            state.recordBookPopup = !state.recordBookPopup;                
        },
        toggleReturnBookPopup: (state) => {
            state.returnBookPopup = !state.returnBookPopup;                
        },
        toggleAddNewAdminPopup: (state) => {
            state.addNewAdminPopup = !state.addNewAdminPopup;                
        },
        toggleUpdateBookPopup: (state) => {
            state.updateBookPopup = !state.updateBookPopup;                
        },
        toggleUpdateProfilePopup: (state) => { 
            state.updateProfilePopup = !state.updateProfilePopup;
        },
        toggleAddFinePopup: (state) => {
            state.addFinePopup = !state.addFinePopup;
        },
        toggleBroadcastPopup: (state) => {
            state.broadcastPopup = !state.broadcastPopup;
        },
       
        toggleFineNotificationPopup: (state) => {
            state.fineNotificationPopup = !state.fineNotificationPopup;
        },
        closeAllPopups: (state) => {
            state.settingPopup = false;
            state.addBookPopup = false;
            state.readBookPopup = false;
            state.recordBookPopup = false;
            state.returnBookPopup = false; 
            state.addNewAdminPopup = false; 
            state.updateBookPopup = false;
            state.addFinePopup = false;
            state.updateProfilePopup = false;
            state.broadcastPopup = false;
            state.fineNotificationPopup = false; 
                },
    }
});

export const { 
    toggleSettingPopup, 
    toggleAddBookPopup, 
    toggleReadBookPopup, 
    toggleRecordBookPopup, 
    toggleReturnBookPopup, 
    toggleAddNewAdminPopup, 
    toggleUpdateBookPopup,
    toggleUpdateProfilePopup, 
    toggleAddFinePopup, 
    toggleBroadcastPopup,
    toggleFineNotificationPopup, 
    closeAllPopups
} = popupSlice.actions;

export default popupSlice.reducer;