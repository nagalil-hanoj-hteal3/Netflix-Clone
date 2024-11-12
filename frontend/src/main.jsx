// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  // <StrictMode> // renders each element twice in development mode
    <BrowserRouter>
      <App />
    </BrowserRouter>
    
  // </StrictMode>,
)
