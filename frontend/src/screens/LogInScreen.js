import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { loginUser } from '../features/auth/authSlice';

const Login = () => {
	const dispatch = useDispatch();
	const { loading, userInfo, error, success } = useSelector(
		state => state.auth
	);
	const { register, handleSubmit } = useForm();

	const navigate = useNavigate();

	const submitForm = data => {
		dispatch(loginUser(data));
		navigate('/');
	};

	return (
		<div className='login-form mx-auto'>
			<form onSubmit={handleSubmit(submitForm)}>
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
				<button
					type='submit'
					className='btn-light'>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
