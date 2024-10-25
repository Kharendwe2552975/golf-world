import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import Game from './game';
import { GameProvider } from './game-context';
import GameMenu from './home-menu';

const App = () => {
  return (
    <GameProvider>
      <BallProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<GameMenu />} />
            <Route path="/play" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </BallProvider>
    </GameProvider>
  );
};
export default App;
