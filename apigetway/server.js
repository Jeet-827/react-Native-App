import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.get('/',(req,res)=>{
    res.json({instanceId:process.env.INSTANCE_ID})

})

const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || "http://127.0.0.1:5001";
const AUTH_URL    = process.env.AUTH_SERVICE_URL    || "http://127.0.0.1:5000";


app.use("/api/productservice", createProxyMiddleware({
    target: PRODUCT_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
        return req.originalUrl.replace("/api/productservice", "/product");
    },
  
}));

app.use("/api/authservice", createProxyMiddleware({
    target: AUTH_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
        return req.originalUrl.replace("/api/authservice", "/api");
    },
   
}));

app.use((req, res) => {
    console.log(`[GATEWAY 404] No match for ${req.url}`);
    res.status(404).json({ error: "Not found on gateway" });
});

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Gateway running on :${port}`));