const admin = require("firebase-admin");

const serviceAccount = require("./iconnect-439421-firebase-adminsdk-8yczg-609746e2b8.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the 'Authorization' header

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded token (user info) to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).send({ error: "Invalid or expired token" });
  }
};
module.exports = authMiddleware;
