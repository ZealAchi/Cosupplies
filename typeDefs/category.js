const {gql}=require('apollo-server-express')

module.exports=gql`
extend type Query {
    categories(cursor: String, limit: Int): CategoryFeed!
    category(id: ID!): Category
  }

  type CategoryFeed{
    categoryFeed: [Category!]
    pageInfo: PageInfo!
  }
  
  input CategoryInput {
      name:String!
  }
  extend type Mutation{
      createCategory(input:CategoryInput!):Category
  }

  type Category{
    id: ID!
    name:String!
    createdAt: Date!
    updatedAt: Date!
  }
`