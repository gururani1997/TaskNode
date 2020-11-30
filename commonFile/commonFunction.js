var nodemailer = require('nodemailer');
const twilio = require("twilio");
const accountSid = 'AC72dff9863342ea96c9abc549cd2a1b0b';
const authToken = 'c348244577e2c5a1dae36ab5b2d95ecd';
const client = require('twilio')(accountSid, authToken);
const cloudinary = require('cloudinary')
var multer=require('multer')

cloudinary.config({
    cloud_name: "djxbli0vg",     //djxbli0vg
    api_key: "281352728476344",
    api_secret: "FAMFtxUMDcbffVh4En24QaHfE1Y"
}),

module.exports = {

    'sendMail': (mobileNo, body, callback) => {
        // const client = require('twilio')(accountSid, authToken);

        client.messages.create(
            {
                from: '+15054314227',
                to: mobileNo,
                body: body,
            },
            (err, message) => {
                if (err) {
                    console.log(err,"check errors");
                    callback(err,null)

                }
                else {
                    console.log('message sent: ');
                    callback(null, message)
                }

            }
        );

    },
   imageUpload:(req,res,callback)=>{
       var fileName;
    var storage=multer.diskStorage({ 
        destination:function(req,file,callback){
            callback(null,'uploads/')
        },
        filename:function(req,file,callback){
            fileName=file.originalname+'-'+Date.now()+'.jpg'
            callback(null,fileName)
            console.log('file>>>>>>>>', file)
        }
     })
       var upload=multer({storage:storage}).array('bookImage',90);
       upload(req,res,(error,result)=>{
           if(error){
               console.log("error",error)
               
           }
           else{
               console.log("result", result)
               callback(null,fileName)
           }
       })
   }














}