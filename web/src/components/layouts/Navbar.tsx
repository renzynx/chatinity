import _ from 'react';
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Toolbar,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MeQuery, useLogoutMutation } from '../../generated/graphql';

const Navbar: _.FC<{ data: MeQuery['me'] }> = ({ data }) => {
	const navigate = useNavigate();
	const [, logout] = useLogoutMutation();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="sticky">
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, cursor: 'pointer' }}
						onClick={() => navigate('/')}
					>
						Chat App
					</Typography>
					{!data ? (
						<Box sx={{ display: 'flex', gap: '5px' }}>
							<Button onClick={() => navigate('/login')} variant="contained">
								Login
							</Button>
							<Button onClick={() => navigate('/register')} variant="contained">
								Register
							</Button>
						</Box>
					) : (
						<Button
							onClick={() => {
								logout({}).then(() => {
									window.location.reload();
								});
							}}
							variant="contained"
							color="error"
						>
							Logout
						</Button>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Navbar;
