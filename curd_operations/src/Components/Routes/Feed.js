import React, { useState, useEffect, useContext } from "react";
import styled from 'styled-components';
import {AppContext} from '../AppProvider.js';
import { Link, NavLink} from 'react-router-dom';
import uniqid from 'uniqid';

import { useFetch } from '../Hooks/useFetch.js';

const StyleFeed = styled.div`

	#feed-articles-wrapper {
		font-size: 1.5rem;
		
		#feed-articles-title-bar {
			height: 5rem;
			border: 1px solid #2d2c3c;
			padding: 1rem 2rem 1rem 2rem;
			display: flex;
			flex-direction: row;
			
			color: #5d858d;
			align-items: center;
			
			#feed-articles-showing {
				margin-right: .5rem;
			}
			#feed-articles-prev,
			#feed-articles-next {
				width: 3rem;
				height: 3rem;
				border: 1px solid #2d3c41;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				svg {
					width: 1rem;
				}
				
				&:hover {
					cursor: pointer;
				}
			}
		}
	}
	
	#feed-articles-content {
		display: grid;
		height: calc(100vh - 20rem);
		
		#feed-articles-right {
			border-right: 1px solid #2d2c3c;
			overflow-y: auto;
			
			.feed-article-title {
				height: relative;
				padding: 2rem;
				border-bottom: 1px solid #2d2d3c;
				color: #f0f0f1;
				font-size: 3rem;
				text-transform: uppercase;
				display: flex;
				flex-direction: row;
				align-items: center;
				text-decation: none; 
			}
			
			.feed-article-info-bar {
				height: 4rem;
				display: flex;
				flex-direction: row;
				border-bottom: 1px solid #2d2c3c;
				align-items: center;
				padding: 0 2rem 0 2rem;
				color: #4d6a74;
				
				a {
					display: flex;
					flex-direction: row;
					align-items: center;
					color: #56baca;
					text-decoration: none;
					text-transform: uppercase;
					
					.feed-article-author-image {
						width: 3rem;
						height: 3rem;
						margin-right: .5rem;
						border: 1px solid #322339;
					}
						
				}
				
				.feed-article-created-at {
					margin-left: 1rem;
					margin-right: 1rem;
				}
				
				& svg {
					width: 3rem;
					
					&:hover { cursor:pointer; }
				}
			}
			
			.feed-article-description {
				color: #5d858d;
				padding: 2rem;
				border-bottom: 1px solid #2d2c3c;
			}	
						
		}	
	}

`;

