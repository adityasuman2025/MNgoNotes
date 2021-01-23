import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';

import { PROJECT_NAME } from '../constants';

export default function AppLogo({
    isLandingScreen,
    displayIndicator
}) {
    return (
        <View style={styles.loginContainer}>
            <Image
                style={
                    isLandingScreen ?
                        { width: 150, height: 150 }
                        :
                        { width: 100, height: 100 }
                }
                source={require('../img/logo.png')}
            />

            <Text
                style={
                    isLandingScreen ?
                        styles.bigLogoText
                        :
                        styles.logoText
                }
            >
                {PROJECT_NAME}
            </Text>

            {
                displayIndicator ?
                    <ActivityIndicator
                        size="large"
                        color="#d8d8d8"
                        style={styles.loader}
                    />
                    : null
            }
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

    bigLogoText: {
        fontSize: 23,
        color: '#fff'
    },

    loader: {
        marginTop: 30,
    }
});