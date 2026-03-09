import { useState, useEffect } from "react"
import { motion } from 'framer-motion'
import Icon from "../assets/Icon.png";
import SideMenu from "./sideMenu";
import Toast from "./toast";
import Login from "./login";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function NavBar() {

    // Menu Open toggle
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [triggerToast, setTriggerToast] = useState(false);
    const { user } = useAuth(); 
    


    /**
     * Toggle the side menu open and closed with the menuOpen useState
     */
    function toggleMenu() {
        setMenuOpen(menuOpen ? false : true);
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setTriggerToast(true);
            console.log('User logged out');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => {
        if (user) {
            setLoginOpen(false);
            console.log('loggedIn');
            console.log(user);
        }
    }, [user]);
    
    // Returns the top navbar
    return (
        <>
            <nav className="navbar">
                <div className="nav-left">
                    <motion.div className="menuIcon" id="menu-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleMenu}>
                        &#9776;
                    </motion.div>
                    <a href="/"><img src={Icon} alt="Minute Math Logo" className="icon" /></a>
                    <h3 className="title">Minute Math</h3>
                </div>

                <div className="nav-right">
                    <a href="/answer-format" target="_blank"> <i className="far fa-question-circle"></i> How do I format my answer?</a>
                    {user ? (
                        <>
                        <div className="user-info">
                            <button className="login" onClick={() => {handleLogout()}}>logout</button>
                        </div>
                        <img className="profile-image" src={user.photoURL} alt="User profile image"/>
                        </>
                    ) : (
                        <button className="login" onClick={() => {setLoginOpen(!loginOpen)}}>login</button>
                    )}
                    <a href="https://github.com/LucaJMazz/Minute-Math" target="_blank"><i className="fab fa-github-square"></i></a>
                </div>
            </nav>
            <div>
                <SideMenu isVisible={menuOpen}/>
            </div>
            <div>
                <Login isVisible={loginOpen}/>
            </div>
            <Toast text={'Successfully Logged Out'} animTrigger={triggerToast} setAnimTrigger={setTriggerToast}/>
        </>
    )
}

export default NavBar;