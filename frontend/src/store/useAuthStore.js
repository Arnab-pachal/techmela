import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import io from "socket.io-client"


const url = "https://techmelaback.onrender.com"
export const useauthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    onlineUsers: [],
    socket: null,
    ischeckingAuth:true,
    team:[],
    forgot: async(email)=>{
      let res = await axiosInstance.post("/auth/send-otp",email)
      if(res.status==200){return true;}
      else{return false;}
  
    },
    verify : async(data)=>{
      console.log(data)
      let res = await axiosInstance.post("/auth/verify-otp",data)
      console.log(res.data)
      if(res.status==200){return true;}
      else{return false;}
  
    },
    updateInfo : async(data)=>{
    console.log(data);
    let res = await axiosInstance.post("/auth/forgotpass",data);
    console.log(res.data);
    return res;
    },
    updateTeam: async(res)=>{
         set({team:[...res]})
    },
    checkAuth : async()=>{
        try{
         const res = await axiosInstance.get("/auth/check");
         set({authUser:res.data})
         get().connectSocket();
        }
        catch(error){
         console.log("error in check auth :- ",error)
         set({authUser:null})
        }
        finally{
            set({ischeckingAuth:false})
        }
    },
    signup:async(data)=>{
        try{
            console.log(data);
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            get().connectSocket();
            alert("Account Created Successfully");
        }
        catch(error){
            alert(error.response.data.message);
        }
        finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
        try{
           await axiosInstance.post("/auth/logout");
           set({authUser:null});
           alert("Logged out Successfully");
           get.disconnectSocket();
        }
        catch(error){
         alert(error.response.data.message);
        }
    },
    login:async(data)=>{
       
        try{
            console.log(data);
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            get().connectSocket();
            alert("Logged-in Successfully");
         }
         catch(error){
          alert(error);
         }
         finally{
            set({isLoggingIng:false})
         }
    },
    
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      alert("Image Uploaded successfully")
    } catch (error) {
      console.log("error in update profile:", error);
      alert(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  updateName : async(data)=>{
   try{
    const res = await axiosInstance.put("/auth/updateName",data);
    set({authUser:res.data});
    alert("Name Changed successfully")
   }
   catch(error){console.log("error in updateName profile:", error);
    alert(error.response.data.message);}
  },
    connectSocket:async()=>{
      //get method helps to fetch the current state associated with useauthStore
      const {authUser}=get();
      if (!authUser || get().socket?.connected) return;
      const socket = io(url, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();
      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
      set({socket:socket})
    },
    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect(); //? this is optional chaining operator 
    },

    }
     ))