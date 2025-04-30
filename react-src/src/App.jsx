import { useEffect } from 'react'
import { initializeLocalStorageDefaults } from './utils/localData'
import './index.css'
import Question from './components/question'
import NavBar from './components/navBar'

function App() {

  useEffect(() => {
          // Function to be called on page load
          function onPageLoad() {
            initializeLocalStorageDefaults(); // initializes local data if the user is new to the page
          }
      
          onPageLoad();
        }, []); // Empty dependency array ensures this runs only once
  
/**
 * Returns all of the UI for the app
 */
  return (
    <div className="app">
      <NavBar /> 
        <div className="title-wrapper">
          <h1 className="title">Minute Math</h1>
          <p> Solve today's math problem </p>
        </div>
        <hr />
      <div className="game-box">
        <Question />
      </div>
    </div>
  )
}

export default App
