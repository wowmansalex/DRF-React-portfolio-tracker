import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../constants/api';

const token = localStorage.getItem('userToken');

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async ({ email, password, password2 }, { rejectWithValue }) => {
		try {
			await api.post('/api/register/', {
				email,
				password,
				password2,
			});
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			let res = await api.post('/api/token/', { email, password });

			let data = res.data;
			console.log(data);
			localStorage.setItem('userToken', data.access);
			return data;

			// return res;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

export const getUserDetails = createAsyncThunk(
	'user/getUserDetails',
	async (_, { getState, rejectWithValue }) => {
		try {
			console.log(token);
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await api.get('/api/user/', config);
			return data;
		} catch (error) {
			if (error.response && error.response.data.message) {
				return rejectWithValue(error.response.data.message);
			} else {
				return rejectWithValue(error.message);
			}
		}
	}
);

const initialState = {
	loading: false,
	userInfo: null,
	userToken: token,
	error: null,
	success: false,
};

export const authSlice = createSlice({
	name: 'userSlice',
	initialState,
	reducers: {
		logout: state => {
			localStorage.removeItem('userToken');
			state.loading = false;
			state.userInfo = null;
			state.userToken = null;
			state.error = null;
		},
	},
	extraReducers: {
		[registerUser.pending]: state => {
			state.loading = true;
			state.error = null;
		},
		[registerUser.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.success = true;
		},
		[registerUser.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		[loginUser.pending]: state => {
			state.loading = true;
			state.error = null;
		},
		[loginUser.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.userInfo = payload;
			state.success = true;
			state.userToken = payload.access;
		},
		[loginUser.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		[getUserDetails.pending]: state => {
			state.loading = true;
			state.error = null;
		},
		[getUserDetails.fulfilled]: (state, { payload }) => {
			state.loading = false;
			state.userInfo = payload.response;
		},
		[getUserDetails.rejected]: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
	},
});

export default authSlice.reducer;
export const { logout } = authSlice.actions;
