import api from "./api";

export async function loginAdmin(credentials) {
  const res = await api.post("/admin/login", credentials);
  return res.data;
}

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const login = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const res = await axios.post("https://backend-ecomm-jol4.onrender.com/api/auth/firebase", { idToken });

    localStorage.setItem("token", res.data.token);

    // Continue navigation...
  } catch (error) {
    console.error(error);
    alert("Login failed: " + error.message);
  }
};
