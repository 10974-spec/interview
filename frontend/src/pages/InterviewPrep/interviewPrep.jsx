import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {AnimatePresence, motion} from 'framer-motion'
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu'
import SpinnerLoader from '../../components/Loader/SpinnerLoader'
import { toast } from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import RoleInfoHeader from './components/RoleInfoHeader'

const interviewPrep = () => {

  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  // =====FETCH SESSION DATA BY SESSION ID===== //

  const fetchSessionDetailsById = async () => {};

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
    </DashboardLayout>
  )
}

export default interviewPrep