import { initializeApp } from "firebase/app";
import { createContext } from "react";
import { firebaseConfig } from "./config/firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const AuthContext = createContext()