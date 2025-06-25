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

const InterviewPrep = () => {

  const { sessionId } = useParams();
    console.log("🆔 sessionId:", sessionId);

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

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
  const generateConceptExplanations = async (question) => {};

  // ===Pin Question=== //
  const toggleQuestionPinStatus = async (questionId) => {};


  // ===ADD MORE QUESTIONS TO A SESSION=== //
  const uploadMoreQuestions = async () => {};

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
                        </>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
        </div>
       </div>
    </DashboardLayout>
  )
}

export default InterviewPrep