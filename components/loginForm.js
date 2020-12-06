import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';

import { auth_api_url_address, api_url_address } from "../constants";

import { globalStyles } from '../styles/globalStyles';

export default function LoginForm() {
    const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loginBtnStatus, setLoginBtnStatus] = useState("not_clicked");
    const [showIndicator, setShowIndicator] = useState(false);

    //on clicking on login btn
    function loginBtnClickHandler() {
        if (loginBtnStatus == "clicked") {
            //if btn is already clicked
            setError("hold on!!");
        } else {
            const username = loginInfo.username.trim();
            const password = loginInfo.password.trim();

            if (username != "" && password != "") {
                setShowIndicator(true); //display loading animation
                setError("");

                //posting request to API
                const api_end_point = auth_api_url_address + "verify_user.php";
                axios.post(api_end_point, {
                    username: username,
                    password: password
                })
                    .then(function(response) {
                        setLoginBtnStatus("not_clicked");

                        const resp = (response.data);
                        if (resp.statusCode === 200) {
                            const data = resp.data;
                            //succesfully logged in
                            setShowIndicator(false); //hiding loading animation
                            setLoginBtnStatus("clicked");

                            //creating cookie
                            AsyncStorage.setItem('logged_user_id', data.id);

                            //redirecting to the home page
                            let toCarry = {
                                logged_user_id: data.id,
                            };
                            Actions.passCode({ toCarry: toCarry });
                        } else {
                            setShowIndicator(false); //hiding loading animation
                            setError(resp.msg);
                        }
                    })
                    .catch(error => {
                        setShowIndicator(false); //hiding loading animation
                        setError("please check your internet connection");
                    });
            } else {
                setShowIndicator(false); //hiding loading animation
                setError("please fill all the fields");
            }
        }
    }

    //for redirecting to the register page
    function redirectToRegisterPage() {
        Actions.registerPage();
    }

    //rendering
    return (
        <View style={globalStyles.container}>
            <View style={styles.loginContainer}>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={require('../img/logo.png')}
                />

                <Text style={styles.logoText}>MNgo Notes</Text>

                <View style={globalStyles.formContainer} >
                    <TextInput style={globalStyles.inputBox}
                        placeholder="Username"
                        placeholderTextColor="#d8d8d8"
                        selectionColor="#1c313a"
                        // keyboardType="email-address"
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
                <TouchableOpacity onPress={redirectToRegisterPage} >
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