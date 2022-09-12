import React, { useEffect } from 'react';
import { MdDelete, MdEdit, MdEventBusy } from 'react-icons/md';

import { deleteTransaction } from '../features/portfolio/portfolioSlice';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Actions = props => {
	const id = props.id;
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClick = event => {
		dispatch(deleteTransaction(id));
		navigate('/');
	};

	return (
		<div>
			<button onClick={handleClick}>
				<MdDelete
					id='delete'
					className='mx-1'
				/>
			</button>
			<button>
				<MdEdit
					id='edit'
					className='mx-1'
				/>
			</button>
		</div>
	);
};

export default Actions;
