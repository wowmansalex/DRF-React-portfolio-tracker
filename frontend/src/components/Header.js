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
import { portfolioReset } from '../features/portfolio/portfolioSlice';

const Header = () => {
	const { loggedIn, userInfo, userToken } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const logOut = () => {
		dispatch(portfolioReset());
		dispatch(logout());
	};

	useEffect(() => {
		dispatch(getUserDetails());
	}, []);

	return (
		<Navbar className='header text-center'>
			<NavbarBrand>
				<NavLink
					className='header-title'
					href='/'>
					Portfolio Tracker
				</NavLink>
			</NavbarBrand>
			<Nav>
				{userToken ? (
					<Nav>
						<NavItem>
							<button
								className='link-light btn btn-link'
								onClick={() => logOut()}>
								Logout
							</button>
						</NavItem>
					</Nav>
				) : (
					<Nav>
						<NavItem>
							<NavLink
								className='link-light'
								href='/login'>
								Login
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								className='link-light'
								href='/register'>
								Register
							</NavLink>
						</NavItem>
					</Nav>
				)}
			</Nav>
		</Navbar>
	);
};

export default Header;
