import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString,GraphQLNonNull } from "graphql";




export const logoType=new GraphQLObjectType({
    name:'logoType',
    description:'logo type',
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    }
})


export const coverPicType=new GraphQLObjectType({
    name:'coverPicType',
    description:'cover Pic type',
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    }
})



export const companyType=new GraphQLObjectType({
    name:'companyType',
    description:'company type',
    fields:{
        _id:{type:GraphQLID},
        companyName:{type:GraphQLString},
        description:{type:GraphQLString},
        industry:{type:GraphQLString},
        address:{type:GraphQLString},
        numberOfEmployees:{type:GraphQLInt},
        companyEmail:{type:GraphQLString},
        logo:{type:logoType},
        coverPic:{type:coverPicType},
        HRs:{type:new GraphQLList(GraphQLID)},
        

    }
})


export const BanCompanyArgs={
    accessToken:{type:new GraphQLNonNull(GraphQLString),description:"access token"},
    companyID:{type:GraphQLID,description:"company id"}

}