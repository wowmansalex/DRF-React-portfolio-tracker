import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	Navbar,
	NavbarBrand,
	NavItem,
	Nav,
	NavbarText,
	NavLink,
} from 'reactstrap';

import { logout, getUserDetails } from '../features/auth/authSlice';

const Header = () => {
	const { loggedIn, userInfo, userToken } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUserDetails());
	}, []);

	return (
		<Navbar className='text-center'>
			<NavbarBrand>
				<NavLink href='/'>Portfolio Tracker</NavLink>
			</NavbarBrand>
			<Nav>
				{userToken ? (
					<div>
						<NavItem>
							<button
								className='btn btn-secondary'
								onClick={() => dispatch(logout())}>
								Logout
							</button>
						</NavItem>
					</div>
				) : (
					<div>
						<NavItem>
							<NavLink href='/login'>Login</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='/register'>Register</NavLink>
						</NavItem>
					</div>
				)}
			</Nav>
		</Navbar>
	);
};

export default Header;
