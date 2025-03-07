import {jobOpportunityModel}from '../../../DB/models/Job-opportunity.model.js'
import {applicationModel}from '../../../DB/models/application.model.js'
import {emitter} from '../../../Services/sent-email.service.js'
import {Pagination}from '../../../utils/pagination.utils.js'


export const applyToJob =async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {jobId}=req.params

    const job=await jobOpportunityModel.findOne({_id:jobId,closed:false})
    if(!job){
        return res.status(404).json({message:'job not found'})
    }

    const existingApplication =await applicationModel.findOne({jobId,userId})
    if (existingApplication) {
        return res.status(400).json({ message: "You have already applied for this job." });
    }

    const newApplication=new applicationModel({
        jobId,
        userId,
    })
    await newApplication.save()
    res.status(201).json({ message: "Job application submitted successfully." });
}



export const AcceptOrReject=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {ApplicationCId}=req.params
    const {status}=req.body

    const application=await applicationModel.findById(ApplicationCId).populate([
        {
            path:'jobId',
            select:"closed",
            populate:[{
                path:'companyId',
                select:"HRs"
            }]
        },
        {
            path: 'userId', 
            select: "email"
        }
    ]).select('status')
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }


    if(application.status===status){
        return res.status(403).json({ message:`the aplication is already ${status}`});
    }

    if (!application.jobId) {
        return res.status(500).json({ message: "Job information is missing" });
    }
    if(application.jobId.closed===true){
        return res.status(403).json({ message:`can not ${status} this application becouse job is closed`});
    }

    if (!application.jobId.companyId) {
        return res.status(500).json({ message: "Company information is missing" });
    }
    if(!application.jobId.companyId.HRs.some(ids=>ids.equals(userId)))
    {
        return res.status(403).json({message:`You are not authorized to ${status} this application`})
    }
    emitter.emit('sendEmail', {
        subject: 'Update on Your Job Application',
        html: `
            <h1>Dear Applicant,</h1>
            <p>We appreciate your interest in joining our team.</p>
            <p>We wanted to inform you that your application has been <strong>${status}</strong>.</p>
            <p>If you have any questions or need further details, feel free to reach out to us.</p>
            <p>Best regards,<br>HR Team</p>
        `,
        to: application.userId.email
    });
    
    application.status=status
    await application.save()
    res.status(201).json({ message: `Application ${status} successfully`,application});
} 



export const getJobWithApplications=async(req,res)=>{
    const {_id:userId}=req.loggedinuser
    const {jobId}=req.params
    const {page=1,limit=10}=req.query
    const {skip,limit:calcLimit}=Pagination(page,limit)

    const job=await jobOpportunityModel.findOne({_id:jobId})
    .select("-updatedBy -closed -companyId -createdAt -updatedAt")
    .populate([
        {
        path:"applications",
        select:(" -createdAt -updatedAt -__v"),
        options: { skip, limit: calcLimit , sort: { createdAt: -1 }},
        populate:[
            {
                path:'userId',
                select:('firstName lastName email gender DOB mobileNumber')
            }
        ]
        },
    ])

    if(!job){
        return res.status(404).json({ message: "job not found" });
    }
    if(job.addedBy.toString()!==userId.toString()){
        return res.status(403).json({message:`You are not authorized to look at the applications `})
    }

    const totalcount=await applicationModel.countDocuments({jobId})
    
    return res.status(200).json(
        {
            success:true,
            totalcount,
            job,
            page:Number(page),

        }
    )

}
