import React, { useEffect } from 'react';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '../features/auth/authSlice';

import Error from '../components/Error';

const RegisterScreen = () => {
	const { loading, error, userInfo, success } = useSelector(
		state => state.auth
	);
	const dispatch = useDispatch();

	const { register, handleSubmit } = useForm();

	const navigate = useNavigate();

	const submitForm = data => {
		if (data.password !== data.password2) {
			alert('Passwords do not match');
			return;
		}
		data.email = data.email.toLowerCase();
		console.log(data);
		dispatch(registerUser(data));
		navigate('/login');
	};

	return (
		<div className='login-form mx-auto'>
			<form
				onSubmit={handleSubmit(submitForm)}
				action=''>
				{error && <Error>{error}</Error>}
				<div className='form-group my-2'>
					<label htmlFor='email'>Email</label>
					<input
						type='email'
						className='form-control'
						{...register('email')}
						required
					/>
				</div>
				<div className='form-group my-2'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						className='form-control'
						{...register('password')}
						required
					/>
				</div>
				<div className='form-group my-2'>
					<label htmlFor='email'>Confirm Password</label>
					<input
						type='password'
						className='form-control'
						{...register('password2')}
						required
					/>
				</div>
				<button
					type='submit'
					className='btn-light'
					disabled={loading}>
					Register
				</button>
			</form>
		</div>
	);
};

export default RegisterScreen;
