import { createRoot } from 'react-dom/client'

// components
import { CoquitoApp } from '@/CoquitoApp'
import { TanStackProvider } from '@/providers/TansStackProvider'
import { Toaster } from 'sonner'
import { sonnerAdapter } from '@/config/sonner.adapter'

import './index.css'

createRoot(document.getElementById('root')!).render(
    <TanStackProvider>
      <Toaster {...sonnerAdapter} />
      <CoquitoApp />
    </TanStackProvider>
)
