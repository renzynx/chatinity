import { SendSharp } from '@mui/icons-material';
import {
	Box,
	IconButton,
	Skeleton,
	TextField,
	Typography,
} from '@mui/material';
import _, { useEffect } from 'react';
import {
	useFetchMessagesQuery,
	useMessageSubscription,
	useSendMessageMutation,
} from '../../generated/graphql';
import { Message } from '../../lib/types';

const ChatFrame = () => {
	const [cursor, setCursor] = _.useState<number>();
	const [{ data: msgData, fetching }] = useFetchMessagesQuery({
		variables: { cursor },
	});
	const [msgs, setMessages] = _.useState<Message[]>([]);
	const [text, setText] = _.useState<string>('');
	const divRef = _.useRef<HTMLDivElement>(null);
	const ref = _.useRef<HTMLDivElement>(null);
	const [, send] = useSendMessageMutation();
	useMessageSubscription({}, (_, response) => {
		const message = response.message;

		const prev = msgs[msgs.length - 1];
		prev && delete prev.ref;

		setMessages([...msgs, { ...message, ref }]);

		return { message };
	});

	useEffect(() => {
		if (!fetching && msgData?.fetchMessages && msgData.fetchMessages.hasMore) {
			if (!cursor) {
				setMessages(msgData.fetchMessages.messages);
			} else {
				setMessages((prev) => [...msgData.fetchMessages.messages, ...prev]);
			}
		}
	}, [fetching, msgData]);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [ref.current, msgs]);

	useEffect(() => {
		if (divRef.current && !cursor) {
			divRef.current.scrollTop = divRef.current.scrollHeight;
		}
	}, [msgs, cursor]);

	const handleSend = async () => {
		if (text) {
			await send({ message: text });
			setText('');
		}
	};

	return (
		<>
			<Box
				sx={{
					height: '87vh',
					width: '99%',
					display: 'flex',
					backgroundColor: '#212121',
					margin: 'auto',
					marginTop: '1rem',
					borderRadius: '10px',
					padding: '1rem',
					boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
					flexDirection: 'column',
					position: 'relative',
				}}
			>
				<div
					ref={divRef}
					style={{
						overflowY: 'scroll',
						height: '90%',
						width: '100%',
					}}
					onScroll={(evt) => {
						const target = evt.target as HTMLDivElement;
						if (target.scrollTop === 0 && msgData?.fetchMessages.hasMore) {
							setCursor(msgs[0].id - 1);
						}
					}}
				>
					{msgs.length && !fetching ? (
						msgs.map((message, idx) => (
							<Box
								ref={message.ref}
								key={idx}
								sx={{
									display: 'flex',
									gap: '1rem',
									alignItems: 'center',
									marginBottom: '1rem',
									padding: '.3rem',
									width: '99%',
									':hover': {
										backgroundColor: '#424242',
									},
								}}
							>
								<img
									width={40}
									height={40}
									src={message.avatar}
									alt={message.username}
									style={{ borderRadius: '50%' }}
								/>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'left',
										justifyContent: 'flex-start',
										width: '100%',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											gap: '1rem',
											alignItems: 'center',
										}}
									>
										<Typography variant="body1">{message.username}</Typography>
										<Typography variant="caption" color="GrayText">
											{new Date(+message.createdAt).toLocaleString('en-US', {
												hour: 'numeric',
												minute: 'numeric',
												hour12: true,
												weekday: 'short',
												day: 'numeric',
											})}
										</Typography>
									</Box>
									<p
										style={{
											width: '99%',
											wordBreak: 'break-word',
											fontWeight: 'lighter',
										}}
									>
										{message.text}
									</p>
								</Box>
							</Box>
						))
					) : fetching ? (
						[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => {
							return (
								<Box
									key={idx}
									sx={{
										display: 'flex',
										gap: '1rem',
										alignItems: 'center',
										marginBottom: '1rem',
										width: '100%',
									}}
								>
									<Skeleton variant="circular" width={40} height={40} />
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'left',
											justifyContent: 'flex-start',
											width: '100%',
										}}
									>
										<Skeleton width={100} />
										<Skeleton width={200} />
									</Box>
								</Box>
							);
						})
					) : (
						<Typography variant="body1" color="GrayText">
							No messages yet
						</Typography>
					)}
				</div>
				<TextField
					sx={{
						width: '97%',
						position: 'absolute',
						bottom: '1rem',
						left: '1rem',
						right: '1rem',
					}}
					placeholder="Message"
					disabled={fetching && !msgs.length}
					autoComplete="off"
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={async (e) => {
						if (e.key === 'Enter') {
							await handleSend();
						}
					}}
					InputProps={{
						endAdornment: (
							<IconButton
								disabled={fetching && !msgs.length}
								onClick={async () => await handleSend()}
							>
								<SendSharp />
							</IconButton>
						),
					}}
				/>
			</Box>
		</>
	);
};

export default ChatFrame;
