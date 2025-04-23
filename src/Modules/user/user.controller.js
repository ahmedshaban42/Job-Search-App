import { Router } from "express";
const userProfile=Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {checkUserStatus}from '../../Middleware/check-User-Status.middleware.js'
import { Multer,MulterCloud } from "../../Middleware/multer.Middleware.js";
import { role,DocumentExtensions } from "../../constants/constants.js";


import {
    UpdateUserAccount,GetLoginUserAccountData,
    GetProfileDataForAnotherUser,updadePassword,
    SoftDeleteAccount,uploadProfilePicture,uploadcoverPicture,
    uploadProfilePictureCloud,uploadProfileCoverCloud,
    deleteProfilePictureCloud,deleteCoverPictureCloud
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



userProfile.post('/upload-profile-picture',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    Multer('User/profile',DocumentExtensions).single('profile'),
    errorHandler(uploadProfilePicture)

)




userProfile.post('/upload-cover-picture',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    Multer('User/cover',DocumentExtensions).array('covers',10),
    errorHandler(uploadcoverPicture)

)

userProfile.post(
    '/upload-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    MulterCloud(DocumentExtensions).single('profile'),
    errorHandler(uploadProfilePictureCloud)
)



userProfile.post('/upload-cover-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    MulterCloud(DocumentExtensions).array('covers',10),
    errorHandler(uploadProfileCoverCloud)

)


userProfile.delete('/delete-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(deleteProfilePictureCloud)
)


userProfile.delete('/delete-covers-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(role.USER)),
    errorHandler(deleteCoverPictureCloud)
)


export default userProfile