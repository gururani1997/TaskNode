var mongoose=require('mongoose')
mongoose.connect( "mongodb://localhost:27017/task",(error,result)=>{
if(error){
    console.log("error");
}
else{
    console.log("connect")
}

})