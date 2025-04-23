
import mongoose from "mongoose";
import { jobOpportunityModel } from "./Job-opportunity.model.js";


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

companySchema.pre('save',async function(next) {
    if(this.isModified('deletedAt')&&this.deletedAt){
        return await jobOpportunityModel.deleteMany({companyId:this._id})
    }
})
export const companyModel=mongoose.models.Company||mongoose.model('Company',companySchema)





// companySchema.pre("save", async function (next) {
//     if (this.isModified("deletedAt") && this.deletedAt) {
//         // حذف جميع الوظائف المرتبطة بهذه الشركة
//         const deletedJobs = await jobModel.find({ companyId: this._id });

//         if (deletedJobs.length > 0) {
//             const jobIds = deletedJobs.map(job => job._id); // جمع الـ jobIds المرتبطة

//             // حذف جميع التطبيقات المرتبطة بالوظائف التي تم حذفها
//             await applicationModel.deleteMany({ jobId: { $in: jobIds } });

//             // حذف جميع الوظائف نفسها
//             await jobModel.deleteMany({ companyId: this._id });
//         }
//     }
//     next();
// });