export function Feed() {
	const { user,authors,setAuthors }=useContext(AppContext);
	const [{fetching,response,error},doFetch] =useFetch();

	const [skip ,setSkip] =useState(0);
	const [count , setCount] =useState(0);
	const [ articles,setArticles]=useState([]);

	useEffect(()=>{
		(async function anon(){
			let options = {
				method: 'post',
				data:{
					payload:{
						col: 'articles',
						limit:10,
						skip: 0,
						sort:{createdOn:1}
					}
				}
			}
			await doFetch('http://localhost:1300/articles',options)
		})();
	},[]);

	useEffect(()=> {
		if(fetching ===false && response !== null && ("Code" in response)) {
			console.log(response);

			let itemsProcessed = 0;
			switch(response['Code']) {
				case 703:
					setCount(response['articles']['count']);
					setArticles(response['articles']['articles']);

					let currentArticles = response['articles']['articles'];
					let currentAuthors = Object.keys(authors);

					let newAuthors = [];

					currentArticles.forEach(async (a,index) => {
						if( !currentAuthors.includes(a['authorObjId']) && !newAuthors.includes(a['authorObjId'])) {
							newAuthors.push(a['authorObjId']);
						}

						itemsProcessed++;
						if(itemsProcessed === currentArticles.length) {
							// console.log('New Authors: ', newAuthors);

							let options = {
								method: 'post',
								data:{
									payload:{
										newAuthors
									}
								}
							}
							await doFetch('http://127.0.0.1:1300/authors',options);
						}
					});
					break;
				case 704:
					let newAuthorsObj = {};
					response['authors'].forEach((a) => {
						newAuthorsObj[a['_id']] = a;
						itemsProcessed++;
						if(itemsProcessed === response['authors'].length) {
							console.log('Done processing new authors.');
							setAuthors({ ...authors, ...newAuthorsObj });
						}
					});
					break;
				default:
					break;

			}
		}
	},[fetching,response,error]);

	const LikeArticle = async (oid) => {
		let options = { method: 'get' }
		
		let userId = 'Anonymous';
		(user['user'] === null) ? '' : userId = user['user']['_id'];
		
		await doFetch(`http://localhost:1300/articles/${oid}/like/${userId}`, options);
	}

	const UnLikeArticle = async (oid) => {
		let options = { method: 'get' }
		
		let userId = 'Anonymous';
		(user['user'] === null) ? '' : userId = user['user']['_id'];
		
		await doFetch(`http://localhost:1300/articles/${oid}/unlike/${userId}`, options);
	}

	const move = async(skip,bool) =>{
		console.log(skip,":",bool);
		if(bool){
			setSkip(((skip-10)<0) ? 0:skip-10);
		}
		else{
			setSkip(((skip+10)>count-10) ? count:skip+10);
		}
		let options = {
				method: 'post',
				data:{
					payload:{
						col: 'articles',
						limit:(skip+10>count)?(count-(skip-10)):10,
						skip: (bool)?skip-10:skip+10,
						sort:{createdOn:1}
					}
				}
			}
			await doFetch('http://localhost:1300/articles',options);
	}


	return(
		<StyleFeed className="master-content-page">
			<div className="master-content-page-title">Articles</div>

			<div id="feed-articles-wrapper">
				<div id ="feed-articles-title-bar">
					<Link to="/profiles/:profile">New Post</Link>
					<div className="flex-row-filler"></div>
					<div id="feed-articles-showing">Showing {skip+1} - {skip+10} Of {count}</div>
					<div id="feed-articles-prev">
						<svg onClick={(e) => move(skip,true)} aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-chevron-left fa-w-8 fa-2x"><path fill="currentColor" d="M231.293 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L70.393 256 251.092 74.87c4.686-4.686 4.686-12.284 0-16.971L231.293 38.1c-4.686-4.686-12.284-4.686-16.971 0L4.908 247.515c-4.686 4.686-4.686 12.284 0 16.971L214.322 473.9c4.687 4.686 12.285 4.686 16.971-.001z"></path></svg>					
					</div>
					<div id="feed-articles-next">
						<svg  onClick={(e) => move(skip,false)} aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-chevron-right fa-w-8 fa-2x"><path fill="currentColor" d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"></path></svg>					
					</div>
				</div>
				<div id= "feed-articles-content">
					<div id ="feed-articles-right">
						{ articles.length > 0 && articles.map((a)=>(
							<div className="feed-article" key={uniqid()}>
								<Link to="/" className="feed-article-title">{a.title}</Link>
								<div className ="feed-article-info-bar">
									{ authors[a['authorObjId']] &&
										<Link to={`/profiles/${authors[a['authorObjId']]['username']}`}>
											<img className="feed-article-author-image" src={ authors[a['authorObjId']]['profile']['url']} />
											<div className="feed-article-author-fullname">{ authors[a['authorObjId']]['fullname'] }</div>
										</Link>
									}
									<div className="feed-article-created-at"> { a.createdOn } </div>
									{ ((user['user'] === null) || (user['user'] !== null && user['user']['_id'] !== a['authorObjId'])) &&
										<>
											<img onClick={(e) => LikeArticle(a._id)} src="https://img.icons8.com/color/32/000000/filled-like.png"/>
											<br></br>
											<img onClick={(e) => UnLikeArticle(a._id)} src="https://img.icons8.com/color/32/000000/dislike.png"/>
										</>
									}
									{ (user['user'] !== null && user['user']['_id'] === a['authorObjId']) &&
										<>
											<Link to={`/articles/${a.aid}/edit`}><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="edit" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="svg-inline--fa fa-edit fa-w-18 fa-2x"><path fill="currentColor" d="M417.8 315.5l20-20c3.8-3.8 10.2-1.1 10.2 4.2V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h292.3c5.3 0 8 6.5 4.2 10.2l-20 20c-1.1 1.1-2.7 1.8-4.2 1.8H48c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h352c8.8 0 16-7.2 16-16V319.7c0-1.6.6-3.1 1.8-4.2zm145.9-191.2L251.2 436.8l-99.9 11.1c-13.4 1.5-24.7-9.8-23.2-23.2l11.1-99.9L451.7 12.3c16.4-16.4 43-16.4 59.4 0l52.6 52.6c16.4 16.4 16.4 43 0 59.4zm-93.6 48.4L403.4 106 169.8 339.5l-8.3 75.1 75.1-8.3 233.5-233.6zm71-85.2l-52.6-52.6c-3.8-3.8-10.2-4-14.1 0L426 83.3l66.7 66.7 48.4-48.4c3.9-3.8 3.9-10.2 0-14.1z"></path></svg></Link>										
										</>
									}
								</div>
								<div className="feed-article-description">{ a.description }</div>
							</div>
							))}
					</div>
				</div>
			</div>

		</StyleFeed>
		)
}