import mongoose  from "mongoose";
const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
            },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    senderName :{
        type:String,

    },
    senderProfile:{
        type:String,
    },
    text:{
        type:String,
             },
    image:{
        type:String,
        default:""
    },
  
},{timestamps:true})
const Messagenew = mongoose.model("Messagesnew",messageSchema)
export default Messagenew;