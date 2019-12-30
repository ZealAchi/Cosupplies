const { combineResolvers } = require("graphql-resolvers");

const Proyect = require("../database/models/proyect");
const User = require("../database/models/user");
const Category = require("../database/models/category");
const MaterialLot = require("../database/models/materialsLot");
const { isAuthenticated, isTaskOwner } = require("./middleware");
const { stringToBase64, base64ToString } = require("../helper");
const PubSub = require("../subscription");
const { proyectEvents } = require("../subscription/events");

module.exports = {
  Query: {
    proyects: combineResolvers(isAuthenticated,async (_, { cursor, limit = 10 }, { loggedInUserId }) => {
      try {
        const query = { user: loggedInUserId };
        if (cursor) {
          query['_id'] = {
            '$lt': base64ToString(cursor)
          }
        };
        let proyects = await Proyect.find(query).sort({ _id: -1 }).limit(limit + 1);
        let count = await Proyect.find(query).countDocuments();
        const hasNextPage = proyects.length > limit;
        proyects = hasNextPage ? proyects.slice(0, -1) : proyects;
        return {
          proyectFeed: proyects,
          pageInfo: {
            nextPageCursor: hasNextPage ? stringToBase64(proyects[proyects.length - 1].id) : null,
            hasNextPage,
            totalCount:count
          }
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  },
  Mutation: {
    createProyect: combineResolvers(
      isAuthenticated,
      async (_, { input }, { email }) => {
        try {
          const user = await User.findOne({ email: email });

          const proyect = new Proyect({ ...input, user: user.id });

          input.Data.map(item => {
            const materialLot = new MaterialLot(item);

            if (materialLot.category) {
              try {
                Category.findById({
                  _id: materialLot.category,
                });
                materialLot.save();
              } catch (error) {
                throw new Error("Categoria no encontrada");
              }
            }
            proyect.materialLot.push(materialLot.id);
          });
          await proyect.save(); 
          await user.save();
          const result = await proyect.save();

          PubSub.publish(proyectEvents.PROYECT_CREATED, {
            proyectCreated: result,
          });
          return result;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    ),
  },
  Subscription:{
    proyectCreated:{
      subscribe: () => PubSub.asyncIterator(proyectEvents.PROYECT_CREATED )
    
    }
  },
  Proyect: {
    user: async (parent, _, { loaders }) => {
      try {
        /* const user = await User.findById(parent.user); */
        const user = await loaders.user.load(parent.user.toString());
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
