import { Router } from "express";
const user=Router()

import { errorHandler } from "../../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../../Middleware/authentication.middleware.js'
import { validationMW } from "../../../Middleware/validation.middleware.js";

import {
    signUpService,confirmEmail,signInUser,gmailRegister,
    gamilsignIn,forgetPassword,resetPassword,resendOtp,
    refreshToken,
} 
from './services/authentication-user.service.js'


import {
    signUpServiceSchema,confirmEmailSchema,signInUserSchema,
    forgetPasswordSchema,resetPasswordSchema,resendOtpSchema,
}
from '../../../Validators/Auth-schema.js'




user.post('/signUpService',
    errorHandler(validationMW(signUpServiceSchema)),
    errorHandler(signUpService)
)

user.post('/confirm-Email',
    errorHandler(validationMW(confirmEmailSchema)),
    errorHandler(confirmEmail)
)

user.post('/signInUserService',
    validationMW(signInUserSchema),
    errorHandler(signInUser)
)

user.post('/gmail-signup',errorHandler(gmailRegister))

user.post('/gmail-login',errorHandler(gamilsignIn))

user.post('/forgetPassword',
    validationMW(forgetPasswordSchema),
    errorHandler(forgetPassword)
)

user.post('/resetPassword',
    validationMW(resetPasswordSchema),
    errorHandler(resetPassword)
)

user.post('/resendOtp',
    validationMW(resendOtpSchema),
    errorHandler(resendOtp)
)
user.post('/refreshToken',
    errorHandler(refreshToken)
)


export default user