import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FirebaseAuth from './FirebaseAuth.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseAuth>
      <App />
    </FirebaseAuth>
  </StrictMode>,
)
