import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ContextShare from './Context/ContextShare.tsx'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <ContextShare>
   <StrictMode>
    <App />
  </StrictMode>
  </ContextShare>
  </BrowserRouter>
)