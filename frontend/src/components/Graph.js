import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

const Graph = () => {
	const logData = useSelector(state => state.portfolio.logData);

	let chartData = {
		labels: logData.timestamp,

		datasets: [
			{
				label: 'Current Balance',
				data: logData.current_balance,
				// you can set indiviual colors for each bar
				backgroundColor: ['rgb(97, 136, 255)'],
				borderColor: ['rgb(97, 136, 255)'],
				borderWidth: 1,
			},
		],
		options: {
			plugins: {
				legend: {
					labels: {
						// This more specific font property overrides the global property
						color: 'rgb(255, 255, 255)',
						font: {
							size: 14,
						},
					},
				},
			},
		},
	};

	return (
		<div className='mx-auto chart'>
			<Chart
				type='line'
				data={chartData}
			/>
		</div>
	);
};

export default Graph;
