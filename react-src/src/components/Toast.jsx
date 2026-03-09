import { use, useEffect } from "react";
import { motion } from 'framer-motion'

function Toast({ text, animTrigger, setAnimTrigger }) {
    useEffect(() => {
        if (animTrigger) {
            setTimeout(() => {
                setAnimTrigger(false);
            }, 2000);
        }
    }, [animTrigger])
    return (
        <motion.div className="toast" 
        initial={{scale: 0}} 
        animate={animTrigger ? { 
            scale: [0, 1, 1, 0], 
            transition: {
                duration: 1.2,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut",
            },} : {}}
        >

        <p> {text} </p>
        </motion.div>
    )
}

export default Toast;