import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { Button, Modal, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionContainer from './components/QuestionContainer';

function App() {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [enableExp, setEnableExp] = useState(false);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(true);
  const [show, setShow] = useState(false);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setEnableExp(false);
      const { data } = await axios.get('http://localhost:5000/fetch-all-records');
      // console.log(data);
      setQuizOver(false);
      setQuestions(data);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleNextQuestion = () => {
    const nextQuestionNum = number + 1;
    if (nextQuestionNum === 10) {
      setQuizOver(true);
    } else {
      setNumber(nextQuestionNum);
      setEnableExp(false);
    }
  };

  const handleAnswer = (e) => {
    if (!quizOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].Answer === answer;
      if (correct) setScore(score + 1);
      const answerObj = {
        question: questions[number].Question,
        answer,
        correct,
        correctAnswer: questions[number].Answer,
      };
      setUserAnswers([...userAnswers, answerObj]);
      setEnableExp(true);
      if(number+1 === 10){
        setShow(true);
      }
    }
  };

  const handleClose = () => setShow(false);

  return (
    <div className="App">
      <h1>Quizz App</h1>
      {(quizOver || userAnswers.length === 10) && (
          <Button variant="success" onClick={fetchQuestions} className='mb-3'>
            Start
          </Button>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Quiz Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, You have scored {score} points in the quiz</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loading && !quizOver && (
        <QuestionContainer
          Question={questions[number].Question}
          questionNum={number + 1}
          Options={questions[number].Options}
          Explanation={questions[number].Explanation}
          enableExp={enableExp}
          userAnswer={userAnswers && userAnswers[number]}
          handleAnswer={handleAnswer}
        />
      )}
      {!quizOver && !loading && userAnswers.length === number + 1 && number !== 10 - 1 && (
        <Button onClick={handleNextQuestion} variant="secondary" className='mt-3'>
          Next
        </Button>
      )}
    </div>
  );
}

export default App;
