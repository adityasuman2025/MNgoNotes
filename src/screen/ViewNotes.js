import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { getListDataOfANote, deleteNotesListDataItem, deleteANote, updateNotesListData } from "../apis";
import { getCookieValue } from '../utils';
import NotesListDataItem from "../components/NotesListDataItem";
import { toast } from '../components/toast';

import { globalStyles } from '../styles/globalStyles';

export default function ViewNotes({
    encryptedNotesId,
    refreshList,
}) {
    const [loggedUserToken, setLoggedUserToken] = useState(null);

    const [notesType, setNotesType] = useState(null);
    const [notesData, setNotesData] = useState({ title: "", hasChanged: false });

    const [notesListData, setNotesListData] = useState([]);
    const [tempNotesOldList, setTempNotesOldList] = useState([]);
    const [counter, setCounter] = useState(-1);

    const [inputFieldPositionToFocusOn, setInputFieldPositionToFocusOn] = useState(-1);

    const [showIndicator, setShowIndicator] = useState(true);

    useEffect(() => {
        (async () => {
            const loggedUserTokenCookie = await getCookieValue("loggedUserToken");
            if (loggedUserTokenCookie) {
                setLoggedUserToken(loggedUserTokenCookie);
                await fetchNotesListData(loggedUserTokenCookie, encryptedNotesId);
            }
        })();
    }, []);

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
        handleSaveNoteClick(true); //saving the edited data
        return true; //prevents the original back action
    }

    //function to handle when any note item is clicked on
    async function fetchNotesListData(loggedUserToken, encryptedNotesId) {
        //sending rqst to api
        const response = await getListDataOfANote(loggedUserToken, encryptedNotesId);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                const title = data.title;
                const type = data.type;
                const notesList = data.notes_list || [];
                setNotesData({
                    "title": title,
                    "hasChanged": false,
                });
                setNotesType(parseInt(type));
                setNotesListData(notesList);
            } else {
                toast("Something went wrong");
            }
        } else {
            toast(response.msg);
        }

        setShowIndicator(false);
    }

    //function to handle when add item btn is clicked on
    function handleAddBtnClick(idx) {
        idx = parseInt(idx);

        //creating a new empty json object
        let emptyJSON = {};
        emptyJSON["id"] = counter;
        emptyJSON["position"] = "";
        emptyJSON["list_title"] = "";
        emptyJSON["type"] = notesType;
        emptyJSON["is_active"] = 1;
        emptyJSON["hasChanged"] = true;

        //storing the noteslist	data in a temp array
        let tempNotesList = [...notesListData];
        let len = Object.keys(tempNotesList).length;

        let newNotesList = [];
        let newPosition;
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

        //updating the state
        setInputFieldPositionToFocusOn(newPosition);
        setNotesListData([]);
        setNotesListData(newNotesList);

        setCounter(counter - 1);
    }

    //function to handle when checkbox icon is clicked
    function hanldeCheckBoxClick(idx, rowId, toSet) {
        rowId = parseInt(rowId);

        //marking its checkbox condition
        var oldJSON = notesListData[idx];
        oldJSON["is_active"] = toSet;
        oldJSON["hasChanged"] = true;

        //updating the textInputs according to the latest user input
        setTempNotesOldList(notesListData);
        setTempNotesOldList((prevNotesOldList) => {
            return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
        });

        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can alwo type there freely
    }

    //function to handle when remove icon is clicked
    function handleRemoveClick(idx, rowId) {
        //if that textinput is newly added
        rowId = parseInt(rowId);
        if (rowId < 0) {
            //removing that textInput
            setNotesListData((prevNotesOldList) => {
                return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id !== rowId);
            });
        } else {
            //if that textinput is old fetched from database
            Alert.alert("Delete Note List Data", "Are you sure to delete?", [
                { text: "Yes", onPress: () => deleteANotesListDataItem(rowId) },
                { text: "No", onPress: () => console.log("No") }
            ]);
        }
    }

    //function to delete a notes list data  item
    async function deleteANotesListDataItem(rowId) {
        rowId = parseInt(rowId);
        if (rowId) {
            setShowIndicator(true);

            //sending rqst to api
            const response = await deleteNotesListDataItem(loggedUserToken, rowId);
            if (response.statusCode === 200) {
                setNotesListData((prevNotesOldList) => {
                    return prevNotesOldList.filter(newNotesOldList => newNotesOldList.id != rowId); // !== is not working
                });
            } else {
                toast(response.msg);
            }

            setShowIndicator(false);
        }
    }

    //function to handle when notes data list input field is changed
    function handleInputFieldChange(idx, rowId, value) {
        rowId = parseInt(rowId);

        var oldJSON = notesListData[idx];
        oldJSON["list_title"] = value;
        oldJSON["hasChanged"] = true;

        //updating the textInputs according to the latest user input
        setTempNotesOldList(notesListData);
        setTempNotesOldList((prevNotesOldList) => {
            return prevNotesOldList.filter(newNotesOldList => parseInt(newNotesOldList.id) !== rowId)
        });
        //i don't know how its happening, but its really happening.
        //that textinput remains at the same place and we can alwo type there freely
    }

    //function to hadle when enter is pressed in any input field
    function handleSubmitInputField(e, idx) {
        e.preventDefault();

        if (notesType === 2) {
            //if type is checkbox
            handleAddBtnClick(idx);
        }
    }

    //function to handle when delete note btn is pressed
    function handleDeleteNoteClick() {
        Alert.alert("Delete Note", "Are you sure to delete?", [
            { text: "Yes", onPress: () => deleteNote() },
            { text: "No", onPress: () => console.log("No") }
        ]);
    }

    //function to delete a note
    async function deleteNote() {
        setShowIndicator(true);

        //sending rqst to api
        const response = await deleteANote(loggedUserToken, encryptedNotesId);
        if (response.statusCode === 200) {
            refreshList();
            Actions.pop();
            return;
        } else {
            toast(response.msg);
        }

        setShowIndicator(false);
    }

    //function to handle when save btn is clicked on
    async function handleSaveNoteClick(byPassIndicatorStatus) {
        if (!showIndicator || byPassIndicatorStatus) {
            //checking is some change has been done in notes data or not
            const hasChanged = await checkIfNotesDataIsChanged();
            if (hasChanged === false) {
                //no any change has occured
                //redirecting back to user's home page
                Actions.pop();
                return;
            } else {
                //some changes has occured
                try {
                    const notesDataDb = hasChanged.notesDataDb;
                    const notesListDataDb = hasChanged.notesListDataDb;

                    //sending rqst to api
                    if (notesDataDb || notesListDataDb) {
                        setShowIndicator(true);
                        updateANotesListData(notesDataDb, notesListDataDb);
                    }
                } catch {
                    toast("Something went wrong");
                }
            }
        }
    }

    //function to check is changes in notes data has taken place
    async function checkIfNotesDataIsChanged() {
        //checking if notes title has changed or not
        let notesDataDb = notesData;

        let notesTitleChanged = notesData.hasChanged;
        if (!notesTitleChanged) {
            notesDataDb = 0;
        }

        //deciding list datas which is to be sent to server
        //for old lists checking if some change has occur // for new list simply pushing it
        let notesListDataDb = [];

        let len = Object.keys(notesListData).length;
        for (let i = 0; i < len; i++) {
            let id = notesListData[i].id;
            let hasChanged = notesListData[i].hasChanged;

            if (parseInt(id) > 0) {
                //if notes list is old
                if (hasChanged) {
                    notesListDataDb.push(notesListData[i]);
                }
            } else {
                //if notes list is new
                notesListDataDb.push(notesListData[i]);
            }
        }

        var listLength = Object.keys(notesListDataDb).length;
        if (listLength === 0) {
            notesListDataDb = 0;
        }

        //checking is some change has been done in notes data or not
        if (notesDataDb === 0 && notesListDataDb === 0) {
            //no any change is done by user
            return false;
        } else {
            //some change has occured
            return {
                "notesDataDb": notesDataDb,
                "notesListDataDb": notesListDataDb,
            }
        }
    }

    //function to handle update notes list data
    async function updateANotesListData(notesDataDb, notesListDataDb) {
        //sending rqst to api
        const response = await updateNotesListData(
            loggedUserToken,
            encryptedNotesId,
            JSON.stringify(notesDataDb),
            JSON.stringify(notesListDataDb),
        );
        if (response.statusCode === 200) {
            Actions.pop();
            return;
        } else {
            toast(response.msg);
        }

        setShowIndicator(false);
    }

    function renderPageContent() {
        return (
            <>
                <View style={globalStyles.notesHeader} >
                    <TouchableOpacity
                        style={globalStyles.createNotesBtn}
                        onPress={handleSaveNoteClick}
                    >
                        <Image source={require('../img/save2.png')} style={globalStyles.goBackImg}
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
                            value={notesData.title}
                            onChangeText={(val) => setNotesData({
                                ...notesData,
                                title: val,
                            })}
                        />
                    </View>

                    <TouchableOpacity onPress={handleDeleteNoteClick}>
                        <Image source={require('../img/delete.png')} style={styles.deleteNotesImg} />
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.notesFormContainer} >
                    {
                        notesType == 2 ?
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
                        <ScrollView style={globalStyles.listNotesFieldContainer}>
                            {
                                notesListData.map((item, idx) => (
                                    <NotesListDataItem
                                        key={idx}
                                        idx={idx}
                                        notesType={notesType}
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
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </>
        )
    }

    return (
        <View style={globalStyles.container}>
            {
                showIndicator ?
                    <ActivityIndicator size="large" color="#d8d8d8" />
                    :
                    renderPageContent()
            }
        </View>
    )
}

const styles = StyleSheet.create({
    deleteNotesImg: {
        width: 22,
        height: 22,
        tintColor: '#1c313a',
    }
});