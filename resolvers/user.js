const User = require("./../database/models/user");
//  const Proyect = require("./../database/models/proyects");
const jwt = require("jsonwebtoken");
const { combineResolvers } = require("graphql-resolvers");
const { isAuthenticated, authorize } = require("./middleware");
const Role=require('../helper/role')
const PubSub = require("../subscription");
const { userEvents } = require("../subscription/events");


module.exports = {
  Query: {
    user: combineResolvers(isAuthenticated, async (_, __, { email,role}) => {
      try {
        authorize([Role.Constructor,Role.Admin],role);
        const user = await User.findOne({ email }).populate({ path: "proyects" });
        // const user =await User.findOne({ email })
        if (!user) {
          throw new Error("Usuario no encontrado!");
        }
        
        // console.log(roles)
        return user;
      } catch (error) {
        console.log(error);
        throw error;
      }
    })},
  Mutation: {
    signup: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (user) {
          throw new Error("El Correo electrónico ya en uso!");
        }
        const newUser = await new User({ ...input });
        const result = await newUser.save();
        PubSub.publish(userEvents.USER_CREATED, {
          userCreated: result,
        });
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ email: input.email });
        if (!user) {
          //  console.log(user)
          throw new Error("Autenticación fallida, usuario no encontrado!");
        }
        if (!user.authenticate(input.password)) {
          throw new Error("El Correo electrónico y la contraseña no coinciden");
        }
        const token = jwt.sign(
          { email: user.email, role: user.role,isAdmin:user.isAdmin,name:user.name,lastName:user.lastName},
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );

        return { token };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => PubSub.asyncIterator(userEvents.USER_CREATED),
    },
  },
  User: {
    proyects: async ({ id }) => {
      try {
        const proyects = await Proyect.find({ user: id });
        return proyects;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
