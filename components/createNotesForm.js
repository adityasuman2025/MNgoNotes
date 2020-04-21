import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Picker, ScrollView, AsyncStorage, TextInput } from 'react-native';
import axios from 'axios';
// import { Form, TextInput } from 'react-native-autofocus';

import {Actions} from 'react-native-router-flux';

import { globalStyles } from '../styles/globalStyles';
import Header from '../components/header';

export default function CreateNotesForm({toCarry}) 
{
	const logged_user_id = toCarry.logged_user_id;
	// console.log("in Create Notes page: " + logged_user_id);

	const [notesData, setNotesData] = useState({title: "", type: ""});	

	const [inputFields, setInputFields] = useState([]);
	const [tempInputFields, setTempInputFields] = useState([]);

	const [counter, setCounter] = useState(1);
	const [notesList, setNotesList] = useState({});

	const [error, setError] = useState(""); 

	const [saveBtnStatus, setSaveBtnStatus] = useState("not_clicked");

//on clicking on add btn
	const handleAddBtnClick = () =>
	{
		// console.log("yay!!");

		setInputFields((prevInputFields) => 
		{			
			return [			
				...prevInputFields,
				{ key: counter }
			]
		});

	//creating a empty notes list	
		createNotesList(counter, "");

		setCounter(counter+1);
	}

//on selecting a type
	const onSelectingType = (itemValue) =>
	{
		setNotesData({title: notesData.title, type: itemValue});

	//creating one list	by default on selecting a type
		if(itemValue != 0 && inputFields.length==0)
			handleAddBtnClick();
	}

//on typing text in any list input
	const addListData = (key, val) =>
	{
		if(val.trim() == "")
		{
			removeFieldBtnHandler(key);
		}
		else
		{
			createNotesList(key, val);
		}
	}

//function to create an empty notes list
	const createNotesList = (key, val) =>
	{
		var oldJSON = notesList;
		if(oldJSON.hasOwnProperty(key))
		{
			var newJSON_for_that_key = {title: val, is_active: oldJSON[key].is_active};
		}
		else
		{
			var newJSON_for_that_key = {title: val, is_active: 1};
		}
		oldJSON[key] = newJSON_for_that_key;

		setNotesList(oldJSON);
	}

//on clicking on checkbox
	const checkboxClickHandler = (key) =>
	{
		var oldJSON = notesList;

		if(oldJSON.hasOwnProperty(key))
		{
			var is_active = oldJSON[key].is_active;
			var to_set = is_active == 1 ? 2: 1;

			var newJSON_for_that_key = {title: oldJSON[key].title, is_active: to_set};
		}
		else
		{
			var newJSON_for_that_key = {title: "", is_active: 2};
		}

		oldJSON[key] = newJSON_for_that_key;		
		setNotesList(oldJSON);

	//updating the textInputs according to the latest user input 
		setTempInputFields(inputFields);		
		setTempInputFields((prevNotesOldList) => 
	    {
	      return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.key) != key)
	    });

	    //i don't know how its happening, but its really happening.
		//that textinput remains at the same place and we can alwo type there freely
	}

//on clicking on remove btn
	const removeFieldBtnHandler = (key) =>
	{
	//removing that list val from data	
		var oldJSON = notesList;
		delete oldJSON[key];

		setNotesList(oldJSON);

	//removing that textInput	
		setInputFields((prevInputFields) => 
	    {
	      return prevInputFields.filter(newInputFields => newInputFields.key != key)
	    });
	}

//on clicking on done/back/left-arrow btn
	const doneCreatingNotesBtn = () =>
	{
		if(saveBtnStatus == "clicked") //if btn is already clicked
		{
			setError("hold on!!");
		}
		else
		{
		//checking if someone is logged or not
			if(logged_user_id == "")
			{
				// Actions.pop();
				setError("you are not logged in");
			}
			else
			{
				var title = notesData.title;
				var type = notesData.type;		

				var listLength = Object.keys(notesList).length;	

				if(title != "" && type != "")
				{
					if(listLength > 0)
					{
						setSaveBtnStatus("clicked");

						setError("please wait...");

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

				          var data = (response.data).toString();
				          // console.log(data);

				          if(data == 0)
				          {
				            setError("failed to create notes");
				          }
				          else if(data == -2)
				          {
				            setError("failed to create notes list");
				          }
				          else if(data == -3)
				          {
				            setError("failed to create notes");
				          }
				          else if(data == -1)
				          {
				            setError("something went wrong");
				          }		          
				          else
				          {
				          	setSaveBtnStatus("clicked");
				          	try
				          	{
				          		var dataString = JSON.stringify((response.data));		          	
								AsyncStorage.setItem(user_notes_of, dataString);

				              //redirecting to the home page  
			          			Actions.pop();
				          	}
				          	catch(error)
				          	{
				          		setError("failed to get your updated data");
				          	}					
				          }
				        })
				        .catch(error => 
				        {
				          setError("please check your internet connection");
				        });
					}
					else
					{
						setError("you can't create an empty Notes");
					}
				}
				else
				{
					// Actions.pop();
					setError("title or type can't be empty");
				}	
			}	
		}
	}

