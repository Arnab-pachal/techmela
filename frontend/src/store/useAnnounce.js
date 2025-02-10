import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useauthStore } from "./useAuthStore.js";

export const useAnnounce = create((set, get) => ({
  messages: [],
isMessagesLoading: false,
  visible:[],

   getAnnounce: async () => {
       
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/announce`);
      set({ messages: res.data });
    } catch (error) {
      alert(error.response.data.msg);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  
sendAnnounces: async (messageData) => {
    console.log(messageData)
    const {messages} = get();
    const res = await axiosInstance.post(`/announce/send`,messageData);
    console.log(res)
    set({messages:[...messages,res.data]})
  },

visibleButton :async({id})=>{
 const {visible} = get();
console.log(id)

if(visible.includes(id)){
  const newvisible = visible.filter(msg=>msg!=id)
  set({visible:[...newvisible]});}
else{  
 set({visible:[...get().visible,id]})}
},

deleteAnnounce :async({id})=>{
try
{let res = await axiosInstance.delete(`/announce/delete?id=${id}`);
console.log(res);
set({messages:[...res.data]})
}
catch(e){
  console.log(e);
  
}
}}));