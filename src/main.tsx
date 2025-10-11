import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApiConfigProvider } from './context/ApiConfigContext.tsx'

document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiConfigProvider>
      <App />
    </ApiConfigProvider>
  </StrictMode>,
)
