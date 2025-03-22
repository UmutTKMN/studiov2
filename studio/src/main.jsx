import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import { router } from './routers/index'
import "./styles/style.css"

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position="top-right" />
    <RouterProvider router={router} />
  </AuthProvider>
)
