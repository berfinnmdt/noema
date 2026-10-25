import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/sections.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('NOEMA: #root kapsayıcısı bulunamadı.')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
