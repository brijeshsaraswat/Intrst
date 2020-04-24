import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {AppContext} from '../AppProvider.js';

import { Button } from '../Button.js';
import { FormTextField } from '../FormTextField.js';
import { useInputChange } from '../Hooks/useInputChange.js';
import { useFetch } from '../Hooks/useFetch.js';

const StyleAuthentication = styled.div`
	overflow:auto;

	#auth-login-form,
	#auth-registration-form {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}

	#auth-login-form {
		position: relative;
		width: 32rem;
		display: flex;
		flex-direction: column;

		#auth-login-form-logo-header {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 1rem;
			justify-content: center;

			#auth-login-form-logo-header-title {
				color: #56baca;
				font-size: 5rem;
				margin-left: 1rem;
			}
		}
		#auth-login-form-content {
			width: 100%;
			height: 100%;
			border: 1px solid #2d2c3c;	
		
			#auth-login-form-content-header {
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #2d2c3c;				
				padding: 1rem;
				
				#auth-login-form-content-header-text {
					font-size: 3rem;
					color: #e1e1e3;
				}
				
				#auth-login-form-content-header-registration-link {
					font-size: 2rem;
					color: #52b0c0;
					&:hover {
						cursor: pointer;
					}
				}
			}
			#auth-login-open-id	{
				padding: 1rem;
			}
			#auth-login-form-form {
				padding: 1rem;
			}		
		}


	}

	#auth-registration-form {
		height: calc(100vh - 12rem);
		
		width: 52rem;
		
		
		display: grid;
		grid-template-columns: 50rem;

		#auth-registration-form-right {
			#auth-registration-form-right-header {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 2.5rem;
					
				height: 5rem;
				padding: 1rem;	
						
				.auth-registration-form-right-header.left {
					color: #e1e1e3;
					font-size: 2rem;				
				}
				.auth-registration-form-right-header.right {
					color: #557880;
					
					span {
						color:#4891a0;
					}
				}	
				
				border-bottom: 1px solid #2d2c3c;			
			}
			#auth-registration-form-right-form {
				display: flex;
				flex-direction: column;
				padding: .5rem 0 0 .5rem;				
			}
				
	}

	& #auth-messages {
		padding: .5rem;
		width: 100%;
		color: #a0371d;
	}

`;

export function Authentication({location}) {
	console.log(location);
	const { dispatch, setJwt} = useContext(AppContext);

	const [loginData,handleLoginInputChange]= useInputChange();
	const [registrationData, handleRegistrationInputChange] = useInputChange();
	const [{fetching,response,error}, doFetch ] = useFetch();

	const handleLogin = async()=>{
		console.log(loginData);

		let payload ={ ...loginData };
		payload['user'] = btoa(payload['user']);
		payload['password']= btoa(payload['password']);

		let options ={
			method: 'post',
			data: {
				payload,
			}

		}
		console.log(options);
		await doFetch('http://localhost:1300/login',options);

	}

	const handleRegistration= async()=>{
		console.log(registrationData);

		let register={...registrationData};
		if(register['password']==register['RTPassword']){
			// payload['role']='subscriber';
			// payload['fullname']=btoa(register['name']);
			// payload['username']=btoa(register['username']);
			// payload['email']=btoa(register['email']);
			// payload['password']=btoa(register['password']);
			// payload[profile[location['city']]]=btoa(payload['city']);
			// payload[profile[location['state']]]=btoa(payload['state']);
			// payload[profile[location['country']]]=btoa(payload['country']);
			let payload = {
				"role" : "subscriber",
    			"fullname" : register['name'],
    			"username" : register['username'],
    			"email" : register['email'],
    			"password" : btoa(register['password']),
    			"profile" : {
        			"url" : "/images/profiles/pic.jpg",
        			"location" : {
           					 "city" : register['city'],
            				"state" : register['state'],
            				"country" : register['country']
       						 }
   						 }
			};
			let options ={
				method:'post',
				data:{
					payload,
				}
			}
			console.log(options);
			await doFetch('http://localhost:1300/new_user',options);
		}
	}


	useEffect(()=>{
		if(fetching===false && response!==null && ('access_token' in response) && ('user' in response)){
			console.log(response.user);
			dispatch({ type: 'SET_AUTHORIZED', payload: response.user});
			setJwt(response.access_token);
		}
		if(fetching ===false &&error!==null){
			console.log("Error Fetch",error);
			console.log('Server Error Response:',error.response.data['Error']);
		}
	},[fetching,error,response]);


	return(
		<StyleAuthentication className="master-content-page">
			{	location.pathname=="/login"&&
				<div id="auth-login-form">
					<div id="auth-login-form-logo-header">
						<div id="auth-login-form-logo-header-title">!nterest</div>
					</div>
					<div id="auth-login-form-content">
						<div id="auth-login-form-content-header">
							<div id="auth-login-form-content-header-text">LOGIN</div>
							<div className="flex-row-filler"></div>
							<div id="auth-login-form-content-header-registration-link"><Link to="/register"> REGISTRATION</Link></div>
						</div>						
						<div id="auth-login-form-form">
							<FormTextField label="Email Address or Username" placeholder="" role="text" name="user" onChange={handleLoginInputChange}/>
							<FormTextField label="Password" placeholder="" role="password" name="password" onChange={handleLoginInputChange} />						
							<Button btype="generic" text="LOGIN" onClick={(e) => handleLogin()} margin=".5rem 0 .5rem 0"/>
						</div>								
					</div>
					{ error !== null &&
						<ul id="auth-messages">
							{ (error.hasOwnProperty('response')  && error.response.data['Error'].length > 0) && error.response.data['Error'].map((e) => (
								<li>{ e }</li>
							))}
						</ul>
					}
				</div>		
					
			}
			{	location.pathname=="/register"&&
				<div id="auth-registration-form">
					<div id="auth-registration-form-right">
						<div id="auth-registration-form-right-header">
							<div className="auth-registration-form-right-header left"><Link to="/register"> REGISTRATION</Link></div>
							<div className="flex-row-filler"></div>
							<div className="auth-registration-form-right-header right">Back to <span><Link to="/login"> LOGIN</Link> </span></div>							
						</div>
						<div id="auth-registration-form-right-form">
							<FormTextField label="Full Name" placeholder="" role="text" name="name"  onChange={handleRegistrationInputChange}/>
							<FormTextField label="Username" placeholder="" role="text" name="username"  onChange={handleRegistrationInputChange}/>
							<FormTextField label="Email" placeholder="" role="email" name="email"  onChange={handleRegistrationInputChange}/>
							<FormTextField label="Password" placeholder="" role="password" name="password" onChange={handleRegistrationInputChange}/>
							<FormTextField label="Retype Password" placeholder="" role="password" name="RTPassword" onChange={handleRegistrationInputChange}/>
							<FormTextField label="City" placeholder="" role="city" name="city"  onChange={handleRegistrationInputChange}/>
							<FormTextField label="State" placeholder="" role="state" name="state"  onChange={handleRegistrationInputChange}/>
							<FormTextField label="Country" placeholder="" role="country" name="country"  onChange={handleRegistrationInputChange}/>
							<Link to="/login">
							<Button btype="generic" text="Register" onClick={(e) => handleRegistration()} margin=".5rem 0 .5rem 0"/>
							</Link> 							
						</div>
					</div>
				</div>
			}

		</StyleAuthentication>
		)
	
}