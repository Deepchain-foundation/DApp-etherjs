import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'http://${window.location.hostname}:7000/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
});
