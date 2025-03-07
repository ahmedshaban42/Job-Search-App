import Joi from "joi";
import mongoose from "mongoose";


const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("valid ObjectId.");
    }
    return value;
};


export const AddCompanySchema={
    body:Joi.object({
        companyName:Joi
        .string()
        .required()
        .max(15)
        .messages(
            {
                "string.base": "company Name must be a text.",
                "string.empty": "company Name is required and cannot be empty.",
                "string.max": "company Name must not exceed 15 characters.",
                "any.required": "company Name is required."
            }
        ),
        description:Joi.string()
        .required()
        .messages(
            {
                "string.base": "description must be a text.",
                "string.empty": "description is required and cannot be empty.",
                "any.required": "description is required."
            }
        ),
        industry:Joi
        .string()
        .required()
        .max(30)
        .messages(
            {
                "string.base": "industry must be a text.",
                "string.empty": "industry is required and cannot be empty.",
                "string.max": "industry must not exceed 30 characters.",
                "any.required": "industry Name is required."
            }
        ),
        address:Joi
        .string()
        .required()
        .max(30)
        .messages(
            {
                "string.base": "address must be a text.",
                "string.empty": "address is required and cannot be empty.",
                "string.max": "address must not exceed 30 characters.",
                "any.required": "address Name is required."
            }
        ),
        numberOfEmployees:Joi.number()
        .integer()
        .min(11)
        .max(20)
        .required()
        .messages({
            "number.base": "Number of employees must be a number.",
            "number.min": "Number of employees must be at least 11.",
            "number.max": "Number of employees must not exceed 30.",
            "any.required": "Number of employees is required."
        }),

        companyEmail:Joi.string()
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
                "string.base": "companyEmail must be a valid text.",
                "string.empty": "companyEmail is required and cannot be empty.",
                "string.email": "Invalid companyEmail format. Make sure it's a valid email address.",
                "any.required": "companyEmail is required.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid companyEmail domain format."
            }
        ),
        HRs: Joi.array()
        .items(Joi.string().custom(objectIdValidator))
        .unique()
        .messages({
            "array.base": "HRs must be an array.",
            "array.unique": "HRs must not contain duplicate values.",
            "string.base": "Each HR ID must be a string.",
            "any.custom": "Each HR ID must be a valid ObjectId."
        })
    })
}


export const updateCompanyDataSchema = {
    body: Joi.object({
        companyName: Joi.string().max(15).optional().messages({
            "string.base": "Company Name must be a text.",
            "string.max": "Company Name must not exceed 15 characters.",
        }),
        description: Joi.string().optional().messages({
            "string.base": "Description must be a text.",
        }),
        industry: Joi.string().max(30).optional().messages({
            "string.base": "Industry must be a text.",
            "string.max": "Industry must not exceed 30 characters.",
        }),
        address: Joi.string().max(30).optional().messages({
            "string.base": "Address must be a text.",
            "string.max": "Address must not exceed 30 characters.",
        }),
        numberOfEmployees: Joi.number().integer().min(11).max(20).optional().messages({
            "number.base": "Number of employees must be a number.",
            "number.min": "Number of employees must be at least 11.",
            "number.max": "Number of employees must not exceed 20.",
        }),
        companyEmail: Joi.string()
            .email({
                tlds: { allow: ['com'], deny: ['net', 'org'] },
                maxDomainSegments: 2,
                multiple: true,
                separator: '&'
            })
            .optional()
            .messages({
                "string.base": "Company Email must be a valid text.",
                "string.email": "Invalid Company Email format. Make sure it's a valid email address.",
                "string.email.tlds": "Only '.com' domains are allowed.",
                "string.email.maxDomainSegments": "Invalid company email domain format.",
            }),
        HRs: Joi.array()
            .items(Joi.string().custom(objectIdValidator))
            .unique()
            .optional()
            .messages({
                "array.base": "HRs must be an array.",
                "array.unique": "HRs must not contain duplicate values.",
                "string.base": "Each HR ID must be a string.",
                "any.custom": "Each HR ID must be a valid ObjectId."
            })
    })
};




export const validateCompanyId = {
    params: Joi.object({
        companyId: Joi.string().custom(objectIdValidator).required().messages({
            "string.base": "Company ID must be a string.",
            "any.required": "Company ID is required.",
            "any.custom": "Company ID must be a valid ObjectId."
        })
    })
};


export const SearchForACompanySchema = {
    body: Joi.object({
        companyName: Joi.string().required().messages({
            "string.base": "Company name must be a text.",
            "string.empty": "Company name is required and cannot be empty.",
            "any.required": "Company name is required."
        })
    })
};
