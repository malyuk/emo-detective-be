import { connectToDb } from "./utils/connectToDb.js";
import { FieldValue } from "firebase-admin/firestore";

export const createUser = async (req, res) => {
  try {
    const db = connectToDb();
    const { userId, email, role } = req.body;

    const doc = await db.collection("users").doc(userId).get();
    if (doc.exists) {
      const data = doc.data();
      if (data.role !== role) {
        return res.status(400).send({
          message: `This account belongs to a ${data.role} account.`,
          success: false,
        });
      }
      return res.status(200).send({
        message: "User already exists in the database",
        data: data,
        success: true,
      });
    }

    await db.collection("users").doc(userId).set({
      userId,
      email,
      role,
      createdOn: FieldValue.serverTimestamp(),
    });

    const newDoc = await db.collection("users").doc(userId).get();
    const newData = newDoc.data();

    res.status(201).send({
      message: "User created successfully!",
      data: newData,
      success: true
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
