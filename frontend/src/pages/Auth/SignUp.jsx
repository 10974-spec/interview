import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [error, setError] = useState(null);

  const navigate = useNavigate();


  // ***********HANDLE SIGNUP FORM SUBMIT***********//

  const handleSignUp = async (e) =>{
    e.preventDefault();


    let profileImageUrl = "";

    if(!fullName){
      setError("*please Enter Your Full Name");
      return;
    }
    if(!validateEmail(email)){
      setError("*Please enter a valid email");
      return;
    }
    if(!password){
      setError("*Password is required");
      return;
    }

    setError("");


    // *****SIGNUP API CALL*****//  

      try{

    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something Went Wrong Plz Try Again.");
      }
    }

  };


  return <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
    <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-6">Join Us today by entering your details below</p>

    <form onSubmit={handleSignUp}>


      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>

      <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label ="Full Name"
          placeholder='John'
          type="text" />
          <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label ="Email"
          placeholder='johndoe@gmail.com'
          type="text" />
          <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label ="Password"
          placeholder='Min 8 characters'
          type="password" />
      </div>
      {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
      <button type='submit' className='btn-primary'>SIGN UP</button>
      <p className="text-[13px] text-slate-800 mt-3">Already Have an account?{""}
        <button
        onClick={()=> setCurrentPage("login")} 
         className="text-primary font-medium underline cursor-pointer">
         Login
        </button>
         </p>
    </form>
  </div>
}

export default SignUp