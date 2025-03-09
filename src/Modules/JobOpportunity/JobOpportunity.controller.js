import { Router } from "express";
const JobOpportunity=Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {checkUserStatus}from '../../Middleware/check-User-Status.middleware.js'
import { role } from "../../constants/constants.js";

import { AddJobOpportunity,updateJobeOpportunityData, deleteJobOpportunity,getJop } from "./services/JobOpportunity.service.js";

import {AddJobOpportunitySchema,UpdateJobOpportunitySchema,
    validatejobId,getJobSchema}from '../../Validators/JobOpportunity-schema.js'

JobOpportunity.post('/AddJobOpportunity/:idCompany',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(AddJobOpportunitySchema)),
    errorHandler(AddJobOpportunity)
)

JobOpportunity.put('/updateJobOpportunity/:jobId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(UpdateJobOpportunitySchema)),
    errorHandler(updateJobeOpportunityData)
)

JobOpportunity.delete('/deleteJobOpportunity/:jobId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validatejobId)),
    errorHandler(deleteJobOpportunity)
)



JobOpportunity.get('/getJop',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(getJobSchema)),
    errorHandler(getJop)
)




export default JobOpportunity