import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './globals.css'
import { SnackbarProvider } from 'notistack'
import App from './App.tsx'
import ClickProvider from './providers/ClickProvider.tsx'
import LoadingProvider from './providers/LoadingProvider.tsx'
import NavProvider from './providers/NavProvider.tsx'
import RouteProvider from './providers/RouteProvider.tsx'
import UserProvider from './providers/UserProvider.tsx'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouteProvider>
      <BrowserRouter>
        <SnackbarProvider classes={{ containerRoot: 'z-alert' }} maxSnack={2}>
          <UserProvider>
            <NavProvider>
              <ClickProvider>
                <LoadingProvider>
                  <App />
                </LoadingProvider>
              </ClickProvider>
            </NavProvider>
          </UserProvider>
        </SnackbarProvider>
      </BrowserRouter>
    </RouteProvider>
  </StrictMode>
)
