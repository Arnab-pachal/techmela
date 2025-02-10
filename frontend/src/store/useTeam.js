import {create} from "zustand"
import { axiosInstance } from "../lib/axios"

export const useTeam=create((set,get)=>({
   isUpdateppt : false,
    currentTeam :null,
    teamParticipants:{},
    team:[],
    visibleupdate:[],
    
    setvisibleupdate: async (_id) => {
      const { visibleupdate } = get();
     if(_id==""){set({visibleupdate:[]})}
     else{
      set({
        visibleupdate: [_id],
      });}},
    
    getTeamparticipants : async(name)=>{
        try{
          const {teamParticipants}=get()
          console.log("team name is :- ",name)
          const res = await axiosInstance.get(`team/teamParticipant/${name}`);
          console.log("Current state before update:", teamParticipants);
          set((state) => ({
            teamParticipants: {
              ...state.teamParticipants,
              [name]: res.data, // Update specific team's participants
            },
          }));
          console.log("State after update:", get().teamParticipants);
        }
        catch(e){
          console.log(e);
        }
    },
    getallTeam: async()=>{
         try{
            const res = await axiosInstance.get("/team/allteam");
            console.log(res.data)
            set({team:[...res.data]});
            }
         catch(e){
            console.log(e);
         }
    },
    createTeam : async(teamInfo)=>{
      try{
        console.log(teamInfo)
      const {team} = get();
      console.log("The team info is :-\n",teamInfo);
      const res =await axiosInstance.post("/team/createteam",teamInfo);
      set({team:[...team,res.data]});
      }
      catch(e){
         console.log(e);
      }
    },
    
    updateTeam : async(teamInfo,id)=>{
      try{
    const {team}=get();
    console.log("I am in update")
    console.log(teamInfo)
    const res =await axiosInstance.post(`/team/updateteam/${id}`,teamInfo);
    console.log(res.data);
    set({team :[...res.data]});
    set({currentTeam:res.data})
      }
      catch(e){
         console.log(e);
      }
    },
    deleteTeam : async(id)=>{
      try{
      const {team}=get();
      const res = await axiosInstance.delete(`/team/deleteteam/${id}`);
      set({team:[...res.data]});
      }
      catch(e){
         console.log(e);
      }
    },
    TicketSubmission: async(teamInfo)=>{
      const {isUpdateppt}=get();
      set({isUpdateppt:true})
      try{
     
     const res = await axiosInstance.post(`/team/pptsubmission/`,teamInfo);
     console.log(res.data)
     set({team:[...res.data]});
     set({currentTeam:res.data});
      }
      catch(e){
         console.log(e);
      }
      set({isUpdateppt:false})
    }
}
     ))