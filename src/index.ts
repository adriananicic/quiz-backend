import express from "express";
import cors from 'cors'
import {prisma} from '../src/utils/prisma.server'

type Question = { questionId: number; question: string; answer: string; }
type Quiz = { name: string; quizId: number; questions: Question[]; }

const app = express()

app.use(cors())
app.use(express.json())



app.post("/quiz", async (req, res) => {
    const { name, questionIds } = req.body;
    try {
      const newQuiz = await prisma.quiz.create({
        data: {
          name,
          QuizQuestion: {
            create: questionIds.map((questionId: number) => ({
              question: { connect: { id: questionId } }
            }))
          }
        },
        include: {
          QuizQuestion: true
        }
      });
      res.json(newQuiz);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Could not create quiz" });
    }
  });
  


  app.get("/quiz", async (_req, res) => {
    try {
      const quizzes = await prisma.quiz.findMany({
        include: {
          QuizQuestion: {
            include: {
              question: true
            }
          }
        }
      });

      const returnArray: Quiz[] = []
      for(let quiz of quizzes){
        let questions:Question[] = []
        for (let question of quiz.QuizQuestion){
            let newQuestion = {
                questionId:question.questionId,
                question: question.question.question,
                answer: question.question.answer
            }
            questions.push(newQuestion)
        }
        let newQuiz = {
            name:quiz.name,
            quizId:quiz.id,
            questions:questions
        }
        returnArray.push(newQuiz)
      }

      res.json(returnArray);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve quizzes" });
    }
  });
  
  app.get("/quiz/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const quiz = await prisma.quiz.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          QuizQuestion: {
            include: {
              question: true
            }
          }
        }
      });
      let questions:Question[] = []
      if(!quiz) return null
      for (let question of quiz.QuizQuestion){
          let newQuestion = {
              questionId:question.questionId,
              question: question.question.question,
              answer: question.question.answer
          }
          questions.push(newQuestion)
      }
      let returnQuiz:Quiz = {
        name:quiz.name,
        quizId:quiz.id,
        questions:questions
      }

      res.json(returnQuiz);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve quiz" });
    }
  });

app.put("/quiz/:id", async (req, res) => {
    const { id } = req.params;
    const { name, questionIds } = req.body;
    
    try {
        const existingQuizQuestions = await prisma.quizQuestion.findMany({
            where: {
                quizId: parseInt(id)
            }
        });

        const existingQuestionIds = existingQuizQuestions.map(quizQuestion => quizQuestion.questionId);

        const newQuestionIds = questionIds.filter((questionId:number) => !existingQuestionIds.includes(questionId));

        const connectionsToDelete = existingQuizQuestions.filter(quizQuestion => !questionIds.includes(quizQuestion.questionId));

        const createConnections = newQuestionIds.map((questionId:number) => prisma.quizQuestion.create({
            data: {
                quizId: parseInt(id),
                questionId: parseInt(questionId.toString())
            }
        }));

        const deleteConnections = connectionsToDelete.map(quizQuestion => prisma.quizQuestion.delete({
            where: {
                quizId_questionId: {
                    quizId: parseInt(id),
                    questionId: quizQuestion.questionId
                }
            }
        }));

        await prisma.$transaction([...createConnections, ...deleteConnections]);

        const updatedQuiz = await prisma.quiz.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name
            }
        });
  
        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ error: "Could not update quiz " + error });
    }
});


app.delete("/quiz/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.quiz.delete({
        where: {
          id: parseInt(id),
        },
        include: {
          QuizQuestion: true,
        },
      });
      res.status(200).json({ message: "Quiz and associated QuizQuestions deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Could not delete quiz and associated QuizQuestions" + error });
    }
  });
  
  app.post("/question", async (req, res) => {
    const { question, answer } = req.body;
    try {
      const newQuestion = await prisma.question.create({
        data: {
          question,
          answer,
        },
      });
      console.log(newQuestion)
      res.json(newQuestion);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: "Could not create question" });
    }
  });
  
    app.get("/question", async (_req, res) => {
    try {
      const questions = await prisma.question.findMany();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve questions" });
    }
  });


app.listen(4000,()=>{
    console.log('listening on 4000')
})

