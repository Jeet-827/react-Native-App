import { getProduct } from "../controllers/Product.controller.js";
import { verify } from "../middleware/verify.js";
import { Router } from "express";

const ProductRoute = Router()
ProductRoute.get('/getproduct',getProduct)

export default ProductRoute

