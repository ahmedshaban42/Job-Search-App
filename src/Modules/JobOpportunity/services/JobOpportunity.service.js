import {companyModel}from '../../../DB/models/company.model.js'
import { jobOpportunityModel } from '../../../DB/models/Job-opportunity.model.js'
import {Pagination}from '../../../utils/pagination.utils.js'

export const AddJobOpportunity=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const{idCompany}=req.params
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body

    const company=await companyModel.findOne({idCompany,deletedAt:null,bannedAt:null})
    if(!company){
        return res.status(404).json({message:"company not found"})
    }
    if(!company.HRs.some(id=>id.equals(userId)) && company.createdBy.toString()!==userId.toString()){
        return res.status(403).json({message:"You are not authorized to add this Job Opportunity"})
    }
    
    const newJobOpportunity=new jobOpportunityModel({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy:userId,
        companyId:idCompany
    })
    await newJobOpportunity.save()
    res.status(201).json({message:"new Job Opportunity add successfully",newJobOpportunity})
}


export const updateJobeOpportunityData=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const{jobId}=req.params
    const updataData=req.body

    const jop=await jobOpportunityModel.findById(jobId)
    if(!jop){
        return res.status(404).json({message:"Job Opportunity not found"})
    }
    if(jop.addedBy.toString()!==userId.toString()){
        return res.status(403).json({message:"You are not authorized to add this Job Opportunity"})
    }
    const updatedJob =await jobOpportunityModel.findByIdAndUpdate(
        jobId,
        {$set:updataData},
        {new:true}
    ).select('-updatedBy -addedBy -closed -companyId -createdAt -updatedAt -__v')
    if (!updatedJob) {
        return res.status(500).json({ message: "Failed to update Job Opportunity" });
    }

    res.status(200).json({message:"Job Opportunity update successfully",updatedJob})

}

export const deleteJobOpportunity=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {jobId}=req.params

    const job=await jobOpportunityModel.findById(jobId).populate('companyId')
    if(!job){
        return res.status(404).json({message:"Job Opportunity not found"})
    }
    console.log(company)
    if(!company){
        return res.status(404).json({message:"company not found"})
    }

    if(company.HRs.some(ids=>ids.equals(userId))){
        return res.status(403).json({message:"You are not authorized to delete this Job Opportunity"})
    }
    await jobOpportunityModel.findByIdAndUpdate(jobId,{$set:{closed:true}})
    res.status(200).json({message:"Job Opportunity delete successfully"})
}



export const getJop=async(req,res)=>{
    const {jobTitle,workingTime,seniorityLevel,page=1,limit=10,companyName,jobLocation,technicalSkills }=req.query

    const filter={}

    if(companyName){
        const company=await companyModel.findOne({companyName})
        if(!company){
            return res.status(404).json({message:"company not found"})
        }
        filter.companyId=company._id
    }


    if(jobTitle){
        filter.jobTitle=jobTitle
    }
    if(workingTime){
        filter.workingTime=workingTime
    }
    if(seniorityLevel){
        filter.seniorityLevel=seniorityLevel
    }
    if(jobLocation) filter.jobLocation=jobLocation
    if(technicalSkills) filter.technicalSkills=technicalSkills

    const {skip,limit:calcLimit}=Pagination(page,limit)
    
    const jobs=await jobOpportunityModel.find(filter)
            .sort("-createdAt")
            .skip(skip)
            .limit(calcLimit)
    const totalCount=await jobOpportunityModel.countDocuments(filter)

    return res.status(200).json(
        {
            success:true,
            totalCount,
            jobs,
            page:Number(page),

        }
    )

}
