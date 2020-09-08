import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, AsyncStorage, Alert, TextInput, ActivityIndicator, BackHandler } from 'react-native';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';

import { api_url_address } from "../constants";
import { toast } from '../components/toast';

import { globalStyles } from '../styles/globalStyles';

export default function ViewNotes(props) 
{
	var toCarry = props.toCarry;
	
//transffered function from Home screen	
	const refreshList_a = () =>
	{
		props.refreshList();
	}

//variables/states
	const logged_user_id = toCarry.logged_user_id;	

	const notes_id = toCarry.notes_id;
	const title = toCarry.title;
	const type = toCarry.type;

	const [notesData, setNotesData] = useState({title: title, hasChanged: false});	

	const notesOldList_from_home = toCarry.notesOldList;	
	const [notesOldList, setNotesOldList] = useState(JSON.parse(notesOldList_from_home));

	const [tempNotesOldList, setTempNotesOldList] = useState([]);

	const [showIndicator, setShowIndicator] = useState(false);
	const [counter, setCounter] = useState(-1);

	const [saveBtnStatus, setSaveBtnStatus] = useState("not_clicked");

//componentDidMount
	useEffect(() => 
	{
	//to handle back button press
		BackHandler.addEventListener('hardwareBackPress', backBtnPressed);
	}, [notesData, notesOldList]);

//componentWillUnmount
	useEffect(() => 
	{
		return () => 
		{
		//to handle back button press
			BackHandler.removeEventListener('hardwareBackPress', backBtnPressed);
		}
	}, [notesData, notesOldList]);

//function to run when back btn is pressed
	const backBtnPressed = () =>
	{
		console.log("back btn pressed");
		
		setShowIndicator(true);
		onPressSaveBtnHandler(); //saving the edited data
		// return true; //prevents the original back action
	}

//on clicking on add btn
	const handleAddBtnClick = (idx) =>
	{
	//creating a new empty json object
		var emptyJSON = {};
		emptyJSON["id"] = counter;
		emptyJSON["position"] = "";
		emptyJSON["list_title"] = "";
		emptyJSON["type"] = type;
		emptyJSON["is_active"] = 1;
		emptyJSON["hasChanged"] = true;

	//storing the noteslist	data in a temp array
		var tempNotesList = [...notesOldList];
		var len = Object.keys(tempNotesList).length;

		var newNotesList = [];

	//if to be added at beginning
		if(idx == -1)
		{
			if(len == 0) //if list is empty
				var nextPosition = 100000;
			else
				var nextPosition = tempNotesList[0]["position"];

			var newPosition = parseInt((parseInt(0) + parseInt(nextPosition))/2);

			emptyJSON["position"] = newPosition;
			newNotesList.push(emptyJSON);
		}
	
	//looping through the temp notes list to insert new empty json at desired position
		for(var i =0; i<len; i++)
		{
			var thisArray = tempNotesList[i];
			newNotesList.push(thisArray);

			if(i == idx)// inserting the new empty json at desired position
			{
				if(i == len - 1) //if last element
				{
					var newPosition = parseInt(parseInt(thisArray["position"]) + parseInt(100000));
					emptyJSON["position"] = newPosition;
				}
				else //if any between elements
				{
					var thisPosition = thisArray["position"];
					var nextPosition = tempNotesList[i+1]["position"];

					var newPosition = parseInt((parseInt(thisPosition) + parseInt(nextPosition))/2);
					emptyJSON["position"] = newPosition;
				}

				newNotesList.push(emptyJSON);
			}
		}
		
	// updating the state
		setNotesOldList([]);
		setNotesOldList(newNotesList);

		setCounter(counter-1);
	}

//on clicking on remove btn for a list
	const removeOldList = (row_id) =>
	{
		if(parseInt(row_id)<0) //if that textinput is newly added
		{
		//removing that textInput	
			setNotesOldList((prevNotesOldList) => 
		    {
		      return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id != row_id)
		    });
		}
		else //if that textinput is old fetched from database
		{			
			Alert.alert("Delete Note Data", "Are you sure to delete ?", [
				{text: "Yes", onPress: () => deleteNoteList(row_id)},
				{text: "No", onPress: () => console.log("No")}
			]);
		}		
	}

//on clicking on yes for deleting a notes data list
	const deleteNoteList = (row_id) =>
	{
		setShowIndicator(true);

		fetch('http://mngo.in/notes_api/deleteNotesListFromDB.php', 
		{
			method: 'POST',
		  	body: JSON.stringify({row_id: row_id})
		})
		.then((response) => response.json())
		.then((responseJson) => 
		{
			setShowIndicator(false);
			if(responseJson == 1)
			{
			//removing that textInput	
				setNotesOldList((prevNotesOldList) => 
			    {
			      return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id != row_id)
			    });
			}
			else if(responseJson == 0)
			{
				toast("failed to delete");
			}
			else if(responseJson == -1)
			{
				toast("something went wrong");
			}
			else
			{
				toast("unknown error");
			}
		})
	    .catch((error) => 
	    {
	    	setShowIndicator(false);
	      	toast("please check your internet connection");
	    });
	}

