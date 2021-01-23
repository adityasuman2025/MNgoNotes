import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator } from 'react-native';

import Header from '../components/header';
import { getCookieValue, redirectToHomeScreen } from '../utils';
import { VerifyPassCode } from "../apis";
import { toast } from '../components/toast';

import { globalStyles } from '../styles/globalStyles';

export default function PassCode() {
    const [loggedUserToken, setLoggedUserToken] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);
    const [error, setError] = useState("");
    const [enteredPassCode, setEnteredPassCode] = useState("");

    useEffect(() => {
        (async () => {
            const loggedUserTokenCookie = await getCookieValue("loggedUserToken");
            if (loggedUserTokenCookie) {
                setLoggedUserToken(loggedUserTokenCookie);
            }
        })();
    }, [])

    //when pass code is entered
    useEffect(() => {
        if (enteredPassCode.length === 4) {
            setShowIndicator(true);

            //checking if someone is logged or not
            if (loggedUserToken) {
                var passCodeOf = "passCodeOf_" + loggedUserToken;

                //looking for pass code in cookies
                (async () => {
                    const passCode = await getCookieValue(passCodeOf);
                    if (passCode) {
                        console.log("pass code verified from cookie");

                        if (passCode === enteredPassCode) {
                            redirectToHomeScreen();
                            return;
                        } else {
                            toast("Wrong pass code");
                        }
                    } else {
                        console.log("pass code verified from api");
                    }
                })();
            } else {
                toast("You are not logged in");
            }
        } else {
            setError("");
        }

        setShowIndicator(false);
    }, [enteredPassCode]);

    //rendering
    return (
        <View style={globalStyles.container}>
            <Header toCarry={{ title: "MNgo Notes" }} />
            {
                showIndicator ?
                    <ActivityIndicator size="large" color="#d8d8d8" />
                    : null
            }

            <View style={styles.loginContainer}>
                <Text style={styles.logoText}>Enter Your Pass Code</Text>
                <TextInput style={[globalStyles.inputBox, styles.inputBox]}
                    placeholder="Pass Code"
                    placeholderTextColor="#d8d8d8"
                    selectionColor="#1c313a"
                    secureTextEntry={true}
                    autoFocus
                    keyboardType="number-pad"
                    maxLength={4}
                    onChangeText={(val) => setEnteredPassCode(val)}
                />

                <Text style={globalStyles.errorText} >{error}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    logoText: {
        fontSize: 15,
        color: '#fff'
    },

    inputBox: {
        width: 200,
        textAlign: "center",
    },
});
