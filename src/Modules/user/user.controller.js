import { Router } from "express";
const userProfile=Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {checkUserStatus}from '../../Middleware/check-User-Status.middleware.js'
import { role } from "../../constants/constants.js";


import {
    UpdateUserAccount,GetLoginUserAccountData,
    GetProfileDataForAnotherUser,updadePassword,
    SoftDeleteAccount
}
from './services/user.service.js'

import {UpdateUserAccountSchema,GetProfileDataForAnotherUserSchema,updadePasswordSchema}from '../../Validators/user-profile-schema.js'


userProfile.patch('/Update-User-Account',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(UpdateUserAccountSchema)),
    errorHandler(UpdateUserAccount)
)

userProfile.get('/Get-Login-User-Account-Data',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(GetLoginUserAccountData)
)

userProfile.get('/Get-Profile-Data-For-Another-User/:userId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(GetProfileDataForAnotherUserSchema)),
    errorHandler(GetProfileDataForAnotherUser)
)

userProfile.put('/updade-Password',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(validationMW(updadePasswordSchema)),
    errorHandler(updadePassword)
)

userProfile.delete('/Soft-Delete-Account',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(checkUserStatus()),
    errorHandler(SoftDeleteAccount)
)

export default userProfile