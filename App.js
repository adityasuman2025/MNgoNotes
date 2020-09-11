import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';

import Routes from './routes/routes';

export default function App(){
  return (
    <TouchableWithoutFeedback onPress={() => {
    //to remove the keyboard from screen when anywhere instead of textInput field is pressed  
      Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#374c56" translucent = {true}/>
        <Routes />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#455a64',
  },
});
