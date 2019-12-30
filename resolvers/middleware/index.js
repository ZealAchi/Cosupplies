const { skip } = require("graphql-resolvers");
const Proyect = require("../../database/models/proyect");
const { isValidObjectId } = require("../../database/util");

module.exports.isAuthenticated = (_, __, { email }) => {
  if (!email) {
    throw new Error("¡Acceso denegado! Por favor inicie sesión para continuar");
  }
  return skip;
};

module.exports.isProyectOwner = async (_, { id }, { loggedInUserId }) => {
  try {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid Proyect id");
    }
    const proyect = await Proyect.findById(id);
    if (!proyect) {
      throw new Error("Proyect not found");
    } else if (proyect.user.toString() !== loggedInUserId) {
      throw new Error("Not authorized as proyect owner");
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.authorize = (roles = [], role) => {
  try {
    if (typeof roles == "string") {
      roles = [];
    }
    if (!roles.includes(role)) {
      throw new Error("El Usuario no tiene este permiso");
    }
    return skip;
  } catch (error) {
    console.log(error);
    throw error;
  }
  return skip;
};