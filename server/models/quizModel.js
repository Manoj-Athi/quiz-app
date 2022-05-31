import mongoose from 'mongoose'

const QuizSchema = mongoose.Schema({
    Question: {
        type: String
    },
    Options: {
        A: { type: String },
        B: { type: String },
        C: { type: String },
        D: { type: String },
    },
    Answer: {
        type: String
    },
    Explanation: {
        type: String
    }
})

export default mongoose.model('Quiz', QuizSchema);