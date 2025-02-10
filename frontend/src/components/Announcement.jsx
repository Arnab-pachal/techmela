import { useEffect, useRef } from "react";
import AnnounceInput from "./AnnounceInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useauthStore } from "../store/useAuthStore";
import { useAnnounce } from "../store/useAnnounce";
import { formatMessageTime } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const Announcement = () => {
  const navigate = useNavigate();
  const {
    messages,
    visibleButton,
    deleteAnnounce,
    getAnnounce,
    isMessagesLoading,
    visible
  } = useAnnounce();
  const { authUser } = useauthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{getAnnounce()},[])
  useEffect(() => {
    console.log(messages)
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  },[messages]);
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
      
        <MessageSkeleton />
        <AnnounceInput />
      </div>
    );
  }
 
 const askmessage=async(id)=>{
    if(authUser.fullName !='#CCARND'){return;}
   const res =  await visibleButton({id});
  }
  const deleteNow =async(msg,id,senderId)=>{
    if(msg=="del"){
      if(authUser.fullName !='#CCARND'){alert("You cant't delete");return;}
       await deleteAnnounce({id});
    }
    else{console.log("Don't Delete")
      await visibleButton({id})
    }
  }
  let messageforward = async()=>{
    if(authUser==null){alert("Please authenticate login first");}
    console.log("forward to messaging section");
    navigate("/msgview");
    
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto min-h-screen ">
     

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {
        messages.map((message) => (
          <div
            key={message._id}
            className={`chat flex flex-col justify-center items-center text-center`}
            ref={messageEndRef}>
           
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt.substring(0,10)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col" onClick={()=>{askmessage(message._id)}}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
           
            {visible.includes(message._id)?<div className="btn btn-outline btn-warning " onClick={()=>{deleteNow("del",message._id,message.senderId)}}>Delete</div>:<div></div>}
            {visible.includes(message._id)?<div className="btn btn-outline btn-warning" onClick={()=>{deleteNow("",message._id)}}>Dont Delete</div>:<div></div>}
                       
          </div>
        ))}
      </div>
      
      <img src="https://res.cloudinary.com/dfdvyif4v/image/upload/v1735059775/chat_zp1v15.jpg" style={{height:'50px',width:'50px',borderRadius:'50%',position:'absolute',right:'10px',bottom:'140px'}} onClick={messageforward}/>
 {authUser !=null && authUser.isHost?<AnnounceInput />:<></>}
      
    </div>
  );
};
export default Announcement;