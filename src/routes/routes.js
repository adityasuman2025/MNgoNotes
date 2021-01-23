import React, { useState } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Login from '../screen/Login';
import Register from '../screen/Register';
import PassCode from '../screen/PassCode';
import Home from '../screen/Home';
import CreateNote from '../screen/CreateNote';
import ViewNotes from '../screen/ViewNotes';

import { getCookieValue } from '../utils';

export default function Routes() {
	const [isLogged, setIsLogged] = useState(false);

	const loggedUserToken = getCookieValue("loggedUserToken");
	if (loggedUserToken) {
		setIsLogged(true);
	}
	console.log("loggedUserToken", loggedUserToken);

	return (
		<Router>
			<Scene key="home" hideNavBar={true} >
				<Scene key="passCodeScreen" component={PassCode} type="replace" initial={isLogged} back={true} />
				<Scene key="homeScreen" component={Home} type="replace" back={true} />

				<Scene key="loginScreen" component={Login} type="replace" initial={!isLogged} />
				<Scene key="registerScreen" component={Register} />

				<Scene key="ViewNotesScreen" component={ViewNotes} back={true} />
				<Scene key="createNotesScreen" component={CreateNote} back={true} />
			</Scene>
		</Router>
	)
}
