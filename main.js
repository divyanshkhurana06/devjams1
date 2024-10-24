
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, deleteUser, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdoDniEWXYs0HOb1Kp6AkIFK4Gf27jJdE",
    authDomain: "vitbuzz-d8248.firebaseapp.com",
    projectId: "vitbuzz-d8248",
    storageBucket: "vitbuzz-d8248.appspot.com",
    messagingSenderId: "531254790319",
    appId: "1:531254790319:web:060103ae757f08b346ac5a",
    measurementId: "G-KGW620DJ3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
auth.languageCode = 'en';

const provider = new GoogleAuthProvider();
const googleLogin = document.getElementById("google-login-Btn");

// Function to store user data in Firestore
async function storeUserData(user) {
    const userRef = doc(db, "users", user.uid);
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: new Date()
    };
    try {
        await setDoc(userRef, userData, { merge: true });
        console.log("User data saved to Firestore!");
    } catch (error) {
        console.error("Error saving user data:", error);
    }
}

// Function to load user-specific data from Firestore
async function loadUserData(uid) {
    const userRef = doc(db, "users", uid);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            console.log("User data:", userDoc.data());
            // Perform actions with the user data if needed (e.g., display on the page)
        } else {
            console.log("No such user data found!");
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// Function to handle Google login
googleLogin.addEventListener("click", function() {
    signInWithPopup(auth, provider)
    .then(async (result) => {
        const user = result.user;

        // Check if the email ends with @vitstudent.ac.in
        if (user.email.endsWith("@vitstudent.ac.in")) {
            console.log("Logged in as:", user.email);
            // Store user data in Firestore
            await storeUserData(user);
            // Redirect to home page
            window.location.href = 'home.html';
        } else {
            // Sign out and delete user if the email is not valid
            deleteUser(user).then(() => {
                alert("Only @vitstudent.ac.in emails are allowed. The user has been removed.");
            }).catch((error) => {
                console.error("Error deleting user:", error);
            });
        }
    }).catch((error) => {
        console.error("Error during sign-in:", error.code, error.message);
    });
});

// Detect changes in user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user.uid);
        // Load user-specific data
        loadUserData(user.uid);
    } else {
        // No user is signed in
        console.log("No user is signed in.");
    }
});

// Function to sign out the user
const signOutButton = document.getElementById("sign-out-Btn");
signOutButton.addEventListener("click", function() {
    signOut(auth).then(() => {
        console.log("User signed out.");
        window.location.href = 'hiii.html'; // Redirect to login page after signing out
    }).catch((error) => {
        console.error("Error during sign out:", error);
    });
});

function updateUserProfile(uid, email, name, pastEvents, tags, upcomingEvents) {
    const userRef = db.collection('Profile').doc(uid);
  
    // Set the user data in Firestore
    userRef.set({
      Email: email,
      Name: name,
      "Past Events": pastEvents,   // Array of past events
      Tags: tags,                  // Array or string of tags
      "Upcoming Events": upcomingEvents // Array of upcoming events
    })
    .then(() => {
      console.log("User profile successfully updated in Firestore!");
    })
    .catch((error) => {
      console.error("Error updating user profile: ", error);
    });
  }
  
  // Example usage after a user signs in or registers
  auth.onAuthStateChanged((user) => {
    if (user) {
      const email = user.email;
      const name = user.displayName;
      
      // Example values for the fields (this could come from user input)
      const pastEvents = ["AI Workshop", "Coding Bootcamp"];
      const tags = ["Tech", "Programming"];
      const upcomingEvents = ["Hackathon 2024", "Startup Expo"];
  
      // Call the function to store the profile
      updateUserProfile(user.uid, email, name, pastEvents, tags, upcomingEvents);
    }
  });