import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
// import { Form, TextInput } from 'react-native-autofocus';

import { globalStyles } from '../styles/globalStyles';

export default function RegisterForm() 
{
  const [registerInfo, setRegisterInfo] = useState({
    username: "", 
    email: "", 
    password: "", 
    conf_pass: "",
    pass_code: "",
    conf_pass_code: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [regBtnStatus, setRegBtnStatus] = useState("not_clicked");

//function to validate username and email
  const validateUsername = ( username ) => {
    var re = /^[a-zA-Z0-9_]*$/;
      return re.test( username );
  };

  const validateEmail = ( email ) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

//on clciking on register btn
  const registerBtnClickHandler = () =>
  {
    if(regBtnStatus == "clicked") //if btn is already clicked
    {
      setError("hold on!!");
    }
    else
    {
      var username      = registerInfo.username.trim();
      var email         = registerInfo.email.trim();
      
      var password      = registerInfo.password.trim();
      var conf_pass     = registerInfo.conf_pass.trim();

      var pass_code     = registerInfo.pass_code;
      var conf_pass_code= registerInfo.conf_pass_code;
     
      if( username != "" && email != "" && password != "" && conf_pass != "" && pass_code != "" && conf_pass_code != "" )
      {
        if( pass_code !== conf_pass_code ) {
          setError("pass code do not match");
          return;
        }

        if( pass_code.length !== 4 ) {
          setError("pass code must be 4 digits long");
          return;
        }

        if(password == conf_pass)
        {
        //validating username and email
          if( !validateUsername( username ) ) {
            setError("username cannot contain symbol and spaces");        
            return;
          }

          if( !validateEmail( email ) ) {
            setError("invalid email id format");        
            return;
          }

          setRegBtnStatus("clicked");

          setError("please wait...");

        //posting request to API  
          axios.post('http://mngo.in/notes_api/registerNewUser.php', 
          {
            username: username,
            email: email,
            password: password,
            passcode: pass_code,
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
              setError("this email or username is already registered");
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
              placeholder="Username"
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              keyboardType="name-phone-pad"
              autoCapitalize = 'none'
              autoFocus
              onChangeText={(username) => 
                setRegisterInfo({
                  username: username, 
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
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              keyboardType="email-address"
              autoCapitalize = 'none'
              onChangeText={(email) => 
                setRegisterInfo({
                  username: registerInfo.username, 
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
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              onChangeText={(password) => 
                setRegisterInfo({
                  username: registerInfo.username, 
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
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              onChangeText={(conf_pass) => 
                setRegisterInfo({
                  username: registerInfo.username, 
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
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              keyboardType="number-pad"
              maxLength={ 4 }
              onChangeText={(pass_code) => 
                setRegisterInfo({
                  username: registerInfo.username, 
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
              placeholderTextColor = "#d8d8d8"
              selectionColor="#1c313a"
              keyboardType="number-pad"
              maxLength={ 4 }
              onChangeText={(conf_pass_code) => 
                setRegisterInfo({
                  username: registerInfo.username, 
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
