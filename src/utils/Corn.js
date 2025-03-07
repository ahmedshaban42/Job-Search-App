import cron from "node-cron";
import {userModel}from '../DB/models/user.model.js'


export const deleteExpiredOtps=()=>{
    console.log("start cleanup")
    cron.schedule("0 */6 * * *",async()=>{
        try{
            const result=await userModel.updateMany(
                {"OTP.expiresIn":{$lt:new Date()}},
                { $pull:{ OTP:{ expiresIn:{ $lt:new Date() } } } }
            )
            //console.log(result)
            console.log('expire otps delete successfully' )

        }catch(error){
            console.log('error in otp cleanup job',error)
        }
    })
}

