import mongoose from "mongoose";
import { ApplicationStatus } from "../../constants/constants.js";


export const applicationSchema=new mongoose.Schema(
    {
        jobId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'jobOpportunity',
            default:null,
            required:true
        },
        userId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            default:null,
            required:true
        },
        status :{
            type:String,
            enum:Object.values(ApplicationStatus),
            default:ApplicationStatus.PENDING,
            required:true
        },
        userCV: {
            secure_url: { type: String, },
            public_id: { type: String, }
        }
    },
    {timestamps:true}
)



export const applicationModel=mongoose.models.application||mongoose.model('application',applicationSchema)