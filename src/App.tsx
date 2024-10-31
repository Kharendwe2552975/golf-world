import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import Game from './game';
import { GameProvider } from './game-context';
import GameSettings from './game-settings';
import GameMenu from './home-menu';
import LevelSelection from './level-selection';

const App = () => {
  return (
    <GameProvider>
      <BallProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GameMenu />} />
            <Route path="/play" element={<Game />} />
            <Route path="/levels" element={<LevelSelection />} />
            <Route path="/settings" element={<GameSettings />} />
          </Routes>
        </BrowserRouter>
      </BallProvider>
    </GameProvider>
  );
};

export default App;
