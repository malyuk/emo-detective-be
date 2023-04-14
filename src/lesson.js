import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createLesson = (req, res) => {
  const db = connectToDb();

  const lessonData = {
    createdBy: req.body.userId,
    lessonName: req.body.lessonName,
    lessonDate: req.body.lessonDate,
    lessonTime: req.body.lessonTime,
    registeredStudents: req.body.registeredStudents,
  };

  db.collection("lessons")
    .add({ ...lessonData, createdOn: FieldValue.serverTimestamp() })
    .then((doc) => {
      res.status(201).send({
        message: "Lesson created successfully!",
        data: lessonData,
        id: doc.id,
      });
    })
    .catch((err) => res.status(500).send(err));
};