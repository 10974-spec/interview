const {GoogleGenAI} = require("@google/genai");
const {conceptExplainPrompt, questionAnswerPrompt} = require("../utils/prompts");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


//@desc  Generate interview questions and answers using Gemini
//@route POST /api/ai/generate-questions
//@access Private

const generateInterviewQuestions = async (req,res) =>{
    try{

        const {role, experience, topicsToFocus, numberOfQuestions }= req.body;
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
          return  res.status(400).json({message:"Missing required fields"});
        }


        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });


        let rawText = response.text;

        //****Clean it: Remove ```jason and ``` from beginning and end****/
        const cleanedText = rawText
        .replace(/^```json\s*/, "")//remove ```json from beginning
        .replace(/```$/, "")//remove ``` from end
        .trim();//remove any trailing spaces

console.log("🧠 Gemini Raw Text:", rawText);
        //****Parse the cleaned text as JSON****/
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

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
        const { question } = req.body;

        if(!question){
            return res.status(400).json({message:"Missing required fields"});
        }
        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        let rawText = response.text;

        //****Clean it: Remove ```jason and ``` from beginning and end****/
        const cleanedText = rawText
        .replace(/^```json\s*/, "")//remove ```json from beginning
        .replace(/```$/, "")//remove ``` from end
        .trim();//remove any trailing spaces

        //****Parse the cleaned text as JSON****/
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

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
