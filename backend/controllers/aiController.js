const {GoogleGenAi} = require("@google/genai");
const {conceptExplainPrompt} = require("../utils/prompts");

const ai = new GoogleGenAi({
    apiKey: process.env.GEMINI_API_KEY
})


//@desc  Generate interview questions and answers using Gemini
//@route POST /api/ai/generate-questions
//@access Private

const generateInterviewQuestions = async (req,res) =>{
    try{

    }catch(error){
        res.status(500).json({message:"Failed to generate questions",
            error: error.message,
        });
    }
};

//@desc   Generate explanation for a concept using Gemini
//@route POST /api/ai/generate-explanation
//@access Private
const generateConceptExplanation = async (req,res) =>{
    try{

    }catch(error){
        res.status(500).json({message:"Failed to generate explanation",
            error: error.message,
        });
    }
};


module.exports = {
    generateInterviewQuestions,
    generateConceptExplanation,
};
