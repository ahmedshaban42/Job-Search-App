import { GraphQLString } from "graphql";
import {ApproveCompanyargs}from '../Types/admin.type.js'
import {ApproveCompanyResolver}from '../resolvers/admin.resolver.js'





export const adminField={
    mutation:{
        ApproveCompany:{
            type:GraphQLString,
            description:'Approve company',
            args:ApproveCompanyargs,
            resolve:(_,args)=>ApproveCompanyResolver(args)
        }
    }
}