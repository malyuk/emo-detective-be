import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";
import { createRoom } from "./utils/ms100.js";
export const createLesson = async (req, res) => {
  const db = connectToDb();

  const lessonData = {
    createdBy: req.body.userId,
    lessonName: req.body.lessonName,
    lessonDate: req.body.lessonDate,
    lessonTime: req.body.lessonTime,
    registeredStudents: req.body.registeredStudents,
  };
  try {
    const docRef = await db.collection("lessons").add({
      ...lessonData,
      createdOn: FieldValue.serverTimestamp(),
    });
    let doc = await docRef.get();
    let createdLesson = {
      data: doc.data(),
      id: doc.id,
    };
    const { hostRoomCode, guestRoomCode } = await createRoom(createdLesson.id);
    docRef.update({
      hostRoomCode: hostRoomCode,
      guestRoomCode: guestRoomCode,
    });
    doc = await docRef.get();
    res.status(201).send({
      message: "Lesson created successfully!",
      data: doc.data(),
      id: doc.id,
    });
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
    throw error;
  }
};

export const getLessons = (req, res) => {
  const db = connectToDb();
  db.collection("lessons")
    .find({ createdBy: req.params.userId })
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

export const addUserToLesson = async (req, res) => {
  const db = connectToDb();
  try {
    const usersRef = db.collection("users");

    const query = usersRef.doc(req.body.userId);
    const userSnapshot = await query.get();
    const studentEmail = userSnapshot.data().email;
    console.log(studentEmail);
    const lessonRef = db.collection("lessons").doc(req.params.lessonId);
    const lessonSnapshot = await lessonRef.get();
    const registeredStudents = lessonSnapshot.data().registeredStudents;
    if (registeredStudents.includes(studentEmail)) {
      res.status(400).send({
        message: "Student already registered for this lesson",
      });
    } else {
      await lessonRef.update({
        registeredStudents: FieldValue.arrayUnion(studentEmail),
      });
      res.status(200).send({
        message: "Student added to lesson",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Failed to add student to lesson",
    });
  }
};

export const getStudentLessons = async (req, res) => {
  const db = connectToDb();
  try {
    const usersRef = db.collection("users");
    const query = usersRef.doc(req.params.userId);
    const userSnapshot = await query.get();
    const studentEmail = userSnapshot.data().email;
    const snapshot = await db
      .collection("lessons")
      .where("registeredStudents", "array-contains", studentEmail)
      .get();
    const lessons = snapshot.docs.map((doc) => {
      let lesson = doc.data();
      lesson.id = doc.id;
      return lesson;
    });
    res.send(lessons);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getSingleLesson = (req, res) => {
  const db = connectToDb();
  db.collection("lessons")
    .doc(req.params.lessonId)
    .get()
    .then((doc) => {
      let lesson = {
        lessonDate: doc.data().lessonDate,
        lessonTime: doc.data().lessonTime,
        lessonName: doc.data().lessonName,
        lessonId: doc.id,
        roomCode:
          req.param.userId && req.params.userId !== doc.data().createdBy
            ? doc.data().guestRoomCode
            : doc.data().hostRoomCode,
      };
      res.send(lesson);
    })
    .catch((err) => res.status(500).send(err));
};
