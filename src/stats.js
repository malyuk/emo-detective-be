import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createStatistic = (req, res) => {
  const db = connectToDb();
  const { userId, emotions, engagementScore, lessonId } = req.body;
  db.collection("stats")
    .add({
      userId,
      engagementScore,
      emotions,
      lessonId,
      createdOn: FieldValue.serverTimestamp(),
    })
    .then((doc) => {
      res.status(201).send({
        message: "Stat created successfully!",
        id: doc.id,
      });
    })
    .catch((err) => res.status(500).send(err));
};

export const getStatsByUser = (req, res) => {
  const db = connectToDb();
  const { userId } = req.params;

  db.collection("stats")
    .where("userId", "==", userId)
    .get()
    .then((snapshot) => {
      const stats = snapshot.docs.map((doc) => {
        let stat = doc.data();
        stat.id = doc.id;
        return stat;
      });
      res.send(stats);
    })
    .catch();
};

export const getStatsByLesson = async (req, res) => {
  const db = connectToDb();
  const { lessonId } = req.params;

  try {
    const lessonRef = db.collection("lessons");

    const lessonDoc = await lessonRef.doc(lessonId).get();
    const lessonData = lessonDoc.data();
    const studentEmails = lessonData.registeredStudents;

    const usersRef = db.collection("users");
    const query = usersRef.where("email", "in", studentEmails);

    const userSnapshot = await query.get();

    let userIds = [];
    let results = [];

    for (const userDoc of userSnapshot.docs) {
      const userId = userDoc.id;
      userIds.push(userId);
      const statsRef = db
        .collection("stats")
        .where("userId", "==", userId)
        .where("lessonId", "==", lessonId);
      const userStatsQuerySnapshot = await statsRef.get();
      userStatsQuerySnapshot.forEach((stat) => {
        results.push(stat.data());
      });
    }

    res.send({
      data: results,
      totalCount: results.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
