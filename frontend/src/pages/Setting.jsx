import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useauthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Camera, User } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";




const Setting = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const { authUser, isUpdatingProfile, updateProfile ,updateName,updateTeam} = useauthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    let name = authUser?.fullName;
    if(!name){name =""}
    const [text,setText]=useState(name)
 
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
  
      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      };
    };
  const change =()=>{
    console.log("Name Want to change")
  }
  const namechange = (e)=>{
    setText(e.target.value);
    
  }
  const submitname=async()=>{
    if(authUser.fullName && text==authUser.fullName){alert("This Name is Already Saved");return;}
    if(text.trim().length==0){alert("A Name Can't Be Empty");}
    else{
      await updateName({name : text,id:authUser._id});
    }
   
  }
  let handleClick=async()=>{
    navigate("/prompt")
  }
let formstyle = {
display:'flex',alignItems:'center',justifyContent:'center',marginTop:'10px',marginBottom:'10px'
}
  return (
    <div className="h-full container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1" style={formstyle}>
          <h2 className="text-lg font-semibold">Profile Info</h2>
          <p className="text-sm text-base-content/70">Change Profile Info</p>
        </div>
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6 flex justify-evenly align-middle">
            <div className=" ace-y-1.5" onClick={change}>
              <div style={formstyle}>
              <label  style={{marginRight:'10px'}}>Change <br></br>Name</label>
              <input type="text" className="px-4 py-2.5 bg-base-200 rounded-lg border" onChange={namechange} ></input>
              </div>
              <div style={formstyle}>
              <button className="btn btn-outline btn-secondary" onClick={handleClick}>Change Password</button>
              </div>
              <div style={formstyle} className="py-2">
              <button className="btn btn-outline btn-secondary" onClick={submitname}>Submit</button>
              </div>
             
            </div>

          </div>



      </div>
    </div>

  );
};
export default Setting;