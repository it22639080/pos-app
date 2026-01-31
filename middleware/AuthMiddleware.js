const jwt = require('jsonwebtoken');
const secretKey=process.env.SECRET_KEY;

const verifyToken= (req,res,next)=>{
    const token = req.headers.authorization;
    console.log(token);
    if(!token){
        return res.status(403).json({'error':'token is missing!'});
    }
    jwt.verify(token, secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({'error':'token is invalid!'});
        }

       next();
    });
}
module.exports=verifyToken;