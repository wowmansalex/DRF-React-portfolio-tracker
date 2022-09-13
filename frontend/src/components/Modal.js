import React, { useState } from 'react';
import { Card, Container, Alert } from 'react-bootstrap';

const Modal = () => {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const setOpenModal = () => {
		setModalIsOpen(true);
	};

	return (
		<>
			<button onClick={setOpenModal}></button>
		</>
	);
};

export default Modal;
