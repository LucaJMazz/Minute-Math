import { useState } from "react"
import { motion } from 'framer-motion'
import Icon from "../assets/Icon.png";
import SideMenu from "./sideMenu";

function NavBar() {

    // Menu Open toggle
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Toggle the side menu open and closed with the menuOpen useState
     */
    function toggleMenu() {
        setMenuOpen(menuOpen ? false : true);
    }
    
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
                    <a href="https://github.com/LucaJMazz/Minute-Math" target="_blank"><i className="fab fa-github-square"></i></a>
                </div>
            </nav>
            <div>
                <SideMenu isVisible={menuOpen}/>
            </div>
        </>
    )
}

export default NavBar;