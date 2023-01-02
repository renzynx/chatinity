import React from 'react';
import FormControl from '@mui/material/FormControl';
import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	Link,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useRegisterMutation } from '../../generated/graphql';
import { toErrorMap } from '../../lib/utils';

const Register = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);
	const navigate = useNavigate();
	const [{ fetching }, register] = useRegisterMutation();

	return (
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
					name: '',
					email: '',
					password: '',
				}}
				onSubmit={async (values, { setErrors }) => {
					const { data } = await register({
						input: values,
					});
					if (data?.register.errors) {
						setErrors(toErrorMap(data.register.errors));
					} else {
						navigate('/');
					}
				}}
			>
				{({
					values,
					errors,
					touched,
					handleSubmit,
					handleChange,
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
								gap: '30px',
								boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
								paddingTop: '30px',
								paddingBottom: '30px',
								paddingLeft: '20px',
								paddingRight: '20px',
								borderRadius: '10px',
								backgroundColor: '#212121',
							}}
						>
							<Typography variant="h4">Register</Typography>
							<TextField
								label="Username"
								name="name"
								value={values.name}
								onChange={handleChange}
								error={!!errors.name && touched.name}
								helperText={errors.name && touched.name && errors.name}
							/>
							<TextField
								label="Email"
								name="email"
								value={values.email}
								onChange={handleChange}
								error={!!errors.email && touched.email}
								helperText={errors.email && touched.email && errors.email}
							/>
							<TextField
								label="Password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								value={values.password}
								onChange={handleChange}
								error={!!errors.password && touched.password}
								helperText={
									errors.password && touched.password && errors.password
								}
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
								<Link href="/login">Already have an account?</Link>
								<Button type="submit" variant="contained">
									Register
								</Button>
							</Box>
						</FormControl>
					</form>
				)}
			</Formik>
		</Box>
	);
};

export default Register;
