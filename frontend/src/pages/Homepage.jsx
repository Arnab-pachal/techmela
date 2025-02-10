import { useChatStore } from "../store/useChatStore";
import NoChatSelected from "../components/NoChatSelected";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { selectedUser, authUser } = useChatStore();

  return (
    <div className="h-full bg-base-200">
      <div className="flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <NoChatSelected />
          </div>
        </div>
        <div className="bg-base-100 mb-8 rounded-lg shadow-cl w-full">
          <div
            className="flex flex-col h-full rounded-lg overflow-hidden"
            style={{ alignItems: "center" }}
          >
            
            <div className="flex flex-col h-full p-4">
              <h2 className="text-2xl pb-8 font-bold" style={{textAlign:"center"}}>What Is TechMela</h2>
              <p style={{ letterSpacing: "2px" }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum facere dolore culpa eveniet, nesciunt iste consequatur
                eum a debitis dolor placeat neque nisi adipisci. Error alias
                voluptatibus voluptate cum accusantium. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Porro illo assumenda
                reprehenderit eveniet iusto! Voluptates, facere sint labore quod
                tempore perferendis sapiente architecto culpa suscipit eius quis
                itaque, veniam odio?
              </p>
            </div>
            <div className="flex flex-col h-full p-4">
              <h2 className="text-2xl pb-8 font-bold" style={{textAlign:'center'}}>How To Register</h2>
              
                A Team Consist Of Maximum 4 members.
                All Members Should have to register at UNSTOP  .
               In Home Page press register button and register at UNSTOP.
                After Shortlisting the Team will be finalised .
              
                <b style={{marginTop:'15px'}}>For More Informations Refer to Announcement And Messaging Section or Contact :- +91-6289378053</b>
            </div>
            <div className="flex flex-col h-full p-4" style={{justifyContent:"center",alignItems:'center',marginBottom:'20px'}}>
              <h2 className="text-2xl pb-8 font-bold" style={{textAlign:'center'}}>Register For Techmela 2025</h2>
              <Link
                  to="https://unstop.com/o/lfdoHxu?lb=XintJFK"
                  className="link link-primary"
                >
                  <button className="btn btn-accent btn-outline">
                    Register Here
                  </button>
                </Link>       
            </div>
       
       
            <div className="flex flex-col h-full p-4" style={{justifyContent:"center",alignItems:'center'}}>
              <h2 className="text-2xl pb-8 font-bold">TechMela 2024</h2>
              <img  src="https://res.cloudinary.com/dfdvyif4v/image/upload/v1735380713/techmela_team_cpbbzh.jpg" style={{height:'200px',width:'400px'}}></img>
            </div>
            <div className="flex flex-col h-full p-4" style={{justifyContent:"center",alignItems:'center'}}>
              <h2 className="text-2xl pb-8 font-bold">Conjecture 2024</h2>
              <img src="https://res.cloudinary.com/dfdvyif4v/image/upload/v1735380815/conjecture_bonrgx.jpg" style={{height:'200px',width:'400px'}}></img>
              </div>
             
              
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
