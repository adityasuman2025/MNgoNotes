import {
    ToastAndroid,
    Platform,
    AlertIOS,
} from 'react-native';

const toast = (msg: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        AlertIOS.alert(msg);
    }
}

export { toast };