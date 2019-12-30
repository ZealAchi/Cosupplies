const {GraphQLDateTime}=require('graphql-iso-date')
const userResolver=require('./user')
const proyectResolver=require('./proyect')
const categoryResolver=require('./category')

const customDateScalarResolver={
    Date:GraphQLDateTime
}
module.exports=[
    userResolver,
    proyectResolver,
    customDateScalarResolver,
    categoryResolver
]