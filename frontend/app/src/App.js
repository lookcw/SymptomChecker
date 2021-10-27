import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import SymptomChecker from "./SymptomChecker";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
});

const App = () => (
  <ApolloProvider client={client}>
  <div style={{
      backgroundColor: '#00000008',
      display: 'flex',
      justifyContent: 'center',
      alignItems:'center',
      flexDirection: 'column'}}>
      <h1>SymptomChecker Alpha.0</h1>
    </div>
    <div>
      <SymptomChecker />
    </div>
  </ApolloProvider>
); 

export default App;
