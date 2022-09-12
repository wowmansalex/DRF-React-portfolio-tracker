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
import Loading from '../components/Loading';

import AssetList from '../components/AssetsList';
import Graph from '../components/Graph';

const PortfolioScreen = () => {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth);

	const portfolioFetch = [
		fetchPortfolio(),
		fetchAssets(),
		fetchTransactions(),
		fetchLogData(),
	];

	const fetchAllData = () => {
		portfolioFetch.map(fetch => dispatch(fetch));
	};

	useEffect(() => {
		if (user.userToken == null) {
			console.log('No user token');
		} else {
			fetchAllData();
			const timer = setTimeout(() => fetchAllData(), 10000);
			return () => clearTimeout(timer);
		}
	}, []);

	const portfolio = useSelector(state => state.portfolio);

	return (
		<div className='container'>
			<div>
				<div>
					<h4>Current Balance</h4>
					<div>
						{new Intl.NumberFormat('en-IN', {
							style: 'currency',
							currency: 'USD',
						}).format(portfolio.balance)}
					</div>
				</div>
				<Graph />
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
		</div>
	);
};

export default PortfolioScreen;
