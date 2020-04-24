import React, { useContext } from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ReactJson from 'react-json-view';
import { AppContext } from './AppProvider.js';

const StyleState = styled.div`
	position: absolute;
	top: 0px;
	left: 0px;

	width: 0px;
	height: 0px;

	background: #ffffff;
	overflow: hidden;

	transition: all .2s;

	&.true {
		width: 100vw;
		height: 100vh;
		overflow: scroll;
		border: 1px solid #000;
	}
`;


export function State(){
	const appState = useContext(AppContext);
	const { display } = useContext(AppContext);
	return(
		<StyleState className={display.state}>
			<h1> State....</h1>
			<ReactJson src={appState} collapsed={false}/>
		</StyleState>

	)
	
}