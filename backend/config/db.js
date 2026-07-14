import {Pool} from "pg"
import dotenv from "dotenv"
dotenv.config()

const pool =new Pool({
      connectionString:process.env.DBSTRING
})


export default pool