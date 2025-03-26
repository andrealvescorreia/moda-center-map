import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import App from './App.tsx'
import ClickProvider from './providers/ClickProvider.tsx'
import LoadingProvider from './providers/LoadingProvider.tsx'
import NavProvider from './providers/NavProvider.tsx'
import UserProvider from './providers/UserProvider.tsx'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <NavProvider>
          <ClickProvider>
            <LoadingProvider>
              <App />
            </LoadingProvider>
          </ClickProvider>
        </NavProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
