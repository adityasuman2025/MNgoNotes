import React, { useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';

import { globalStyles } from '../styles/globalStyles';

const window = Dimensions.get("window");

export default function NotesListDataItem({
    idx,
    notesType,
    positionToFocus,
    rowId,
    isActive,
    position,
    title = "",
    onCheckBoxClick,
    onRemoveClick,
    onInputFieldChange,
    onSubmitInputField,
}) {
    const inputRef = useRef(null);
    useEffect(() => {
        if (positionToFocus === position) {
            inputRef.current && inputRef.current.focus();
        }
    }, [notesType, positionToFocus, position]);

    const toSet = isActive === 1 ? 2 : 1;

    return (
        <View
            style={globalStyles.listNotesFields}
            onSubmit={(e) => onSubmitInputField(e, idx)}
        >
            {
                //if notes type is checkbox then showing checkbox icon
                notesType === 2 ?
                    <TouchableOpacity onPress={() => onCheckBoxClick(idx, rowId, toSet)} >
                        <Image
                            source={isActive == 1 ? require('../img/unchecked.png') : require('../img/checked.png')}
                            style={globalStyles.notesCheckedImg}
                        />
                    </TouchableOpacity>
                    : null
            }

            <TextInput
                ref={inputRef}
                multiline={notesType === 2 ? false : true}
                style={
                    (notesType === 2) ?
                        (isActive === 2) ?
                            globalStyles.notesListInput_checked
                            :
                            globalStyles.notesListInput_checkbox
                        :
                        [
                            globalStyles.notesListInput_normal, {
                                height: window.height - 100
                            }
                        ]
                }
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="type text"
                placeholderTextColor="#d8d8d8"
                value={title}
                selectionColor="#1c313a"
                keyboardType="name-phone-pad"
                onChangeText={(val) => onInputFieldChange(idx, rowId, val)}
                onSubmitEditing={(e) => onSubmitInputField(e, idx)}
            />

            {
                //if notes type is checkbox then showing remove icon
                notesType === 2 ?
                    <TouchableOpacity onPress={() => onRemoveClick(idx, rowId)} >
                        <Image
                            source={require('../img/cross2.png')}
                            style={globalStyles.notesFieldCloseImg}
                        />
                    </TouchableOpacity>
                    : null
            }
        </View>
    )
}