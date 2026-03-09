import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

function FirebaseAuth({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set persistence to localStorage for auth (users stay logged in)
        setPersistence(auth, browserLocalPersistence).then(() => {
            const unsub = onAuthStateChanged(auth, (firebaseUser) => {
                setUser(firebaseUser);
                setLoading(false);
            });

            return unsub;
        }).catch((error) => {
            console.error("Error setting auth persistence:", error);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default FirebaseAuth;
export {AuthContext};
