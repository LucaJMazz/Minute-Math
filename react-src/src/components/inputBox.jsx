import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"
import IncorrectPopup from "./incorrectPopup";
import { EditableMathField, StaticMathField } from "react-mathquill";
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
    const [showKb, setShowKb] = useState(false); // show/hide kb box
    const mathFieldRef = useRef(null); // mathquill cursor referencer
    const kbButtons = { // buttons in kb box
        sqrt: { 
            code: "\\sqrt{ }",
            display: "\\sqrt{x}",
            move: -1,
        },
        nthRoot: { 
            code: "\\sqrt[]{ }",
            display: "\\sqrt[n]{x}",
            move: -1,
        },
        exponent: { 
            code: "\^{()}",
            display: "x^y",
            move: -2,
        },
        pi: {
            code: "\\pi",
            display: "\\pi",
            move: 0,
        },
        e: {
            code: "e",
            display: "e",
            move: 0,
        },
        theta: {
            code: "\\theta",
            display: "\\theta",
            move: 0,
        },
        abs: { 
            code: "||",
            display: "|x|",
            move: -1,
        },
        log: { 
            code: "log()",
            display: "log",
            move: -1,
        },
        logBase: { 
            code: "log\_{}()",
            display: "log\_{a}",
            move: -1,
        },
        ln: { 
            code: "ln()",
            display: "ln",
            move: -1,
        },
        sin: { 
            code: "sin()",
            display: "sin",
            move: -1,
        },
        cos: { 
            code: "cos()",
            display: "cos",
            move: -1,
        },
        tan: { 
            code: "tan()",
            display: "tan",
            move: -1,
        },
        arcsin: { 
            code: "arcsin()",
            display: "arcsin",
            move: -1,
        },
        arccos: { 
            code: "arccos()",
            display: "arccos",
            move: -1,
        },
        arctan: { 
            code: "arctan()",
            display: "arctan",
            move: -1,
        },
    }

    /**
     * Refreshes the chances and completed variables
     * Gets the current stats from the local files and chances the local variables to match
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
            <div className="input-wrapper">
                <p>Input Your Answer: {chances} chances left</p>
                <div className="input-area">
                    <div className="input-box">
                        <div className="inputInclude" style={(inputInclude.length < 1) ? {width: '0'} : {}}>
                            <p > {inputInclude} </p>
                        </div>
                        <div className="mf-holder">
                            <EditableMathField
                                latex={userInput || ""}
                                onChange={(mathField) => {
                                    setUserInput(mathField.latex());
                                }} 
                                mathquillDidMount={(mf) => (mathFieldRef.current = mf)}
                                onFocus={() => {setShowKb(false)}}/>
                        </div>
                        <div style={{width: '10px'}}>  </div> 
                    </div>
                    <div className="functions-box">
                        <button className="keyboard-fnc" onClick={() => setShowKb(!showKb)}> kb </button>
                        <AnimatePresence>
                            {(showKb) ? <motion.div className="keyboard-box" 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}>
                            <div className="keyboard-box-rect">
                            <div className="kb-scroll-box">
                                {Object.entries(kbButtons).map(([key, value]) => (
                                    <button key={key} onClick={() => {
                                        mathFieldRef.current.focus();
                                        mathFieldRef.current.write(value.code);
                                        for (let i = 0; i < Math.abs(value.move); i++) {
                                            mathFieldRef.current.keystroke(value.move < 0 ? "Left" : "Right");
                                        }
                                        setShowKb(false);
                                    }} className="kb-button">
                                        <StaticMathField style={value.display.length > 5 ? { fontSize: "1.5vmax" } : {}}> {value.display} </StaticMathField>
                                    </button>
                                ))}
                            </div>
                            </div>
                            </motion.div> : null}
                        </AnimatePresence>
                    </div>
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