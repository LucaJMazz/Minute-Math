import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"
import IncorrectPopup from "./incorrectPopup";
import { EditableMathField, StaticMathField } from "react-mathquill";
import { useAuth } from "../hooks/useAuth";
import { updateScore, updateStreak, getUserProfile, updateDailyChances, completeGame } from "../firestore";

function InputBox({answer, onEndGame, inputInclude}) {
    /**
    * Instantiates variables as useStates to be changed and used by the component
    */
    const [userInput, setUserInput] = useState(""); // Gets user input from input box as a String
    const [chances, setChances] = useState(0); // Sets the amount of chances you have left as an integer
    const [triggerPopup, setTriggerPopup] = useState(false); // Used to trigger the Incorrect pop up, boolean value
    const [endGame, setEndGame] = useState(0); // Ends the game when set to 1
    const [completed, setCompleted] = useState(false); // To see if the game has been completed already
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

    const { user } = useAuth(); 
    const [profile, setProfile] = useState(null);

    useEffect(() => {
    if (user) {
        // User is logged in - load from Firebase
        const fetchProfile = async () => {
            const data = await getUserProfile(user.uid);
            setProfile(data);
            setChances(data?.dailyChances || 5);
            setCompleted(data?.completedDay || false);
        };
        fetchProfile();
    } else {
        // User not logged in - load from localStorage only
        const savedChances = localStorage.getItem("dailyChances");
        const savedCompleted = localStorage.getItem("completedDay");
        
        setChances(savedChances ? parseInt(savedChances) : 5);
        setCompleted(savedCompleted === "true");
    }
    }, [user]);

    /**
     * Handles the 'submit answer' button
     */
    async function handleSubmit() {
        try {
            let correctAnswer = testCorrectAnswer(userInput);
            let newChances = chances - 1;
            let endGameValue = endGame;
            
            if (user) {
                // LOGGED IN: Use Firebase for everything
                await updateDailyChances(user.uid, newChances);
                
                if (correctAnswer) {
                    await addScore();
                    await updateStreak(user.uid);
                    await completeGame(user.uid, 1);
                    setCompleted(true);
                    endGameValue = 2;
                } else if (!correctAnswer && newChances > 0) {
                    setTriggerPopup(true);
                    setTimeout(() => setTriggerPopup(false), 1200);
                } else if (!correctAnswer && newChances <= 0) {
                    await updateStreak(user.uid);
                    await completeGame(user.uid, 1);
                    setCompleted(true);
                    endGameValue = 1;
                }
            } else {
                // NOT LOGGED IN: Use localStorage only
                localStorage.setItem("dailyChances", newChances.toString());
                
                if (correctAnswer) {
                    localStorage.setItem("completedDay", "true");
                    setCompleted(true);
                    endGameValue = 2;
                } else if (!correctAnswer && newChances > 0) {
                    setTriggerPopup(true);
                    setTimeout(() => setTriggerPopup(false), 1200);
                } else if (!correctAnswer && newChances <= 0) {
                    localStorage.setItem("completedDay", "true");
                    setCompleted(true);
                    endGameValue = 1;
                }
            }
            
            setChances(newChances);
            setEndGame(endGameValue);
        } catch (error) {
            console.error("Error submitting answer:", error);
        }
    }

    function testCorrectAnswer(userAnswer) {
        let formattedAnswer = userAnswer.replaceAll(' ', '');
        return answer.includes(formattedAnswer);
    }

    /**
     * Adds the users score to Firebase (only for logged in users)
     */
    async function addScore() {
        if (user) {
            try {
                await updateScore(user.uid, chances * 10);
            } catch (error) {
                console.error("Error updating score:", error);
            }
        }
        // Score only saved for logged in users
    }

    /**
     * Tests when the endGame variable is changed, 
     * therefore the game is ended and the question component needs to be updated
     */
    useEffect(()=>{
        onEndGame(endGame);
    }, [endGame]) // Dependencies on endGame

    if (completed){ // If the game has been completed today, display a continue button to go back to the game over screen
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