import { useContext } from "react";
import { AuthContext } from "../FirebaseAuth";

export function useAuth() {
    return useContext(AuthContext);
}