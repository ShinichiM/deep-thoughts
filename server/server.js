const express = require('express');
const { authMiddleware } = require('./utils/auth');
const path = require('path');

// import Apollo Server
const { ApolloServer, AuthenticationError } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: ({ req }) => req.headers
    // formatError(err) {
    //   if (err.originalError instanceof AuthenticationError) {
    //     return new Error(err);
    //   }
    // },
    context: authMiddleware
  });
  // start apollo server
  await server.start();

  // integrate apollo server w/ express applicatino as middleware
  server.applyMiddleware({ app });

  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// app.get('*', (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, './public/404.html'));
// });
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
