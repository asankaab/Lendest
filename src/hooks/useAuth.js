import { useContext } from "react";
import { AuthContext } from "../contexts/context";

export const useAuth = () => useContext(AuthContext);