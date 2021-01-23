import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';

import { registerNewUser } from "../apis";
import { validateUsername, validateEmail, validateContactNo } from "../utils";
import { PROJECT_NAME } from '../constants';

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
    const [showIndicator, setShowIndicator] = useState(false);

    //on clciking on register btn
    async function registerBtnClickHandler() {
        if (!showIndicator) {
            setShowIndicator(true);
            setError("");
            setSuccess("");

            const username = registerInfo.username.trim();
            const name = registerInfo.name.trim();
            const email = registerInfo.email.trim();

            const password = registerInfo.password.trim();
            const confPassword = registerInfo.conf_pass.trim();

            const passCode = registerInfo.pass_code;
            const confPassCode = registerInfo.conf_pass_code;

            if (username !== "" && name != "" && email !== "" && password !== "" && confPassword !== "" && passCode !== "" && confPassCode !== "") {
                if (!validateUsername(username)) {
                    setShowIndicator(false);
                    setError("Username cannot contain symbol and spaces");
                    return;
                }

                if (!validateEmail(email)) {
                    setShowIndicator(false);
                    setError("Invalid email id format");
                    return;
                }

                if (password !== confPassword) {
                    setShowIndicator(false);
                    setError("Password do not match");
                    return;
                }

                if (passCode !== confPassCode) {
                    setShowIndicator(false);
                    setError("Pass code do not match");
                    return;
                }

                if (passCode.length !== 4) {
                    setShowIndicator(false);
                    setError("Pass code must be 4 digits long");
                    return;
                }

                if (!validateContactNo(passCode)) {
                    setShowIndicator(false);
                    setError("Pass code must be numeric");
                    return;
                }

                //sending rqst to api
                const response = await registerNewUser(username, name, email, password, passCode);
                if (response.statusCode === 200) {
                    setError("");
                    setSuccess("Sucessfully registered. Please Login to continue", "success");
                } else {
                    setError(response.msg);
                }
            } else {
                setError("Please fill all details");
            }
        }

        setShowIndicator(false);
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

                    <Text style={styles.logoText}>{PROJECT_NAME}</Text>

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
                                    ...registerInfo,
                                    username: username,
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
                                    ...registerInfo,
                                    name: name,
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
                                    ...registerInfo,
                                    email: email,
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
                                    ...registerInfo,
                                    password: password,
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
                                    ...registerInfo,
                                    conf_pass: conf_pass,
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
                                    ...registerInfo,
                                    pass_code: pass_code,
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
                                    ...registerInfo,
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