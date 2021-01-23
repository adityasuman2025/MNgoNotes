import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';

import Header from '../components/header';
import { getCookieValue, makeCookie, redirectToCreateNoteScreen, redirectToViewNotesScreen } from '../utils';
import { getUserNotes } from "../apis";
import { toast } from '../components/toast';

import { globalStyles } from '../styles/globalStyles';

export default function Home() {
    const [loggedUserToken, setLoggedUserToken] = useState(null);
    const [notes, setNotes] = useState([]);
    const [showIndicator, setShowIndicator] = useState(true);

    useEffect(() => {
        (async () => {
            const loggedUserTokenCookie = await getCookieValue("loggedUserToken");
            if (loggedUserTokenCookie) {
                setLoggedUserToken(loggedUserTokenCookie);
                await fetchNotesFromAPI(loggedUserTokenCookie);
            }
        })();
    }, []);

    //function to refresh the list
    function refreshList() {
        setShowIndicator(true); //displaying loading animation
        fetchNotesFromAPI(loggedUserToken);
    }

    async function fetchNotesFromAPI(loggedUserToken) {
        //sending rqst to api
        const response = await getUserNotes(loggedUserToken);
        if (response.statusCode === 200) {
            const data = response.data;
            if (data) {
                const notesOf = "notesOf_" + loggedUserToken;
                const notesCookie = await makeCookie(notesOf, JSON.stringify(data));
                if (notesCookie) {
                    await loadNotesFromCookies(loggedUserToken);
                } else {
                    toast("Something went wrong");
                }
            } else {
                toast("Something went wrong");
            }
        } else if (response.statusCode === 600) {
            //no internet connection / API DNE
            await loadNotesFromCookies(loggedUserToken);
        } else {
            toast(response.msg);
        }
    }

    async function loadNotesFromCookies(loggedUserToken) {
        const notesOf = "notesOf_" + loggedUserToken;
        const notesCookie = await getCookieValue(notesOf);
        if (notesCookie) {
            setNotes(JSON.parse(notesCookie));
        } else {
            toast("Something went wrong");
        }

        setShowIndicator(false);
    }

    //on clicking on any notes
    function onClickingOnAnyNotes(item) {
        if (item.encrypted_notes_id) {
            redirectToViewNotesScreen({
                encryptedNotesId: item.encrypted_notes_id,
                refreshList: () => refreshList()
            }); //transfering refreshList to refresh the notes list when any note id deleted or any new note ic created
        }
    }

    //on clicking on +/add item btn
    function createNewNoteBtnClickHandler() {
        redirectToCreateNoteScreen({
            refreshList: () => refreshList()
        });
    }

    //rendering
    return (
        <View style={globalStyles.container}>
            <Header toCarry={{ title: "MNgo Notes" }} />
            {
                showIndicator ?
                    <ActivityIndicator size="large" color="#d8d8d8" />
                    : null
            }
            <FlatList
                style={styles.list}
                data={notes}
                keyExtractor={(item) => item.encrypted_notes_id}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.box}
                        onPress={() => onClickingOnAnyNotes(item)}
                    >
                        <Image
                            source={item.type == 1 ? require('../img/notes_icon.png') : require('../img/todos_icon.png')}
                            style={styles.icon}
                        />
                        <View>
                            <Text style={styles.listText} >{item.title}</Text>
                            <Text style={styles.listType} >{item.type == 1 ? "text" : "checkbox"} </Text>
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
    addNotesBtn: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        height: 50,
        width: 50,
        borderRadius: 100,
        backgroundColor: "#181915", //455a64
        alignItems: 'center',
        justifyContent: 'center'
    },

    titleImg: {
        height: '50%',
        width: '50%',
        tintColor: '#455a64',
    },

    list: {
        width: '100%',
        height: '110%',
    },

    box: {
        borderBottomColor: '#3d4e56',
        borderBottomWidth: 1,

        padding: 15,
        flexDirection: 'row',
        marginHorizontal: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    icon: {
        height: 75,
        width: 60,
        tintColor: '#fff',
        marginRight: 10,
    },

    listText: {
        color: "#d8d8d8",
        fontWeight: 'bold',
        fontSize: 16,
        maxWidth: '83%',
        minWidth: '83%',
    },

    listType: {
        color: "#1c313a",
        textAlign: 'left',
        padding: 0,
        margin: 0,
        width: '100%',
        fontSize: 13,
    },
});
