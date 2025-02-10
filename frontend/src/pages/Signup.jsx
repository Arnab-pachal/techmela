import { useState } from "react";
import { useauthStore} from "../store/useAuthStore.js";
import { MessageSquare,Loader2,EyeOff,User,Mail,Lock,Eye} from "lucide-react"
import { Link } from "react-router-dom";
const Signup = ()=>{
    const [showPassword , setShowPassword]=useState(false);
    const [formdata,setFormdata]=useState({
        fullName:"",
        password:"",
        email:"",
    });
  
    const {signup,isSigningup}=useauthStore();
    const validateForm =()=>{
      console.log(formdata.fullName.trim().length)
      if(formdata.email.trim().length===0){alert('Please Provide Email');return false;}
      if(formdata.fullName.trim().length===0){ alert('Please Provide Name'); return false;}
      if(formdata.password.trim().length==0){alert('Please Provide password');return false;}
      return true;
    }
   
    const handleSubmit=(e)=>{
        e.preventDefault();
        const success = validateForm();
        if(success==true){signup(formdata);
          
        }
        else{toast.error("Please Give Valid FullName")}

    }
    return (<>
        <div className="min-h-screen flex justify-center ">
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div
                  className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-colors"
                >
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Please signup And register for Techmela</p>
              </div>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="John Doe"
                    value={formdata.fullName}
                    onChange={(e) => setFormdata({ ...formdata, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10`}
                    placeholder="@gmail.com"
                    value={formdata.email}
                    onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                  />
                </div>
              </div>
    
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10`}
                    placeholder="••••••••"
                    value={formdata.password}
                    onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>
  
              <button type="submit" className="btn btn-primary w-full" disabled={isSigningup}>
                {isSigningup ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
  
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
    )}

export default Signup;
