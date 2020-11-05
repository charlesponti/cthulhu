import { gql } from 'apollo-server'

export default gql`
    type Message {
        content: String
    }

    type Query {
        messages: [Message]
    }

    type Mutation {
        addMessage(message: String): Message
    }
`