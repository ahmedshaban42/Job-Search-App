
import { userModel } from "../../../DB/models/user.model.js"
import {companyModel}from '../../../DB/models/company.model.js'
import { emitter } from "../../../Services/sent-email.service.js"
import { role } from "../../../constants/constants.js"




export const AddCompany =async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const{companyName,description,industry,address,numberOfEmployees,companyEmail,HRs}=req.body
    
    const createdByUser=await userModel.findById(userId)
    if(!createdByUser){
        return res.status(404).json({message:"user not found"})
    }
    const existingCompany = await companyModel.findOne({ 
        $or: [{ companyEmail }, { companyName }] 
    });
    if (existingCompany) {
        return res.status(400).json({ message: "Company name or email already exists" });
    }

    const hrUsers = await userModel.find({ _id: { $in: HRs },deletedAt:null,bannedAt:null });
    if (hrUsers.length !== HRs.length) {
        return res.status(400).json({ message: "One or more HR IDs are invalid" });
    }

    const newcompany=new companyModel({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        createdBy:createdByUser._id,
        HRs,
        approvedByAdmin:false
    })
    await newcompany.save()
    emitter.emit('sendEmail',{
        subject: "Company created successfully",
        html: `<h1>Welcome to our platform</h1><p>Your company has been successfully registered.</p>`,
        to:companyEmail
    })
    res.status(201).json({message:'signUp susseccfuly'})
}


export const updateCompanyData=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {companyId}=req.params
    const updateData=req.body

    console.log(userId)

    const {companyName,companyEmail}=updateData
    const existingCompany = await companyModel.findOne({ 
        $or: [{ companyEmail }, { companyName }] ,
        _id: { $ne: companyId } 
    });
    if (existingCompany) {
        return res.status(400).json({ message: "Company name or email already exists" });
    }

    const updatedCompany =await companyModel.findOneAndUpdate(
        { _id: companyId, createdBy: userId },
        updateData,
    )
    if(!updatedCompany){
        return res.status(403).json({message:"You are not authorized to update this company or company not found"})
    }

    res.status(200).json({message:"update successfully"})

}


export const SoftDeleteCompany=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {companyId}=req.params

    const user=await userModel.findById(userId)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }

    const company=await companyModel.findById(companyId)
    if(!company){
        return res.status(403).json({message:"company not found"})
    }


    if(user.role!==role.ADMIN&&company.createdBy.toString()!==userId.toString()){
        return res.status(403).json({message:"You are not authorized to delete this company(admin)"})
    }

    
    if (company.deletedAt) {
        return res.status(400).json({ message: "Company is already deleted" });
    }

    company.deletedAt=new Date()
    await company.save()
    return res.status(200).json({ message: "Company deleted successfully" });
}


export const ReactivationOfTheCompany=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {companyId}=req.params

    const user=await userModel.findById(userId)
    if(!user){
        return res.status(404).json({message:'user not found'})
    }

    const company=await companyModel.findById(companyId)
    if(!company){
        return res.status(404).json({message:"company not found"})
    }

    if(user.role!==role.ADMIN&&company.createdBy.toString()!==userId.toString()){
        return res.status(403).json({message:"You are not authorized to reactivated  this company"})
    }

    if (!company.deletedAt) {
        return res.status(400).json({ message: "Company is not deleted" });
    }

    company.deletedAt=null
    await company.save()
    return res.status(200).json({ message: "Company reactivated successfully" });
}


export const SearchForACompany=async(req,res)=>{
    const {companyName}=req.body

    const company=await companyModel.findOne(
        {
        companyName,
        bannedAt: null,
        deletedAt: null
        }
    )
    .select('companyName description industry address numberOfEmployees companyEmail logo coverPic legalAttachment')

    if(!company){
        return res.status(404).json({message:"company not found"})
    }

    res.status(200).json({message:"company=>",company})
}



export const GetSpecificCompanyWithRelatedJobs=async(req,res)=>{
    const {companyId}=req.params

    const company=await companyModel.findById(companyId)
    .select('companyName companyEmail')
    .populate([
        {
            path:'createdBy',
            select:"email -_id"
        },
        {
            path:'jobs',
            select:'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills addedBy',
            populate:[
                {
                    path:'addedBy',
                    select:"email -_id"
                }
            ]
        },
        
    ])
    if(!company){
        return res.status(403).json({message:"company not found"})
    }
    return res.status(200).json({message:"company jobs",company})
}

