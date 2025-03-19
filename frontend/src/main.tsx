import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './routes/Home/App.tsx'
import './globals.css'
import ClickProvider from './providers/ClickProvider.tsx'
import NavProvider from './providers/NavProvider.tsx'
import Register from './routes/Register/intex.tsx'

function NotFound() {
  return <h1>404 Page Not Not Found</h1>
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavProvider>
        <ClickProvider>
          <Routes>
            <Route path="" element={<App />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClickProvider>
      </NavProvider>
    </BrowserRouter>
  </StrictMode>
)
