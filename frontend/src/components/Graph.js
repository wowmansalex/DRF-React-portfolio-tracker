import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

const Graph = () => {
	const { balance, timestamp } = useSelector(state => state.graphData);

	let chartData = {
		labels: timestamp,

		datasets: [
			{
				label: 'Current Balance',
				data: balance,
				// you can set indiviual colors for each bar
				backgroundColor: ['rgba(9, 52, 166, 0.8)'],

				borderWidth: 1,
			},
		],
		options: {},
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
