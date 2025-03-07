import {verifyToken}from '../../utils/token.utils.js'
import { blacklistmodel } from '../../DB/models/blacklist.model.js'
import { userModel } from '../../DB/models/user.model.js'

export const graphqlauthentication=async(accessToken)=>{
    try{

        const decodedData=verifyToken({token:accessToken,sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})

        const isBlacklisted = await blacklistmodel.findOne({ tokenId: decodedData.jti });
        if (isBlacklisted) {
            return { error1: 'Token is blacklisted, please login again' };
        }

        const user=await userModel.findById(decodedData._id,'-password -__v')
        if(!user){
            return {error1:'user not found plase signUp'}
        }
        

        if(user.changeCredentialTime&&decodedData.iat*100<user.changeCredentialTime.getTime()){
            
        }
        return {user,token:{tokenId:decodedData.jti,expiryData:decodedData.exp}}

    }catch(error){
        return {error1:error.message}
    }
}


export const graphQlauthorization=async(userRole,allowroles)=>{
    try{

        const {role}=userRole
        const isrloeallowed=allowroles.includes(role)
        if(!isrloeallowed){
            return {error2:'unauthorized'}
        }
        return true

    }catch(error){
        return {error2:error.message}
    }

}