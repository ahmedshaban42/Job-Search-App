import Joi from "joi";
import mongoose from "mongoose";
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("valid ObjectId.");
    }
    return value;
};


export const validateApplyToJob = {
    params: Joi.object({
        jobId: Joi.string().custom(objectIdValidator).required().messages({
            "string.base": "job ID must be a string.",
            "any.required": "job ID is required.",
            "any.custom": "job ID must be a valid ObjectId."
        })
    })
};

export const validateApplicationAction = {
    params: Joi.object({
        ApplicationCId: Joi.string().custom(objectIdValidator).required().messages({
            "string.base": "Application ID must be a string.",
            "any.required": "Application ID is required.",
            "any.custom": "Application ID must be a valid ObjectId."
        })
    }),
    body: Joi.object({
        status: Joi.string().valid("accepted", "rejected").required().messages({
            "string.base": "Status must be a string.",
            "any.required": "Status is required.",
            "any.only": "Status must be either 'accepted' or 'rejected'."
        })
    })
};

export const validateGetJobWithApplications = {
    params: Joi.object({
        jobId: Joi.string().custom(objectIdValidator).required().messages({
            "string.base": "Job ID must be a string.",
            "any.required": "Job ID is required.",
            "any.custom": "Job ID must be a valid ObjectId."
        })
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1).messages({
            "number.base": "Page must be a number.",
            "number.integer": "Page must be an integer.",
            "number.min": "Page must be at least 1."
        }),
        limit: Joi.number().integer().min(1).max(100).default(10).messages({
            "number.base": "Limit must be a number.",
            "number.integer": "Limit must be an integer.",
            "number.min": "Limit must be at least 1.",
            "number.max": "Limit must not exceed 100."
        })
    })
};
