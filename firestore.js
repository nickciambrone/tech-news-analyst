import admin from "firebase-admin";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");
// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Example: write to Firestore with auto-generated ID
export async function addLink(linkUrl) {
  try {
    const docRef = await db
      .collection("tech-news-analyst-used-article-links")
      .add({
        link: linkUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    console.log("Document written with ID:", docRef.id);
  } catch (err) {
    console.error("Error writing document:", err);
  }
}
