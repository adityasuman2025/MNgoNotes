import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container:
    {
        backgroundColor: '#455a64',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    formContainer:
    {
        padding: 0,
        margin: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    inputBox:
    {
        width: "85%",
        height: 45,
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },

    loginSignUpBtn:
    {
        width: "85%",
        height: 50,
        backgroundColor: '#1c313a',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 13,
        justifyContent: 'center',
    },

    buttonText:
    {
        fontSize: 16,
        fontWeight: '500',
        color: '#d8d8d8',
        textAlign: 'center'
    },

    errorText:
    {
        color: 'red',
        fontSize: 13,
        padding: 0,
        margin: 0,
        width: '100%',
        textAlign: 'center',

        // backgroundColor: 'blue',
    },

    successText:
    {
        color: '#13af05',
        fontSize: 13,
        padding: 0,
        margin: 0,
        width: '100%',
        textAlign: 'center',
    },

    notesHeader:
    {
        paddingTop: 30,
        paddingLeft: 7,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center', //vertical align
        justifyContent: 'flex-start', //horizontal align

        // backgroundColor: 'red',
    },

    titleFormContainer:
    {
        padding: 0,
        margin: 0,
        width: '75%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },

    notesInputBox:
    {
        // backgroundColor: 'red',
        width: "100%",
        height: 40,

        padding: 0,
        margin: 0,
        paddingHorizontal: 5,
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },

    createNotesBtn:
    {
        padding: 0,
        margin: 0,
        paddingHorizontal: 10,
    },

    goBackImg:
    {
        // tintColor:'#1c313a',
        tintColor: '#d8d8d8',
        height: 26,
        width: 26,
    },

    notesFormContainer:
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '95%',
        padding: 0,
        margin: 0,

        // backgroundColor: 'red',
    },

    listNotesFieldContainer:
    {
        // flex: 1,
        // height: '100%',
        width: "100%",
        // marginBottom: 20,
        // paddingBottom: 20,
        // backgroundColor: 'red',
    },

    picker_and_addListBtn:
    {
        width: '100%',
        padding: 0,
        margin: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    pickerBox:
    {
        width: "50%",
        height: 25,

        padding: 0,
        margin: 0,
        color: '#d8d8d8',
        paddingHorizontal: 15,
    },

    addNotesListBtn:
    {
        margin: 0,
        padding: 0,
        width: '90%',

        flexDirection: 'row',
        paddingVertical: 10,
    },

    addBtnText:
    {
        height: 21,
        width: 21,
        tintColor: '#d8d8d8',

    },

    listNotesFields:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 7,
    },

    notesCheckedImg:
    {
        width: 20,
        height: 20,
        tintColor: '#d8d8d8',
    },

    notesListInput_checkbox:
    {
        width: "80%",

        padding: 0,
        margin: 0,
        paddingHorizontal: 7,
        color: '#d8d8d8',
        fontSize: 15,
    },

    notesListInput_normal: {
        width: "90%",
        padding: 0,
        margin: 0,
        paddingHorizontal: 7,
        color: '#d8d8d8',
        fontSize: 15,

        backgroundColor: "red",
    },

    notesListInput_checked:
    {
        width: "80%",

        padding: 0,
        margin: 0,
        paddingHorizontal: 7,
        color: '#d8d8d8',
        fontSize: 15,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },

    notesFieldCloseImg:
    {
        width: 16,
        height: 16,
        tintColor: '#1c313a',
    },

    formContainer_scroll:
    {
        padding: 0,
        margin: 0,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
});