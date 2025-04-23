import multer from "multer";
import fs from 'fs'



//multer local
export const Multer=(destinationPath='general',allowExtentionns=[])=>{
    const destinationfolder=`Assets/${destinationPath}`
    if(!fs.existsSync(destinationfolder)){
        fs.mkdirSync(destinationfolder,{recursive:true})
    }


    //disckStorage or memoryStorage
    const storage=multer.diskStorage({
        //destination
        destination:function(req,file,cb){
            // error    مكان التخزين
            cb(null,destinationfolder)
        },

        //fileName
        filename:function(req,file,cb){
            console.log(file)//before upload

            //to make a unique file name
            const uniqueSuffix= Date.now() + '-' + Math.round( Math.random() * 1E9 )
            
            cb(null,uniqueSuffix + '__' + file.originalname)
        }
    })

    
    const fileFilter=(req,file,cb)=>{
        if(allowExtentionns.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('invalid file type',false))
        }
    }


    const upload=multer({fileFilter,storage})
    return upload

}


//multer in cloud

export const MulterCloud=(allowExtentionns=[])=>{
    const storage=multer.diskStorage({})

    const fileFilter=(req,file,cb)=>{
        if(allowExtentionns.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('invalid file type',false))
        }
    }


    const upload=multer({fileFilter,storage})
    return upload
}