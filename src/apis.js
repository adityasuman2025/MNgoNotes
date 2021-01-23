import axios from "axios";

import { AUTH_API_URL_ADDRESS, API_URL_ADDRESS } from "./constants"

export async function VerifyLogin(username, password) {
    try {
        const requestAddress = AUTH_API_URL_ADDRESS + "verify_user.php";
        const response = await axios.post(requestAddress, {
            username: username,
            password: password,
        });

        const data = (response.data);
        return data;
    } catch {
        return { msg: "API Connection Failed" };
    }
}