import Authusercontroller from '../Modules/Auth/auth-user/auth-user.controller.js'
import userProfileController from '../Modules/user/user.controller.js'
import companyController from '../Modules/Company/company.controller.js'
import JobOpportunityController from '../Modules/JobOpportunity/JobOpportunity.controller.js'
import ApplicationController from '../Modules/Application/Application.controller.js'

import {globalhandelrMW} from '../Middleware/error-handeller.middleware.js'

import {rateLimit}from 'express-rate-limit'

import { createHandler } from 'graphql-http/lib/use/express'
import { mainSchema } from '../Graphql/main.shema.js'

const limit=rateLimit({
    windowMs:15*60*1000,
    limit:1000,
    message:'to many request',
    legacyHeaders:false
})




const routerhandellar=(app,express)=>{
    app.use(limit)


    app.use('/auth-user',Authusercontroller)
    app.use('/user-profile',userProfileController)
    app.use('/Company',companyController)
    app.use('/graphQl/JopSearchApp',createHandler({schema:mainSchema}))
    app.use('/JobOpportunity',JobOpportunityController)
    app.use('/Application',ApplicationController)






    app.get('/',async(req,res)=>{res.status(200).json({message:"app work done"})})







    app.use(globalhandelrMW)
}


export default routerhandellar