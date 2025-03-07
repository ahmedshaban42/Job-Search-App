import { userModel } from "../DB/models/user.model.js"

export const checkUserStatus=()=>{
    return async (req,res,next)=>{
        const {_id:userId}=req.loggedinuser
        const user=await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if(user.bannedAt){
            return res.status(403).json({message:"Your account has been banned."})
        }
        if(user.deletedAt){
            return res.status(403).json({message:"Your account has been deactivated."})
        }
        next()
    }
}