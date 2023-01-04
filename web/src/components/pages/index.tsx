import _ from 'react';
import Navbar from '../layouts/Navbar';
import ChatFrame from '../layouts/ChatFrame';
import { useMeQuery } from '../../generated/graphql';
import LoadingPage from '../layouts/LoadingPage';
import { Typography } from '@mui/material';

const Index = () => {
	const [{ data, fetching, error }] = useMeQuery({
		requestPolicy: 'network-only',
	});

	if (fetching) {
		return <LoadingPage />;
	}

	return (
		<>
			<Navbar data={data?.me!} />
			{data?.me && !error ? (
				<ChatFrame />
			) : (
				<Typography align="center" variant="h2" mt="30vh">
					Please login to continue
				</Typography>
			)}
		</>
	);
};

export default Index;
