import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LevelOne from './experiment';
import GameStage from './game-stage';
import GameMenu from './home-menu';
import TestScene from './testWorld';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <LevelOne /> */}
    <Router>
      <Routes>
        <Route path="/" element={<GameMenu />} />
        <Route path="/temp" element={<LevelOne />} />
        <Route path="/test" element={<TestScene />} />
        <Route path="/play" element={<GameStage />} />
      </Routes>
    </Router>
  </StrictMode>,
);
