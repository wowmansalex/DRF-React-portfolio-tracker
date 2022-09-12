import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetch24hprice } from '../features/portfolio/portfolioSlice';

import { Link } from 'react-router-dom';

import { Table } from 'reactstrap';

const AssetList = () => {
	const dispatch = useDispatch();

	const { assets } = useSelector(state => state.portfolio.assets);
	console.log(assets);

	useEffect(() => {
		assets.map(asset => {
			dispatch(fetch24hprice(asset.name.toLowerCase()));
		});
	}, []);

	return (
		<div>
			<Table>
				<thead>
					<tr>
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
					{assets &&
						assets.map((asset, index) => {
							return (
								<tr key={index}>
									<td>{asset.name}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(asset.current_price)}
									</td>
									<td>
										{new Intl.NumberFormat('default', {
											style: 'percent',
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}).format(
											(asset.price_24h - asset.current_price) / asset.price_24h
										)}
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
											className='text-decoration-none'
											to={`/transactions/${asset.name}`}
											asset={asset.name}>
											Transactions
										</Link>
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</div>
	);
};

export default AssetList;
