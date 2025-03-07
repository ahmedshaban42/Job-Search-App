import { compareSync, hashSync } from "bcrypt"
import { userModel } from "../../../../DB/models/user.model.js"
import {Decryption,Encryption} from '../../../../utils/encryption.utils.js'
import {emitter} from '../../../../Services/sent-email.service.js'
import { generateToken,verifyToken } from "../../../../utils/token.utils.js"
import {v4 as uuidv4}from 'uuid'
import { OAuth2Client } from "google-auth-library"
import {providers,typrOfOtp}from '../../../../constants/constants.js'



export const signUpService=async(req,res,next)=>{
    const {firstName,lastName,email,password,confirmPassword,gender,DOB,mobileNumber,role}=req.body

    const isEmailfound =await userModel.findOne({email})
    if(isEmailfound){
        return res.status(400).json({message:'email is already exists'})
    }

    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user=new userModel({
        firstName,
        lastName,
        email,
        DOB,
        gender,
        password,
        mobileNumber,
        OTP:[
            {
                code:hashOtp,
                type:typrOfOtp.CONFIRM_EMAIL,
                expiresIn:otpExpires
            }
        ],
        role
    })
    await user.save()
    emitter.emit('sendEmail',{
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
        to:email,
    })

    res.status(201).json({message:'signUp susseccfuly'})

}


export const confirmEmail = async (req, res) => {
    const { otp, email } = req.body;

    const user = await userModel.findOne({
        email,
        isConfirmed: false,
        "OTP.type": "confirmEmail",
    });

    if (!user) {
        return res.status(400).json({ message: "User not found or already verified" });
    }

    const userOtp = user.OTP.filter(otpObj => otpObj.type === typrOfOtp.CONFIRM_EMAIL);
    const lastForgetPasswordOtp = userOtp.at(-1); 


    if (!lastForgetPasswordOtp) {
        return res.status(400).json({ message: "No valid OTP found" });
    }

    if (new Date() > lastForgetPasswordOtp.expiresIn) {
        return res.status(400).json({ message: "OTP has expired, request a new one" });
    }


    const isValidOtp = compareSync(otp, lastForgetPasswordOtp.code);
    if (!isValidOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }


    await userModel.findByIdAndUpdate(user._id, {
        isConfirmed: true,
    });

    res.status(200).json({ message: "Email confirmed successfully" });
};

export const signInUser=async(req,res)=>{

    const {email,password}=req.body
    const user=await userModel.findOne({email,isConfirmed:true})
    if(!user){
        return res.status(400).json({message:'email or password not valid'})
    }
    if (user.bannedAt) {
        return res.status(403).json({ message: "Your account is banned. You cannot log in." });
    }

    const ispassword=compareSync(password,user.password)
    if(!ispassword){
        return res.status(400).json({message:'email or password not valid'})
    }
    const accesstoken=generateToken({
        data:{_id:user._id,role:user.role,username:user.username},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{_id:user._id,role:user.role,username:user.username},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        opoptions:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',accesstoken,refreshtoken})


}


export const gmailRegister=async(req,res)=>{
    const {idToken}=req.body
    const client=new OAuth2Client()
    const ticket=await client.verifyIdToken({idToken:idToken,audience:process.env.CLIENTTD_GOOGLE})
    const payload=ticket.getPayload()
    const {email_verified,email, given_name,family_name}=payload
    if(!email_verified){
        return res.status(400).json({message:'invalid gmail credentials'})
    }
    

    const user=await userModel.findOne({email})
    if(user){
        return res.status(400).json({message:'user is already exist'})
    }

    const newUser=new userModel({
        firstName:given_name,
        lastName:family_name,
        email,
        provider:providers.GOOGLE,
        isConfirmed:true,
        password:hashSync(uuidv4(),+process.env.SALT)
    })
    await newUser.save()
    res.status(201).json({message:'signUp susseccfuly'})



}


export const gamilsignIn=async(req,res)=>{
    const {idToken}=req.body
    const client=new OAuth2Client()
    const ticket=await client.verifyIdToken({idToken:idToken,audience:process.env.CLIENTTD_GOOGLE})
    const payload=ticket.getPayload()
    const {email_verified,email}=payload
    if(!email_verified){
        return res.status(400).json({message:'invalid gmail credentials'})
    }
    const user =await userModel.findOne({email,provider:providers.GOOGLE})
    if(!user){
        return res.status(400).json({message:'user is not found'})
    }

    const accesstoken=generateToken({
        data:{_id:user._id},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{_id:user._id},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        opoptions:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',tokens:{accesstoken,refreshtoken}})


}

export const forgetPassword=async(req,res)=>{
    const {email}=req.body

    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:"user not found"})
    }

    const userOtp = user.OTP.find(otpObj => otpObj.type === typrOfOtp.FORGET_PASSWORD);
    

    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    
    await userModel.updateOne({email},
        {
            $push:{
                OTP:{
                    code:hashOtp,
                    type:typrOfOtp.FORGET_PASSWORD,
                    expiresIn:otpExpires
                }
            }
        }
    )
    
    emitter.emit('sendEmail',{
        subject:'otp to reset password',
        html:`<h1>${otp}</h1>`,
        to:user.email,
    })
    res.status(200).json({message:"otp send successfully"})


}

export const resetPassword=async(req,res)=>{
    const{email,otp,password,confirmPassword}=req.body

    if(password!==confirmPassword){
        return res.status(400).json({message:"The password and the confirm Password are not the same"})
    }

    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:"user not found"})
    }

    const userotp= user.OTP.filter(otp => otp.type === typrOfOtp.FORGET_PASSWORD)
    const lastForgetPasswordOtp = userotp.at(-1); 

    if (new Date() > new Date(lastForgetPasswordOtp.expiresIn)) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    const isNotSame=compareSync(otp,lastForgetPasswordOtp.code)
    if(!isNotSame){
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const newpassword=hashSync(password,+process.env.SALT)
    await userModel.updateOne({email:user.email},
        {
        $set:{
            password:newpassword
        }
    })
    res.status(200).json({message:"reset Password successfully"})

}


export const resendOtp=async(req,res)=>{
    const {email,typeOtp}=req.body
    const user =await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await userModel.updateOne({email},
        {
            $push:{
                OTP:{
                    code:hashOtp,
                    type:typeOtp,
                    expiresIn:otpExpires
                }
            }
        }
    )
    emitter.emit('sendEmail',{
        to:user.email,
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
    })
    res.status(201).json({message:'otp send susseccfuly'})
}



export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh Token is required" });
    
    const decoded = verifyToken({token:refreshToken, sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN});
    const user = await userModel.findById(decoded._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });


    if (user.changeCredentialTime && decoded.iat * 1000 < user.changeCredentialTime.getTime()) {
        return res.status(401).json({ message: "Session expired, please login again" });
    }

    
    const accesstoken=generateToken({
        data:{_id:user._id,role:user.role,username:user.username},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    res.status(200).json({ accesstoken });

};

