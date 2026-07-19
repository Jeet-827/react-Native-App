import mongoose, { Mongoose } from "mongoose"

export default  async function ConnectMongodb(){
    try {
        const conn = await mongoose.connect(process.env.MONGODBURL)
        console.log("mongodb is connected")
    } catch (error) {
        console.log("Mongodb is not connenected",error.message)
    }
} 