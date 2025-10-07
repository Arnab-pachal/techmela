import Team from "../models/team.js";
import Users from "../models/userschema.js";
import cloudinary from "../lib/cloudinary.js";
import nodemailer from "nodemailer";
import { v4 } from "uuid";
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
dotenv.config();
const sendMessage =  async (recipientEmail,user,pass) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.GOOGLE_USER}`,
            pass: `${process.env.GOOGLE_PASS}`,
        },
    });
 

 const mailOptions = {
    from: 'arnabpachal2004@gmail.com',
    to: recipientEmail,
    subject: 'Your New Account has been created',
    text: `Hi Guys,Your new Account for TechMela-2025 has been created \n Your UserName is :--> ${user}\n
    Your password is :--> ${pass}`,
};

try {
    await transporter.sendMail(mailOptions);
    console.log(`Account created of ${recipientEmail}`);
  
} catch (error) {
    console.error('Error sending email:', error);
}
}

export const ateam = async(req,res)=>{
    try{
const{name}=req.body;
const team = await Team.findOne({teamName:name});
res.status(200).json(team);
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const allteam = async(req,res)=>{
    try{
        const team = await Team.find({});
        res.status(200).json(team);
            }
            catch(e){
                console.log(e);
                res.status(500).json({message:"Internal Server Error"});
            }
}


export const createTeam=async(req,res)=>{
    try{ 
 const {teamName , deadline , project,teamStrength,participants}=req.body;
 

 const newTeam = new Team({teamName:teamName,deadLine:deadline,projectName:project})
 await newTeam.save();
 console.log(teamStrength);
 for(let i=0;i<teamStrength;i++){
    console.log(participants[i]);
    const response =await cloudinary.uploader.upload(participants[i].token,{ folder: "event-tickets",
        resource_type: "image", // Ensure it's treated as an image
      });

    const User = await Users.findOne({fullName:participants[i].name,email:participants[i].email});
    if(User){const User = await Users.findOneAndUpdate({fullName:participants[i].name,email:participants[i].email},{TeamName:teamName,generatedToken:response.secure_url},{new:true})
        }
    else{    const pass = v4().replace(/-/g, '').slice(0, 12);
          const salt = await bcrypt.genSalt(10);
                        const hashedPassword =await bcrypt.hash(pass,salt);
        const User = await Users.create({fullName:participants[i].name,email:participants[i].email,password:hashedPassword,TeamName:teamName,generatedToken:response.secure_url})
        await sendMessage(User.email,User.fullName,pass)
    }
    
    console.log(`The User Number ${i} is :-`,User)
 }
 console.log(newTeam);
 res.status(201).json(newTeam);

}
catch(error){
    console.log(error);
    res.status(500).json({message:"Internal Server Error"});
}
}

export const UpdateTeam= async(req,res)=>{
    const teamid = req.params.id;
    const {teamName , deadline , project,teamStrength,participants}=req.body;
    try{
    const updatedUser= await Team.findByIdAndUpdate(teamid,{teamName:teamName,deadLine:deadline,projectName:project},{new:true})
    for(let i=0;i<teamStrength;i++){
        console.log(participants[i]);
        const User = await Users.findOneAndUpdate({fullName:participants[i]},{TeamName:teamName});
        console.log(`The User Number ${i} is :-`,User)
     }
     const allpart = await Team.find({});
      res.status(200).json(allpart)}
      catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
      }
   }

export const deleteTeam = async(req,res)=>{
    try{
    const teamid = req.params.id;
    let deleteTeam = await Team.findByIdAndDelete(teamid);
    console.log(deleteTeam);
    let allteam = await Team.find({});
    res.status(200).json(allteam);
}
    catch(error){
        console.log(error);
        res.status(500).json("Internal Server Error");

    }
}
export const teamParticipants = async(req,res)=>{
    try{
    const teamname=req.params.name;
    console.log(teamname)
    let allUser = await Users.find({TeamName:teamname});
    console.log('all user is:-',allUser);
    res.status(200).json(allUser);
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const submitTicket = async(req,res)=>{
    try{
   let{teamName,name,pdf}=req.body;
    console.log(req.body);
    let url =await handlePPTUpload(pdf);
    
    let pdfurl =await convertFileToPDF(url);
    console.log("pdfurl is :-",pdfurl)

    const updatedUser = await Users.findOneAndUpdate({fullName:name[0],TeamName:teamName},{generatedToken:url},{new:true});
    console.log(updatedUser);
    // res.status(201).json(allteam);
   
    }
    catch(e){
        console.log(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}