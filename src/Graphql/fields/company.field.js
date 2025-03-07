import { GraphQLList,GraphQLString } from "graphql";
import { listAllCompanysDAta } from "../resolvers/company.resolver.js";

import { companyType,BanCompanyArgs } from "../Types/company.type.js";
import {banCompany,unbanCompany}from '../resolvers/company.resolver.js'



export const companyField={
    Query:{
        listAllCompany:{
            type:new GraphQLList(companyType),
            description:'get all companys data',
            resolve:listAllCompanysDAta
        }
    },
    mutation:{
        BanCompany:{
            type:GraphQLString,
            description:'Ban specific company',
            args:BanCompanyArgs,
            resolve:(_,args)=>banCompany(args)
        },
        unBanCompany:{
            type:GraphQLString,
            description:'Ban specific company',
            args:BanCompanyArgs,
            resolve:(_,args)=>unbanCompany(args)
        }
    }
}