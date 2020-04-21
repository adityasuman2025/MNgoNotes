import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
// import { Form, TextInput } from 'react-native-autofocus';

import { globalStyles } from '../styles/globalStyles';

export default function RegisterForm() 
{
  const [registerInfo, setRegisterInfo] = useState({username: "", email: "", password: "", conf_pass: ""});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [regBtnStatus, setRegBtnStatus] = useState("not_clicked");

//on clciking on register btn
  const registerBtnClickHandler = () =>
  {
    if(regBtnStatus == "clicked") //if btn is already clicked
    {
      setError("hold on!!");
    }
    else
    {
      var username = registerInfo.username.trim();
      var email = registerInfo.email.trim();
      
      var password = registerInfo.password.trim();
      var conf_pass = registerInfo.conf_pass.trim();
     
      if(username != "" && email != "" && password != "" && conf_pass != "")
      {
        if(password == conf_pass)
        {
          setRegBtnStatus("clicked");

          setError("please wait...");

        //posting request to API  
          axios.post('http://mngo.in/notes_api/registerNewUser.php', 
          {
            username: username,
            email: email,
            password: password
          })
          .then(function(response) 
          {
            setRegBtnStatus("not_clicked");

            var data = (response.data).toString();
            // console.log(data);

            if(data == 1)
            {
              setError("");
              setSuccess("sucessfully registered. Please login to continue");
            }
            else if(data == 0)
            {
              setError("failed to register user");
            }
            else if(data == -1)
            {
              setError("something went wrong");
            }
            else if(data == -2)
            {
              setError("this email is already registered");
            }
            else //succesfully logged in
            {
              setError("unknown error");
            }
          })
          .catch(error => 
          {
            setError("please check your internet connection");
          });
        }
        else
        {
          setError("password do not match");
        }    
      }
      else
      {
        setError("please fill all the fields");
      }
    }
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
              placeholder="Username"
              placeholderTextColor = "#d8d8d8"
              selectionColor="#d8d8d8"
              keyboardType="name-phone-pad"
              autoCapitalize = 'none'
              autoFocus
              onChangeText={(username) => setRegisterInfo({username: username, email: registerInfo.email, password: registerInfo.password, conf_pass: registerInfo.conf_pass})}
          />

          <TextInput style={globalStyles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Email"
              placeholderTextColor = "#d8d8d8"
              selectionColor="#d8d8d8"
              keyboardType="email-address"
              autoCapitalize = 'none'
              onChangeText={(email) => setRegisterInfo({username: registerInfo.username, email: email, password: registerInfo.password, conf_pass: registerInfo.conf_pass})}
          />

          <TextInput style={globalStyles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor = "#d8d8d8"
              onChangeText={(password) => setRegisterInfo({username: registerInfo.username, email: registerInfo.email, password: password, conf_pass: registerInfo.conf_pass})}
          />  

          <TextInput style={globalStyles.inputBox} 
              underlineColorAndroid='rgba(0,0,0,0)' 
              placeholder="Confirm Password"
              secureTextEntry={true}
              placeholderTextColor = "#d8d8d8"
              onChangeText={(conf_pass) => setRegisterInfo({username: registerInfo.username, email: registerInfo.email, password: registerInfo.password, conf_pass: conf_pass})}
          />
        </View>
        
        <TouchableOpacity style={globalStyles.loginSignUpBtn} onPress={registerBtnClickHandler}>
          <Text style={globalStyles.buttonText}>Register</Text>
        </TouchableOpacity>

        <Text style={globalStyles.errorText} >{error}</Text>
        <Text style={globalStyles.successText} >{success}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer:
  {
    flex: 6,
    alignItems:'center',
    justifyContent :'center',
    width: '100%',
  },
  
  logoText :
  {
    fontSize: 20,
    color:'#fff'
  },

  signupTextCont : {
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
