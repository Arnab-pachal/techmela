import mongoose  from "mongoose";
const Team = new mongoose.Schema({
    teamName :{
        type:String,
        required:true,
        unique:true,
    },
    deadLine:{
        type:String,
        default:""
    },
    teampic:{
      type:String,
      default:"https://res.cloudinary.com/dfdvyif4v/image/upload/v1735295489/tagteam_ql7nvp.jpg"
    },
    projectName:{
        type:String,
        default:""
             },
  
    ticket:{
        type:String,
        default:""
    },
  },{timestamps:true})
const Teams = mongoose.model("Teams",Team)
export default Teams;