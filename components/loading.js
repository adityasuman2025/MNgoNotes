import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { usePromiseTracker } from "react-promise-tracker";
const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        <View pointerEvents="none" style={ promiseInProgress || props.visible ? styles.container:styles.containerHidden }>         
            { promiseInProgress && <ActivityIndicator size="large" color="#0000ff" /> }
        </View>
    );  
}
const LoadingIndicatorDark = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        <View pointerEvents="none" style={ promiseInProgress || props.visible ? styles.containerDark:styles.containerHidden }>         
            { promiseInProgress && <ActivityIndicator size="large" color="#0000ff" /> }
        </View>
    );  
}
const LoadingIndicatorLight = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        <View pointerEvents="none" style={ promiseInProgress || props.visible ? styles.containerLight:styles.containerHidden }>         
            { promiseInProgress && <ActivityIndicator size="large" color="#0000ff" /> }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 999,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99,
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 999,
        
    },
    containerDark: {
        flex: 999,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99,
        backgroundColor: 'black',
        opacity: 1,
        zIndex: 999,
        
    },
    containerLight: {
        flex: 999,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99,
        backgroundColor: 'white',
        opacity: 1,
        zIndex: 999,
        
    },
    containerHidden: {
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        textAlign: 'center',
        zIndex: -1,
    },
});

export { LoadingIndicator, LoadingIndicatorDark, LoadingIndicatorLight };