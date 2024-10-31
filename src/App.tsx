import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import Game from './game';
import GameSettings from './game-settings';
import GameMenu from './home-menu';
import LevelSelection from './level-selection';
import LevelTwo from './levels/two/level-two';

const App = () => {
  return (
    <BallProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/play" element={<Game />} />
          <Route path="/level-two" element={<LevelTwo />} />
          <Route path="/levels" element={<LevelSelection />} />
          <Route path="/settings" element={<GameSettings />} />
        </Routes>
      </BrowserRouter>
    </BallProvider>
  );
};

export default App;
