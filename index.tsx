import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThreeElements } from '@react-three/fiber';

// Fix: Extend JSX.IntrinsicElements to include React Three Fiber elements.
// This resolves errors like "Property 'mesh' does not exist on type 'JSX.IntrinsicElements'" globally.
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);