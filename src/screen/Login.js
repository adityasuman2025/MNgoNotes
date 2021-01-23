import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';

import { VerifyLogin } from "../apis";
import { makeCookie, redirectToRegisterScreen, redirectToPassCodeScreen } from "../utils";
import { PROJECT_NAME } from '../constants';

import { globalStyles } from '../styles/globalStyles';

export default function Login() {
    const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [showIndicator, setShowIndicator] = useState(false);

    //on clicking on login btn
    async function loginBtnClickHandler() {
        if (!showIndicator) {
            setShowIndicator(true);
            setError("");

            const username = loginInfo.username.trim();
            const password = loginInfo.password.trim();
            if (username !== "" && password !== "") {

                //sending rqst to api
                const response = await VerifyLogin(username, password);
                if (response.statusCode === 200) {
                    const token = response.token;
                    if (token) {
                        const loggedUserToken = await makeCookie("loggedUserToken", token);
                        if (loggedUserToken) {
                            redirectToPassCodeScreen();
                            return;
                        } else {
                            setError("Something went wrong");
                        }
                    } else {
                        setError("Something went wrong");
                    }
                } else {
                    setError(response.msg);
                }
            } else {
                setError("Please fill all the fields");
            }
        }

        setShowIndicator(false);
    }

    //rendering
    return (
        <View style={globalStyles.container}>
            <View style={styles.loginContainer}>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={require('../img/logo.png')}
                />

                <Text style={styles.logoText}>{PROJECT_NAME}</Text>

                <View style={globalStyles.formContainer} >
                    <TextInput style={globalStyles.inputBox}
                        placeholder="Username"
                        placeholderTextColor="#d8d8d8"
                        selectionColor="#1c313a"
                        autoCapitalize='none'
                        autoFocus
                        onChangeText={(val) => setLoginInfo({ username: val, password: loginInfo.password })}
                    />

                    <TextInput style={globalStyles.inputBox}
                        placeholder="Password"
                        placeholderTextColor="#d8d8d8"
                        selectionColor="#1c313a"
                        secureTextEntry={true}
                        onChangeText={(val) => setLoginInfo({ username: loginInfo.username, password: val })}
                    />
                </View>

                <TouchableOpacity style={globalStyles.loginSignUpBtn} onPress={loginBtnClickHandler}>
                    <Text style={globalStyles.buttonText}>Login</Text>
                </TouchableOpacity>

                {
                    showIndicator ?
                        <ActivityIndicator size="large" color="#d8d8d8" />
                        : null
                }

                <Text style={globalStyles.errorText} >{error}</Text>
            </View>

            <View style={styles.signupTextCont}>
                <Text style={styles.signupText}>Don't have an account yet?</Text>
                <TouchableOpacity onPress={redirectToRegisterScreen} >
                    <Text style={styles.signupButton}> Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    logoText: {
        fontSize: 20,
        color: '#fff'
    },

    signupTextCont: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },

    signupText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16
    },

    signupButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    },
});