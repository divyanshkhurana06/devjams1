import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey : "AIzaSyDdoDniEWXYs0HOb1Kp6AkIFK4Gf27jJdE",
    authDomain: "vitbuzz-d8248.firebaseapp.com",
    projectId: "vitbuzz-d8248",
    storageBucket: "vitbuzz-d8248.appspot.com",
    messagingSenderId: "531254790319",
    appId: "1:531254790319:web:060103ae757f08b346ac5a",
    measurementId: "G-KGW620DJ3W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

const googleLogin = document.getElementById("google-login-Btn");

googleLogin.addEventListener("click", function() {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;

        // Check if the email ends with @vitstudent.ac.in
        if (user.email.endsWith("@vitstudent.ac.in")) {
            console.log("Logged in as:", user.email);
            window.location.href = 'home.html'; // Allow access if the email domain matches
        } else {
            // Sign out the user and delete them from Firebase if the email doesn't match the required domain
            deleteUser(user).then(() => {
                alert("Only @vitstudent.ac.in emails are allowed. The user has been removed.");
            }).catch((error) => {
                console.error("Error deleting user:", error);
            });
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during sign-in:", errorCode, errorMessage);
    });
});
