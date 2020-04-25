import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Picker, ScrollView, AsyncStorage, TextInput, ActivityIndicator, BackHandler } from 'react-native';
import axios from 'axios';
// import { Form, TextInput } from 'react-native-autofocus';

import {Actions} from 'react-native-router-flux';

import { globalStyles } from '../styles/globalStyles';
import Header from '../components/header';

import { toast } from '../components/toast';

export default function CreateNotesForm(props) 
{
	var toCarry = props.toCarry;
	
//transffered function from Home screen	
	const refreshList_a = () =>
	{
		props.refreshList();
	}

//variables/states
	const logged_user_id = toCarry.logged_user_id;
	
	const [notesData, setNotesData] = useState({title: "", type: 1});	

	const [notesList, setNotesList] = useState([{position: 100000, title: "", is_active: 1}]);
	const [tempNotesList, setTempNotesList] = useState([]);

	const [showIndicator, setShowIndicator] = useState(false);
	const [saveBtnStatus, setSaveBtnStatus] = useState("not_clicked");

//componentDidMount
	useEffect(() => 
	{
	//to handle back button press
		BackHandler.addEventListener('hardwareBackPress', backBtnPressed);
	}, [notesData, notesList]);

//componentWillUnmount
	useEffect(() => 
	{
		return () => 
		{
		//to handle back button press
			BackHandler.removeEventListener('hardwareBackPress', backBtnPressed);
		}
	}, [notesData, notesList]);

//function to run when back btn is pressed
	const backBtnPressed = () =>
	{
		console.log("back btn pressed");
		
		doneCreatingNotesBtn();
		// return true; //prevents the original back action
	}

//on clicking on add btn
	const handleAddBtnClick = (idx) =>
	{
	// creating a new empty json object
		var emptyJSON = {};
		emptyJSON["position"] = "";
		emptyJSON["title"] = "";
		emptyJSON["is_active"] = 1;

	//storing the noteslist	data in a temp array
		var tempNotesList = [...notesList];
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
				else //if any betweeb elements
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
		setNotesList([]);
		setNotesList(newNotesList);

		// console.log(notesList);
	}

//on selecting a type
	const onSelectingType = (itemValue) =>
	{
		setNotesData({title: notesData.title, type: itemValue});
	}

//on typing text in any list input
	const addListData = (idx, val) =>
	{
	//getting the old data
		var oldJSON = notesList;
		var oldJsonForThatKey = oldJSON[idx];

	//update the old data	
		var newJSON_for_that_key = {position: oldJsonForThatKey.position, title: val, is_active: oldJsonForThatKey.is_active};
		oldJSON[idx] = newJSON_for_that_key;

	//set the state with new updated data	
		setNotesList([]);
		setNotesList(oldJSON);
	}

//on clicking on checkbox
	const checkboxClickHandler = (idx) =>
	{
	//getting the old data
		var oldJSON = notesList;
		var oldJsonForThatKey = oldJSON[idx];		

	//update the old data
		var is_active = oldJsonForThatKey["is_active"];
		var to_set = is_active == 1 ? 2: 1;

		var newJSON_for_that_key = {position: oldJsonForThatKey.position, title: oldJsonForThatKey.title, is_active: to_set};
		oldJSON[idx] = newJSON_for_that_key;				

	//set the state with new updated data
		setNotesList([]);
		setNotesList(oldJSON);

	// //i don't know how its happening, but its really happening.
	//that textinput remains at the same place and we can also type there freely
		setTempNotesList(notesList);
		setTempNotesList((prevtemNotestFields) => 
		{
			return prevtemNotestFields.filter(newInputFields => newInputFields.position != idx)
		});
	}

//on clicking on remove btn
	const removeFieldBtnHandler = (idx) =>
	{
	//removing that list val from data	
		var oldJSON = notesList;
		if (idx > -1) {
		  	oldJSON.splice(idx, 1);
		}

	//i don't know how its happening, but its really happening.
	//that textinput remains at the same place and we can also type there freely
		setTempNotesList(notesList);
		setTempNotesList((prevtemNotestFields) => 
	    {
	      return prevtemNotestFields.filter(newInputFields => newInputFields.position != idx)
	    });

	//setting/updating state	
		setNotesList([]);
		setNotesList(oldJSON);
	}

//on clicking on done/back/left-arrow btn
	const doneCreatingNotesBtn = () =>
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
				// Actions.pop();
				toast("you are not logged in");
			}
			else
			{
				console.log(notesData);
				var title = notesData.title;
				var type = notesData.type;		

				if(title != "" && type != "")
				{
					setSaveBtnStatus("clicked");

					setShowIndicator(true);

				//getting logged user notes data
					var user_id = logged_user_id;
					var user_notes_of = "user_notes_of_" + user_id;

				//posting data to API  
				        axios.post('http://mngo.in/notes_api/addUserNotesInDB.php', 
				        {
				        	user_id: user_id,
				          	notesData: JSON.stringify(notesData),
				          	notesList: JSON.stringify(notesList),
				        })
				        .then(function(response) 
				        {
							setSaveBtnStatus("not_clicked");
							setShowIndicator(false);

							var data = (response.data).toString();
							if(data == 0)
							{
							toast("failed to create notes");
							}
							else if(data == -2)
							{
							toast("failed to create notes list");
							}
							else if(data == -3)
							{
							toast("failed to create notes");
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

								//making cookies of updated notes list	
									var dataString = JSON.stringify((response.data));
									AsyncStorage.setItem(user_notes_of, dataString);

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
				else
				{
					// Actions.pop();
					toast("title or type can't be empty");
				}	
			}	
		}
	}

//on submit editing in list textInput
	const submitEditList = (idx) =>
	{
		var type = notesData.type;
		
		if(type == 2) //&& (list_len -1) == idx) //if checkbox
		{
			handleAddBtnClick(idx);
		}
	}

//rendering
	return(
		<View style={globalStyles.container} >
			<View style={globalStyles.notesHeader} >
				<TouchableOpacity 
					style={globalStyles.createNotesBtn} 
					onPress={() => doneCreatingNotesBtn()}
				>
		        	<Image 
				    	source={require('../img/save2.png')} 
				    	style={globalStyles.goBackImg} 
				    />
		        </TouchableOpacity>
				<View style={globalStyles.titleFormContainer}>
					<TextInput 
			        	style={globalStyles.notesInputBox} 
			            underlineColorAndroid='rgba(0,0,0,0)' 
			            placeholder="Title"
			            placeholderTextColor = "#d8d8d8"
			            selectionColor="#d8d8d8"
			            keyboardType="name-phone-pad"
			            autoCapitalize = "words"
			            onChangeText={(val) => setNotesData({title: val, type: notesData.type})}
			        />
				</View>				
			</View>

			<View style={globalStyles.notesFormContainer} >
				{
			        showIndicator ?
			          	<ActivityIndicator size="large" color="#d8d8d8" />
			        : null
			    }
				<View style={globalStyles.picker_and_addListBtn} >
					<Picker
			       		selectedValue={notesData.type}
					 	// mode="dropdown"
					 	style={globalStyles.pickerBox}
					 	onValueChange={(itemValue, itemIndex) => onSelectingType(itemValue)}
						>
						<Picker.Item label="text" value="1" />
					  	<Picker.Item label="checkbox" value="2" />
					</Picker>
				</View>
			  	{
			  		notesData.type == 2 ?
			  			<View style={globalStyles.picker_and_addListBtn} >
						    <TouchableOpacity style={globalStyles.addNotesListBtn} onPress={() => handleAddBtnClick(-1) }>
					        	<Image source={require('../img/add1.png')} style={globalStyles.addBtnText} />
					        	<Text style={{color: '#d8d8d8'}} > Add Item</Text>
					        </TouchableOpacity>
						</View>
					: null
			  	}
		       	
		        <View style={globalStyles.formContainer_scroll}>
		        	<ScrollView style={globalStyles.listNotesFieldContainer} >
			        {
		          		notesList.map((item, idx) => 
						{
							var key = item.position;
							var keyString = key.toString();

						//checking the status of checkbox //either checked or not
							var is_active = item.is_active;
							var title = item.title;
							
						//rendering	
							return(
							  <View key={key} style={globalStyles.listNotesFields} >
							  	{
							  		notesData.type == 2 ?
							  		<TouchableOpacity key={key} onPress={() => checkboxClickHandler(idx)} >
									    <Image 
									    	source={is_active == 1 ? require('../img/unchecked.png'): require('../img/checked.png')}
									    	style={globalStyles.notesCheckedImg} 
									    />
								    </TouchableOpacity>
								    : null
							  	} 

							  	<TextInput
							    	multiline = {notesData.type == 2 ? false: true}
							    	// style = {(notesData.type == 2) ? (is_active == 2)? globalStyles.notesListInput_checked: globalStyles.notesListInput_checkbox : globalStyles.notesListInput_normal}
							    	style = {notesData.type == 2 ? globalStyles.notesListInput_checkbox : globalStyles.notesListInput_normal}
						            underlineColorAndroid='rgba(0,0,0,0)' 
						            placeholder= "type text"
						            placeholderTextColor = "#d8d8d8"
									selectionColor="#d8d8d8"
						            keyboardType="name-phone-pad"
						            onChangeText={(val)=> addListData(idx, val)}
						            onSubmitEditing={() => submitEditList(idx)}
						            autoFocus //to auto focus on creation of its new element
						           />

						        {
				            	//if types is checkox then showing delete/close icon
					            	notesData.type == 2 ?
									    <TouchableOpacity onPress={() => removeFieldBtnHandler(idx)} >
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
});