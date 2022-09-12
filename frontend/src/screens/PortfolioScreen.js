import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	fetchAssets,
	fetchTransactions,
	fetchPortfolio,
	fetchLogData,
	fetchCoins,
} from '../features/portfolio/portfolioSlice';
// import { fetchGraphData, fetchCoins } from '../features/graphSlice';

import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import AssetList from '../components/AssetsList';
import Graph from '../components/Graph';

const Main = () => {
	const dispatch = useDispatch();

	const allFetch = [
		fetchPortfolio(),
		fetchAssets(),
		fetchTransactions(),
		// fetchLogData(),
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
			<div>
				<h4>Current Balance</h4>
				<div>
					{new Intl.NumberFormat('en-IN', {
						style: 'currency',
						currency: 'USD',
					}).format(portfolio.balance)}
				</div>
			</div>
			<div>Graph</div>
			<div className='d-flex justify-content-between'>
				<h4 className=''>Your Assets</h4>
				<Button>
					<a
						className='text-light text-decoration-none'
						href='/add-transaction'>
						Add New
					</a>
				</Button>
			</div>
			<div>
				<AssetList />
			</div>
		</div>
	);
};

export default Main;