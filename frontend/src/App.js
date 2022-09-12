import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { checkedLoggedIn, getUserDetails } from './features/auth/authSlice';

import PortfolioScreen from './screens/PortfolioScreen';

import LoginScreen from './screens/LogInScreen';

const App = () => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.auth);

	const userFetch = [checkedLoggedIn, getUserDetails];

	const fetchAllData = () => {
		userFetch.map(fetch => dispatch(fetch));
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	return (
		<div className='container'>
			{user.userToken ? <PortfolioScreen /> : <LoginScreen />}
		</div>
	);
};

export default App;
