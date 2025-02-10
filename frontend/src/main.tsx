import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <script defer src="https://use.fontawesome.com/releases/v5.12.0/js/all.js"></script>
    <App />
  </StrictMode>,
)
