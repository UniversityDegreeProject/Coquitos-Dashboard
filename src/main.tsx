// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// components
import { CoquitoApp } from '@/CoquitoApp'

import './index.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <CoquitoApp />
  // </StrictMode>,
)
