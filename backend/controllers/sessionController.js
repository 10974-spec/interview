
const Session = require("../models/Session");
const Question = require("../models/Question");

//@ desc ====== create a new session and linked question
//@ route====== POST /api/sessions/create
//@ access===== Private

exports.createSession = async (req, res) => {
    try{

        const {role, experience,topicsToFocus, description, questions} = req.body;

        if (!req.user) {
  return res.status(401).json({ success: false, message: "Not authenticated" });
}
        const userId = req.user._id; // Assuming you have a middleware setting req.user


        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
              const question = await Question.create({
                session: session._id,
                question: q.question,
                answer: q.answer,
              });
              return question._id
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({success: true, session});

    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
};

// @desc ====== get all sessions of a user
// @route ====== GET /api/sessions/my-sessions
// @access ===== Private


exports.getMySessions = async (req,res) => {
      try{
        const sessions = await Session.find({user: req.user.id})
        .sort({createdAt: -1})
        .populate("questions");
        res.status(200).json({sessions});
    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
};

// @desc ===== Get a session by Id with populated questions
// @route ===== GET/api/sessions/:id
//@access ===== Private

exports.getSessionById = async (req, res) =>{
      try{
        const session = await Session.findById(req.params.id)
        .populate({
            path:"questions",
            options: { sort: {isPinned: -1, createdAt: 1}},

        })
        .exec();

        if(!session){
            return res.status(404).json({success:false,message:"Session not found"});
        }
        res.status(200).json({success: true,session});
    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
};

//@desc =====Delete a session and its questions
//@route ===== DELETE /api/sessions/:id
//@access ===== Private

exports.deleteSession = async (req,res) =>{
  try{
    const session = await Session.findById(req.params.id);
    if(!session){
        return res.status(404).json({success:false,message:"Session not found"});
    }

    // ******CHECK IF THE LOGGED-IN USER OWNS THIS SESSION
    if (session.user.toString() !== req.user.id){
        return res.status(401).json({success:false,message:"Not Authorized to delete this session"});
    }

    // ****FIRST , DELETE ALL QUESTIONS LINKED TO THIS SESSION
    await Question.deleteMany({session: session._id});

    // ****THEN DELETE THE SESSION
    await session.deleteOne();

    res.status(200).json({success: true,message:"Session deleted successfully"});

    
    }catch(error){
        res.status(500).json({success:false,message:"Server Error"});
    }
}