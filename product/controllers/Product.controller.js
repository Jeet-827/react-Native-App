import pool from "../config/postgress.config.js";

export const getProduct = async(req,res)=>{
    try {
        const page = Number(req.query.page || 1) ;
        const limit = Number(req.query.limit || 10) ;
        const skip = (page -1)* limit;
        const product = await pool.query("select * from products  ORDER BY ID LIMIT $1 OFFSET $2",[limit,skip])  
        res.status(200).json({message:"all product",products:product.rows})

    } catch (error) {
        
        res.status(500).json({message:error.message})
    }
}