//on typing/editing anything in old notes list
	const updateHandlerOfNotesOldList = (index, row_id, val) =>
	{
		var oldJSON = notesOldList[index];
		oldJSON["list_title"] = val;
		oldJSON["hasChanged"] = true;
	
	//updating the textInputs according to the latest user input 
		setTempNotesOldList(notesOldList);
		setTempNotesOldList((prevNotesOldList) => 
	    {
	      return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) != row_id)
	    });

	    //i don't know how its happening, but its really happening.
		//that textinput remains at the same place and we can alwo type there freely
	}

//on clicking on save btn
	const onPressSaveBtnHandler = () =>
	{
		if(saveBtnStatus == "clicked") //if btn is already clicked
		{
			toast("hold on!!");
		}
		else
		{
		//checking if someone is logged or not
			if(logged_user_id == "")
			{
				toast("you are not logged in");
			}
			else
			{
			//checking if notes title has changed or not	
				var notesData_db = notesData;

				var notesTitleChanged = notesData.hasChanged;
				if(!notesTitleChanged)
					var notesData_db = 0;

			//deciding list datas which is to be sent to server	
			//for old lists checking if some change has occur // for new list simply pushing it
				var notesOldList_db = [];
				
				var len = Object.keys(notesOldList).length;
				for(var i = 0; i<len; i++)
				{
					var id 				= notesOldList[i].id;
					var hasChanged 		= notesOldList[i].hasChanged;

					if(parseInt(id)>0) //if notes list is old
					{
						if(hasChanged)
						{
							notesOldList_db.push(notesOldList[i]);
						}
					}
					else //if notes list is new
					{
						notesOldList_db.push(notesOldList[i]);					
					}				
				}

				var listLength = Object.keys(notesOldList_db).length;
				if(listLength == 0)		
					notesOldList_db = 0;

			// //inserting data in DB
				if(notesData_db == 0 && notesOldList_db == 0)
				{
				//redirecting to the home page  
	 		      	Actions.pop();	
				}
				else
				{
					setSaveBtnStatus("clicked");
					setShowIndicator(true);

					const api_end_point = api_url_address + "updateNotesList.php";
					axios.post( api_end_point, {
			        	user_id: logged_user_id,
			        	notes_id: notes_id,
			          	notesData_db: JSON.stringify(notesData_db),
			          	notesOldList_db: JSON.stringify(notesOldList_db),
			        })
			        .then(function(response) 
			        {
			        	setShowIndicator(false);
						setSaveBtnStatus("not_clicked");

						var data = (response.data);
						
						if(data == 0)
						{
							toast("failed to get your updated data");
						}
						else if(data == -1)
						{
							toast("something went wrong");
						}
						else
						{
							setSaveBtnStatus("clicked");
							
							try
							{
							//refreshing the list of notes in Home page	
								refreshList_a();

							//making cookie of notes of users
								var userNotesJSON = JSON.stringify(data);

								var user_id = logged_user_id;
								var user_notes_of = "user_notes_of_" + user_id;
								AsyncStorage.setItem(user_notes_of, userNotesJSON);

							//redirecting to the home page  
								Actions.pop();
							}
							catch(error)
							{
								toast("failed to get your updated data");
							}
						}
			        })
			        .catch(error => 
			        {
			        	setShowIndicator(false);
			        	setSaveBtnStatus("not_clicked");

			          	toast("please check your internet connection");
			        });
				}	        
			}
		}
	}

//on clicking on delete notes btn
	const deleteNotesHandler = () =>
	{
		Alert.alert("Delete Note", "Are you sure to delete " + title + "?", [
			{text: "Yes", onPress: () => deleteNote()},
			{text: "No", onPress: () => console.log("No")}
		]);
	}

//on clicking on yes for deleteing note
	const deleteNote = () =>
	{	
		setShowIndicator(true);

		const api_end_point = api_url_address + "deleteANote.php";
		axios.post( api_end_point, {
        	user_id: logged_user_id,
        	notes_id: notes_id,
        })
        .then(function(response) 
        {
        	setShowIndicator(false);

        	try
          	{
          		var data = (response.data);		          
				var userNotesJSON = JSON.stringify(data);

				if(userNotesJSON == 0)
				{
					toast("failed to delete the note");
				}
				else if(userNotesJSON == -1)
				{
					toast("something went wrong");
				}          
				else if(userNotesJSON == -2)
				{
					toast("failed to get your updated data");
				}
				else
				{
				//refreshing the list of notes in Home page	
					refreshList_a();

				//making cookie of notes of users
					var user_id = logged_user_id;
					var user_notes_of = "user_notes_of_" + user_id;
					AsyncStorage.setItem(user_notes_of, userNotesJSON);

				//redirecting to the home page  
					Actions.pop();
				}
          	}
          	catch(error)
          	{
          		toast("failed to get your updated data");
          	}
        })
        .catch(error => 
        {
        	setShowIndicator(false);
          	toast("please check your internet connection");
        });	
	}

