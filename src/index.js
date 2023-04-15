import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createLesson, getLessons, getSingleLesson } from "./lessons.js";
import { createUser } from "./users.js";
import { createStatistic, getStatsByLesson, getStatsByUser } from "./stats.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/lessons", createLesson);
app.get("/lessons", getLessons);
app.get("/lessons/:lessonId/:userId?", getSingleLesson);

app.post("/users", createUser);

app.post("/stats", createStatistic);
app.get("/stats/user/:userId", getStatsByUser);
app.get("/stats/lesson/:lessonId", getStatsByLesson);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
