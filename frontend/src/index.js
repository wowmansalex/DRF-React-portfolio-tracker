import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { store } from './features/store';
import { Provider } from 'react-redux';

import './index.css';

import App from './App';

import Header from './components/Header';
import Portfolio from './screens/PortfolioScreen';
import LogInScreen from './screens/LogInScreen';
import RegisterScreen from './screens/RegisterScreen';
import NewTransactionScreen from './screens/NewTransactionScreen';
import TransactionForm from './screens/TransactionScreen';
import PortfolioForm from './screens/PortfolioForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<div>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route
						path='/'
						element={<App />}></Route>
					<Route
						path='/add-transaction'
						element={<NewTransactionScreen />}></Route>
					<Route
						path='/portfolio'
						element={<Portfolio />}></Route>
					<Route
						path='/transactions/:asset'
						element={<TransactionForm />}></Route>
					<Route
						path='/login'
						element={<LogInScreen />}></Route>
					<Route
						path='/register'
						element={<RegisterScreen />}></Route>
					<Route
						path='/add-portfolio'
						element={<PortfolioForm />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	</Provider>
);
