import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { UserInfo, AssociationInfo } from './User'
import SymptomChecker from './SymptomChecker'


const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
});



const App = () => (
  <ApolloProvider client={client}>
    <div>

      <SymptomChecker />

    </div>
  </ApolloProvider>

);

export default App;
