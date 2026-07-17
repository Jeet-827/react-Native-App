
import jwt from "jsonwebtoken"
import { genrateAccessToken,genrateRefresToken } from "../utils/GenrateToken.js";
export const tokenRouting = async (req,res)=>{
    try {
        const refreshToken  = req.cookies?.token || req.body.token;
        
        if(!refreshToken ){
            return res.status(400).json({error:"token is expired plase login"})
        }

        const token = jwt.verify(refreshToken ,process.env.ACCESSTOKEN)
        const accessToken = genrateAccessToken(token.id)
        const refresToken = genrateRefresToken(token.id)

        res.status(200).json({message:"token is genrated",accessToken,refresToken})
    } catch (error) {
        res.status(500).json({error,message:"somthing wrong form rerouting"})
    }
}