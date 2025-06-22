import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';

const Login = ({setCurrentPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  // *********HANDLE LOGIN FORM SUBMISSION********//

  const handleLogin = async (e) => {
    e.preventDefault();
  }

  return <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
    <h3 className='text-lg font-semibold text-black'>Welcome <span className='text-yellow-300'>Back</span></h3>
    <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please Enter Your Details to log In </p>
    <form onSubmit={handleLogin}>
      <Input
      value={email}
      onChange={({target}) => setEmail(target.value)} 
      label="Email Address"
      placeholder="example@example.com"
      type="email"
     />
     <Input
     value={password}
     onChange={({target}) => setPassword(target.value)} 
     label="Password"
     placeholder="Min 8 characters"
     type="password"
     />
    
    </form>
  </div>
}

export default Login