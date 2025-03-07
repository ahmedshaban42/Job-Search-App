import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString,GraphQLNonNull } from "graphql";



export const ApproveCompanyargs={
    accessToken:{type:new GraphQLNonNull(GraphQLString),description:"access token"},
    compantId:{type:GraphQLID,description:"company id"}
}