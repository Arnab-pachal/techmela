import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
export const connectDb =async()=>{
const pass = process.env.ATLAS_PASS;
const user = process.env.ATLAS_USER
console.log("the user is",user)
console.log("the pass is",pass)
const uri = `mongodb+srv://${user}:${pass}@cluster0.ustzk.mongodb.net/Techmela3?retryWrites=true&w=majority`
console.log("the uri is",uri)
const connection = await mongoose.connect(uri)
.then(()=>{console.log("connected successfully");})
.catch((error)=>{console.log("some error occured",error)})}