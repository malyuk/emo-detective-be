import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {
  createLesson,
  getLessons,
  getSingleLesson,
  getStudentLessons,
  addUserToLesson,
} from "./lessons.js";
import { createUser } from "./users.js";
import { createStatistic, getStatsByLesson, getStatsByUser } from "./stats.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/lessons", createLesson);
app.get("/lessons/:userId", getLessons);
app.put("/lessons/:lessonId", addUserToLesson);
app.get("/lessons/student/:userId", getStudentLessons);
app.get("/lesson/:lessonId/:userId?", getSingleLesson);

app.post("/users", createUser);

app.post("/stats", createStatistic);
app.get("/stats/user/:userId", getStatsByUser);
app.get("/stats/lesson/:lessonId", getStatsByLesson);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
