import { tokenRouting } from "../controller/TokenRounting.controller.js";
import { Router } from "express";
const TokenRoute = Router()


TokenRoute.post('/route',tokenRouting)

export default TokenRoute