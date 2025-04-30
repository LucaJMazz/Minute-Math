import { useState } from 'react';
import { motion } from 'framer-motion'

function IncorrectPopup({animTrigger}) {

    return (
        <motion.div className="incorrect-popup" 
        initial={{scale: 0}} 
        animate={animTrigger ? { 
            scale: [0, 1, 1, 0], 
            x: [0, 0, -3, 3, -3, 3, 0, 0], 
            transition: {
                duration: 1.2,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut",
            },} : {}}
        >

        <p> Incorrect! &#10006;</p>
        </motion.div>
    )
};

export default IncorrectPopup