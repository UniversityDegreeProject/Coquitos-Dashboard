import { createRoot } from 'react-dom/client'

// components
import { CoquitoApp } from '@/CoquitoApp'
import { TransStackProvider } from '@/providers/TansStackProvider'
import { Toaster } from 'sonner'
import { sonnerAdapter } from '@/config/sonner.adapter'

import './index.css'

createRoot(document.getElementById('root')!).render(
    <TransStackProvider>
      <Toaster {...sonnerAdapter} />
      <CoquitoApp />
    </TransStackProvider>
)
