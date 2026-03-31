import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')

function showBootError(title, errorLike) {
  const details = errorLike instanceof Error
    ? `${errorLike.message}\n\n${errorLike.stack || ''}`
    : String(errorLike)

  rootEl.innerHTML = `
    <div style="font-family: system-ui, sans-serif; max-width: 980px; margin: 24px auto; padding: 16px;">
      <h2 style="margin: 0 0 8px; color: #a31212;">${title}</h2>
      <pre style="white-space: pre-wrap; background: #fff6f6; border: 1px solid #efcaca; padding: 12px; border-radius: 8px;">${details}</pre>
    </div>
  `
}

window.addEventListener('error', (event) => {
  showBootError('Runtime error while loading app', event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  showBootError('Unhandled promise rejection while loading app', event.reason)
})

try {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  showBootError('Failed to render React app', err)
}
