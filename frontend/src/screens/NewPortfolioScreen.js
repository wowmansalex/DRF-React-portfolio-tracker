import React from 'react';

const NewPortfolioScreen = () => {
	return (
		<div className='d-flex flex-row justify-content-center mx-auto'>
			<div className='d-flex flex-column justify-content-center'>
				<h4>No portfolios found</h4>
				<a
					href='/add-portfolio'
					className='btn-light m-auto'>
					Create new portfolio
				</a>
			</div>
		</div>
	);
};

export default NewPortfolioScreen;
