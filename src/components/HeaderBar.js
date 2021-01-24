import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';

import { logOut } from "../utils";

export default function HeaderBar({
	toCarry: {
		title,
	} = {}
}) {
	//on clicking on logout btn
	const logOutHandler = () => {
		Alert.alert("Logout", "Are you sure to logout?", [
			{ text: "Yes", onPress: () => logOut() },
			{ text: "No", onPress: () => console.log("No") }
		]);
	}

	//rendering
	if (title == "MNgo Notes") {
		return (
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
	else {
		return (
			<View style={styles.header}>
				<Text style={styles.headerText} > {title} </Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	header: {
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

	titleContainer: {
		width: '50%',
		flexDirection: 'row',
		alignItems: 'center', //vertical align
		justifyContent: 'flex-start', //horizontal align
	},

	titleImg: {
		height: 30,
		width: 30,
	},

	headerText: {
		fontWeight: 'bold',
		fontSize: 20,
		color: '#fff',
	},

	logOutContainer: {
		width: '50%',
		alignItems: 'flex-end',
	},

	logOutImg: {
		height: 25,
		width: 25,
		marginRight: 10,
		tintColor: '#181915',
	}
});