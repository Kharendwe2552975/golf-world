import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import Game from './game';
import GameMenu from './home-menu';
import LevelTwo from './levels/two/level-two';

const App = () => {
  return (
    <BallProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/play" element={<Game />} />
          <Route path="/level-two" element={<LevelTwo />} />
        </Routes>
      </BrowserRouter>
    </BallProvider>
  );
};

export default App;
