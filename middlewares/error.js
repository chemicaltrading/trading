class Errorhandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}


export const errormiddleware=(err, req, res, next)=>{
    err.message=err.message||"Internal server error";
    err.statusCode=err.statusCode||500;

    if(err.name==="CaseError"){
        const message=`Resource not found. Invalid ${err.path}`
        err=new Errorhandler(message, 400)
    }
    
    if(err.code===11000){                     // error related to database
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`
        err=new Errorhandler(message, 400)
    }

    if(err.name==="JsonWebTokenError"){
        const message=`json web token is invalid. Try Again`
        err=new Errorhandler(message, 400)
    }

    if(err.name==="TokenExpiredError"){
        const message=`json webtoken is expired. Try Again`
        err=new Errorhandler(message, 400)
    }

    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};

export default Errorhandler;