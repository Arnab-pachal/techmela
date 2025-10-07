import jwt from "jsonwebtoken";
import User from "../models/userschema.js";
export const checkHost =async(req,res,next)=>{
try{
    console.log("cookies are :-",req.cookies)
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"UnAuthorized-No Token Provided"});
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        console.log("Not decoded")
        return res.status(401).json({message:"UnAuthorized-Token is Invalid"});
    }
    
    const myUser = await User.findById(decoded.userId).select("-password");
    if(!myUser.isHost){return res.status(401).json({message:"Only Admin can change it"});}
    console.log("This is host");
  req.user = myUser;
  next();

}
catch(error){
    console.log("Error in Protectv MiddleWare: ",error);
    res.status(500).json({message:"Internal Server Error"});
}
}