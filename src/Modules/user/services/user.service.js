import { compareSync } from "bcrypt"
import { userModel } from "../../../DB/models/user.model.js"




export const UpdateUserAccount=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {newMobileNumber,DOB,firstName,lastName,gender}=req.body
    const user=await userModel.findById(userId)

    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    if(newMobileNumber)  user.mobileNumber=newMobileNumber
    if(DOB) user.DOB=DOB
    if(firstName) user.firstName=firstName
    if(lastName) user.lastName=lastName
    if(gender) user.gender=gender

    await user.save()
    res.status(200).json({message:"update data successfully",newMobileNumber})

}



export const GetLoginUserAccountData=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const user=await userModel.findOne({_id:userId}).select('firstName lastName mobileNumber email gender DOB')
    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    res.status(200).json(
        {
            message:"user data",
            user:{
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                gender:user.gender,
                DOB:user.DOB,
                mobileNumber:user.mobileNumber
            }
        }
    )
}


export const GetProfileDataForAnotherUser=async(req,res)=>{
    const {userId}=req.params
    const user=await userModel.findOne({_id:userId,bannedAt:null,deletedAt:null})
    .select('firstName lastName mobileNumber profilePic coverPic email gender')
    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    res.status(200).json(
        {
            message:"user data",
            user:{
                userName:user.userName,
                profilePic:user.profilePic,
                coverPic:user.coverPic,
                mobileNumber:user.mobileNumber,
                email:user.email,
                gender:user.gender
            }
        }
    )

}


export const updadePassword=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const{oldPassword,newPassword,confirmNewPassword}=req.body
    if(newPassword!==confirmNewPassword){
        return res.status(400).json({message:'new Password and confirm New Password not matched'})
    }
    const user=await userModel.findById(userId)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const notmatched=compareSync(oldPassword,user.password)
    if(!notmatched){
        return res.status(400).json({message:'Incorrect old password'})
    }
    user.password=newPassword
    user.changeCredentialTime=new Date()
    await user.save()
    res.status(200).json({ message: "Password updated successfully. Please log in again." });

}

export const SoftDeleteAccount=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const user=await userModel.findById(userId)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    if(user.deletedAt){
        return res.status(400).json({ message: "Account already deleted" })
    }
    user.deletedAt=new Date()
    await user.save()
    res.status(200).json({ message: "Account deleted successfully" });
} 


