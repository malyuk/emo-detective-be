import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createStatistic = (req, res) => {
  const db = connectToDb();
  const { userId, emotion, engagementScore } = req.body;
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