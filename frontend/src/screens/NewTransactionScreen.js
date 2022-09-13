import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
	createNewTransaction,
	fetchLogData,
	fetchCoins,
	fetchPortfolio,
} from '../features/portfolio/portfolioSlice';

import axios from 'axios';

import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

const NewTransactionForm = () => {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const portfolio = useSelector(state => state.portfolio);
	console.log(portfolio.id);

	const [formInput, setFormInput] = useState({
		transaction_type: '',
		coin: '',
		symbol: '',
		amount: '',
		date_added: '',
		price: '',
		portfolio_linked: portfolio.id,
	});

	useEffect(() => {
		dispatch(fetchPortfolio());
		dispatch(fetchCoins());
		let date = new Date(formInput.date_added)
			.toLocaleDateString('en-GB')
			.replace(/\//g, '-');

		const fetchCurrentPrice = async () => {
			let coin_request = '';

			coin_names.map(coin => {
				if (formInput.coin === coin[1]) {
					coin_request = coin[0];
				}
			});
			const response = await axios.get(
				`https://api.coingecko.com/api/v3/coins/${coin_request}/history?date=${date}`
			);

			setFormInput({
				...formInput,
				price: response.data.market_data.current_price.usd.toFixed(2),
			});
			return response.data;
		};

		fetchCurrentPrice();
	}, [formInput.date_added]);

	const { coin_names } = useSelector(state => state.portfolio.logData);

	const handleChange = event => {
		if (event.target.id === 'select') {
			// console.log(event.target.options[event.target.selectedIndex].text);
			setFormInput(current => {
				return {
					...current,
					coin: event.target.options[event.target.selectedIndex].text,
				};
			});
		} else {
			setFormInput({
				...formInput,
				[event.target.name]: event.target.value,
			});
		}
	};

	const handleSubmit = event => {
		// prevents the submit button from refreshing the page
		event.preventDefault();
		dispatch(createNewTransaction(formInput));
		navigate('/');
	};

	return (
		<div className='container-md mx-auto row justify-content-center '>
			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<label htmlFor='select'>Select a coin</label>
					<select
						id='select'
						onChangeCapture={handleChange}>
						{coin_names &&
							coin_names.map((coin, index) => {
								return (
									<option
										key={index}
										index={index}
										name='coin'
										value={formInput.coin}>
										{coin[1]}
									</option>
								);
							})}
					</select>
				</FormGroup>
				<FormGroup>
					<Label for='transaction_type'>Buy or Sell:</Label>
					<Input
						type='text'
						name='transaction_type'
						value={formInput.transaction_type}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='amount'>Amount:</Label>
					<Input
						type='text'
						name='amount'
						value={formInput.amount}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='date'>Date:</Label>
					<Input
						type='date'
						name='date_added'
						value={formInput.date_added}
						onChange={handleChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for='price'>Price:</Label>
					<Input
						type='text'
						name='price'
						value={formInput.price}
						onChange={handleChange}
					/>
				</FormGroup>
				<Button>Add Transaction</Button>
			</Form>
		</div>
	);
};

export default NewTransactionForm;