//on submit editing in list textInput
	const submitEditList = (idx, type) =>
	{
		var type = notesData.type;
		var list_len = inputFields.length;
		
		if(type == 2 && (list_len -1) == idx) //if checkbox and that list input field is last then inserting new textinput after that/at bottom
		{
			// console.log("yay!!");
			handleAddBtnClick();

			// textInput.current.focus();
			// focusNextField(counter);
		}
	}

//function to define reference of a textInput
	// const focusNextField = (id) =>
	// {
	//     inputs[id].focus();
	// }


	// const [inputs, setInputs] = useState({});

	// const textInput = React.createRef();

	// const defRef = (input, key) =>
	// {
	// 	console.log(input);
	// 	// var oldInputs = inputs,
 //  //   	oldInputs[key] = input;

 //  //       setInputs(oldInputs},
	// }

//rendering
	return(
		<View style={globalStyles.container} >
			<View style={globalStyles.notesHeader} >
				<TouchableOpacity style={globalStyles.createNotesBtn} onPress={doneCreatingNotesBtn}>
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
			            autoFocus
			            onChangeText={(val) => setNotesData({title: val, type: notesData.type})}
			        />
				</View>				
			</View>

			<View style={globalStyles.notesFormContainer} >
				<Text style={globalStyles.errorText} >{error}</Text>

				<View style={globalStyles.picker_and_addListBtn} >
					<Picker
			       		selectedValue={notesData.type}
					 	// mode="dropdown"
					 	style={globalStyles.pickerBox}
					 	onValueChange={(itemValue, itemIndex) => onSelectingType(itemValue)}
						>
						<Picker.Item label="Select Type" value="" />
					  	<Picker.Item label="text" value="1" />
					  	<Picker.Item label="checkbox" value="2" />
					</Picker>

				    <TouchableOpacity style={globalStyles.addNotesListBtn} onPress={(e) => handleAddBtnClick(e) }>		        	
			        	<Image source={require('../img/add1.png')} style={globalStyles.addBtnText} />
			        </TouchableOpacity>
				</View>
		       	
		        <View style={globalStyles.formContainer_scroll}>
		        	<ScrollView style={globalStyles.listNotesFieldContainer} >
			        {
		          		inputFields.map((item, idx) => 
						{
							var key = item.key;
							var keyString = key.toString();

						//checking the status of checkbox //either checked or not
							var is_active = 1;

							var oldJSON = notesList;
							if(oldJSON.hasOwnProperty(key))
								var is_active = oldJSON[key].is_active;
							
						//rendering according to type
							var html = [];
							if(notesData.type == 2)//if type is checkbox showing checkbox image	
							{
								html.push(
									<TouchableOpacity key={key} onPress={() => checkboxClickHandler(key)} >
									    <Image 
									    	source={is_active == 1 ? require('../img/unchecked.png'): require('../img/checked.png')}
									    	style={globalStyles.notesCheckedImg} 
									    />
								    </TouchableOpacity>
					            );
							}

						//rendering	
							return(
							  <View key={key} style={globalStyles.listNotesFields} >
							  	{html} 

							  	<TextInput
							    	multiline = {notesData.type == 2 ? false: true}
							    	style = {(notesData.type == 2) ? (is_active == 2)? globalStyles.notesListInput_checked: globalStyles.notesListInput_checkbox : globalStyles.notesListInput_normal}
						            underlineColorAndroid='rgba(0,0,0,0)' 
						            placeholder= "type text"
						            placeholderTextColor = "#d8d8d8"
									selectionColor="#d8d8d8"
						            keyboardType="name-phone-pad"
						            onChangeText={(val)=> addListData(key, val)}
						            onSubmitEditing={() => submitEditList(idx)}

						        //getting WARNING: functional components can't be accessed using references    
						            // ref={(input) => defRef(input, key)}
						            // ref={texttInput}
						           />

							    <TouchableOpacity onPress={() => removeFieldBtnHandler(key)} >
								    <Image 
								    	source={require('../img/cross2.png')} 
								    	style={globalStyles.notesFieldCloseImg} 
								    />
							    </TouchableOpacity>
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