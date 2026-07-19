import jwt from "jsonwebtoken"

export function genrateAccessToken(userId) {
    const Token = jwt.sign({ id: userId }, process.env.ACCESSTOKEN, { expiresIn: "7d" })
    return Token
}

export function genrateRefresToken(userId) {
    const Token = jwt.sign({ id: userId }, process.env.ACCESSTOKEN, { expiresIn: "7d" })
    return Token
}