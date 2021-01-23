import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Actions } from 'react-native-router-flux';

import NotesListDataItem from "../components/NotesListDataItem";
import { toast } from '../components/toast';

import { addUserNotes } from "../apis";
import { getCookieValue } from '../utils';

import { globalStyles } from '../styles/globalStyles';

export default function CreateNote({
    refreshList
}) {
    const [notesData, setNotesData] = useState({ title: "", type: 1 });
    const [notesListData, setNotesListData] = useState([{ position: 100000, list_title: "", is_active: 1 }]);
    const [tempNotesListData, setTempNotesListData] = useState([]);

    const [inputFieldPositionToFocusOn, setInputFieldPositionToFocusOn] = useState(100000);

    const [showIndicator, setShowIndicator] = useState(false);

    //componentDidMount
    useEffect(() => {
        //to handle back button press
        BackHandler.addEventListener('hardwareBackPress', backBtnPressed);

        //componentWillUnmount
        return () => {
            //to handle back button press
            BackHandler.removeEventListener('hardwareBackPress', backBtnPressed);
        }
    }, [notesData, notesListData]);

    //function to run when back btn is pressed
    function backBtnPressed() {
        console.log("back btn pressed in create notes screen");

        handleSaveNoteClick("backBtn"); //creating new notes
        return true; //prevents the original back action
    }

    //function to handle when add item is clicked on
    function handleAddBtnClick(idx) {
        // creating a new empty json object
        let emptyJSON = {};
        emptyJSON["position"] = "";
        emptyJSON["list_title"] = "";
        emptyJSON["is_active"] = 1;

        //storing the noteslist	data in a temp array
        let tempNotesList = [...notesListData];
        let len = Object.keys(tempNotesList).length;

        let newNotesList = [];
        let newPosition = 100000;
        //if to be added at beginning
        if (idx === -1) {
            let nextPosition = 100000; //if list is empty
            if (len !== 0) {
                //if list is not empty
                nextPosition = tempNotesList[0]["position"];
            }

            newPosition = parseInt((parseInt(0) + parseInt(nextPosition)) / 2);

            emptyJSON["position"] = newPosition;
            newNotesList.push(emptyJSON);
        }

        //looping through the temp notes list to insert new empty json at desired position
        for (let i = 0; i < len; i++) {
            let thisArray = tempNotesList[i];
            newNotesList.push(thisArray);

            if (i === idx) {
                // inserting the new empty json at desired position
                if (i === len - 1) {
                    //if last element
                    newPosition = parseInt(parseInt(thisArray["position"]) + parseInt(100000));
                    emptyJSON["position"] = newPosition;
                } else {
                    //if any between elements
                    let thisPosition = thisArray["position"];
                    let nextPosition = tempNotesList[i + 1]["position"];

                    newPosition = parseInt((parseInt(thisPosition) + parseInt(nextPosition)) / 2);
                    emptyJSON["position"] = newPosition;
                }
                newNotesList.push(emptyJSON);
            }
        }

        // updating the state
        setInputFieldPositionToFocusOn(newPosition);
        setNotesListData([]);
        setNotesListData(newNotesList);
    }

    //function to hanlde when checkbox is cliked on
    function hanldeCheckBoxClick(idx, rowId, toSet) {
        //getting the old data
        let oldJSON = notesListData;
        let oldJsonForThatKey = oldJSON[idx];

        //update the old data
        let newJSONForThatKey = {
            "position": oldJsonForThatKey.position,
            "list_title": oldJsonForThatKey.list_title,
            "is_active": toSet
        };
        oldJSON[idx] = newJSONForThatKey;

        //set the state with new updated data
        setTempNotesListData(notesListData);
        setTempNotesListData((prevtemNotestFields) => {
            return prevtemNotestFields.filter(newInputFields => newInputFields.position !== idx)
        });
        // //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can also type there freely
    }

    //function to handle when remove btn is clicked on for any list data input field
    function handleRemoveClick(idx, rowId) {
        //removing that list val from data
        let oldJSON = notesListData;
        if (idx > -1) {
            oldJSON.splice(idx, 1);
        }

        // updating the state
        setTempNotesListData(notesListData);
        setTempNotesListData((prevtemNotestFields) => {
            return prevtemNotestFields.filter(newInputFields => newInputFields.position !== idx)
        });
        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can also type there freely
    }

    //function to handle when typed in notes list data field
    function handleInputFieldChange(idx, rowId, val) {
        //getting the old data
        let oldJSON = notesListData;
        let oldJsonForThatKey = oldJSON[idx];

        //update the old data
        let newJSONForThatKey = {
            "position": oldJsonForThatKey.position,
            "list_title": val,
            "is_active": oldJsonForThatKey.is_active
        };
        oldJSON[idx] = newJSONForThatKey;

        //updating the textInputs according to the latest user input
        setTempNotesListData(notesListData);
        setTempNotesListData((prevNotesOldList) => {
            return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
        });
        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can alwo type there freely
    }

    //function to hadle when enter is pressed in any input field
    function handleSubmitInputField(e, idx) {
        e.preventDefault();

        if (notesData.type === 2) {
            //if type is checkbox
            handleAddBtnClick(idx);
        }
    }

    //function yo handle when save btn is clicked on
    async function handleSaveNoteClick(action) {
        if (!showIndicator) {
            const title = notesData.title;
            const type = notesData.type;

            if (title !== "" && type !== "") {
                setShowIndicator(true);
                const loggedUserToken = await getCookieValue("loggedUserToken");
                console.log("loggedUserToken", loggedUserToken);
                //sending rqst to api
                const response = await addUserNotes(
                    loggedUserToken,
                    JSON.stringify(notesData),
                    JSON.stringify(notesListData),
                );
                if (response.statusCode === 200) {
                    toast("Saved", "success");

                    refreshList();
                    Actions.pop();
                    return;
                } else {
                    toast(response.msg);
                    setShowIndicator(false);
                }
            } else {
                if (action === "backBtn") {
                    Actions.pop();
                    return;
                } else {
                    toast("Title or Type can't be empty");
                }
            }
        }
    }

    function renderPageContent() {
        return (
            <>
                <View style={globalStyles.notesHeader} >
                    <TouchableOpacity
                        style={globalStyles.createNotesBtn}
                        onPress={handleSaveNoteClick}
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
                            placeholderTextColor="#d8d8d8"
                            selectionColor="#1c313a"
                            keyboardType="name-phone-pad"
                            autoCapitalize="words"
                            onChangeText={(val) => setNotesData({
                                ...notesData,
                                title: val
                            })}
                        />
                    </View>
                </View>

                <View style={globalStyles.notesFormContainer} >
                    <View style={globalStyles.picker_and_addListBtn} >
                        <Picker
                            selectedValue={notesData.type}
                            // mode="dropdown"
                            style={globalStyles.pickerBox}
                            onValueChange={(itemValue, itemIndex) =>
                                setNotesData({
                                    ...notesData,
                                    type: itemValue
                                })}
                        >
                            <Picker.Item label="text" value="1" />
                            <Picker.Item label="checkbox" value="2" />
                        </Picker>
                    </View>
                    {
                        notesData.type == 2 ?
                            <View style={globalStyles.picker_and_addListBtn} >
                                <TouchableOpacity
                                    style={globalStyles.addNotesListBtn}
                                    onPress={() => handleAddBtnClick(-1)}
                                >
                                    <Image source={require('../img/add1.png')} style={globalStyles.addBtnText} />
                                    <Text style={{ color: '#d8d8d8' }} > Add Item</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                    }

                    <View style={globalStyles.formContainer_scroll}>
                        <ScrollView style={globalStyles.listNotesFieldContainer} >
                            {
                                //rendering notes data list items
                                notesListData.map(function(item, idx) {
                                    return (
                                        <NotesListDataItem
                                            key={idx}
                                            idx={idx}
                                            notesType={notesData.type}
                                            positionToFocus={inputFieldPositionToFocusOn}
                                            rowId={parseInt(item.id)}
                                            isActive={parseInt(item.is_active)}
                                            position={parseInt(item.position)}
                                            title={item.list_title}
                                            onCheckBoxClick={hanldeCheckBoxClick}
                                            onRemoveClick={handleRemoveClick}
                                            onInputFieldChange={handleInputFieldChange}
                                            onSubmitInputField={handleSubmitInputField}
                                        />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </>
        )
    }
    //rendering
    return (
        <View style={globalStyles.container} >
            {
                showIndicator ?
                    <ActivityIndicator size="large" color="#d8d8d8" />
                    :
                    renderPageContent()
            }
        </View>
    )
}