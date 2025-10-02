import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'
import { router } from './router'
import { RouterProvider } from 'react-router'

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />
)
