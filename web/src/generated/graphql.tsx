import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  avatar: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  text: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  sendMessage: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  input?: InputMaybe<UserLoginInput>;
};


export type MutationRegisterArgs = {
  input?: InputMaybe<UserInput>;
};


export type MutationSendMessageArgs = {
  message: Scalars['String'];
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  hasMore: Scalars['Boolean'];
  messages: Array<Message>;
};

export type Query = {
  __typename?: 'Query';
  fetchMessages: PaginatedMessages;
  hello: Scalars['String'];
  me?: Maybe<User>;
};


export type QueryFetchMessagesArgs = {
  cursor?: InputMaybe<Scalars['Float']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  message: Message;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type UserLoginInput = {
  password: Scalars['String'];
  username_email: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type ErrorRegularFragment = { __typename?: 'FieldError', field: string, message: string };

export type MessageRegularFragment = { __typename?: 'Message', id: number, text: string, createdAt: string, updatedAt: string, username: string, avatar: string };

export type UserRegularFragment = { __typename?: 'User', id: number, name: string, email: string, createdAt: string };

export type LoginMutationVariables = Exact<{
  input: UserLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, name: string, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, name: string, email: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, name: string, email: string, createdAt: string } | null };

export type FetchMessagesQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['Float']>;
}>;


export type FetchMessagesQuery = { __typename?: 'Query', fetchMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, messages: Array<{ __typename?: 'Message', id: number, text: string, createdAt: string, updatedAt: string, username: string, avatar: string }> } };

export type MessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageSubscription = { __typename?: 'Subscription', message: { __typename?: 'Message', id: number, text: string, username: string, avatar: string, createdAt: string, updatedAt: string } };

export const ErrorRegularFragmentDoc = gql`
    fragment ErrorRegular on FieldError {
  field
  message
}
    `;
export const MessageRegularFragmentDoc = gql`
    fragment MessageRegular on Message {
  id
  text
  createdAt
  updatedAt
  username
  avatar
}
    `;
export const UserRegularFragmentDoc = gql`
    fragment UserRegular on User {
  id
  name
  email
  createdAt
}
    `;
export const LoginDocument = gql`
    mutation Login($input: UserLoginInput!) {
  login(input: $input) {
    user {
      ...UserRegular
    }
    errors {
      ...ErrorRegular
    }
  }
}
    ${UserRegularFragmentDoc}
${ErrorRegularFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($input: UserInput!) {
  register(input: $input) {
    user {
      ...UserRegular
    }
    errors {
      ...ErrorRegular
    }
  }
}
    ${UserRegularFragmentDoc}
${ErrorRegularFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SendMessageDocument = gql`
    mutation SendMessage($message: String!) {
  sendMessage(message: $message)
}
    `;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserRegular
  }
}
    ${UserRegularFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};
export const FetchMessagesDocument = gql`
    query FetchMessages($cursor: Float) {
  fetchMessages(cursor: $cursor) {
    messages {
      ...MessageRegular
    }
    hasMore
  }
}
    ${MessageRegularFragmentDoc}`;

export function useFetchMessagesQuery(options?: Omit<Urql.UseQueryArgs<FetchMessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<FetchMessagesQuery, FetchMessagesQueryVariables>({ query: FetchMessagesDocument, ...options });
};
export const MessageDocument = gql`
    subscription Message {
  message {
    id
    text
    username
    avatar
    createdAt
    updatedAt
  }
}
    `;

export function useMessageSubscription<TData = MessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<MessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<MessageSubscription, TData>) {
  return Urql.useSubscription<MessageSubscription, TData, MessageSubscriptionVariables>({ query: MessageDocument, ...options }, handler);
};