import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default function CreateNotesArea({toCarry}) 
{
	const logged_user_id = toCarry.logged_user_id;
	
//on clicking on + btn  
  const createNewNoteBtnClickHandler = () =>
  {
  	var toCarry = {};
    toCarry['logged_user_id'] = logged_user_id;
    
    // console.log("new notes is going to be created");
    Actions.createNotesForm({ toCarry: toCarry});
  }

	return(
		<TouchableOpacity style={styles.header} onPress={createNewNoteBtnClickHandler}>
			<Image source={require('../img/add1.png')} style={styles.titleImg} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	header:
	{
		position: 'absolute',
    	bottom: 8,
    	right: 	8,
    	height: 60,
		width: 	60,
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

	headerText: 
	{
		fontWeight: '600',
		fontSize: 20,
		color: '#fff',	
    },
});