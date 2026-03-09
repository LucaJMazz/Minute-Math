import { useEffect } from 'react'
import './index.css'
import Question from './components/question'
import NavBar from './components/navBar'
import { useAuth } from './hooks/useAuth'


function App() {
  const { user } = useAuth();
  
/**
 * Returns all of the UI for the app
 */
  return (
    <>
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
    </>
  )
}

export default App
