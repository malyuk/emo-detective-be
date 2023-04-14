import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createStatistic = (req, res) => {
  const db = connectToDb();
  const { userId, emotions, engagementScore } = req.body;
  db.collection("stats")
    .add({
      userId,
      engagementScore,
      emotions,
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