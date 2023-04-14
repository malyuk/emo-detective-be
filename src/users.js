import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createUser = (req, res) => {
  const db = connectToDb();
  const { userId, role } = req.body;
  db.collection("users")
    .doc(userId)
    .set({
      userId: userId,
      role: role,
      createdOn: FieldValue.serverTimestamp(),
    })
    .then(() => {
      return db.collection("users").doc(userId).get();
    })
    .then((doc) => {
      const data = doc.data();
      res.status(201).send({
        message: "User created successfully!",
        data: data,
      });
    })
    .catch((err) => res.status(500).send(err));
};
