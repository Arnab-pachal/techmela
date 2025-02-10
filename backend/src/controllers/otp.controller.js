import nodemailer from "nodemailer";
import crypto from "crypto"
import OTP from "../models/otp.model.js"
import Users from "../models/userschema.js";
import bcrypt from "bcryptjs"
const generateOTP = () => {
    return crypto.randomInt(100000, 999999);
};

const sendOTP = async (recipientEmail) => {
    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'arnabpachal2004@gmail.com',
            pass: 'zevl zvew jzbh zatk',
        },
    });
 

 const mailOptions = {
    from: 'arnabpachal2004@gmail.com',
    to: recipientEmail,
    subject: 'Your OTP for App Access',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
};

try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${recipientEmail}`);
    return otp; // Store this OTP securely
} catch (error) {
    console.error('Error sending email:', error);
}
}

export const send =async(req,res)=>{

    try{
    
    let {email}=req.body;
    console.log(email)
    let existedotp = OTP.find({email:email});
    if(existedotp){await OTP.findByIdAndDelete(existedotp._id);}
    const result = await sendOTP(email);
    let newotp = new OTP({email:email,otp:result,expiresAt:Date.now()+10*60*1000,used:false});
    newotp.save();
    res.status(200).json({message : "OTP Send Successfully"});}
    catch(e){
        console.log(e);
        res.status(500).json({message:'Internal Server Error'});
    }

}
export const verify = async(req,res)=>{
    const { email, otp} = req.body;

    if (!email || !otp ) {
        return res.status(400).send("Email, OTP,  are required");
    }

    try {

        const otpRecord = await OTP.findOne({ email, otp });

        if (!otpRecord) return res.status(400).send("Invalid OTP");

        const serverTime = Date.now();
        const expiresAt = otpRecord.expiresAt;
         
     
        if (expiresAt < serverTime) {
            return res.status(400).send("OTP has expired");
        }
        console.log("otp verified")
        const User =await  Users.findOne({email:email});
     
        res.status(200).json({username : User.fullName, pass: User.password});
    } catch (error) {
        res.status(500).send("Error verifying OTP: " + error.message);
    }
}
const message = async(recipientEmail,text)=>{
    const mail = {
        from: 'arnabpachal2004@gmail.com',
        to: recipientEmail,
        subject: 'Your OTP for App Access',
        text: text,
    };
    return mail;
}
export  const updateInfo = async(req,res)=>{
    try{
const {email, password}=req.body;
  const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt);
let User = await Users.findOneAndUpdate({email:email},{password:hashedPassword},{new:true});
const msg = await message(email,`.Hi This Message Is From TechMela BY CCA OF NIT DURGAPUR.\nYour UserName And Password is Changed \n.
    Hi ${User.fullName}! \n Your new Password is :- ${password}`)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arnabpachal2004@gmail.com',
        pass: 'zevl zvew jzbh zatk',
    },
});
await transporter.sendMail(msg);
res.status(200).json({message:"New Username And Password sent to Your email"});}
catch(e){
    console.log(e);
    res.status(500).json({message:"Intenal Server Error"});
}
}

    

