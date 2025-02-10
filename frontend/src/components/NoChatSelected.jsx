import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-40 h-40 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <img src="https://res.cloudinary.com/dfdvyif4v/image/upload/v1734944224/rnd_gbkzfp.png" style={{height:'120px',width:'120px'}}/>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">TechMela-2025</h2>
        <p className="text-base-content/60">
       Technology Awaits You
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;