import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import { SocketProvider } from './components/multiplayer/socket-provider';
import { GameProvider } from './game-context';
import GameLayout from './game-layout';
import GameSettings from './game-settings';
import GameMenu from './home-menu';
import LevelSelection from './level-selection';

const App = () => {
  return (
    <GameProvider>
      <SocketProvider>
        <BallProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<GameMenu />} />
              <Route path="/play" element={<GameLayout />} />
              <Route path="/levels" element={<LevelSelection />} />
              <Route path="/settings" element={<GameSettings />} />
            </Routes>
          </BrowserRouter>
        </BallProvider>
      </SocketProvider>
    </GameProvider>
  );
};

export default App;
