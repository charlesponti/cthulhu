import {gql} from 'apollo-server';

export default gql`
  type Query {
    hello(input: String): String
  }

  type Mutation {
    setName(input: String): String
  }
`;
