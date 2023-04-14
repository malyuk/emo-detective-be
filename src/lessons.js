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

export const getLessons = (req, res) => {
  const db = connectToDb();
  db.collection("lessons")
    .get()
    .then((snapshot) => {
      const lessons = snapshot.docs.map((doc) => {
        let lesson = doc.data();
        lesson.id = doc.id;
        return lesson;
      });
      res.send(lessons);
    })
    .catch((err) => res.status(500).send(err));
};

export const getSingleLesson = (req, res) => {
  const db = connectToDb();
  db.collection("lessons")
    .doc(req.params.lessonId)
    .get()
    .then((doc) => {
      const lesson = doc.data();

      lesson.id = doc.id;
      res.send(lesson);
    })
    .catch((err) => res.status(500).send(err));
};
