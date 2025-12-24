import { useContext } from "react";
import { AuthContext } from "../context/context";

export const useAuth = () => useContext(AuthContext);