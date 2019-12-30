const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const { connection } = require("./database/util");
const bodyParser = require("body-parser");
const Dataloader=require('dataloader')
const dotEnv = require('dotenv');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const {verifyUser}=require('./helper/context')
const loaders=require('./loaders')

dotEnv.config();
const app = express();
connection();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    const contextObj = {};
    if (req) {
      await verifyUser(req)
      contextObj.email = req.email;
      contextObj.loggedInUserId = req.loggedInUserId;
      contextObj.role = req.role;
      
    }
    contextObj.loaders = {
      user: new Dataloader(keys => loaders.user.batchUsers(keys))
    };
    return contextObj;
  },
  formatError: (error) => {
    return {
      message: error.message
    };
  }
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hola Mundo' });
})

const httpServer= app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer)