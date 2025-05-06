import { motion, AnimatePresence } from 'framer-motion';

function SideMenu({isVisible}) {
    return (
        <>
        <AnimatePresence>
            {isVisible ? (
                    <motion.div className="side-menu-wrapper"
                        initial={{ x: -350 }}
                        animate={{ x: 0 }}
                        exit={{ x: -350 }}
                        transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
                    >
                        <p> References </p>
                        <a className="side-button" href="/answer-format">
                            How to format my answers
                        </a>
                        <a className="side-button" href="/FAQ">
                            FAQ
                        </a>
                        <a className="side-button" href="/about">
                            Full About Page
                        </a>
                        <p> Links </p>
                        <a className="side-button" href="https://www.openalgebra.com/?utm_source=MinuteMath(InDevelopment)">
                            Math Help
                        </a>
                        <a className="side-button" href="https://github.com/LucaJMazz/Minute-Math">
                            Minute Math GitHub
                        </a>
                    </motion.div>
                ) : null}
        </AnimatePresence>
        </>
    )
}

export default SideMenu;