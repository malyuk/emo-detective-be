import express from "express";
import cors from "cors";
import { createLesson } from "./lesson.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/lessons", createLesson);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
