import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, TextInput } from 'react-native';
import axios from 'axios';
// import { Form, TextInput } from 'react-native-autofocus';

import {Actions} from 'react-native-router-flux';

import { globalStyles } from '../styles/globalStyles';

export default function LoginForm() 
{
  const [loginInfo, setLoginInfo] = useState({email: "", password: ""});
  const [error, setError] = useState("");

  const [loginBtnStatus, setLoginBtnStatus] = useState("not_clicked");

//on clicking on login btn  
  const loginBtnClickHandler = () =>
  {
    if(loginBtnStatus == "clicked") //if btn is already clicked
    {
      setError("hold on!!");
    }
    else
    {
      var email = loginInfo.email.trim();
      var password = loginInfo.password.trim();

      if(email != "" && password != "")
      {
        setError("");

      //posting request to API  
        axios.post('http://mngo.in/notes_api/verifyLogin.php', 
        {
          email: email,
          password: password
        })
        .then(function(response) 
        {
          setLoginBtnStatus("not_clicked");

          var data = (response.data).toString();
          //console.log(data);

          if(data == 0)
          {
            setError("login credentials is not correct");
          }
          else if(data == -1)
          {
            setError("something went wrong");
          }
          else //succesfully logged in
          {
            setLoginBtnStatus("clicked");
            
          //creating cookie  
            AsyncStorage.setItem('logged_user_id', data);
            
          //redirecting to the home page
            var toCarry = {};
            toCarry['logged_user_id'] = data;
            
            Actions.homePage({ toCarry: toCarry });
          }
        })
        .catch(error => 
        {
          setError("please check your internet connection");
        });
      }
      else
      {
        setError("please fill all the fields");
      }
    }
  }

//for redirecting to the register page
  const redirectToRegisterPage = () =>
  {
    Actions.registerPage();
  }

//rendering
  return (
    <View style={globalStyles.container}>
      <View style={styles.loginContainer}>
        <Image
          style={{width:100, height: 100}}
          source={require('../img/logo.png')}
        />
          
        <Text style={styles.logoText}>MNgo Notes</Text> 

        <View style={globalStyles.formContainer} >
           <TextInput style={globalStyles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Email"
              placeholderTextColor = "#d8d8d8"
              selectionColor="#d8d8d8"
              keyboardType="email-address"
              autoCapitalize = 'none'
              autoFocus
              onChangeText={(val) => setLoginInfo({email: val, password: loginInfo.password})}
          />

          <TextInput style={globalStyles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "#d8d8d8"
              onChangeText={(val) => setLoginInfo({email: loginInfo.email, password: val})}
          />   
        </View>

        <TouchableOpacity style={globalStyles.loginSignUpBtn} onPress={loginBtnClickHandler}>
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>

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
  loginContainer:
  {
    flex: 10,
    alignItems:'center',
    justifyContent :'center',
    width: '100%',
  },
  
  logoText :
  {
    fontSize: 20,
    color:'#fff'
  },

  signupTextCont : 
  {
    flex: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },

  signupText: {
    color:'rgba(255,255,255,0.6)',
    fontSize:16
  },

  signupButton: {
    color:'#ffffff',
    fontSize:16,
    fontWeight:'500'
  },
});
