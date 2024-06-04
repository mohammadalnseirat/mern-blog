// create a function to handle errors:
const handleErrors=(statusCode,message)=>{
    const error=new Error();
    error.statusCode=statusCode;
    error.message=message;
    return error;
}


module.exports = { handleErrors };