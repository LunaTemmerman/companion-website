import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {auth} from "./init";
import {setDocument} from "./database";

export async function signup(email, pwd, tel, first_name, last_name) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(email, pwd);
    const user = userCredential.user;

    const userData = {
      id: user.uid,
      first_name,
      last_name,
      email: user.email,
      tel: tel,
    };

    await setDocument(userData, userData.id, "users");

    return {data: user, error: null};
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    let userFriendlyMessage;

    switch (errorCode) {
      case "auth/email-already-in-use":
        userFriendlyMessage = "This email is already in use.";
        break;
      case "auth/invalid-email":
        userFriendlyMessage = "The email address is not valid.";
        break;
      case "auth/operation-not-allowed":
        userFriendlyMessage = "Email/password accounts are not enabled.";
        break;
      case "auth/weak-password":
        userFriendlyMessage = "The password is too weak.";
        break;
      default:
        userFriendlyMessage = errorMessage;
    }

    return {data: null, error: userFriendlyMessage};
  }
}

export async function signin(email, pwd) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
    const user = userCredential.user;
    return {data: user, error: null};
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    let userFriendlyMessage;

    switch (errorCode) {
      case "auth/user-disabled":
        userFriendlyMessage = "The user account has been disabled.";
        break;
      case "auth/invalid-email":
        userFriendlyMessage = "The email address is not valid.";
        break;
      case "auth/user-not-found":
        userFriendlyMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        userFriendlyMessage = "Incorrect password.";
        break;
      default:
        userFriendlyMessage = errorMessage;
    }

    return {data: null, error: userFriendlyMessage};
  }
}

export async function signout() {
  try {
    await signOut(auth);
    return {data: "Sign out successful", error: null};
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    let userFriendlyMessage;

    switch (errorCode) {
      case "auth/no-current-user":
        userFriendlyMessage = "No user is currently signed in.";
        break;
      default:
        userFriendlyMessage = errorMessage;
    }

    return {data: null, error: userFriendlyMessage};
  }
}
