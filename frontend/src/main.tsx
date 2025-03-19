import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavBar from './components/nav.tsx'
import App from './routes/Home/App.tsx'
import './globals.css'
import ClickProvider from './providers/ClickProvider.tsx'
import NavProvider from './providers/NavProvider.tsx'

function NotFound() {
  return <h1>404 Page Not Not Found</h1>
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NavProvider>
        <ClickProvider>
          <NavBar />
          <Routes>
            <Route path="" element={<App />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClickProvider>
      </NavProvider>
    </BrowserRouter>
  </StrictMode>
)
