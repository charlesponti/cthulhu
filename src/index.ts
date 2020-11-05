import typeDefs from './typeDefs'
import resolvers from './resolvers'
import { ApolloServer } from 'apollo-server'

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})