import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axios from "axios";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    topicsToFocus: "",
    experience: "",
    questions: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError("All fields are required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      //  =======CALL AI API TO GENERATE QUESTIONS====== //
      const  aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS,
        {
            role,
            experience,
            topicsToFocus,
            numberOfQuestions: 10,
        }
      );
      // =======SHOULD BE ARRAY LIKE [{QUESTION, ANSWER}, ...]======= //
      const generateQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE,{
        ...formData,
        questions: generateQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      } else{
        setError("Something Went Wrong. Please try again.");
      }
      
    }catch(error){
      if (error?.response && error.response.data.message) {
        setError(error.response.data.message);
      }
    }  finally{
        setIsLoading(false);
      }
  };

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black ">Start a New Interview Journey</h3>
      <p className="text-xs  text-slate-700 mt-[15px] md-3">
        Fill out a few quick details and unlock your personalized set of
        interview questions
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="(e.g., 1-2 years, 3-5 years, etc.)"
          type="number"
        />
        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics to Focus on"
          placeholder="(Comma-Separated, e.g., Data Structures, Algorithms, etc.)"
          type="text"
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="(Any specific goals or notes for this session)"
          type="text"
        />
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
          {isLoading && <SpinnerLoader/>} Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
