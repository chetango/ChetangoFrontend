// Verified: Mac setup 2026-03-23
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/design-system/tokens/global.scss'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />    
  </StrictMode>,
)
