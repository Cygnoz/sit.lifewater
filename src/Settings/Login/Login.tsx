import { useState } from "react"
import Eye from "../../assets/icons/Eye"
import EyeOffIcon from "../../assets/icons/EyeOffIcon"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Button from "../../commoncomponents/Buttons/Button"
import useApi from "../../Hook/UseApi"
import { endpoints } from "../../services/ApiEndpoint"
import axios from "axios"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { request: CheckLogin } = useApi("post", 4000);

  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error message

    try {
      const response = await CheckLogin(endpoints.LOGIN, { username, password });
      // Log the response to verify its structure
      console.log("Login response:", response.response?.data.success);

      // Check if login is successful
      if (response.response?.data.success) {
        // Display success message and navigate to dashboard
        const token = response.response?.data.token.split(' ')[1];
        toast.success(response.response?.data.message || 'Login successful! Redirecting...');   
        console.log(response);
           
        // Save the token for future authenticated requests
        localStorage.setItem("authToken", token);
        // Pass username via navigate state
        setTimeout(()=>{
          navigate("/dashboard")
        }, 2000)
        
      } else {
        // Show an error message if login fails
        const errorMessage = response.response?.data.message || "Invalid username or password";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        // Handle non-Axios error
        setError("Login failed. Please try again.");
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className=" flex items-center justify-center min-h-screen">
      <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <div className="w-[40%] text-[rgb(48,63,88,1)]  ">
        <h1 className="font-bold  text-3xl text-center">Login</h1>

        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="text-dropdownText text-sm">
                Email
              </label>
              <input id="email" name="email" type="email" value={username} onChange={(e) => setUsername(e.target.value)} required className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed" placeholder="Enter Email" />
            </div>
            <div>
              <label htmlFor="password" className="text-dropdownText text-sm">
                Password
              </label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-3 text-sm w-[100%] rounded-md text-start mt-1.5 bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed" placeholder="Password" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button type="button" onClick={togglePasswordVisibility} className="focus:outline-none mt-1">
                    {showPassword ? <Eye color="#4B5C79" /> : <EyeOffIcon color="#4B5C79" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-center">
            <Button type="submit" className="px-[45%] mt-7" onClick={handleLogin}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
