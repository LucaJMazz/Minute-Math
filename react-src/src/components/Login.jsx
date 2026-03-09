import { AnimatePresence, motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { createUserProfile } from '../firestore';

function Login({isVisible = false}) {
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            await createUserProfile(result.user);
        } catch (err) {
            console.error("Google sign-in failed", err);
            // You could add user-friendly error messages here
            alert("Sign-in failed. Please try again.");
        }
    };
    return (
        <AnimatePresence>
            {isVisible ? (
            <motion.div className='blur-background' initial={{opacity:0}} 
                exit={{opacity:0}} 
                animate={{opacity:1}}>
                <motion.div className="login-wrapper" initial={{scale:0, opacity:0}} 
                exit={{scale:0, opacity:0}} 
                animate={{scale:1, opacity:1}}
                style={{translateX: '-50%'}}>
                    <button
                        onClick={handleGoogleSignIn}
                        style={{
                            padding: "12px 16px",
                            fontSize: "16px",
                            cursor: "pointer"
                        }}
                    >
                        Sign in with Google
                    </button>
                </motion.div>
            </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

export default Login;