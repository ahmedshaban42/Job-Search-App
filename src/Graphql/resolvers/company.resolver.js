import { companyModel } from "../../DB/models/company.model.js"
import {graphqlauthentication,graphQlauthorization}from '../utils/authentication.utils.js'
import { role } from '../../constants/constants.js'

export const listAllCompanysDAta=async()=>{
    const companys=await companyModel.find()
    return companys
}


export const banCompany=async(args)=>{

    const {accessToken,companyID}=args

    const isCompanyban=await companyModel.findById(companyID)
    if(isCompanyban.bannedAt){
        return 'company exist ban'
    }

    const {error1,user}=await graphqlauthentication(accessToken)
    if(error1){
        return new Error(error1)
    }


    const {error2}=await graphQlauthorization(user,[role.ADMIN])
    if(error2){
        return new Error(error2)
    }

    await companyModel.findByIdAndUpdate(companyID,
        {
            bannedAt:new Date()
        }
    )
    return "company Ban successfully"
}




export const unbanCompany=async(args)=>{

    const {accessToken,companyID}=args

    const isCompanyban=await companyModel.findById(companyID)
    if(!isCompanyban.bannedAt){
        return 'company exist unban'
    }

    const {error1,user}=await graphqlauthentication(accessToken)
    if(error1){
        return new Error(error1)
    }

    const {error2}=await graphQlauthorization(user,[role.ADMIN])
    if(error2){
        return new Error(error2)
    }

    await companyModel.findByIdAndUpdate(companyID,
        {
            bannedAt:null
        }
    )
    return "company unBan successfully"
}