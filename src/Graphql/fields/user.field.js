import { GraphQLList, GraphQLString } from "graphql";
import {BanUserRsolver,unBanUserRsolver, listAllUserData}from '../resolvers/user.resolver.js'
import { BanUserArgs, userType } from "../Types/user.type.js";




export const userField={
    Query:{
        listuser:{
            type:new GraphQLList(userType),
            description:'get All users data',
            resolve:listAllUserData
        }
    },
    mutation:{
        BanUser:{
            type:GraphQLString,
            description:'Ban specific  user',
            args:BanUserArgs,
            resolve:(_,args)=>BanUserRsolver(args)
        },
        unBanUser:{
            type:GraphQLString,
            description:'unBan specific  user',
            args:BanUserArgs,
            resolve:(_,args)=>unBanUserRsolver(args)
        }
    }
}