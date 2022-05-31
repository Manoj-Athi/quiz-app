import { Card, Button} from 'react-bootstrap';

const QuestionContainer = ({ Question, questionNum, Options, userAnswer, Explanation, enableExp, handleAnswer }) => {
  return (
    <Card style={{ width: '35rem' }}>
        <Card.Body>
            <p className='number'>
                Question: {questionNum} / 10
            </p>
            <Card.Text>
                { Question }
            </Card.Text>
            <div className="d-grid gap-2">
                <Button disabled={userAnswer ? true : false} value={Options.A} onClick={handleAnswer} size="sm" variant={(userAnswer?.correctAnswer === Options.A && "success") || (userAnswer?.answer === Options.A && "danger") || "primary"}>
                    {Options.A}
                </Button>
                <Button disabled={userAnswer ? true : false} value={Options.B} onClick={handleAnswer} size="sm" variant={(userAnswer?.correctAnswer === Options.B && "success") || (userAnswer?.answer === Options.B && "danger") || "primary"}>
                    {Options.B}
                </Button>
                <Button disabled={userAnswer ? true : false} value={Options.C} onClick={handleAnswer} size="sm" variant={(userAnswer?.correctAnswer === Options.C && "success") || (userAnswer?.answer === Options.C && "danger") || "primary"}>
                    {Options.C}
                </Button>
                <Button disabled={userAnswer ? true : false} value={Options.D} onClick={handleAnswer} size="sm" variant={(userAnswer?.correctAnswer === Options.D && "success") || (userAnswer?.answer === Options.D && "danger") || "primary"}>
                    {Options.D}
                </Button>
            </div>
            {
                enableExp && (
                    <Card.Text>
                        Explanation: { Explanation }
                    </Card.Text>
                )
            }
        </Card.Body>
    </Card>
  )
}

export default QuestionContainer