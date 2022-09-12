import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	fetchAssets,
	fetchTransactions,
	fetchPortfolio,
} from './features/portfolio/portfolioSlice';
// import { fetchGraphData, fetchCoins } from '../features/graphSlice';

import PortfolioScreen from './screens/PortfolioScreen';

import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const Main = () => {
	const dispatch = useDispatch();

	const allFetch = [
		fetchAssets(),
		fetchTransactions(),
		fetchPortfolio(),
		// fetchGraphData(),
		// fetchCoins(),
	];

	const fetchAllData = () => {
		allFetch.map(fetch => dispatch(fetch));
	};

	useEffect(() => {
		fetchAllData();
		const timer = setTimeout(() => fetchAllData(), 10000);
		return () => clearTimeout(timer);
	}, []);

	const portfolio = useSelector(state => state.portfolio);

	return (
		<div className='container'>
			<PortfolioScreen />
		</div>
	);
};

export default Main;
