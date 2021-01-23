import AsyncStorage from '@react-native-async-storage/async-storage';

//function to get cookie value
export function getCookieValue(name) {
    let toReturn = null;
    try {
        AsyncStorage.getItem(name).then((value) => {
            if (value != null) {
                toReturn = value.trim();
            }
        });
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
};
