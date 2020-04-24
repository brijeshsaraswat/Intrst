import React from 'react';
import { Switch,Route} from 'react-router-dom';

import { Feed } from './Routes/Feed.js';
import { Authentication } from './Routes/Authentication.js';
import { Profile } from './Routes/Profile.js';  
import { Article } from './Routes/Article.js';


export default () => {
	return(
		<Switch>
			<Route path="/" component={Feed} exact/>
			<Route path="/login" component={Authentication} />
			<Route path="/register" component={Authentication} />
			
			<Route path="/profiles/:profile" component={Profile} />
			<Route path="/articles/:article" component={Article} />
			<Route path="/articles/:oid/like/:uid" component={Feed}/>
			<Route path="/articles/:oid/unlike/:uid" component={Feed}/>

		</Switch>
		)
}