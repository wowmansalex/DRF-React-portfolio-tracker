import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deleteTransaction } from '../features/portfolio/portfolioSlice';

const DeleteConfirmation = ({
	showModal,
	hideModal,
	confirmModal,
	id,
	type,
	message,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const submitDelete = event => {
		dispatch(deleteTransaction(id));
		hideModal();
		navigate('/');
	};

	return (
		<Modal
			show={showModal}
			onHide={hideModal}>
			<Modal.Header closeButton>
				<Modal.Title>Delete</Modal.Title>
			</Modal.Header>
			<Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
			<Modal.Footer>
				<Button
					variant='default'
					onClick={hideModal}>
					Cancel
				</Button>
				<Button
					variant='danger'
					onClick={() => submitDelete(id)}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteConfirmation;
