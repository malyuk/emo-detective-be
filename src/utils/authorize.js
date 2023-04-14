export const authorize = async (req, res, next) => {
  const jwt = req.headers.authorization;
  try {
    const id = await admin.auth().verifyIdToken(jwt);
    res.locals.userId = id.uid;
    res.send({
      success: true,
      message: "User authorized with token",
    });
  } catch {
    res.status(403).send("Unauthorized");
    return;
  }
  next();
};
