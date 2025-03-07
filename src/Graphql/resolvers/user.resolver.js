import {userModel}from '../../DB/models/user.model.js'
import {graphqlauthentication,graphQlauthorization}from '../utils/authentication.utils.js'
import { role } from '../../constants/constants.js'

export const listAllUserData=async()=>{
    const users=await userModel.find()
    return users
}

export const BanUserRsolver=async(args)=>{
    const {accessToken,userId}=args
    const isusreban=await userModel.findById(userId)
    if(isusreban.bannedAt){
        return 'user exist ban'
    }
    const {error1,user}=await graphqlauthentication(accessToken)
    if(error1){
        return new Error(error1)
    }
    if(userId.toString()===user._id.toString()){
        return 'can ban this user'
    }
    const {error2}=await graphQlauthorization(user,[role.ADMIN])
    if(error2){
        return new Error(error2)
    }

    await userModel.findByIdAndUpdate(userId,
        {
            bannedAt:new Date()
        }
    )
    return "user Ban successfully"


}



export const unBanUserRsolver=async(args)=>{
    const {accessToken,userId}=args
    const isusreban=await userModel.findById(userId)
    if(!isusreban.bannedAt){
        return 'user exist unban'
    }
    const {error1,user}=await graphqlauthentication(accessToken)
    if(error1){
        return new Error(error1)
    }
    if(userId.toString()===user._id.toString()){
        return 'can unban this user'
    }
    const {error2}=await graphQlauthorization(user,[role.ADMIN])
    if(error2){
        return new Error(error2)
    }

    await userModel.findByIdAndUpdate(userId,
        {
            bannedAt:null
        }
    )
    return "user unBan successfully"


}