import React from 'react';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';

import { API_URL } from 'src/config';

const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
  connectToDevTools: true,
});

const ApolloAppProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
export default ApolloAppProvider;
