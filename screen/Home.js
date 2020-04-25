import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, AsyncStorage, Image, ActivityIndicator, BackAndroid } from 'react-native';
import axios from 'axios';

import {Actions} from 'react-native-router-flux';

import { globalStyles } from '../styles/globalStyles';
import Header from '../components/header';
import { toast } from '../components/toast';

export default function Home({toCarry}) 
{
  const logged_user_id = toCarry.logged_user_id;

  const [notes, setNotes] = useState([]);
  const [showIndicator, setShowIndicator] = useState(true);

  const [counter, setCounter] = useState(1);

//function to refresh the list
  const refreshList = () =>
  {
    console.log("list refreshed");

    setCounter(counter + 1);
  }

//here it updates UI on change of counter
  useEffect(() => //useEffect works as componentDidMount
  {
    if(logged_user_id == "")
    {
      toast("you are not logged in");
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
          console.log("list loaded from cookie");
          var data = JSON.parse(val);          
          setNotes(data);
          
          if(showIndicator == true)
            setShowIndicator(false); //hiding loading animation
        }
        else
        {
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
              console.log("list loaded from internet");

              if(dataString == 0)
              {
                toast("failed to fetch data");
              }
              else if(dataString == -1)
              {
                toast("something went wrong");
              }
              else //some data is there
              {
                if(showIndicator == true)
                  setShowIndicator(false);//hiding loading animation

              //making cookie of the list of notes  
                AsyncStorage.setItem(user_notes_of, dataString);
                Actions.refresh();

              //refreshing for loading UI  
                refreshList();
              }
            }
            catch
            {
              toast("failed to get your updated data");
            }          
          })
          .catch(error => 
          {
            toast("please check your internet connection");
          });
        }  
      });
    }
  }, [counter]);

//on clicking on any notes
  const onClickingOnAnyNotes = (item) =>
  {
    setShowIndicator(true);
    
    // refreshList();

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
      setShowIndicator(false);

      var data = response.data;
      var dataString = JSON.stringify((response.data));

      if(dataString == 0)
      {
        toast("failed to fetch data");
      }
      else if(dataString == -1)
      {
        toast("something went wrong");
      }
      else //some data is there
      {
        try
        {
        //making cookie of that notes_id list
          var user_notes_list_data = logged_user_id + "_list_data_for_notes_id_" + item.notes_id;
          AsyncStorage.setItem(user_notes_list_data, dataString);

        //redirecting to notes view page  
          toCarry['notesOldList'] = dataString;
          Actions.ViewNotesPage({ toCarry: toCarry, refreshList: () => refreshList()  }); //transfering refreshList function so that notes list can be refreshed when a note is deleted
        }
        catch(error)
        {
          toast("failed to get your updated data");
        } 
      }
    })
    .catch(error => 
    {
    //looking for user notes list in cookies if internet not available
      var user_notes_list_data = logged_user_id + "_list_data_for_notes_id_" + item.notes_id;
      AsyncStorage.getItem(user_notes_list_data).then((val) =>
      {
        setShowIndicator(false);

        if(val != null) //if some data exist in cookies then loading in flatlist
        {
          toCarry['notesOldList'] = val;
          Actions.ViewNotesPage({ toCarry: toCarry, refreshList: () => refreshList()  }); //transfering refreshList function so that list of notes can be refreshed when a note is deleted
        }
        else
        {
          toast("please check your internet connection");
        }
      });  
    }); 
  }

//on clicking on +/add item btn  
  const createNewNoteBtnClickHandler = () =>
  {
    var toCarry = {};
    toCarry['logged_user_id'] = logged_user_id;
    
    // console.log("new notes is going to be created");
    Actions.createNotesForm({ toCarry: toCarry, refreshList: () => refreshList()  }); //transfering refreshList function so that list of notes can be refreshed when a new notes is created
  }

//rendering
  return (
    <View style={globalStyles.container}>
      <Header toCarry={ {title: "MNgo Notes"} } />
      {
        showIndicator ?
          <ActivityIndicator size="large" color="#d8d8d8" />
          : null
      }
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

      <TouchableOpacity style={styles.addNotesBtn} onPress={() => createNewNoteBtnClickHandler()}>
        <Image source={require('../img/add1.png')} style={styles.titleImg} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addNotesBtn:
  {
    position: 'absolute',
    bottom: 8,
    right:  8,
    height: 50,
    width:  50,
    borderRadius: 100,
    backgroundColor: "#181915", //455a64
    alignItems:'center',
    justifyContent :'center'
  },

  titleImg:
  {
    height: '50%',
    width: '50%',
    tintColor: '#455a64',
  },

  list:
  {
    width: '100%',
    height: '110%',
  },

  box:
  {
    // backgroundColor: '#1c313a',
    // borderColor: '#3d4e56',
    // borderWidth: 1,
    
    borderBottomColor: '#3d4e56',
    borderBottomWidth: 1,

    padding: 15,
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  icon:
  {
    height: 75,
    width: 60,
    tintColor: '#fff',
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
    color: "#1c313a",
    textAlign: 'left',
    padding: 0,
    margin :0,
    width: '100%',
    fontSize: 13,
  },  
});
