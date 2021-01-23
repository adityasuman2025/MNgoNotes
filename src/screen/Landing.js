import React from 'react';
import { View } from 'react-native';

import AppLogo from "../components/AppLogo";

import { globalStyles } from '../styles/globalStyles';

export default function Landing() {
    return (
        <View style={globalStyles.container}>
            <AppLogo
                isLandingScreen
                displayIndicator
            />
        </View>
    );
}