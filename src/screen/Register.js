import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { auth_api_url_address } from "../constants";

import { globalStyles } from '../styles/globalStyles';

export default function Register() {
    const [registerInfo, setRegisterInfo] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        conf_pass: "",
        pass_code: "",
        conf_pass_code: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [regBtnStatus, setRegBtnStatus] = useState("not_clicked");
    const [showIndicator, setShowIndicator] = useState(false);

    //function to validate username and email
    function validateUsername(username) {
        const re = /^[a-zA-Z0-9_]*$/;
        return re.test(username);
    }

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //on clciking on register btn
    function registerBtnClickHandler() {
        if (regBtnStatus == "clicked") {
            //if btn is already clicked
            setError("hold on!!");
        } else {
            const username = registerInfo.username.trim();
            const name = registerInfo.name.trim();
            const email = registerInfo.email.trim();

            const password = registerInfo.password.trim();
            const conf_pass = registerInfo.conf_pass.trim();

            const passcode = registerInfo.pass_code;
            const conf_pass_code = registerInfo.conf_pass_code;

            if (username != "" && name != "" && email != "" && password != "" && conf_pass != "" && passcode != "" && conf_pass_code != "") {
                //validating username and email
                if (!validateUsername(username)) {
                    setError("username cannot contain symbol and spaces");
                    return;
                }

                if (!validateEmail(email)) {
                    setError("invalid email id format");
                    return;
                }

                if (password != conf_pass) {
                    setError("password do not match");
                    return;
                }

                if (passcode != conf_pass_code) {
                    setError("pass code do not match");
                    return;
                }

                if (passcode.length !== 4) {
                    setError("pass code must be 4 digits long");
                    return;
                }

                setRegBtnStatus("clicked");
                setSuccess("");
                setShowIndicator(true); //display loading animation

                //posting request to API
                const api_end_point = auth_api_url_address + "register_user.php";
                axios.post(api_end_point, {
                    username,
                    name,
                    email,
                    password,
                    passcode,
                    registeringFor: "NotesApp",
                })
                    .then(function(response) {
                        setRegBtnStatus("not_clicked");

                        const resp = (response.data);
                        if (resp.statusCode === 200) {
                            setShowIndicator(false); //hiding loading animation
                            setError("");
                            setSuccess("sucessfully registered. Please login to continue");
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

    //rendering
    return (
        <View style={globalStyles.container}>
            <ScrollView style={styles.scroll}>
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
                            keyboardType="name-phone-pad"
                            autoCapitalize='none'
                            autoFocus
                            onChangeText={(username) =>
                                setRegisterInfo({
                                    username: username,
                                    name: registerInfo.name,
                                    email: registerInfo.email,
                                    password: registerInfo.password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Name"
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            keyboardType="name-phone-pad"
                            autoCapitalize='words'
                            onChangeText={(name) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: name,
                                    email: registerInfo.email,
                                    password: registerInfo.password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Email"
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            keyboardType="email-address"
                            autoCapitalize='none'
                            onChangeText={(email) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: registerInfo.name,
                                    email: email,
                                    password: registerInfo.password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Password"
                            secureTextEntry={true}
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            onChangeText={(password) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: registerInfo.name,
                                    email: registerInfo.email,
                                    password: password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            onChangeText={(conf_pass) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: registerInfo.name,
                                    email: registerInfo.email,
                                    password: registerInfo.password,
                                    conf_pass: conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Pass Code"
                            secureTextEntry={true}
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            keyboardType="number-pad"
                            maxLength={4}
                            onChangeText={(pass_code) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: registerInfo.name,
                                    email: registerInfo.email,
                                    password: registerInfo.password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: pass_code,
                                    conf_pass_code: registerInfo.conf_pass_code,
                                })
                            }
                        />

                        <TextInput style={globalStyles.inputBox}
                            placeholder="Confirm Pass Code"
                            secureTextEntry={true}
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            keyboardType="number-pad"
                            maxLength={4}
                            onChangeText={(conf_pass_code) =>
                                setRegisterInfo({
                                    username: registerInfo.username,
                                    name: registerInfo.name,
                                    email: registerInfo.email,
                                    password: registerInfo.password,
                                    conf_pass: registerInfo.conf_pass,
                                    pass_code: registerInfo.pass_code,
                                    conf_pass_code: conf_pass_code,
                                })
                            }
                        />
                    </View>

                    <TouchableOpacity style={globalStyles.loginSignUpBtn} onPress={registerBtnClickHandler}>
                        <Text style={globalStyles.buttonText}>Register</Text>
                    </TouchableOpacity>

                    {
                        showIndicator ?
                            <ActivityIndicator size="large" color="#d8d8d8" />
                            : null
                    }

                    <Text style={globalStyles.errorText} >{error}</Text>
                    <Text style={globalStyles.successText} >{success}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scroll: {
        width: "100%",
        flex: 1,
    },

    loginContainer: {
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
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