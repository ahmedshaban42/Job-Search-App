import { compareSync } from "bcrypt"
import { userModel } from "../../../DB/models/user.model.js"
import { cloudinary } from "../../../config/cloudinary.config.js"



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


export const uploadProfilePicture=async(req,res)=>{
    const {_id}=req.loggedinuser
    const {file}=req

    if(!file){
        return res.status(404).json({message:"no file uploaded"})
    }
    
    // store url in DB using full url
    const url =`${req.protocol}://${req.headers.host}/${file.path}`
    const user=await userModel.findByIdAndUpdate(_id,{profilePic:{secure_url:url}}, {new:true})



    res.status(200).json({ message: "successfully",user});

}



export const uploadcoverPicture=async(req,res)=>{
    const {_id}=req.loggedinuser
    const {files}=req
    if(!files?.length){
        return res.status(404).json({message:"no file uploaded"})
    }

    const images=files.map(file=> `${req.protocol}://${req.headers.host}/${file.path}`)

    const user=await userModel.findByIdAndUpdate(_id,{coverPic:{secure_url:images}}, {new:true})



    res.status(200).json({ message: "successfully",user});
}



export const uploadProfilePictureCloud=async(req,res)=>{
    const {_id}=req.loggedinuser
    const {file}=req
    if(!file){
        return res.status(400).json({message:'no file uploaded'})
    }

    const {secure_url,public_id}=await cloudinary().uploader.upload(file.path,{
        folder:`${process.env.CLOUDINARY_FOLDER}/user/profile`
    })

    const user=await userModel.findByIdAndUpdate(_id,{profilePic:{secure_url,public_id}}, {new:true})

    res.status(200).json({ message: "successfully",user});


}

export const uploadProfileCoverCloud=async(req,res)=>{
    const {_id}=req.loggedinuser
    const {files}=req
    if(!files){
        return res.status(400).json({message:'no file uploaded'})
    }
    

    const images=[]
    for(const file of files){
        const {secure_url,public_id}=await cloudinary().uploader.upload(file.path,{
            folder:`${process.env.CLOUDINARY_FOLDER}/user/cover`
        })
        images.push({secure_url,public_id})

    }

    const user=await userModel.findByIdAndUpdate(_id,{coverPic:images})
    res.status(200).json({ message: "successfully",user});
}

export const deleteProfilePictureCloud=async (req,res)=>{
    const {_id}=req.loggedinuser
    const user=await userModel.findById(_id)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    if(user.profilePic===null  || !user.profilePic.public_id){
        return res.status(400).json({message:'no profile picture to delete'})
    }

    const ProfilePicture=user.profilePic.public_id
    const data=await cloudinary().uploader.destroy(ProfilePicture)
    if (data.result !== "ok") {
        return res.status(500).json({ message: "Failed to delete profile picture from Cloudinary", error: data });
    }

    await userModel.updateOne({_id},{ profilePic: { secure_url: null, public_id: null } })
    res.status(200).json({ message: "delete profile picture successfully",data});

}
export const deleteCoverPictureCloud=async (req,res)=>{
    const {_id}=req.loggedinuser
    const user=await userModel.findById(_id)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }
    if(!user.coverPic.length){
        return res.status(400).json({message:'no covers pictures to delete'})
    }

    const coversPicture=user.coverPic.map(id=>id.public_id)
    console.log(coversPicture)
    const data=await cloudinary().api.delete_resources(coversPicture)


    await userModel.updateOne({_id},
        { 
            $set: { 
                coverPic: []
            } 
        }
    )
    res.status(200).json({ message: "delete profile picture successfully",data});

}



