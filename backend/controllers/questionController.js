const Question = require("../models/Question");
const Session = require("../models/Session");

//@desc Add questions to a session
//@route POST /api/questions/add
//@access Private

exports.addQuestionsToSession = async(req,res) =>{
    try{

    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
}

//@desc pin or unpin a question 
//@route POST /api/questions/:id/pin
//@access Private

exports.togglePinQuestion = async(req,res) =>{
    try{
    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
}

//@desc Update a note for a question
//@route POST /api/questions/:id/note
//@access Private

exports.updateQuestionNote = async(req,res) =>{
    try{
    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
}
