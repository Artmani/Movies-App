import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { GenresProvider } from './hooks/GenresContext'
import 'antd/dist/reset.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <GenresProvider>
    <App />
  </GenresProvider>
)
