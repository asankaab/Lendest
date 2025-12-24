import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { ThemeProvider } from './contexts/ThemeProvider.jsx'
=======
import { ThemeProvider } from './context/ThemeProvider.jsx'
>>>>>>> 13af10e341f71a153942c64c6efba3ad96e05558

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  </StrictMode>
)
