import React, { useState, useEffect } from 'react';
import { MdDelete, MdEdit, MdEventBusy } from 'react-icons/md';

import DeleteConfirmation from '../components/DeleteConfirmation';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Actions = props => {
	const id = props.id;
	const navigate = useNavigate();
	const dispatch = useDispatch();

	return (
		<div>
			<button onClick={() => showDeleteModal}>
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
