import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetch24hprice } from '../features/portfolio/portfolioSlice';

import { Link } from 'react-router-dom';

import { Table } from 'reactstrap';

import Loading from '../components/Loading';

const AssetList = () => {
	const dispatch = useDispatch();

	const { assets } = useSelector(state => state.portfolio.assets);
	const isLoading = useSelector(state => state.portfolio.isLoading);

	useEffect(() => {
		assets.map(asset => {
			dispatch(fetch24hprice(asset.name.toLowerCase()));
		});
	}, []);

	return (
		<div>
			<Table className='assets'>
				<thead>
					<tr>
						<th></th>
						<th>Coin</th>
						<th>Current Price</th>
						<th>24h Change</th>
						<th>Amount</th>
						<th>Value</th>
						<th>Average Price</th>
						<th>Win/Loss</th>
						<th>Actions</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<Loading />
					) : (
						assets &&
						assets.map((asset, index) => {
							return (
								<tr key={index}>
									<td>
										{
											<img
												className='coin-image'
												src={asset.image}
												alt=''
											/>
										}
									</td>
									<td>{asset.name}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.current_price)}
									</td>
									<td
										className={
											Math.sign(
												parseInt(
													(asset.price_24h - asset.current_price) /
														asset.current_price
												)
											) == -1
												? 'negative'
												: 'positive'
										}>
										{(asset.current_price - asset.price_24h) / asset.price_24h}
									</td>
									<td>{asset.amount}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.value)}
									</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.average_price)}
									</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(
											asset.current_price * asset.amount -
												asset.average_price * asset.amount
										)}
									</td>
									<td>
										<Link
											className='link'
											to={`/transactions/${asset.name}`}
											asset={asset.name}>
											Transactions
										</Link>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</Table>
		</div>
	);
};

export default AssetList;
