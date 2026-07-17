import { Router } from "express";
import { SortUrl,GetUrl } from "../controller/Url.controller.js";
const route = Router()

route.post('/url',SortUrl)
route.get('/urlget/:id',GetUrl)

export default route