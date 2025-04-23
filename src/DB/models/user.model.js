import mongoose from "mongoose";
import { providers,genders,role,typrOfOtp } from "../../constants/constants.js";
import { compareSync, hashSync } from "bcrypt"
import {Decryption,Encryption} from '../../utils/encryption.utils.js'

export const userShema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            //required:[true,'user name is require'],
            lowercase:true,
            trim:true,
            minLength:[3,'name must be grater then 3 '],
            maxlength:[10,'name must be less than 20']
        },
        lastName:{
            type:String,
            //required:[true,'last name is require'],
            lowercase:true,
            trim:true,
            minLength:[3,'name must be grater then 3 '],
            maxlength:[10,'name must be less than 20']
        },
        email:{
            type:String,
            //required:[true,'email is require'],
            unique:[true,'email is already taken'],
        },
        password:{
            type:String,
            //required:[true,'password is require'],
        },
        provider:{
            type:String,
            default:providers.SYSTEM,
            enum:Object.values(providers)
        },
        gender:{
            type:String,
            default:genders.NITSPECIFIED,
            enum:Object.values(genders),
            //required:[true,'gender is require'],
        },
        DOB: {
            type: Date,
            //required: [true, "Date of birth is required"],
            validate: {
                validator: function (value) {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 18); // يجب أن يكون العمر أكبر من 18 سنة
                    return value < today && value <= minDate;
                },
                message: "Date of birth must be valid and user must be at least 18 years old"
            }
        },
        mobileNumber: {
            type: String,
            //required: [true, "Mobile number is required"],
            trim: true
        },
        role: {
            type: String,
            enum:Object.values(role),
            default: role.USER
        },
        isConfirmed: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        bannedAt: {
            type: Date,
            default: null
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        changeCredentialTime: {
            type: Date,
            default: null
        },
        profilePic: {
            secure_url: { type: String, default: null },
            public_id: { type: String, default: null }
        },
        coverPic:[{
            secure_url: { type: String, default: null },
            public_id: { type: String, default: null }
        }],
        
    },
    {timestamps:true}
)

userShema.virtual('userName').get(function(){
    return `${this.firstName} ${this.lastName}`;
})


userShema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = hashSync(this.password, +process.env.SALT);
    }
    
    if (this.isModified("mobileNumber")) {
        this.mobileNumber = await Encryption({ value: this.mobileNumber, secretkey: process.env.ENCRYPTED_KEY_PHONE });
    }
    
    next();
});

userShema.post('init',async function (doc) {
    if (doc && doc.mobileNumber) {
        doc.mobileNumber = await Decryption({ cipher: doc.mobileNumber, secretkey:process.env.ENCRYPTED_KEY_PHONE });
    }
})

export const userModel=mongoose.models.user||mongoose.model('user',userShema)