import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppProvider.js';
import { useFetch } from '../Hooks/useFetch.js';
import {CreatePost} from '../CreatePost.js';

const { v1: uuidv1 } = require('uuid');

const StyledProfile = styled.div`
	display: grid;
	grid-template-columns: 28rem 1fr 28rem

	#profile-center-column {
		margin:0 1rem 0 1rem;
	}
`;

export function Profile(){
	const {user} = useContext(AppContext);
	const [{fetching,response,error},doFetch]=useFetch();

	const handlePostSubmit = async(payload)=>{
		payload['authorObjId'] = user.user._id;

		let aid =uuidv1();
		payload['aid'] = aid;
		payload['createdOn']= new Date().toISOString();
		payload['slug']='/articles/'+aid;

		let options ={
			method: 'post',
			data:{
				payload,
			}
		}
		await doFetch('http://localhost:1300/articles/post/new',options);


	}

	return(
		<StyledProfile className="master-content-page profile">
			<div id="profile-left-column">
			</div>
			<div id="profile-center-column">
				<CreatePost handlePostSubmit={handlePostSubmit}  />
			</div>
			<div id="profile-right-column">
			</div>
		</StyledProfile>
		)

}