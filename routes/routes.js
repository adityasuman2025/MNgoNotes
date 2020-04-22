import React, { useState } from 'react';
import {Router, Stack, Scene, Actions} from 'react-native-router-flux';

import { AsyncStorage } from 'react-native';

import LoginForm from '../components/loginForm';
import RegisterForm from '../components/registerForm';
import CreateNotesForm from '../components/createNotesForm';

import Home from '../screen/Home';
import ViewNotes from '../screen/ViewNotes';

export default function Routes()
{
	const [logged_user_id, setLogged_user_id] = useState("");
	const [isLogged, setIsLogged] = useState(false);

	// const [toRefreshHome, setToRefreshHome] = useState(1);
	var toRefreshHome = 1;

	AsyncStorage.getItem('logged_user_id').then((value) =>
	{
		if(value != null)
	  	{
	  		setLogged_user_id(value.trim());
	  		setIsLogged(true);
	  	}
	});

	const onEnterHandler = () =>
	{
	}

	return(
		<Router>	  
     		<Scene key="home" hideNavBar={true} >
				<Scene key="homePage" component={Home} type="replace" toCarry = {{logged_user_id: logged_user_id}} initial={isLogged}  back={true} />

				<Scene key="login" component={LoginForm} type="replace" initial={!isLogged} />
				<Scene key="registerPage" component={RegisterForm} />

				<Scene key="ViewNotesPage" component={ViewNotes} back={true} onEnter={() => onEnterHandler()} />
				<Scene key="createNotesForm" component={CreateNotesForm} back={true} onEnter={() => onEnterHandler()} />
			</Scene>		
		 </Router>
	)
}
