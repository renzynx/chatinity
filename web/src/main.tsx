import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {
	createClient,
	defaultExchanges,
	Provider,
	subscriptionExchange,
} from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

const wsClient = createWSClient({
	url: import.meta.env.VITE_WS_URL,
});
const client = createClient({
	url: import.meta.env.VITE_GRAPHQL_URL,
	fetchOptions: {
		credentials: 'include',
	},
	exchanges: [
		...defaultExchanges,
		subscriptionExchange({
			forwardSubscription: (operation) => ({
				subscribe: (sink) => ({
					unsubscribe: wsClient.subscribe(operation, sink),
				}),
			}),
		}),
	],
});

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		fontFamily: 'Nunito',
	},
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<BrowserRouter>
				<Provider value={client}>
					<App />
				</Provider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
