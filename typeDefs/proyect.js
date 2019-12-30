const { gql } = require('apollo-server-express');

module.exports = gql`
  extend type Query {
    proyects(cursor: String, limit: Int): ProyectFeed!
    proyect(id: ID!): Proyect
  }

  type ProyectFeed {
    proyectFeed: [Proyect!]
    pageInfo: PageInfo!    
  }

  type PageInfo {
    nextPageCursor: String
    hasNextPage: Boolean
    totalCount: Int!
  }
  input PaymentConditions{
    advance:String!
    uponDelivery:String!
    credit:String!
  }
  input Place{
      country:String!
      state:String!
  }

  input createProyectInput {
    name: String!
    typeProyect: Int!
    Ending: Date!
    paymentConditions:PaymentConditions!
    place:Place!
    Data:[MaterialLot!]!
  }
#   input MaterialLots{
#     MaterialLot:[MaterialLot]
#   }
  extend type Mutation {
    createProyect(input: createProyectInput!): Proyect
    updateProyect(id: ID!, input: updateProyectInput!): Proyect
    deleteProyect(id: ID!): Proyect
  }
  
  input updateProyectInput {
    name: String
    completed: Boolean
  }

  type Proyect {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
    createdAt: Date!
    updatedAt: Date!
  }


  input MaterialLot{
    category:String!
    nameMaterialLot:String!
    deadline:Date!
    quantity:Int!
    unitMeasurement:Int!
    technicalData:Int!
    blueprints:String!
    }

  extend type Subscription {
    proyectCreated: Proyect
  }

`;
