
import mongoose from "mongoose";


export const companySchema=new mongoose.Schema(
    {
        companyName:{
            type:String,
            required:[true,'companyName is required'],
            unique:[true,'companyName is already taken'],
        },
        description :{
            type:String,
            required:[true,'description is require'],
        },
        industry :{
            type:String,
            required:[true,'industry is require'],
        },
        address:{
            type:String,
            required:[true,'address is require'],
        },
        numberOfEmployees: {
            type: Number,
            required: [true, "Number of employees is required"],
            min: [11, "Number of employees must be at least 11"],
            max: [20, "Number of employees must not exceed 20"]
        },
        companyEmail :{
            type:String,
            required:[true,'companyEmail is require'],
            unique:[true,'companyEmail is already taken'],
            lowercase:true,
            trim:true,
        },
        createdBy :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
        logo: {
            secure_url:{ type: String,  },
            public_id:{ type: String, }
        },
        coverPic: {
            secure_url:{ type: String,  },
            public_id:{ type: String,  }
        },
        HRs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],
        bannedAt: {
            type: Date,
            default: null
        },
        deletedAt: {
            type: Date,
            default: null
        },
        legalAttachment: {
            secure_url: { type: String, },
            public_id: { type: String, }
        },
        approvedByAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps:true,
        toJSON: { virtuals: true }, 
        toObject: { virtuals: true } 

    },
)

companySchema.virtual('jobs', {
    ref: 'jobOpportunity',
    localField: '_id',
    foreignField: 'companyId'
});

export const companyModel=mongoose.models.Company||mongoose.model('Company',companySchema)