import {Router} from "express";

const Application =Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {checkUserStatus}from '../../Middleware/check-User-Status.middleware.js'
import { role } from "../../constants/constants.js";

import {applyToJob,AcceptOrReject,getJobWithApplications}from './services/Application.services.js'
import {validateApplyToJob,validateApplicationAction,validateGetJobWithApplications}from '../../Validators/application-schema.js'


Application.post('/applyToJob/:jobId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateApplyToJob)),
    errorHandler(applyToJob)
)

Application.patch('/AcceptOrReject/:ApplicationCId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateApplicationAction)),
    errorHandler(AcceptOrReject)
)





Application.get('/getJobWithApplications/:jobId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateGetJobWithApplications)),
    errorHandler(getJobWithApplications)
)



export default Application