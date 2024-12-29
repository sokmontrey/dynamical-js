import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './output.css' 

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
