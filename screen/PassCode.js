import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';

import Header from '../components/header';
import { toast } from '../components/toast';
import { api_url_address } from "../constants";

import { globalStyles } from '../styles/globalStyles';

export default function PassCode({toCarry}) 
{
  const logged_user_id = toCarry.logged_user_id;

  const [showIndicator, setShowIndicator] = useState(false);
  const [error, setError] = useState("");
  const [enteredPassCode, setEnteredPassCode] = useState("");

//when pass code is entered
    useEffect(() => {
    //verifying entered pass cpde
        const enteredPassCodeLength = enteredPassCode.length;
        if( enteredPassCodeLength === 4 ) {
        //if entered pass code is 4 digits long
            setShowIndicator(true); //displaying loading animation

        //checking if someone is logged or not
            if(logged_user_id === "") {
                toast("you are not logged in");
            } else {
                var user_id = logged_user_id;       
                var user_pass_code_of = "user_pass_code_of_" + user_id;

            //looking for pass code in cookies  
                AsyncStorage.getItem(user_pass_code_of).then((val) => {
                    if( val != null ) {
                        console.log("pass code verified from cookie");
                        setShowIndicator(false); //hiding loading animation

                        if( val === enteredPassCode ) {
                        //redirecting to the home page
                            var toCarry = {};
                            toCarry['logged_user_id'] = user_id;
                            
                            Actions.homePage({ toCarry: toCarry });
                        } else {
                            setError("wrong pass code");
                        }
                    } else {
                        console.log("pass code verified from api");

                    //sending rqst to api for verifiying pass code
                        const api_end_point = api_url_address + "verifyPassCode.php";
                        axios.post( api_end_point, {
                            user_id: user_id,
                            passcode: enteredPassCode,
                        }).then(function(response) {
                            setShowIndicator(false); //hiding loading animation

                            var data = (response.data).toString();
                            if(data == 0) {
                                setError("wrong pass code");
                            } else if( data == 1) {
                            //creating cookie  
                                AsyncStorage.setItem(user_pass_code_of, enteredPassCode);

                            //redirecting to the home page
                                var toCarry = {};
                                toCarry['logged_user_id'] = user_id;
                                
                                Actions.homePage({ toCarry: toCarry });
                            } else {
                                setError("something went wrong");
                            }
                        }).catch(error => {
                            setShowIndicator(false); //hiding loading animation
                            toast("please check your internet connection");
                        });
                    }  
                });
            }
        } else {
            setShowIndicator(false); //hiding loading animation
            setError("");
        }
    }, [enteredPassCode]);
  
//rendering
  return (
    <View style={globalStyles.container}>
        <Header toCarry={ {title: "MNgo Notes"} } />
        {
            showIndicator ?
            <ActivityIndicator size="large" color="#d8d8d8" />
            : null
        }

        <View style={styles.loginContainer}>
            <Text style={styles.logoText}>Enter Your Pass Code</Text> 
            <TextInput style={[ globalStyles.inputBox, styles.inputBox ]}
                placeholder="Pass Code"
                placeholderTextColor = "#d8d8d8"
                selectionColor="#1c313a"
                secureTextEntry={true}
                autoFocus
                keyboardType="number-pad"
                maxLength={ 4 }
                onChangeText={(val) => setEnteredPassCode(val)}
            />

            <Text style={globalStyles.errorText} >{error}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    loginContainer:
    {
      flex: 1,
      alignItems:'center',
      justifyContent :'center',
      width: '100%',
    },

    logoText :
    {
        fontSize: 15,
        color:'#fff'
    },

    inputBox: {
        width: 200,
        textAlign: "center",
    },
});