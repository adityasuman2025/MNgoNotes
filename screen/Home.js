import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, AsyncStorage, Image } from 'react-native';
import axios from 'axios';

import {Actions} from 'react-native-router-flux';

import { globalStyles } from '../styles/globalStyles';
import Header from '../components/header';
import CreateNotesArea from '../components/createNotesArea';

export default function Home({toCarry}) 
{
  const logged_user_id = toCarry.logged_user_id;
  // console.log("in Home page: " + logged_user_id);

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(""); 

//checking if someone is logged or not
//before loading that user's data
  if(logged_user_id == "")
  {
    setError("you are not logged in");
  }
  else
  {
    var user_id = logged_user_id;       
    var user_notes_of = "user_notes_of_" + user_id;

  //looking for user notes data in cookies  
    AsyncStorage.getItem(user_notes_of).then((val) =>
    {
      if(val != null) //if some data exist in cookies then loading in flatlist
      {           
        var data = JSON.parse(val);          
        setNotes(data);
        // console.log("cokkie found");
      }
      else
      {
        // console.log("cokkie not found");
      //posting request to API for getting user notes data from server and storing it as cookies
        axios.post('http://mngo.in/notes_api/getUserNotes.php', 
        {
          user_id: user_id
        })
        .then(function(response) 
        {
          try
          {
            var data = response.data;
            var dataString = JSON.stringify((response.data));
            // console.log(dataString);

            if(dataString == 0)
            {
              setError("failed to fetch data");
            }
            else if(dataString == -1)
            {
              setError("something went wrong");
            }
            else //some data is there
            {
              AsyncStorage.setItem(user_notes_of, dataString);
              Actions.refresh();                
            }
          }
          catch
          {
            setError("failed to get your updated data");
          }          
        })
        .catch(error => 
        {
          setError("please check your internet connection");
        });      
      }  
    });
  }

//on clicking on any notes
  const onClickingOnAnyNotes = (item) =>
  {
    setError("please wait...");

    var toCarry = {};
    toCarry['logged_user_id'] = logged_user_id;
    toCarry['notes_id'] = item.notes_id;
    toCarry['title'] = item.title;
    toCarry['type'] = item.type;    

//loading notes list data from internet
    axios.post('http://mngo.in/notes_api/getListDataOfANote.php', 
    {
      notes_id: item.notes_id
    })
    .then(function(response) 
    {
      var data = response.data;
      var dataString = JSON.stringify((response.data));

      if(dataString == 0)
      {
        setError("failed to fetch data");
      }
      else if(dataString == -1)
      {
        setError("something went wrong");
      }
      else //some data is there
      {
        try
        {
          setError("");
         
        //making cookie of that notes_id list
          var user_notes_list_data = logged_user_id + "_list_data_for_notes_id_" + item.notes_id;
          AsyncStorage.setItem(user_notes_list_data, dataString);

        //redirecting to notes view page  
          toCarry['notesOldList'] = dataString;
          Actions.ViewNotesPage({ toCarry: toCarry });
        }
        catch(error)
        {
          setError("failed to get your updated data");
        } 
      }
    })
    .catch(error => 
    {
    //looking for user notes list in cookies if internet not available
      var user_notes_list_data = logged_user_id + "_list_data_for_notes_id_" + item.notes_id;
      AsyncStorage.getItem(user_notes_list_data).then((val) =>
      {
        if(val != null) //if some data exist in cookies then loading in flatlist
        {           
          setError("");
          
          toCarry['notesOldList'] = val;
          Actions.ViewNotesPage({ toCarry: toCarry });   
        }
        else
        {
           setError("please check your internet connection");
        }
      });  
    }); 
  }

//rendering
  return (
    <View style={globalStyles.container}>
      <Header toCarry={ {title: "MNgo Notes"} } />     
      <FlatList 
        style = {styles.list}
        data={notes}
        keyExtractor ={(item) => item.notes_id }
        renderItem = {({item}) => (
          <TouchableOpacity style={styles.box} onPress={() => onClickingOnAnyNotes(item)}>
            <Image 
                source={item.type == 1 ? require('../img/notes_icon.png'): require('../img/todos_icon.png')} 
                style={styles.icon} 
              />
            <View>
              <Text style={styles.listText} >{ item.title }</Text>
              <Text style={styles.listType} >{ item.type == 1 ? "text" : "checkbox" } </Text>
            </View>            
          </TouchableOpacity>
        )}
      />

      <Text style={globalStyles.errorText} >{error}</Text>
      <CreateNotesArea toCarry = {{logged_user_id: logged_user_id}} />
    </View>
  );
}

const styles = StyleSheet.create({
  list:
  {
    width: '100%',
    height: '110%',
  },

  box:
  {
    backgroundColor: '#1c313a',
    borderColor: '#3d4e56',
    borderWidth: 1,
    padding: 15,
    flexDirection: 'row',
    margin: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  icon:
  {
    height: 75,
    width: 60,
    tintColor: '#d8d8d8',
    marginRight: 10,
  },

  listText:
  {
    color: "#d8d8d8",
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: '83%',
    minWidth: '83%',
  },

  listType:
  {
    color: "#b2b2b2",
    textAlign: 'left',
    padding: 0,
    margin :0,
    width: '100%',
    fontSize: 13,
  },  
});
