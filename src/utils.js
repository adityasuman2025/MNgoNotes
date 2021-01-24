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

//for redirecting to the create note screen
export function redirectToCreateNoteScreen(payload) {
    Actions.createNoteScreen(payload);
}

//for redirecting to the view notes screen
export function redirectToViewNotesScreen(payload) {
    Actions.viewNotesScreen(payload);
}

export function goBack() {
    Actions.pop();
    return;
}

//function to validate name, contact no and email
export function validateUsername(name) {
    var re = /^[a-zA-Z0-9_]*$/;
    return re.test(name);
};

export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export function validateContactNo(number) {
    var re = /^[0-9]*$/;
    return re.test(number);
};

//onc clinking on yes btn
export function logOut() {
    try {
        AsyncStorage.removeItem('loggedUserToken');
        Actions.loginScreen();

        return true;
    } catch {
        return false
    }
}