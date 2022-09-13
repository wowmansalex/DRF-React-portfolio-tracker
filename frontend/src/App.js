import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	fetchAssets,
	fetchTransactions,
	fetchPortfolio,
	fetchLogData,
	fetchCoins,
} from './features/portfolio/portfolioSlice';

import { checkedLoggedIn, getUserDetails } from './features/auth/authSlice';

import PortfolioScreen from './screens/PortfolioScreen';

import LoginScreen from './screens/LogInScreen';

const App = () => {
	const dispatch = useDispatch();

	const user = useSelector(state => state.auth);

	const allData = [checkedLoggedIn(), getUserDetails()];

	const fetchAllData = () => {
		allData.map(fetch => dispatch(fetch));
	};

	useEffect(() => {
		fetchAllData();
	}, [user.isLoggedIn]);

	return (
		<div className='app'>
			{user.userToken ? (
				<PortfolioScreen className='general' />
			) : (
				<LoginScreen className='general' />
			)}
		</div>
	);
};

export default App;
