import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import ProductRoute from "./router/Product.route.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}))

app.use(express.json())
app.use('/product', ProductRoute)

const port = process.env.PORT || 5001
app.listen(port, '0.0.0.0', () => {
  console.log(`Product server is running on port ${port}`)
})