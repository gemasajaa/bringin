

const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');

const serviceAccount = require("../bringindb-firebase-adminsdk-r8f2o-353b22b921.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bringindb-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getDatabase();

module.exports = db;
