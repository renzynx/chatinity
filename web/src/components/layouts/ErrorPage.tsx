import { Box, Typography } from '@mui/material';
import React from 'react';

const ErrorPage = () => {
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
			<Typography variant="h1">Error - 500</Typography>
			<Typography variant="h2">Internal Server Error</Typography>
			<Typography variant="h3">Please try again later</Typography>
		</Box>
	);
};

export default ErrorPage;
