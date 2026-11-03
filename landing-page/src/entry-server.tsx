// Used only at build time: renders the page to plain HTML so text shows before JavaScript loads.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
