import React from 'react';
import HashLoader from 'react-spinners/HashLoader';
import { Box } from '@mui/material';

const LoadingPage = () => {
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
			<HashLoader color="#3f51b5" />
		</Box>
	);
};

export default LoadingPage;
