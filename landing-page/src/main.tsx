import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships pre-rendered HTML (see scripts/prerender.mjs); in dev the root is empty.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
