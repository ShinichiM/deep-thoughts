import React from 'react';
// Provider - React component to provide data to other components
// Client - Constructor to initialize GraphQL connection
// Memory - Cache api response (efficient data resolution)
//  http - control how client makes request
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';

const httpLink = createHttpLink({ 
  uri: '/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
          <div className='container'>
            <Home />
          </div>
          <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
