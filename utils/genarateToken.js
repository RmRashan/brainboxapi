import jwt from "jsonwebtoken";


const genarateToken = (userID,userPassowrd, res) => {
    const token = jwt.sign({ userID,userPassowrd }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })
    return token
    
    
    // res.cookie("jwt", token, {
    //     maxAge: 15 * 24 * 60 * 60 * 1000,
    //     httpOnly: true,
    //     sameSite: "strict",
    //     secure:true

    // })
}
export default  genarateToken;