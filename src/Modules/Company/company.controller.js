import { Router  } from "express";
const company=Router()

import {
    AddCompany,updateCompanyData,SoftDeleteCompany,
    ReactivationOfTheCompany,SearchForACompany,
    GetSpecificCompanyWithRelatedJobs
}from './services/company.service.js'


import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {checkUserStatus}from '../../Middleware/check-User-Status.middleware.js'
import {AddCompanySchema,updateCompanyDataSchema,
    validateCompanyId,SearchForACompanySchema}from '../../Validators/company-schema.js'
import { role } from "../../constants/constants.js";



company.post('/Add-Company',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(validationMW(AddCompanySchema)),
    errorHandler(AddCompany)
)


company.patch('/update-Company-Data/:companyId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(updateCompanyDataSchema)),
    errorHandler(updateCompanyData)
)


company.delete('/Soft-Delete-Company/:companyId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER,role.ADMIN)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateCompanyId)),
    errorHandler(SoftDeleteCompany)
)

company.post('/Reactivation-Of-The-Company/:companyId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER,role.ADMIN)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateCompanyId)),
    errorHandler(ReactivationOfTheCompany)
)

company.get('/Search-For-A-Company',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER,role.ADMIN)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(SearchForACompanySchema)),
    errorHandler(SearchForACompany)
)



company.get('/Get-Specific-Company-With-Related-Jobs/:companyId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER,role.ADMIN)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(validateCompanyId)),
    errorHandler(GetSpecificCompanyWithRelatedJobs)
)



export default company