import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createNewPortfolio } from '../features/portfolio/portfolioSlice';

const PortfolioForm = () => {
	const auth = useSelector(state => state.auth);
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const [formInput, setFormInput] = useState({
		name: '',
		balance: '',
		user_id: auth.userInfo,
	});

	const handleChange = event => {
		setFormInput({
			...formInput,
			[event.target.name]: event.target.value,
		});
	};

	const handleSubmit = event => {
		event.preventDefault();
		console.log(formInput);
		dispatch(createNewPortfolio(formInput));
		navigate('/');
	};

	return (
		<div className='login-form mx-auto'>
			<div className='form-group'>
				<form
					action=''
					onSubmit={handleSubmit}>
					<label htmlFor=''>Portfolio name:</label>
					<input
						className='form-control my-2'
						name='name'
						type='text'
						value={formInput.name}
						onChange={handleChange}
					/>
					<label htmlFor=''>Portfolio balance:</label>
					<input
						className='form-control my-2'
						name='balance'
						type='number'
						value={formInput.balance}
						onChange={handleChange}
					/>
					<button className='btn-light'>Submit</button>
				</form>
			</div>
		</div>
	);
};

export default PortfolioForm;
