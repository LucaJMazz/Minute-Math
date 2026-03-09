import { useActionState, useState } from 'react';
import { useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../firestore';

function GameOver({endGame, handleEndGame, answer, inputInclude}) {
    const {user} = useAuth();
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        if (user) {
            // User is logged in - fetch profile data
            const fetchProfile = async () => {
                // Add a small delay to allow Firebase updates to complete
                await new Promise(resolve => setTimeout(resolve, 500));
                const data = await getUserProfile(user.uid);
                setProfile(data);
                setScore(data?.score || 0);
                setStreak(data?.streak || 0);
                console.log("Fetched profile:", data);
            };
            fetchProfile();
        } else {
            // User not logged in - score/streak not available
            setScore(0);
            setStreak(0);
        }
    }, [user]);

    const winLoss = (endGame-1 ? "Correct! You solved todays problem" : "Wrong answer, try again next time!"); // Sets the title of a win or loss
    const [answerString, setAnswer] = useState("Show Answer"); // Creates variable to display the answer for the question
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);

    // State variables to store the animated display values for score and streak
    const [displayScore, setDisplayScore] = useState(0);
    const [displayStreak, setDisplayStreak] = useState(0);

    // Create motion values for Framer Motion to animate score and streak
    const scoreCount = useMotionValue(0);    
    const streakCount = useMotionValue(0);

    useEffect(() => {
        console.log("Animating score:", score, "streak:", streak);
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
    }, [score, streak]); // Run when score or streak change


    /** 
     * Displays the answer on the button
     */
    function showAnswer() {
        setAnswer(inputInclude +""+ answer[0]);
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