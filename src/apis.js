import axios from "axios";

import { AUTH_API_URL_ADDRESS, API_URL_ADDRESS } from "./constants"

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
        return { msg: "API Connection Failed" };
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
        return { msg: "API Connection Failed" };
    }
}