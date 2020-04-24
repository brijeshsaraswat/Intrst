import React,{useState, useEffect} from 'react';
import axios from 'axios';

export const useFetch=()=>{
	const [ fetching, setFetching ] = useState(false);
	const [ response, setResponse ] = useState(null); 
	const [ error, setError ] = useState(null);

	const doFetch = async(url,options ={}) =>{
		setFetching(true);
		setResponse(null);
		setError(null);

		axios(url,options).then((res)=>{
			console.log('success:',res);
			setFetching(false);
			setResponse(res.data);
		}).catch(error=>{
			setFetching(false);

			setError(error);

		});
	}

	return [{fetching,response,error},doFetch]
}