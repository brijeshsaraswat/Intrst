import React, { useState,useContext, useEffect } from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { AppContext } from './AppProvider.js';

import { SidebarProfile } from './SidebarProfile.js';

const StyleSideBar = styled.div`
	height: calc(100vh - 5rem);
	background-image: linear-gradient(#21202e, #0f0f1b);
	
	display: flex;
	flex-direction: column;

`;
export function Sidebar(){
	const {user} = useContext(AppContext);
	return(
		<StyleSideBar>
			{ user.user !== null &&
			 <SidebarProfile />
			 }
		</StyleSideBar>

	)
	
}

