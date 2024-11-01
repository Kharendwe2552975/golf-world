import React, { createContext, useContext, useEffect, useState } from 'react';
import startSound from './assets/start.mp3';
import winSound from './assets/win.mp3';

type GameContextType = {
  isMusicOn: boolean;
  toggleMusic: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  levelUp: () => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
  par: number;
  setPar: (par: number) => void;
  hasFailed: boolean;
  setHasFailed: (failed: boolean) => void;
  levels: Level[];
  setLevels: (levels: Level[]) => void;
  restartGame: () => void;
};

interface Level {
  id: number;
  name: string;
  unlocked: boolean;
  Points: number;
  image: string;
}

const initialLevels: Level[] = [
  {
    id: 1,
    name: 'Level One',
    unlocked: true,
    Points: 3,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 2,
    name: 'Level Two',
    unlocked: false,
    Points: 4,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 3,
    name: 'Level Three',
    unlocked: false,
    Points: 5,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 4,
    name: 'Level Four',
    unlocked: false,
    Points: 4,
    image: 'https://via.placeholder.com/220x150',
  },
  {
    id: 5,
    name: 'Level Five',
    unlocked: false,
    Points: 5,
    image: 'https://via.placeholder.com/220x150',
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem('currentLevel');
    return savedLevel ? parseInt(savedLevel, 10) : 1;
  });
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(() => {
    const savedMusicState = localStorage.getItem('isMusicOn');
    return savedMusicState ? JSON.parse(savedMusicState) : true;
  });
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => {
    const savedSoundState = localStorage.getItem('isSoundOn');
    return savedSoundState ? JSON.parse(savedSoundState) : true;
  });
  const [par, setPar] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);
  const [levels, setLevels] = useState<Level[]>(() => {
    const savedLevels = localStorage.getItem('levels');
    return savedLevels ? JSON.parse(savedLevels) : initialLevels;
  });

  const winAudio = new Audio(winSound);
  const startAudio = new Audio(startSound);

  const levelUp = () => {
    setCurrentLevel((prev) => prev + 1);
    setLevelCompleted(false);
    setLevels((prevLevels) => {
      const updatedLevels = prevLevels.map((level) => {
        if (level.id === currentLevel + 1) {
          return { ...level, unlocked: true };
        }
        return level;
      });
      localStorage.setItem('levels', JSON.stringify(updatedLevels));
      return updatedLevels;
    });
  };

  const restartGame = () => {
    setCurrentLevel(1);
    setLevels(initialLevels);
    localStorage.setItem('currentLevel', '1');
    localStorage.setItem('levels', JSON.stringify(initialLevels));
    window.location.reload();
  };

  useEffect(() => {
    winAudio.load();
    startAudio.load();
  }, []);

  // Play start sound when the level changes
  useEffect(() => {
    if (isSoundOn) {
      startAudio.play();
    }
  }, [currentLevel]);

  // Play win sound when the level is completed
  useEffect(() => {
    if (levelCompleted) {
      if (isSoundOn) {
        winAudio.play();
      }
    }
  }, [levelCompleted]);

  useEffect(() => {
    localStorage.setItem('currentLevel', currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('isMusicOn', JSON.stringify(isMusicOn));
  }, [isMusicOn]);

  useEffect(() => {
    localStorage.setItem('isSoundOn', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  useEffect(() => {
    const savedLevels = localStorage.getItem('levels');
    if (!savedLevels) {
      localStorage.setItem('levels', JSON.stringify(initialLevels));
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        levelCompleted,
        setLevelCompleted,
        levelUp,
        isMusicOn,
        toggleMusic: () => setIsMusicOn((prev) => !prev),
        isSoundOn,
        toggleSound: () => setIsSoundOn((prev) => !prev),
        par,
        setPar,
        hasFailed,
        setHasFailed,
        levels,
        setLevels,
        restartGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
