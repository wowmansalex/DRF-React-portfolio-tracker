import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

import { fetchAssets } from '../features/portfolio/portfolioSlice';
import { fetchTransactionByAsset } from '../features/portfolio/portfolioSlice';

import { Table } from 'reactstrap';
import Actions from '../components/Actions';

const TransactionList = () => {
	const dispatch = useDispatch();
	const transactions = useSelector(state => state.portfolio.transactions);
	let asset = useParams();

	useEffect(() => {
		dispatch(fetchTransactionByAsset(asset.asset));
	}, []);

	return (
		<div>
			<Table>
				<thead>
					<tr>
						<th>Coin</th>
						<th>Date</th>
						<th>Price</th>
						<th>Amount</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{transactions &&
						transactions.map((transaction, index) => {
							return (
								<tr key={index}>
									<td>{transaction.coin}</td>
									<td>{transaction.date_added.substring(0, 10)}</td>
									<td>
										{new Intl.NumberFormat('en-IN', {
											style: 'currency',
											currency: 'USD',
										}).format(transaction.price)}
									</td>
									<td>{transaction.amount}</td>
									<td>
										<Actions id={transaction.id} />
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</div>
	);
};

export default TransactionList;