//on clicking on checkbox
	const checkboxClickHandler = (index, row_id, to_set) =>
	{
	//marking its checkbox condition  	
		var oldJSON = notesOldList[index];
		oldJSON["is_active"] = to_set;
		oldJSON["hasChanged"] = true;

	//updating the textInputs according to the latest user input 
		setTempNotesOldList(notesOldList);
		setTempNotesOldList((prevNotesOldList) => 
	    {
	      return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) != row_id)
	    });

	    //i don't know how its happening, but its really happening.
		//that textinput remains at the same place and we can alwo type there freely
	}

//on submit editing in list textInput
	const submitEditList = (idx) =>
	{
		var list_len = notesOldList.length;
		
		if(type == 2) //&& (list_len -1) == idx) //if checkbox
		{
			handleAddBtnClick(idx);
		}
	}

//rendering
	return(
		<View style={globalStyles.container}>		
			<View style={globalStyles.notesHeader} >
				<TouchableOpacity style={globalStyles.createNotesBtn} onPress={() => onPressSaveBtnHandler()}>
		        	<Image 
				    	source={require('../img/save2.png')} 
				    	style={globalStyles.goBackImg} 
				    />
		        </TouchableOpacity>

				<View style={globalStyles.titleFormContainer}>
					<TextInput 
			        	style={globalStyles.notesInputBox} 
			            underlineColorAndroid='rgba(0,0,0,0)' 
			            placeholder= "Title"
			            placeholderTextColor = "#d8d8d8"
			            selectionColor="#1c313a"
			            keyboardType="name-phone-pad"
			            autoCapitalize = "words"
			            value = {notesData.title}
			            onChangeText={(val) => setNotesData({title: val, hasChanged: true})}
			        />
				</View>

				<TouchableOpacity style={styles.deleteNotesBtnCotainer} onPress={() => deleteNotesHandler()}>
		        	<Image source={require('../img/delete.png')} style={styles.deleteNotesImg} />
		        </TouchableOpacity>
			</View>
			{
		        showIndicator ?
		          	<ActivityIndicator size="large" color="#d8d8d8" />
		        : null
		    }
			<View style={globalStyles.notesFormContainer} >
				{
			  		type == 2 ?
			  			<View style={globalStyles.picker_and_addListBtn} >
						    <TouchableOpacity style={globalStyles.addNotesListBtn} onPress={() => handleAddBtnClick(-1) }>
					        	<Image source={require('../img/add1.png')} style={globalStyles.addBtnText} />
					        	<Text style={{color: '#d8d8d8'}} > Add Item</Text>
					        </TouchableOpacity>
						</View>
					: null
			  	}

		    	<View style={globalStyles.formContainer_scroll}>
			        <ScrollView style={globalStyles.listNotesFieldContainer}>
			        {
						notesOldList.map((item, idx) => 
						{
							var row_id = item.id;
							var is_active = item.is_active;
							var title = (item.list_title).toString();						
							// var res = title.replace(/\\n/g, "\n"); // in db \n goes as \\n becoz of mysqli_real_escape_string so making it \n once again
							
							var html = [];
							if(type == 2) //if type is checkbox showing checkbox image
							{
								var to_set = is_active == 1 ? 2: 1;
								html.push(
									<TouchableOpacity key={idx} onPress={() => checkboxClickHandler(idx, row_id, to_set)} >
									    <Image 
									    	source={is_active == 1 ? require('../img/unchecked.png'): require('../img/checked.png')} 
									    	style={globalStyles.notesCheckedImg} 
									    />
								    </TouchableOpacity>
					            );
							}

							return(
							  <View key={idx} style={globalStyles.listNotesFields} >
							  	{html}

							   	<TextInput
							   		multiline = {type == 2 ? false: true}
							    	style = {(type == 2) ? (is_active == 2)? globalStyles.notesListInput_checked: globalStyles.notesListInput_checkbox : globalStyles.notesListInput_normal}
						            underlineColorAndroid='rgba(0,0,0,0)' 
						            placeholder= "type text"
						            placeholderTextColor = "#d8d8d8"
									value = {title}
						            selectionColor="#1c313a"
						            keyboardType="name-phone-pad"
						            onChangeText={(val) => updateHandlerOfNotesOldList(idx, row_id, val)} 
						            onSubmitEditing={() => submitEditList(idx)}
						            // autoFocus //to auto focus on creation of its new element
					            />

					            {
					            	//if types is checkbox then showing delete/close icon
					            	type == 2 ?
					            		<TouchableOpacity onPress={() => removeOldList(row_id)} >
										    <Image 
										    	source={require('../img/cross2.png')} 
										    	style={globalStyles.notesFieldCloseImg} 
										    />
									    </TouchableOpacity>
					            	: null
					            }
							  </View>
							)
						})
			        }
			        </ScrollView>
		        </View>
		    </View>
		</View>
	)
}

const styles = StyleSheet.create(
{
	deleteNotesBtnCotainer:
	{
		// // backgroundColor: 'red',
		// alignItems:'center',
		// // width: '50%',
	},

	deleteNotesImg:
	{
		width: 22,
		height: 22,
		tintColor: '#1c313a',
	}
});