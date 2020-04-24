import React, { useState,useContext, useEffect } from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {Link,NavLink} from 'react-router-dom';

import { AppContext } from './AppProvider.js';

const StyleNavbar = styled.div`
	position: relative;
	width: 100vw;
	height: 5rem;
	background: #21202e;

	display: grid;
	grid-template-columns: 25% 75%;


	& a {
		color: #56baca;
		text-decoration: none;
		margin-right: 1rem;
		font-size: 2rem;
	}

	#nav-left,
	#nav-right {
		display: flex;
		flex-direction: row;
		align-item: center;
		#logo {
			position: relative;
		
			width: 16rem;
			height: 5rem;
			
			background-position: center center;
			background-size: 4rem 4rem;
		}
		#logo-link {
			position: relative;
		
			width: 7.5rem;
			height: 4.5rem;
			
			background-position: center center;
			background-size: 4rem 4rem;
		}
	}	

	#nav-left{


		#nav-left-text{
			position:relative;
			color: #324544;
			align: center;
			font-size: 10 rem;
			text-transform: uppercase;
		}
	}

	#nav-right{
		width: 100%;
	}

`;


export function Navbar(){
	const { user, setJwt } = useContext(AppContext);
	const handleLogout = ()=>{
		setJwt('^vAr^');
	}
	return(
		<StyleNavbar>
			<div id="nav-left">
			
			<img id="logo" src="/images/logo.png"/>
			</div>
			<div id="nav-right">
				<Link to="/">
					<img id="logo" src="/images/logo.png"/>
				</Link>
				<div className="flex-row-filler"></div>
				<NavLink to="/" exact>
					<img id="logo-link" src="/images/home.png"/>
				</NavLink>
					{ user.isLoggedIn===true &&
						<NavLink to="/" onClick={ handleLogout }>
							<img id="logo-link" src="/images/logout.png"/>
						</NavLink>
					}
					{	user.isLoggedIn === false &&
						<>
											<NavLink to="/login">
												<img id="logo-link" src="/images/login.png"/>
											</NavLink>
											<NavLink to="/register">
												<img id="logo-link" src="/images/register.png"/>
											</NavLink>
						</>
					}
			</div>
		</StyleNavbar>

	)
	
}