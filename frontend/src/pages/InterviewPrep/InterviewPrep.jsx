import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {AnimatePresence, motion} from 'framer-motion'
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu'
import SpinnerLoader from '../../components/Loader/SpinnerLoader'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import RoleInfoHeader from './components/RoleInfoHeader'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import QuestionCard from '../../components/Cards/QuestionCard'
import AIResponsePreview from './components/AIResponsePreview'
import Drawer from '../../components/Drawer'
import SkeletonLoader from '../../components/Loader/SkeletonLoader'

const InterviewPrep = () => {

  const { sessionId } = useParams();
    console.log("🆔 sessionId:", sessionId);

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // =====FETCH SESSION DATA BY SESSION ID===== //

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));

      if (response.data && response.data.session) {
        console.log("Fetched session data 👉", response.data.session); 
      setSessionData(response.data.session);
    }
    }catch(error){
      console.error("Error:",error)
    }
  };

  // =====GENERATE CONCEPT EXPLANATIONS===== //
  const generateConceptExplanations = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true)
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if (response.data) {
        setExplanation(response.data);
      }

    }catch(error){
      setExplanation(null)
      setErrorMsg("Failed To generate Explanation, Try again later")
      console.log("Error:", error);
      
    }finally{
      setIsLoading(false);
    }
  };

  // ===Pin Question=== //
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTIONS.PIN(questionId),
      );

      console.log(response);

      if(response.data && response.data.question){
        //=====Toast.success("question pinned successfully")
        fetchSessionDetailsById();
        toast.success("question pinned successfully")
      }
      
    }catch(error){
      console.log("Error:",error);
      
    }
  };


  // ===ADD MORE QUESTIONS TO A SESSION=== //
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);

      //*****CALL AI API TO GENERATE MORE QUESTIONS*****//
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          topicsToFocus: sessionData?.topicsToFocus,
          experience: sessionData?.experience,
          numberOfQuestions: 10,
        }
      );

      //*****SHOULD BE AN ARRAY LIKE [{question, answer},...] */
      const generatedQuestions = aiResponse.data;//error.questions
      const response = await axiosInstance.post(
        API_PATHS.QUESTIONS.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );
      

      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }

    }catch(error){
      if (error.response && error.response.data.message){
        setError(error.response.data.message)
      }else {
        setError("Failed to add more questions, Try again later")
      }
    }finally{
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId){
      fetchSessionDetailsById();
    }
    return () => {};
  }, [sessionId])

  console.log("💬 Questions Array:", sessionData?.questions);

  return (
    <DashboardLayout>
      <RoleInfoHeader
       role={sessionData?.role || ""}
       topicsToFocus={sessionData?.topicsToFocus || ""}
       experience={sessionData?.experience || "–"}
       questions={sessionData?.questions.length || "–"}
       description={sessionData?.description || ""}
       lastUpdated={
        sessionData?.updatedAt ? moment(sessionData?.updatedAt).format("MMMM Do YYYY, h:mm:ss a") : "–"
       }
       />
       <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10 ">
              <div 
              className={`col-span-12 ${
                openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
              }`}
              >
                <AnimatePresence>
                  {sessionData?.questions?.map((data, index) => {
                    return (
                      <motion.div
                       key={data._id || index}
                       initial={{ opacity: 0, y: -20  }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                        delay: index * 0.1,
                        damping: 15,
                      }}
                      layout //this is the ley prop that animates position changes
                      layoutId={`question-${data._id || index}`} //this is the unique id for each question
                      >
                        <>
                         <QuestionCard
                          question={data?.question}
                          answer={data?.answer}
                          onLearnMore={() => 
                            generateConceptExplanations(data.question)
                          }
                          isPinned={data?.isPinned}
                          onTogglePin={() => toggleQuestionPinStatus(data._id)}
                        />
                      


                          {!isLoading && 
                            sessionData?.questions?.length === index + 1 && (
                              <div className="flex items-center justify-center mt-5">
                                <button
                                 className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2  mr-2 rounded text-nowrap cursor-pointer"
                                 disabled={isLoading || isUpdateLoader}
                                 onClick={uploadMoreQuestions}
                                 >
                                  {isUpdateLoader ? <SpinnerLoader/> 
                                  : (
                                    <LuListCollapse className='text-lg'/>
                                  )}{""}
                                  Load More
                                </button>
                              </div>
                            )
                          }
                      </>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
        </div>

          <Drawer
           isOpen={openLearnMoreDrawer}
           onClose={() => setOpenLearnMoreDrawer(false)}
           title={!isLoading && explanation?.title}
           >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className='mt-1'/> {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader/>}
            {
              !isLoading && explanation && (
                <AIResponsePreview content={explanation?.explanation}/>
              )
            }
            </Drawer>       
       </div>
    </DashboardLayout>
  )
}

export default InterviewPrep