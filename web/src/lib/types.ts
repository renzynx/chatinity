import { RefObject } from 'react';
import { FetchMessagesQuery } from '../generated/graphql';

export type Message =
	FetchMessagesQuery['fetchMessages']['messages'][number] & {
		ref?: RefObject<HTMLDivElement>;
	};
