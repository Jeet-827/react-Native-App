import pool from "../config/db.js";
import bcrypt from "bcrypt"
import { genrateAccessToken,genrateRefresToken } from "../utils/GenrateToken.js";


export const signup = async (req,res)=>{
    try {
        const {username,email,password}=req.body
        if(!username || !email || !password){
            return res.status(401).json({message:"somthing wrong data is not Get Try again.."});
        } 

        const CheckUser = await pool.query("select * from users where email = $1 OR username = $2",[email,username])
        if(CheckUser.rows.length > 0){
           return res.status(409).json({message:"username or email allready exist so please login"})
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        const newUser = await pool.query("insert into users (username,email,hash) values ($1,$2,$3) RETURNING  id, username, email",[username,email,hash])    
        const user= newUser.rows[0]
        const accessToken = genrateAccessToken(user.id)
        const refrestoken = genrateRefresToken(user.id)

            res.status(200).json({message:"user are Signup sucessfully",accessToken,refrestoken,user})

    } catch (error) {
        res.status(501).json({message:"somthing wrong",error})
    }
}

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length === 0) {
      return res.status(404).json({
        message: "User does not exist. Please sign up.",
      });
    }

    const user = checkUser.rows[0];

    const checkPass = await bcrypt.compare(password, user.hash);

    if (!checkPass) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    const accessToken = genrateAccessToken(user.id);
    const refreshToken = genrateRefresToken(user.id);

    return res.status(200).json({
      message: "User signed in successfully.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};
