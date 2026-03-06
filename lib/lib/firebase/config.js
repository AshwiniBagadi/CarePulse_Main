"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = exports.auth = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: "AIzaSyDEMc12t0NGZryo6oAD1wQK_K5EgsXg7zY",
    authDomain: "carepluse-21b86.firebaseapp.com",
    projectId: "carepluse-21b86",
    storageBucket: "carepluse-21b86.firebasestorage.app",
    messagingSenderId: "1081209163197",
    appId: "1:1081209163197:web:600c5382898c219e6696d4",
    measurementId: "G-GZX9JQW3TZ"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)(app);
exports.default = app;
//# sourceMappingURL=config.js.map