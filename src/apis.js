import axios from "axios";

import {
    AUTH_API_URL_ADDRESS,
    API_URL_ADDRESS,
    NO_INTERNET_ERROR,
} from "./constants";

export async function VerifyLogin(username, password) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_user.php";
        const response = await axios.post(requestAddress, {
            username,
            password,
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function VerifyPassCode(logged_user_token, passcode) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_passcode.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            passcode,
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function registerNewUser(username, name, email, password, passcode) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "register_user.php";
        const response = await axios.post(requestAddress, {
            username,
            name,
            email,
            password,
            passcode,
            registeringFor: "NotesApp",
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function getUserNotes(logged_user_token) {
    try {
        const requestAddress = API_URL_ADDRESS + "get_user_notes.php";
        const response = await axios.post(requestAddress, {
            logged_user_token
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function getListDataOfANote(logged_user_token, encrypted_notes_id) {
    try {
        const requestAddress = API_URL_ADDRESS + "get_note_list_data.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            encrypted_notes_id,
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function deleteNotesListDataItem(logged_user_token, note_list_id) {
    try {
        const requestAddress = API_URL_ADDRESS + "delete_note_list_data_item.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            note_list_id
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function deleteANote(logged_user_token, encrypted_notes_id) {
    try {
        const requestAddress = API_URL_ADDRESS + "delete_note.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            encrypted_notes_id
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function updateNotesListData(logged_user_token, encrypted_notes_id, notesData_db, notesOldList_db) {
    try {
        const requestAddress = API_URL_ADDRESS + "update_note.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            encrypted_notes_id,
            notesData_db,
            notesOldList_db
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}

export async function addUserNotes(logged_user_token, notesData, notesList) {
    try {
        const requestAddress = API_URL_ADDRESS + "create_note.php";
        const response = await axios.post(requestAddress, {
            logged_user_token,
            notesData,
            notesList
        });

        const data = (response.data);
        return data;
    } catch {
        return { statusCode: 600, msg: NO_INTERNET_ERROR };
    }
}