import { signin,signup } from "../controller/Auth.controller.js";
import { Router } from "express";

const AuthRoute = Router()

AuthRoute.post('/signup',signup)
AuthRoute.post('/signin',signin)

export default AuthRoute