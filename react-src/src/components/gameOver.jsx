import { useState } from 'react';
import { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { getGameStats } from "../utils/localData";

function GameOver({endGame, handleEndGame, answer, inputInclude}) {

    const winLoss = (endGame-1 ? "Correct! You solved todays problem" : "Wrong answer, try again next time!"); // Sets the title of a win or loss
    const [answerString, setAnswer] = useState("Show Answer"); // Creates variable to display the answer for the question

    // State variables to store the animated display values for score and streak
    const [displayScore, setDisplayScore] = useState(0);
    const [displayStreak, setDisplayStreak] = useState(0);

    // Retrieve the stored game score and streak from local storage
    const score = getGameStats().score;
    const streak = getGameStats().streak;

    // Create motion values for Framer Motion to animate score and streak
    const scoreCount = useMotionValue(0);    
    const streakCount = useMotionValue(0);

    useEffect(() => {
        // Animate scoreCount and streakCount from 0 to their respective values
        const scoreControls = animate(scoreCount, score, { duration: 1 });
        const streakControls = animate(streakCount, streak, { duration: 1 });

        // Subscribe to scoreCount changes and update the display state
        const unsubscribeScore = scoreCount.on("change", latest => {
            setDisplayScore(Math.round(latest));
        });

        // Subscribe to streakCount changes and update the display state
        const unsubscribeStreak = streakCount.on("change", latest => {
            setDisplayStreak(Math.round(latest));
        });

        // Cleanup: stop animations and unsubscribe when component unmounts
        return () => {
            scoreControls.stop();
            streakControls.stop();
            unsubscribeScore();
            unsubscribeStreak();
        };
    }, []); // No dependencies, runs once when component mounts


    /** 
     * Displays the answer on the button
     */
    function showAnswer() {
        setAnswer(inputInclude +""+ answer);
    }

    /**
     * Opens the question pane back up
     */
    function backToQuestion() {
        handleEndGame(0);
    }

    /**
     * Goes back to the main index.html homepage
     */
    function backToHomepage() {
        window.location.href = "/";
    }

    // Returns the game over screen
    return (
        <motion.div className="game-over" initial={{opacity:0}} animate={{opacity: 1}}>
            <motion.h1 className="title" initial={{scale:0}} animate={{scale: 1}}> {winLoss} </motion.h1>
            <motion.div className="answer" initial={{scale:0}} animate={{scale: 1}}>
                <h2 className="title" > The answer was </h2>
                <motion.div whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={showAnswer}>
                    {answerString}
                </motion.div>
            </motion.div>
            <motion.div initial={{y: 200}} animate={{y:0, transition:{duration:0.2}}}>
                <button className="button" onClick={backToQuestion}> Back to Question </button>
                <button className="button" onClick={backToHomepage}> Back to Homepage </button>
            </motion.div>
            <motion.div className="score" initial={{scale:0}} animate={{scale: 1}}>
                <motion.h2 > Score: {displayScore}</motion.h2>
                <motion.h2 > Streak: {displayStreak}</motion.h2>
            </motion.div>
        </motion.div>
    )
};

export default GameOver;