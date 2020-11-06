import * as dotenv from 'dotenv';
import {ApolloServer} from 'apollo-server';

// Load environment variables
dotenv.config();

import logger from './logger';
import typeDefs from './schema';
import resolvers from './resolvers';

const {PORT, APP_URL, NODE_ENV = 'development'} = process.env;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {origin: APP_URL},
});

if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(
      `🚀 ${NODE_ENV.toUpperCase()} GraphQL Server running @ port ${PORT}`
    );
  });
}

export default server;
