import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userField } from "./fields/user.field.js";
import { companyField } from "./fields/company.field.js";
import { adminField } from "./fields/admin.field.js";



export const mainSchema=new GraphQLSchema({
    query:new GraphQLObjectType({
        name:'mainQueryShema',
        description:' main Query Schema',
        fields:{
            ...userField.Query,
            ...companyField.Query
        }
    }),
    mutation:new GraphQLObjectType({
        name:"mainMutationShema",
        description: 'main mutation schema',
        fields:{
            ...userField.mutation,
            ...companyField.mutation,
            ...adminField.mutation
        }
    })
})