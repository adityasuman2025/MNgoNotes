import AsyncStorage from '@react-native-async-storage/async-storage';
import { Actions } from 'react-native-router-flux';

//function to get cookie value
export async function getCookieValue(key) {
    let toReturn = null;
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            toReturn = await value;
        }
    } catch {
        toReturn = null;
    }

    return toReturn;
}

//function to set cookie 
export function makeCookie(key, value) {
    try {
        AsyncStorage.setItem(key, value);

        return true;
    } catch {
        return false;
    }
}

//for redirecting to the register screen
export function redirectToRegisterScreen() {
    Actions.registerScreen();
}

//for redirecting to the passCode screen
export function redirectToPassCodeScreen() {
    Actions.passCodeScreen();
}

//for redirecting to the home screen
export function redirectToHomeScreen() {
    Actions.homeScreen();
}
