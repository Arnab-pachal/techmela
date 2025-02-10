import mongoose from "mongoose"
export const connectDb =async()=>{
const pass = process.env.ATLAS_PASS;
const user = process.env.ATLAS_USER
const uri = `mongodb+srv://${user}:${pass}@cluster0.ustzk.mongodb.net/Techmela3?retryWrites=true&w=majority&appName=Cluster0/`
const connection = await mongoose.connect(uri,{useNewUrlParser: true,
    useUnifiedTopology: true})
.then(()=>{console.log("connected successfully");})
.catch((error)=>{console.log("some error occured",error)})}