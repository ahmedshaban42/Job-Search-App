import { companyModel } from "../../DB/models/company.model.js"
import { graphqlauthentication,graphQlauthorization } from "../utils/authentication.utils.js"
import { role } from "../../constants/constants.js"


export const ApproveCompanyResolver=async(args)=>{
    const {accessToken,compantId}=args

    const company=await companyModel.findById(compantId)
    if(!company){
        return 'company not found'
    }

    const {error1,user}=await graphqlauthentication(accessToken)
    if(error1){
        return new Error(error1)
    }

    const {error2}=await graphQlauthorization(user,[role.ADMIN])
    if(error2){
        return new Error(error2)
    }

    if(company.bannedAt){
        return 'company is ban'
    }
    if(company.deletedAt){
        return 'company is delete'
    }
    if (company.approvedByAdmin) {
        throw new Error("Company is already approved");
    }

    await companyModel.findByIdAndUpdate(compantId,
        {
            approvedByAdmin:true
        }
    )

    return 'company approved successfully'


}