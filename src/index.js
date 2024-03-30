var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
import express from "express";
import cors from "cors";
import { prisma } from "../src/utils/prisma.server.js";
var app = express();
app.use(cors());
app.use(express.json());
app.post("/quiz", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, questionIds, newQuiz, error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = req.body), (name = _a.name), (questionIds = _a.questionIds);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            prisma.quiz.create({
              data: {
                name: name,
                QuizQuestion: {
                  create: questionIds.map(function (questionId) {
                    return {
                      question: { connect: { id: questionId } },
                    };
                  }),
                },
              },
              include: {
                QuizQuestion: true,
              },
            }),
          ];
        case 2:
          newQuiz = _b.sent();
          res.json(newQuiz);
          return [3 /*break*/, 4];
        case 3:
          error_1 = _b.sent();
          console.log(error_1);
          res.status(500).json({ error: "Could not create quiz" });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
app.get("/quiz", function (_req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var quizzes,
      returnArray,
      _i,
      quizzes_1,
      quiz,
      questions,
      _a,
      _b,
      question,
      newQuestion,
      newQuiz,
      error_2;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            prisma.quiz.findMany({
              include: {
                QuizQuestion: {
                  include: {
                    question: true,
                  },
                },
              },
            }),
          ];
        case 1:
          quizzes = _c.sent();
          returnArray = [];
          for (_i = 0, quizzes_1 = quizzes; _i < quizzes_1.length; _i++) {
            quiz = quizzes_1[_i];
            questions = [];
            for (_a = 0, _b = quiz.QuizQuestion; _a < _b.length; _a++) {
              question = _b[_a];
              newQuestion = {
                questionId: question.questionId,
                question: question.question.question,
                answer: question.question.answer,
              };
              questions.push(newQuestion);
            }
            newQuiz = {
              name: quiz.name,
              quizId: quiz.id,
              questions: questions,
            };
            returnArray.push(newQuiz);
          }
          res.json(returnArray);
          return [3 /*break*/, 3];
        case 2:
          error_2 = _c.sent();
          res.status(500).json({ error: "Could not retrieve quizzes" });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
});
app.get("/quiz/:id", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, quiz, questions, _i, _a, question, newQuestion, returnQuiz, error_3;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          id = req.params.id;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            prisma.quiz.findUnique({
              where: {
                id: parseInt(id),
              },
              include: {
                QuizQuestion: {
                  include: {
                    question: true,
                  },
                },
              },
            }),
          ];
        case 2:
          quiz = _b.sent();
          questions = [];
          if (!quiz) return [2 /*return*/, null];
          for (_i = 0, _a = quiz.QuizQuestion; _i < _a.length; _i++) {
            question = _a[_i];
            newQuestion = {
              questionId: question.questionId,
              question: question.question.question,
              answer: question.question.answer,
            };
            questions.push(newQuestion);
          }
          returnQuiz = {
            name: quiz.name,
            quizId: quiz.id,
            questions: questions,
          };
          res.json(returnQuiz);
          return [3 /*break*/, 4];
        case 3:
          error_3 = _b.sent();
          res.status(500).json({ error: "Could not retrieve quiz" });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
app.put("/quiz/:id", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id,
      _a,
      name,
      questionIds,
      existingQuizQuestions,
      existingQuestionIds_1,
      newQuestionIds,
      connectionsToDelete,
      createConnections,
      deleteConnections,
      updatedQuiz,
      error_4;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          id = req.params.id;
          (_a = req.body), (name = _a.name), (questionIds = _a.questionIds);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 5, , 6]);
          return [
            4 /*yield*/,
            prisma.quizQuestion.findMany({
              where: {
                quizId: parseInt(id),
              },
            }),
          ];
        case 2:
          existingQuizQuestions = _b.sent();
          existingQuestionIds_1 = existingQuizQuestions.map(function (
            quizQuestion
          ) {
            return quizQuestion.questionId;
          });
          newQuestionIds = questionIds.filter(function (questionId) {
            return !existingQuestionIds_1.includes(questionId);
          });
          connectionsToDelete = existingQuizQuestions.filter(function (
            quizQuestion
          ) {
            return !questionIds.includes(quizQuestion.questionId);
          });
          createConnections = newQuestionIds.map(function (questionId) {
            return prisma.quizQuestion.create({
              data: {
                quizId: parseInt(id),
                questionId: parseInt(questionId.toString()),
              },
            });
          });
          deleteConnections = connectionsToDelete.map(function (quizQuestion) {
            return prisma.quizQuestion.delete({
              where: {
                quizId_questionId: {
                  quizId: parseInt(id),
                  questionId: quizQuestion.questionId,
                },
              },
            });
          });
          return [
            4 /*yield*/,
            prisma.$transaction(
              __spreadArray(
                __spreadArray([], createConnections, true),
                deleteConnections,
                true
              )
            ),
          ];
        case 3:
          _b.sent();
          return [
            4 /*yield*/,
            prisma.quiz.update({
              where: {
                id: parseInt(id),
              },
              data: {
                name: name,
              },
            }),
          ];
        case 4:
          updatedQuiz = _b.sent();
          res.json(updatedQuiz);
          return [3 /*break*/, 6];
        case 5:
          error_4 = _b.sent();
          res.status(500).json({ error: "Could not update quiz " + error_4 });
          return [3 /*break*/, 6];
        case 6:
          return [2 /*return*/];
      }
    });
  });
});
app.delete("/quiz/:id", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, error_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          id = req.params.id;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            prisma.quiz.delete({
              where: {
                id: parseInt(id),
              },
              include: {
                QuizQuestion: true,
              },
            }),
          ];
        case 2:
          _a.sent();
          res
            .status(200)
            .json({
              message: "Quiz and associated QuizQuestions deleted successfully",
            });
          return [3 /*break*/, 4];
        case 3:
          error_5 = _a.sent();
          res
            .status(500)
            .json({
              error:
                "Could not delete quiz and associated QuizQuestions" + error_5,
            });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
app.post("/question", function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, answer, newQuestion, error_6;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = req.body), (question = _a.question), (answer = _a.answer);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            prisma.question.create({
              data: {
                question: question,
                answer: answer,
              },
            }),
          ];
        case 2:
          newQuestion = _b.sent();
          console.log(newQuestion);
          res.json(newQuestion);
          return [3 /*break*/, 4];
        case 3:
          error_6 = _b.sent();
          console.log(error_6);
          res.status(500).json({ error: "Could not create question" });
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
app.get("/question", function (_req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var questions, error_7;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [4 /*yield*/, prisma.question.findMany()];
        case 1:
          questions = _a.sent();
          res.json(questions);
          return [3 /*break*/, 3];
        case 2:
          error_7 = _a.sent();
          res.status(500).json({ error: "Could not retrieve questions" });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
});
app.listen(4000, function () {
  console.log("listening on 4000");
});
