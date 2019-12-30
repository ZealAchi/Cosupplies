const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    user: User
  }

  extend type Mutation {
    signup(input: signupInput): User
    login(input: loginInput): Token
  }

  input loginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  input signupInput {
    name: String!
    lastName: String!
    secondLastName:String
    role:String!
    email: String!
    isAdmin:Boolean!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role:String!
    isAdmin:Boolean!
    proyects: [Proyect!]
    createdAt: Date!
    lastName:String!
    secondLastName:String
    updatedAt: Date!
  }

  extend type Subscription {
    userCreated: User
  }

`;