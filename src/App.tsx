import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BallProvider } from './components/ball/ball-provider';
import Game from './game';
import GameMenu from './home-menu';

const App = () => {
  return (
    <BallProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GameMenu />} />
          <Route path="/play" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </BallProvider>
  );
};
export default App;
