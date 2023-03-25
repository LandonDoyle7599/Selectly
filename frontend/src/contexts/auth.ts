
import { createContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { Api } from "../lib/api";



export const AuthContext = createContext<(token: string) => void>((token) => {
});