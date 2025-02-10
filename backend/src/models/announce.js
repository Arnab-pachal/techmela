import mongoose  from "mongoose";
const Announce= new mongoose.Schema({
        text:{
        type:String,
             },
    image:{
        type:String,
        default:""
    },
  
},{timestamps:true})
const Announces = mongoose.model("Announces",Announce)
export default Announces;