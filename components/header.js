import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, Alert} from 'react-native';

import {Actions} from 'react-native-router-flux';

export default function Header({toCarry}) 
{
	const title = toCarry.title;

//onc clicking on logout btn
	const logOutHandler = () =>
	{
		Alert.alert("Logout", "Are you sure to logout?", [
			{text: "Yes", onPress: () => logOut()},
			{text: "No", onPress: () => console.log("No")}
		]);
	}

//onc clinking on yes btn
	const logOut = () =>
	{		
		AsyncStorage.getItem('logged_user_id').then((val) =>
		{
			if(val != null) //if some data exist in cookies then loading in flatlist
			{
				var logged_user_id = val.toString();

			  	AsyncStorage.removeItem('logged_user_id');
			  	AsyncStorage.removeItem('user_notes_of_' + logged_user_id);
				// AsyncStorage.removeItem('5_list_data_for_notes_id_57');

				Actions.login();
			}	      
		});
	}

//rendering
	if(title=="MNgo Notes")
	{
		return(
			<View style={styles.header}>
				<View style={styles.titleContainer}>
					<Image source={require('../img/logo.png')} style={styles.titleImg} />
					<Text style={styles.headerText}> {title} </Text>
				</View>
				
				<View style={styles.logOutContainer}>
					<TouchableOpacity onPress={logOutHandler} >
			        	<Image source={require('../img/logout.png')} style={styles.logOutImg} />
			        </TouchableOpacity>
				</View>
			</View>
		)
	}
	else
	{
		return(
		<View style={styles.header}>
				<Text style={styles.headerText} > {title} </Text>
			</View>
		)
	}
	
}

const styles = StyleSheet.create({
	header:
	{
		backgroundColor: '#455a64',
		borderWidth: 1,
		borderColor: '#3d4e56',
		height: 80,
		paddingTop: 27,
		paddingLeft: 10,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center', //vertical align
    	justifyContent: 'flex-start', //horizontal align
	},
	
	titleContainer:
    {	
    	width: '50%',
    	flexDirection: 'row',
		alignItems: 'center', //vertical align
    	justifyContent: 'flex-start', //horizontal align
    },

	titleImg:
	{
		height: 30,
		width: 30,
	},

	headerText: 
	{
		fontWeight: 'bold',
		fontSize: 20,
		color: '#fff',
    },

    logOutContainer:
    {
    	width: '50%',
    	alignItems: 'flex-end',
    },

    logOutImg:
    {
    	height: 25,
		width: 25,
		marginRight: 10,
		tintColor: '#181915',		
    }
});