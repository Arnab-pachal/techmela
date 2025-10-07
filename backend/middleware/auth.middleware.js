import jwt from "jsonwebtoken";
import User from "../models/userschema.js";
export const protectRoute =async(req,res,next)=>{
try{
    console.log(req.cookies)
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"UnAuthorized-No Token Provided"});
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({message:"UnAuthorized-Token is Invalid"});
    }
    const myUser = await User.findById(decoded.userId).select("-password");
    if(!myUser){return res.status(401).json({message:"User Not Found"});}
  req.user = myUser;
  next();

}
catch(error){
    console.log("Error in Protectv MiddleWare: ",error.message);
    res.status(500).json({message:"Internal Server Error"});
}
}