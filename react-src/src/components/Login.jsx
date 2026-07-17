import { AnimatePresence, motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { createUserProfile } from '../firestore';
import { useEffect } from 'react';

function Login({isVisible = false,  onClose}) {
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            await createUserProfile(result.user);
        } catch (err) {
            console.error("Google sign-in failed", err);
        }
    };
    const handleEmailSignIn = async () => {
        
    };

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'Escape') onClose();
        });
    },[])

    return (
        <AnimatePresence>
            {isVisible ? (
            <motion.div className='blur-background' initial={{opacity:0}} 
                exit={{opacity:0}} 
                animate={{opacity:1}}>
                <motion.div className="login-wrapper" initial={{scale:0, opacity:0}} 
                exit={{scale:0, opacity:0}} 
                animate={{scale:1, opacity:1}}>
                    <button className='button signInButton' onClick={handleGoogleSignIn}> 
                        <img className="signInIcon" src='https://img.icons8.com/?size=100&id=17949&format=png&color=000000'/>
                        Sign in with Google 
                    </button>
                    <button className='button signInButton' onClick={handleEmailSignIn}> 
                        Sign in with Email
                    </button>
                    <button className='button signInButton' onClick={onClose}>
                        cancel
                    </button>
                </motion.div>
            </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

export default Login;