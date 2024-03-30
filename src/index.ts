import express from "express";
import cors from 'cors'
import {prisma} from '../src/utils/prisma.server'


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
  
  type Question = { questionId: number; question: string; answer: string; }
  type Quiz = { name: string; quizId: number; questions: Question[]; }

  // Get all quizzes with their questions
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
  
  // Get a quiz by ID with its questions
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

// Update a quiz by ID
app.put("/quiz/:id", async (req, res) => {
    const { id } = req.params;
    const { name, questionIds } = req.body;
    
    try {
        // Fetch existing QuizQuestion records for the given quiz ID
        const existingQuizQuestions = await prisma.quizQuestion.findMany({
            where: {
                quizId: parseInt(id)
            }
        });

        // Extract the IDs of existing QuizQuestion records
        const existingQuestionIds = existingQuizQuestions.map(quizQuestion => quizQuestion.questionId);

        // Identify existing connections
        const connectedQuestionIds = existingQuestionIds.filter(questionId => questionIds.includes(questionId));

        // Identify new connections
        const newQuestionIds = questionIds.filter((questionId:number) => !existingQuestionIds.includes(questionId));

        // Identify connections to be deleted
        const connectionsToDelete = existingQuizQuestions.filter(quizQuestion => !questionIds.includes(quizQuestion.questionId));

        // Create new connections
        const createConnections = newQuestionIds.map((questionId:number) => prisma.quizQuestion.create({
            data: {
                quizId: parseInt(id),
                questionId: parseInt(questionId.toString())
            }
        }));

        // Delete connections to be deleted
        const deleteConnections = connectionsToDelete.map(quizQuestion => prisma.quizQuestion.delete({
            where: {
                quizId_questionId: {
                    quizId: parseInt(id),
                    questionId: quizQuestion.questionId
                }
            }
        }));

        // Perform the create and delete operations in a transaction
        await prisma.$transaction([...createConnections, ...deleteConnections]);

        // Update the quiz name
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


  // Delete a quiz by ID
app.delete("/quiz/:id", async (req, res) => {
    const { id } = req.params;
    try {
      // Delete the quiz and its associated QuizQuestion entries
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
  
  // Create a new question
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
  
  // Get all questions
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

