import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import { GameProvider } from './game-context';
import GameLayout from './game-layout';
import GameMenu from './home-menu';

const App = () => {
  return (
    <GameProvider>
      <BallProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<GameMenu />} />
            <Route path="/play" element={<GameLayout />} />
          </Routes>
        </BrowserRouter>
      </BallProvider>
    </GameProvider>
  );
};
export default App;
