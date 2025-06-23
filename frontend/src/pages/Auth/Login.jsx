import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  // *********HANDLE LOGIN FORM SUBMISSION********//

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("*Please enter a valid email");
      return;
    }

    if(!password){
      setError("*Password is required");
      return;
    }

    setError("");


    // ********LOGIN API CALL*********//
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const {token } = response.data;

      if(token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something Went Wrong Plz Try Again.");
      }
    }

  }

  return <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
    <h3 className='text-lg font-semibold text-black'>Welcome <span className='text-primary'>Back</span></h3>
    <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please Enter Your Details to log In </p>
    <form onSubmit={handleLogin}>
      <Input
      value={email}
      onChange={({target}) => setEmail(target.value)} 
      label="Email Address"
      placeholder="example@example.com"
      type="text"
     />
     <Input
     value={password}
     onChange={({target}) => setPassword(target.value)} 
     label="Password"
     placeholder="Min 8 characters"
     type="password"
     />

     {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
    <button type='submit' className='btn-primary'>LOGIN</button>
    <p className="text-[13px] text-slate-800 mt-3">
      Don't have an account?{""}
      <button 
      className="font-medium text-primary underline cursor-pointer"
      onClick={()=> setCurrentPage("signup")}
      >
        SignUp
      </button>
    </p>
    </form>
  </div>
}

export default Login