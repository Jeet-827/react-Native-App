import jwt from "jsonwebtoken"

export const verify = (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message:"Auth header is missing"})
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            return res.status(401).json({message:"token was missing"})
        }

        const decode = jwt.verify(token,process.env.ACCESSTOKEN)

        req.user = decode

        next()
    } catch (error) {
        res.status(401).json({message:"Invalid or expired token"})
        
    }
}