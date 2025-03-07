import Joi from "joi";
import mongoose from "mongoose";
import {jobLocation,workingTime,seniorityLevel}from '../constants/constants.js'
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("valid ObjectId.");
    }
    return value;
};

export const AddJobOpportunitySchema={
    body:Joi.object({
        jobTitle:Joi.string()
        .required()
        .max(20)
        .min(3)
        .messages({
            "string.base": "jobTitle must be a text.",
            "string.empty": "jobTitle is required and cannot be empty.",
            "string.min": "jobTitle must be at least 3 characters long.",
            "string.max": " must not exceed 20 characters.",
        }),
        jobLocation:Joi.string()
        .required()
        .valid(...Object.values(jobLocation))
        .messages({
            "string.base": "job Location must be a text.",
            "string.empty": "job Location is required and cannot be empty.",
            "any.only": `job Location must be one of: ${Object.values(jobLocation).join(", ")}.`
        }),
        workingTime:Joi.string()
        .required()
        .valid(...Object.values(workingTime))
        .messages({
            "string.base": "workingTime must be a text.",
            "string.empty": "workingTime is required and cannot be empty.",
            "any.only": `workingTime must be one of: ${Object.values(workingTime).join(", ")}.`
        }),
        seniorityLevel:Joi.string()
        .required()
        .valid(...Object.values(seniorityLevel))
        .messages({
            "string.base": "seniority Level  must be a text.",
            "string.empty": "seniority Level is required and cannot be empty.",
            "any.only": `seniority Level must be one of: ${Object.values(seniorityLevel).join(", ")}.`
        }),
        jobDescription:Joi.string()
        .required()
        .max(1500)
        .messages({
            "string.base": "seniority Level  must be a text.",
            "string.empty": "seniority Level is required and cannot be empty.",
            "string.max": " must not exceed 1500 characters."
        }),
        technicalSkills:Joi.array()
        .items(Joi.string()
            .messages(
                {
                    "string.base": "Each skill must be a string.",
                    "string.empty": "Skills cannot be empty"
                }
            ))
        .min(1)
        .required()
        .messages({
            "array.base": "Technical skills must be an array.",
            "array.min": "You must provide at least one technical skill.",
            "any.required": "Technical skills are required."
        }),
        softSkills:Joi.array().items(Joi.string().messages(
            {
                "string.base": "Each skill must be a string.",
                "string.empty": "Skills cannot be empty"
            }
        ))
        .min(1)
        .required()
        .messages(
            {
                "array.base": "soft Skills  must be an array.",
                "array.min": "You must provide at least one soft Skills ",
                "any.required": "soft Skills are required."
            }
        )


    })
}



export const UpdateJobOpportunitySchema = {
    body: Joi.object({
        jobTitle: Joi.string().max(20).min(3).optional().messages({
            "string.base": "jobTitle must be a text.",
            "string.min": "jobTitle must be at least 3 characters long.",
            "string.max": "jobTitle must not exceed 20 characters."
        }),
        jobLocation: Joi.string().valid(...Object.values(jobLocation)).optional().messages({
            "string.base": "job Location must be a text.",
            "any.only": `job Location must be one of: ${Object.values(jobLocation).join(", ")}.`
        }),
        workingTime: Joi.string().valid(...Object.values(workingTime)).optional().messages({
            "string.base": "workingTime must be a text.",
            "any.only": `workingTime must be one of: ${Object.values(workingTime).join(", ")}.`
        }),
        seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)).optional().messages({
            "string.base": "seniority Level must be a text.",
            "any.only": `seniority Level must be one of: ${Object.values(seniorityLevel).join(", ")}.`
        }),
        jobDescription: Joi.string().max(1500).optional().messages({
            "string.base": "jobDescription must be a text.",
            "string.max": "jobDescription must not exceed 1500 characters."
        }),
        technicalSkills: Joi.array().items(Joi.string().messages({
            "string.base": "Each skill must be a string.",
            "string.empty": "Skills cannot be empty."
        })).min(1).optional().messages({
            "array.base": "Technical skills must be an array.",
            "array.min": "You must provide at least one technical skill."
        }),
        softSkills: Joi.array().items(Joi.string().messages({
            "string.base": "Each skill must be a string.",
            "string.empty": "Skills cannot be empty."
        })).min(1).optional().messages({
            "array.base": "Soft skills must be an array.",
            "array.min": "You must provide at least one soft skill."
        })
    })
};


export const validatejobId = {
    params: Joi.object({
        jobId: Joi.string().custom(objectIdValidator).required().messages({
            "string.base": "job ID must be a string.",
            "any.required": "job ID is required.",
            "any.custom": "job ID must be a valid ObjectId."
        })
    })
};


export const getJopSchema = {
    query: Joi.object({
        jobTitle: Joi.string().max(20).min(3).optional().messages({
            "string.base": "jobTitle must be a text.",
            "string.min": "jobTitle must be at least 3 characters long.",
            "string.max": "jobTitle must not exceed 20 characters."
        }),
        jobLocation: Joi.string().valid(...Object.values(jobLocation)).optional().messages({
            "string.base": "job Location must be a text.",
            "any.only": `job Location must be one of: ${Object.values(jobLocation).join(", ")}.`
        }),
        workingTime: Joi.string().valid(...Object.values(workingTime)).optional().messages({
            "string.base": "workingTime must be a text.",
            "any.only": `workingTime must be one of: ${Object.values(workingTime).join(", ")}.`
        }),
        seniorityLevel: Joi.string().valid(...Object.values(seniorityLevel)).optional().messages({
            "string.base": "seniority Level must be a text.",
            "any.only": `seniority Level must be one of: ${Object.values(seniorityLevel).join(", ")}.`
        }),
        jobDescription: Joi.string().max(1500).optional().messages({
            "string.base": "jobDescription must be a text.",
            "string.max": "jobDescription must not exceed 1500 characters."
        }),
        technicalSkills: Joi.array().items(Joi.string().messages({
            "string.base": "Each skill must be a string.",
            "string.empty": "Skills cannot be empty."
        })).min(1).optional().messages({
            "array.base": "Technical skills must be an array.",
            "array.min": "You must provide at least one technical skill."
        }),
        softSkills: Joi.array().items(Joi.string().messages({
            "string.base": "Each skill must be a string.",
            "string.empty": "Skills cannot be empty."
        })).min(1).optional().messages({
            "array.base": "Soft skills must be an array.",
            "array.min": "You must provide at least one soft skill."
        })
    })
};

