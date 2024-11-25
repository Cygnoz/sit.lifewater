import { useState } from "react";
import Eye from "../../assets/icons/Eye";
import EyeOffIcon from "../../assets/icons/EyeOffIcon";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../commoncomponents/Buttons/Button";




const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const [isLoading] = useState(false);

  const navigate =useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (email && password) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
    } else {
      toast.error("Please enter your credentials");
    }
  };    
  


  return (
    <div className=" flex items-center justify-center min-h-screen">
        

<div className="w-[40%] text-[rgb(48,63,88,1)]  ">
    <h1 className="font-bold  text-3xl text-center">Login</h1>
    
    <form className="mt-8 space-y-6" >
                <div className="rounded-md shadow-sm space-y-4">
                  <div>
                    <label htmlFor="email" className="text-dropdownText text-sm">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Enter Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="text-dropdownText text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                        placeholder="Password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="focus:outline-none mt-1"
                        >
                          {showPassword ? (
                           <Eye color='#4B5C79'/>
                          ) : (
                           <EyeOffIcon color='#4B5C79'/>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-center">
                  <Button type="submit" className="px-[45%] mt-7" onClick={handleLogin} >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>        
            
            
            
</div>
        </div>
  )
}

export default Login