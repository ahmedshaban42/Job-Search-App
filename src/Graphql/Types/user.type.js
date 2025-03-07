import { GraphQLEnumType, GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDate } from 'graphql-scalars';

export const genderEnumType=new GraphQLEnumType({
    name:'genderEnumType',
    description:'gender enum type',
    values:{
        MALE:{value:'male'},
        FEMALE:{value:'femaie'},
        NOT_SPECIFIED: { value: "Not Specified" }
    }
})


export const profilePicType=new GraphQLObjectType({
    name:"profilePicType",
    description:"profile Pic Type",
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    }
})


export const coverPicType=new GraphQLObjectType({
    name:"coverPicUserType",
    description:"cover Pic user Type",
    fields:{
        secure_url:{type:GraphQLString},
        public_id:{type:GraphQLString}
    }
})



export const userType=new GraphQLObjectType({
    name:'userType',
    description:'user type',
    fields:{
        _id:{type:GraphQLID},
        firstName:{type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        gender:{type:genderEnumType},
        mobileNumber:{type:GraphQLString},
        profilePic:{type:profilePicType},
        coverPic:{type:coverPicType},
        DOB:{type:GraphQLDate},
        provider:{type:GraphQLString}
    }
})


export const BanUserArgs={
    accessToken:{type:new GraphQLNonNull(GraphQLString),description:"access token"},
    userId:{type:GraphQLID,description:"user id"}

}