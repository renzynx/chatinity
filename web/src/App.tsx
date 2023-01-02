import { Route, Routes } from 'react-router-dom';
import ErrorPage from './components/layouts/ErrorPage';
import Index from './components/pages';
import Login from './components/pages/login';
import Register from './components/pages/register';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Index />} errorElement={<ErrorPage />} />
				<Route path="login" element={<Login />} caseSensitive />
				<Route path="register" element={<Register />} caseSensitive />
			</Routes>
		</>
	);
}

export default App;
