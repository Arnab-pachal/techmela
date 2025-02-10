import mongoose  from "mongoose";
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        unique:true,
    },
    isHost:{
        type:Boolean,
        default:false
    },
    TeamName :{
        type:String,
        default:""
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required :true,
        },
    generatedToken:{
        type:String,
        default:""
    },
    profilePic:{
        type:String,
        default:"https://res.cloudinary.com/dfdvyif4v/image/upload/v1735373510/50350404_vkjcoc.jpg"
    },
  
},{timestamps:true})
const Users = mongoose.model("Users",userSchema)
export default Users;