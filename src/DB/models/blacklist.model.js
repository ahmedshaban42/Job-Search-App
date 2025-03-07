import mongoose from "mongoose";

const blacklistSchema=new mongoose.Schema(
    {
        tokenid:{type:String,require:true,unique:true},
        expirydata:{type:String,require:true}
    },
    {
        timestamps:true
    })

export const blacklistmodel=mongoose.model.blackListToken||mongoose.model('blackListToken',blacklistSchema)