import { useState } from "react"
import { useEffect } from "react";
import { motion } from "framer-motion"
import IncorrectPopup from "./incorrectPopup";
import { getGameStats, checkAndResetDaily, saveChances, saveScore, completeGame } from "../utils/localData";

function InputBox({answer, onEndGame, inputInclude}) {

    useEffect(() => {
        // Function to be called on page load
        function onPageLoad() {
            checkAndResetDaily(); 
            setTimeout(() => {
                refreshStates();
            }, 100);
        }
    
        onPageLoad();
      }, []); // Empty dependency array ensures this runs only once

    /**
    * Instantiates variables as useStates to be changed and used by the component
    */
    const [userInput, setUserInput] = useState(""); // Gets user input from input box as a String
    const [chances, setChances] = useState(getGameStats().chances); // Sets the amount of chances you have left as an integer
    const [triggerPopup, setTriggerPopup] = useState(false); // Used to trigger the Incorrect pop up, boolean value
    const [endGame, setEndGame] = useState(0); // Ends the game when set to 1
    const [completed, setCompleted] = useState( getGameStats().completed ); // To see if the game has been completed already

    /**
     * - Refreshes the chances and completed variables
     * - Gets the current stats from the local files and chances the local variables to match
     */
    function refreshStates() {
        setCompleted( getGameStats().completed );
        setChances( getGameStats().chances );
    }

    /**
     * Handles the 'submit answer' button
     */
    function handleSubmit() {
        let correctAnswer = testCorrectAnswer(userInput); // If the users answers match the json's answer

        let newChances = chances - 1; // Decrements the users chances
        saveChances(newChances); // Updates local storage

        let endGameValue = endGame; // Temp endgame value to be used by if statements
        
        if (correctAnswer) { // Winner
            addScore();
            completeGame(1);
            setCompleted(1);
            endGameValue = 2;
        } else if (!correctAnswer && newChances > 0) { // Incorrect, plays pop up
            setTriggerPopup(true);
            setTimeout(() => setTriggerPopup(false), 1200);
        } else if (!correctAnswer && newChances <= 0) { // Out of chances, loser
            completeGame(1);
            setCompleted(1);
            endGameValue = 1;
        } 
        
        setChances(newChances); // Updates the chances useState
        setEndGame(endGameValue); // Updates the endGame useState
    }

    function testCorrectAnswer(userAnswer) {
        let formattedAnswer = userAnswer.replaceAll(' ', '');
        return answer.includes(formattedAnswer);
    }

    /**
     * Adds the users score to the local storage based on how many chances are left
     */
    function addScore() {
        let score = getGameStats().score;
        saveScore(score + (chances*10));
    }

    /**
     * Tests when the endGame variable is changed, 
     * therefore the game is ended and the question component needs to be updated
     */
    useEffect(()=>{
        onEndGame(endGame);
    }, [endGame]) // Dependencies on endGame


    if (completed == 1){ // If the game has been completed today, display a continue button to go back to the game over screen
        return (
            <div className="input-area">
                <motion.button className="button continue" whileTap={{ scale: 0.9 }} onClick={()=>{
                    setEndGame(1);
                }}>
                    Continue
                </motion.button>
            </div>
        )
    } else { // Default return: the input area
        return (
            <>
                <div className="input-area">
                    <p>Input Your Answer: {chances} chances left</p>
                    <div className="input-box">
                        <p>{inputInclude}</p>
                        <input onChange={(e) => setUserInput(e.target.value)}>
                            
                        </input>
                    </div>
                    <motion.button className="button" onClick={handleSubmit} whileTap={{ scale: 0.9 }}>
                        Submit Answer
                    </motion.button>
                </div>
                <IncorrectPopup animTrigger={triggerPopup}/>
            </>
        )
    }
}

export default InputBox;