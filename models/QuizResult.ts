import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  dominantDosha: { type: String, required: true },
  scores: {
    vata: Number,
    pitta: Number,
    kapha: Number,
  },
  answers: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const QuizResult = mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);
export default QuizResult; 