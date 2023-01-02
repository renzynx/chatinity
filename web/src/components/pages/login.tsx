import React from 'react';
import {
	Box,
	FormControl,
	TextField,
	Link,
	Typography,
	IconButton,
	InputAdornment,
	Tooltip,
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useLoginMutation } from '../../generated/graphql';
import { LoadingButton } from '@mui/lab';
import { toErrorMap } from '../../lib/utils';

const Login = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);
	const navigate = useNavigate();
	const [{ fetching }, login] = useLoginMutation();

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					width: '100vw',
				}}
			>
				<Tooltip title="Home Page">
					<IconButton
						onClick={() => navigate('/')}
						color="info"
						sx={{ position: 'absolute', top: 20, left: 30 }}
					>
						<ArrowBack />
					</IconButton>
				</Tooltip>
				<Formik
					initialValues={{
						username_email: '',
						password: '',
					}}
					validate={(values) => {
						const errors: Record<string, string> = {};
						Object.keys(values).forEach((key) => {
							// @ts-ignore
							if (!values[key]) {
								// format username_email to Username or Email
								const formattedKey = key
									.replace('_', ' ')
									.split(' ')
									.map((word) => word[0].toUpperCase() + word.slice(1))
									.join(' ');
								errors[key] = `${formattedKey} is required`;
							}
						});
						return errors;
					}}
					onSubmit={async (values, { setErrors }) => {
						const { data } = await login({
							input: values,
						});

						if (data?.login.errors) {
							setErrors(toErrorMap(data.login.errors));
						} else {
							navigate('/', { replace: true });
						}
					}}
				>
					{({
						values,
						handleSubmit,
						handleChange,
						errors,
						touched,
						handleBlur,
					}) => (
						<form onSubmit={handleSubmit}>
							<FormControl
								sx={{
									width: 420,
									'@media (max-width: 420px)': {
										width: '95%',
									},
									display: 'flex',
									flexDirection: 'column',
									gap: '20px',
									boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
									paddingTop: '30px',
									paddingBottom: '30px',
									paddingLeft: '20px',
									paddingRight: '20px',
									borderRadius: '10px',
									backgroundColor: '#212121',
								}}
							>
								<Typography variant="h4">Login</Typography>
								<TextField
									name="username_email"
									label="Email or Username"
									value={values.username_email}
									onChange={handleChange}
									error={!!errors.username_email && touched.username_email}
									helperText={
										!!errors.username_email &&
										touched.username_email &&
										errors.username_email
									}
									onBlur={handleBlur}
								/>
								<TextField
									name="password"
									label="Password"
									value={values.password}
									onChange={handleChange}
									type={showPassword ? 'text' : 'password'}
									error={!!errors.password && touched.password}
									helperText={
										!!errors.password && touched.password && errors.password
									}
									onBlur={handleBlur}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
												>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Link href="/register">Don&apos;t have an account?</Link>
									<LoadingButton
										loading={fetching}
										type="submit"
										variant="contained"
									>
										Login
									</LoadingButton>
								</Box>
							</FormControl>
						</form>
					)}
				</Formik>
			</Box>
		</>
	);
};

export default Login;
