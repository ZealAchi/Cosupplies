const { combineResolvers } = require('graphql-resolvers');

const Category = require('../database/models/category');
const { isAuthenticated } = require('./middleware');

module.exports = {
  Query: {
    categories: combineResolvers( async (_, { cursor, limit = 10 }) => {
      throw new Error("¡Acceso denegado! Por favor inicie sesión para continuar");
    })
  },
  Mutation: {
    createCategory:combineResolvers(isAuthenticated, async(_,{input})=>{
      try {
        const category=new Category({...input})
        const result=await category.save();
        return result
      } catch (error) {
        console.log(error);
        throw error;  
      }
    })
  }
}