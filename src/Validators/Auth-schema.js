import Joi from "joi";
import { genders,role } from "../constants/constants.js";





export const signUpServiceSchema={
    body:Joi.object({
        firstName:Joi.string()
        .required()
        .max(10)
        .min(3)
        .trim()
        .messages({
            "string.base": "First name must be a text.",
            "string.empty": "First name is required and cannot be empty.",
            "string.min": "First name must be at least 3 characters long.",
            "string.max": "First name must not exceed 10 characters.",
            "any.required": "First name is required."
        }),

        lastName:Joi.string()
        .required()
        .max(10)
        .min(3)
        .trim()
        .messages({
            "string.base": "last name must be a text.",
            "string.empty": "last name is required and cannot be empty.",
            "string.min": "last name must be at least 3 characters long.",
            "string.max": "last name must not exceed 10 characters.",
            "any.required": "last name is required."
        }),


        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),

        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages(
            {
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            }
        ),
        confirmPassword:Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            "any.only":"passwoed and confirm password is not match"
        }),

        gender:Joi.string()
        .required()
        .valid(...Object.values(genders))
        .messages(
            {
                "any.required": "Gender is required.",
                "any.only": `Gender must be one of: ${Object.values(genders).join(", ")}.`
            }
        ),

        DOB:Joi.date()
        .required()
        .less('now')
        .greater(new Date(new Date().setFullYear(new Date().getFullYear() - 100)))
        .messages(
            {
                "date.base":"plase enter valid date"
            }
        ),

    mobileNumber: Joi.string()
    .required()
    .max(11)
    .pattern(/^[0-9]{11}$/)
    .messages({
        "string.base": "Mobile number must be a valid text.",
        "string.empty": "Mobile number is required and cannot be empty.",
        "string.max": "Mobile number must not exceed 11 digits.",
        "string.pattern.base": "Mobile number must contain exactly 11 digits.",
        "any.required": "Mobile number is required."
        }),
    
    role:Joi.string()
    .max(5)
    .valid(...Object.values(role))
    .messages(
        {
            "string.base": "Mobile number must be a valid text."
        }
    )

    })
}

export const confirmEmailSchema={
    body:Joi.object({
        otp:Joi.string()
        .required()
        .messages(
            {
                "string.base": "otp must be a valid text.",
                "string.empty": "otp is required and cannot be empty.",
            }
        ),

        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),
    }),
    
}

export const signInUserSchema={
    body:Joi.object({
        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),

        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages(
            {
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            }
        ),
    })
}


export const forgetPasswordSchema={
    body:Joi.object({
        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),

    })
    

}


export const resetPasswordSchema={
    body:Joi.object({
        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),

        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages(
            {
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            }
        ),
        confirmPassword:Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
            "any.only":"passwoed and confirm password is not match"
        }),
        otp:Joi.string().required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "any.required": "Email is required."
            }
        )
    })
}

export const resendOtpSchema={
    body:Joi.object({
        email:Joi.string()
        .email({
            tlds:{
                allow:['com'],
                deny:['net','org']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'&'
        })
        .required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "string.email": "Invalid email format. Make sure it's a valid email address.",
                "any.required": "Email is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid email domain format."
            }
        ),
        typeOtp:Joi.string().required().messages(
            {
                "string.base": "Email must be a valid text.",
                "string.empty": "Email is required and cannot be empty.",
                "any.required": "Email is required."
            }
        )
    })
}

export const refreshTokenSchema={
    body:Joi.object(
        {
            refreshToken:Joi.string().required().messages(
                {
                    "string.base": "Email must be a valid text.",
                    "string.empty": "Email is required and cannot be empty.",
                    "any.required": "Email is required."
                }
            )
        }
    )
}