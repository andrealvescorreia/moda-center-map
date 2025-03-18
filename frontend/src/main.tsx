import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/nav.tsx'
import App from './routes/Home/App.tsx'
import './globals.css'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
