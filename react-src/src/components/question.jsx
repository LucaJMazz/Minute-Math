import { useState } from "react"
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { motion } from 'framer-motion'
import InputBox from './inputBox'
import GameOver from "./gameOver";
import questions from '../data/dailyQuestions.json';

function Question(){

    /*
     * Configures the MathJax settings for display
     */

    const today = new Date(); // Gets todays date to display at the top
    const formattedDate = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); // Formats the date for visuals
    
    /**
     * Turns an integer difficulty into a list of stars for a visual difficulty meter
     * @param {*} difficultyNum difficulty as an integer
     * @returns a string with the difficulty as stars
     */
    function getDifficulty(difficultyNum){
        let difficultyString = "";
        for (let i = 0; i < difficultyNum; i++) { // Loops through the integer difficulty to add filled in stars for that amount
            difficultyString += "★";
        } 
        for (let i = 3; i > difficultyNum; i--) {  // Loops through remaining amount to add outlined stars
            difficultyString += "☆";
        }
        return difficultyString
    }

    const launchDate = new Date("2025-05-04T00:00:00Z"); // universal and consistent // Launch date is here to tell the site when the clues start
    const daysSinceLaunch = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24)).toString(); // Calculates the current day and the amount of days since launch 
    const questionAmount = 31; // Total amount of questions in the json file

    /**
     * Recursive function makes sure the id's don't go out of the bounds of the question amount
     * @param {*} days - days since launch
     * @returns days since launch in the threshold of the question amount
     */
    function recycleQuestions(days) {
        if (days>questionAmount){
            return recycleQuestions(days - questionAmount); // Recursively removes the question total from the value until its in the threshold
        } else {
            return days.toString(); // Returns the days in the threshold as a string for the id's
        }
    }
    
    const questionId = recycleQuestions(Math.abs(parseInt(daysSinceLaunch))); // Gets the absolute value of the days-since integer and puts it in the function, so no matter the date you will get a question
    
    const selectedQuestion = questions.find(q => q.id === questionId); // Grabs a selected question from the json file
    if (!selectedQuestion) return <p>Question not found. Error id: {daysSinceLaunch}</p>; // In case the selected option doesn't exist, displays error
    
    /**
     * Gets all the variables from the selected json question to be used by the components
     */
    const difficulty = getDifficulty(selectedQuestion.difficultyJson);
    const question = selectedQuestion.questionJson;
    const equation = selectedQuestion.equationJson;
    const answer = selectedQuestion.answerJson;
    const inputInclude = selectedQuestion.inputIncludeJson;
    const [endGame, setEndGame] = useState(0);

    /**
     * Gets endgame from the inputBox.jsx to return the game over screen
     * @param {*} endGameValue 
     */
    function handleEndGame(endGameValue) {
        setEndGame(endGameValue);
    }

    // If the game is over, display the game over screen instead
    if (endGame>0) {
        return (
            <GameOver endGame={endGame} handleEndGame={handleEndGame} answer={answer} inputInclude={inputInclude}/>
        )
    } else // Default return: returns the question pane
    return (
        <div className="question-wrapper">
            <p className="date"> { " The daily Math Problem for "+ formattedDate} </p>
            <hr />
                <motion.div className="difficulty-panel" initial={{scale:0}} animate={{scale:1}}>  
                    <h2> Today's Difficulty </h2>
                    <h2> : {difficulty} </h2>
                </motion.div>
            <motion.div className="question-panel" initial={{scale:0}} animate={{scale:1}}>
                <h1 className="question-title"> {question} </h1>

                <div className="question-display">
                    <MathJaxContext className="equation">
                        <MathJax> {equation} </MathJax>
                    </MathJaxContext>
                </div>
                
            </motion.div>
            <motion.div className="input-wrapper" initial={{y:350}} animate={{y:0}}>
                <InputBox answer={answer} onEndGame={handleEndGame} inputInclude={inputInclude}/>
            </motion.div>
        </div>
    )
}

export default Question