import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LevelOne from './level-one';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LevelOne />
  </StrictMode>,
);
