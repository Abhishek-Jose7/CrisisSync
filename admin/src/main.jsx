import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

window.onerror = (msg, url, line, col, error) => {
  document.body.innerHTML = `<div style="padding: 20px; color: white; background: #900;">
    <h1>Runtime Error</h1>
    <pre>${msg}</pre>
    <pre>${error?.stack}</pre>
  </div>`;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
