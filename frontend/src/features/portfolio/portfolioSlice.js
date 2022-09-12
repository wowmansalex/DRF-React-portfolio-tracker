import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../constants/api';
import axios from 'axios';

import {
	PORTFOLIO,
	ASSET,
	TRANSACTION,
	TRANSACTION_ASSET,
	TRANSACTION_LIST,
	TRANSACTION_DETAIL,
	LOG_DATA,
} from '../../constants/endpoints';

const token = localStorage.getItem('userToken');

const config = {
	headers: {
		Authorization: `Bearer ${token}`,
	},
};

export const fetchPortfolio = createAsyncThunk(
	'portfolio/fetchPortfolio',
	async (arg, { getState, rejectWithValue }) => {
		try {
			const id = getState().portfolio.id;
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const response = await api.get(PORTFOLIO + `${id}`, config);

			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				console.log(error.message);
				return rejectWithValue(error.response.data.message);
			} else {
				console.log('source: fetchPortfolio:' + error.message);
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchAssets = createAsyncThunk(
	'assets/fetchAssets',
	async (arg, { getState, rejectWithValue }) => {
		try {
			const portfolioId = getState().portfolio.id;
			const response = await api.get(ASSET + `${portfolioId}`, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchTransactions = createAsyncThunk(
	'transactions/fetchTransactions',
	async (_, { getState, rejectWithValue }) => {
		try {
			const portfolioLinked = getState().portfolio.id;
			const response = await api.get(
				TRANSACTION_LIST + `${portfolioLinked}`,
				config
			);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchTransactionByAsset = createAsyncThunk(
	'transactions/fetchTransactiopnsByAsset',
	async (coin, { rejectWithValue }) => {
		try {
			const response = await api.get(TRANSACTION_ASSET + `${coin}`, config);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const createNewTransaction = createAsyncThunk(
	'transactions/createNewTransaction',
	async (data, { getState, rejectWithValue }) => {
		try {
			const portfolioLinked = getState().portfolio.portfolio_name;
			const response = await api.post(
				TRANSACTION_LIST + `${portfolioLinked}`,
				data,
				config
			);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const deleteTransaction = createAsyncThunk(
	'transaction/deleteTransaction',
	async (id, { getState, rejectWithValue }) => {
		try {
			const portfolioLinked = getState().portfolio.id;
			const config_delete = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				params: { transaction_id: id, portfolio_linked: portfolioLinked },
			};
			const response = await api.delete(TRANSACTION_DETAIL, config_delete);
			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchLogData = createAsyncThunk(
	'logData/getLogData',
	async (_, { getState, rejectWithValue }) => {
		try {
			const portfolioLinked = getState().portfolio.id;
			const response = await api.get(LOG_DATA + `${portfolioLinked}`, config);

			return response.data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const fetchCoins = createAsyncThunk('logData/fetchCoins', async () => {
	const response = await axios.get(
		'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
	);
	return response.data;
});

const initialState = {
	id: 1,
	portfolio_name: 'test',
	assets: [],
	transactions: [],
	balance: 0,
	logData: {
		coin_names: [],
		current_balance: [],
		timestamp: [],
	},
	isLoading: false,
	error: '',
	success: false,
	deleted: false,
};

const portfolioSlice = createSlice({
	name: 'portfolio',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchPortfolio.pending]: state => {
			console.log('fetch portfolio pending');
			state.isLoading = true;
		},
		[fetchPortfolio.fulfilled]: (state, { payload }) => {
			console.log('fetch portfolio fulfilled');
			state.isLoading = false;
			state.balance = payload.balance;
			state.id = payload.id;
		},
		[fetchPortfolio.rejected]: (state, { payload }) => {
			console.log('fetch portfolio rejected');
			state.isLoading = false;
			state.error = payload;
		},
		[fetchAssets.pending]: state => {
			console.log('fetch assets pending');
			state.isLoading = true;
		},
		[fetchAssets.fulfilled]: (state, { payload }) => {
			console.log('fetch assets fulfilled');
			state.isLoading = false;
			state.assets = payload;
		},
		[fetchAssets.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('Error:' + payload + 'fetch assets rejected');
		},
		[fetchTransactions.pending]: () => {
			console.log('fetching transaction pending');
		},
		[fetchTransactions.fulfilled]: (state, { payload }) => {
			console.log('fetch transaction fulfilled');
			return { ...state, transactions: payload };
		},
		[fetchTransactions.rejected]: (state, { payload }) => {
			state.error = payload;
			console.log('fetch transaction rejected');
		},
		[createNewTransaction.pending]: () => {
			console.log('creating transaction pending');
		},
		[createNewTransaction.fulfilled]: (state, { payload }) => {
			console.log(payload, 'creating transaction fulfilled');
			state.transactions.push(payload);
			state.deleted = false;
		},
		[createNewTransaction.rejected]: () => {
			console.log('creating transaction rejected');
		},
		[deleteTransaction.pending]: () => {
			console.log('delete transaction pending');
		},
		[deleteTransaction.fulfilled]: (state, { payload }) => {
			state.deleted = true;
			console.log('delete transaction fulfilled');
		},
		[deleteTransaction.rejected]: (state, { payload }) => {
			state.success = false;
			state.error = payload;
			console.log('delete transaction rejected');
		},
		[fetchTransactionByAsset.pending]: () => {
			console.log('fetching transaction by asset pending');
		},
		[fetchTransactionByAsset.fulfilled]: (state, { payload }) => {
			console.log('fetch transaction by asset fulfilled');
			return { ...state, transactions: payload };
		},
		[fetchTransactionByAsset.rejected]: () => {
			console.log('fetch transaction by asset rejected');
		},
		[fetchLogData.pending]: state => {
			state.isLoading = true;
			console.log('fetch log data pending');
		},
		[fetchLogData.fulfilled]: (state, { payload }) => {
			state.logData.current_balance = payload.map(item => {
				return item['current_balance'];
			});
			state.logData.timestamp = payload.map(item => {
				return new Date(item['updated']).toLocaleTimeString('en', {
					timeStyle: 'short',
					hour12: false,
					timeZone: 'UTC',
				});
			});
			console.log(payload, 'fetch log data fulfilled');
		},
		[fetchLogData.rejected]: state => {
			state.isLoading = false;
			console.log('fetch log data fulfilled');
		},
		[fetchCoins.pending]: state => {
			state.isLoading = true;
			console.log('fetching coin data pending');
		},
		[fetchCoins.fulfilled]: (state, { payload }) => {
			console.log('fetching coin data fulfilled');
			state.logData.coin_names = payload.map(item => {
				return [item['id'], item['name']];
			});
		},
		[fetchCoins.rejected]: state => {
			state.isLoading = false;
			console.log('fetch coins rejected');
		},
	},
});

export const {} = portfolioSlice.actions;
export default portfolioSlice.reducer;
