import Joi from "joi";
import { genders } from "../constants/constants.js";


export const UpdateUserAccountSchema={
    body:Joi.object({
        firstName:Joi.string()
        .max(10)
        .min(3)
        .trim()
        .messages({
            "string.base": "First name must be a text.",
            "string.empty": "First name is required and cannot be empty.",
            "string.min": "First name must be at least 3 characters long.",
            "string.max": "First name must not exceed 10 characters.",
        }),
        lastName:Joi.string()
        .max(10)
        .min(3)
        .trim()
        .messages({
            "string.base": "last name must be a text.",
            "string.empty": "last name is required and cannot be empty.",
            "string.min": "last name must be at least 3 characters long.",
            "string.max": "last name must not exceed 10 characters.",
        }),
        DOB:Joi.date()
        .less('now')
        .greater(new Date(new Date().setFullYear(new Date().getFullYear() - 100)))
        .messages(
            {
                "date.base":"plase enter valid date"
            }
        ),
        newMobileNumber: Joi.string()
        .max(11)
        .pattern(/^[0-9]{11}$/)
        .messages({
            "string.base": "Mobile number must be a valid text.",
            "string.empty": "Mobile number is required and cannot be empty.",
            "string.max": "Mobile number must not exceed 11 digits.",
            "string.pattern.base": "Mobile number must contain exactly 11 digits.",
        }),
        gender:Joi.string()
        .valid(...Object.values(genders))
        .messages(
            {
                "any.required": "Gender is required.",
                "any.only": `Gender must be one of: ${Object.values(genders).join(", ")}.`
            }
        ),
    })
}


export const GetProfileDataForAnotherUserSchema={
    params:Joi.object({
        userId:Joi.string()
        .trim()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages(
            {
                "string.empty": "User ID is required",
                "string.pattern.base": "Invalid user ID format",
            }
        )
    })
}


export const updadePasswordSchema={
    body:Joi.object({
        newPassword:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages(
            {
                "string.pattern.base":"newPassword must be contain 8 characters at least and contain uppercase and louercace "
            }
        ),
        confirmNewPassword:Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({
            "any.only":"new Password and confirm New Password is not match"
        }),
        oldPassword:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages(
            {
                "string.pattern.base":"oldPassword must be contain 8 characters at least and contain uppercase and louercace "
            }
        ),
    })
}