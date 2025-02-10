import express from "express"
const app = express();
import cloudinary from "../lib/cloudinary.js";
import Announces from "../models/announce.js";

export const getAnnounces = async(req,res)=>{
    try{
    const Announce = await Announces.find({});
    res.status(200).json(Announce)}
    catch(err){
        console.log(err);
      res.status(500).json({msg:"Internal Server Error"});
    }
}
export const saveAnnounce = async(req,res)=>{
    try{
    const{text,image}=req.body;
    const newAnnounce = new Announces({text:text,image:image});
    await newAnnounce.save();
    console.log(newAnnounce);
    res.status(200).json(newAnnounce)}
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal Server Error"});
    }
}
export const deleteAnnounce=async(req,res)=>{
    try{
        let id = req.query.id;
        console.log(id)
        const msg = await Announces.findByIdAndDelete(id);
        const allmsg = await Announces.find({});
        console.log(allmsg)
        res.status(200).json(allmsg);
    }
    catch(e){
        console.log(e);
        res.status(500).json({msg:"Internal Server Error"});
    }
}