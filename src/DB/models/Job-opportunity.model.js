import mongoose from "mongoose";
import {jobLocation,workingTime,seniorityLevel}from '../../constants/constants.js'


export const jobOpportunitySchema=new mongoose.Schema(
    {
        jobTitle :{
            type:String,
            required:[true,'jobTitle is require'],
            minLength:[2,'jobTitle must be grater then 3 '],
            maxlength:[20,'jobTitle must be less than 20']
        },
        jobLocation :{
            type:String,
            required:[true,'jobLocation is require'],
            enum:Object.values(jobLocation),
            default:jobLocation.HYBRID,
        },
        workingTime :{
            type:String,
            required:[true,'workingTime is require'],
            enum:Object.values(workingTime),
        },
        seniorityLevel  :{
            type:String,
            required:[true,'seniorityLevel is require'],
            enum:Object.values(seniorityLevel),
        },
        jobDescription :{
            type:String,
            required:[true,'jobDescription is require'],
        },
        technicalSkills: {
            type:[String],
            default:[]
        },
        softSkills: {
            type:[String],
            default:[]
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        closed: {
            type: Boolean,
            default: false
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        }
    },
    {
        timestamps:true,
        toJSON: { virtuals: true }, 
        toObject: { virtuals: true }
    }
)

jobOpportunitySchema.virtual('applications', {
    ref: 'application',
    localField: '_id',
    foreignField: 'jobId'
});

export const jobOpportunityModel=mongoose.models.jobOpportunity||mongoose.model('jobOpportunity',jobOpportunitySchema)