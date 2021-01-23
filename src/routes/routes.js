import React, { useState, useEffect } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Landing from '../screen/Landing';
import Login from '../screen/Login';
import Register from '../screen/Register';
import PassCode from '../screen/PassCode';
import Home from '../screen/Home';
import CreateNote from '../screen/CreateNote';
import ViewNotes from '../screen/ViewNotes';

import { getCookieValue } from '../utils';

export default function Routes() {
	const [isLogged, setIsLogged] = useState(false);

	useEffect(() => {
		(async () => {
			const loggedUserToken = await getCookieValue("loggedUserToken");
			if (loggedUserToken) {
				setIsLogged(true);
			}
			console.log("loggedUserToken", loggedUserToken);
		})();
	}, [])

	return (
		<Router>
			<Scene key="home" hideNavBar={true} >
				<Scene key="landingScreen" component={Landing} type="replace" initial={true} back={true} />

				<Scene key="passCodeScreen" component={PassCode} type="replace" initial={isLogged} back={true} />
				<Scene key="loginScreen" component={Login} type="replace" initial={!isLogged} />

				<Scene key="registerScreen" component={Register} />
				<Scene key="homeScreen" component={Home} type="replace" back={true} />

				<Scene key="viewNotesScreen" component={ViewNotes} back={true} />
				<Scene key="createNoteScreen" component={CreateNote} back={true} />
			</Scene>
		</Router>
	)
}
