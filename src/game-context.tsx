import level1 from '@/assets/levels/level1.jpeg';
import level2 from '@/assets/levels/level2.jpeg';
import level3 from '@/assets/levels/level3.jpeg';
import level4 from '@/assets/levels/level4.jpeg';
import React, { createContext, useContext, useEffect, useState } from 'react';
import startSound from './assets/start.mp3';
import winSound from './assets/win.mp3';

type GameContextType = {
  hasScenery: boolean;
  setHasScenery: (hasScenery: boolean) => void;
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
  par: number;
  image: string;
}

const initialLevels: Level[] = [
  {
    id: 1,
    name: 'Level One',
    unlocked: true,
    par: 2,
    image: level1,
  },
  {
    id: 2,
    name: 'Level Two',
    unlocked: false,
    par: 4,
    image: level2,
  },
  {
    id: 3,
    name: 'Level Three',
    unlocked: false,
    par: 4,
    image: level3,
  },
  {
    id: 4,
    name: 'Level Four',
    unlocked: false,
    par: 8,
    image: level4,
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
  const [hasFailed, setHasFailed] = useState(false);
  const [levels, setLevels] = useState<Level[]>(() => {
    const savedLevels = localStorage.getItem('levels');
    return savedLevels ? JSON.parse(savedLevels) : initialLevels;
  });

  const [par, setPar] = useState(() => levels[currentLevel - 1].par);
  const winAudio = new Audio(winSound);
  const startAudio = new Audio(startSound);

  const [hasScenery, setHasScenery] = useState(() => {
    const savedScenery = localStorage.getItem('hasScenery');
    return savedScenery ? JSON.parse(savedScenery) : true;
  });

  const levelUp = () => {
    setCurrentLevel((prev) => prev + 1);
    setPar(levels[currentLevel].par);
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
    localStorage.setItem('hasScenery', JSON.stringify(hasScenery));
  }, [hasScenery]);

  useEffect(() => {
    const savedLevels = localStorage.getItem('levels');
    if (!savedLevels) {
      localStorage.setItem('levels', JSON.stringify(initialLevels));
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        hasScenery,
        setHasScenery,
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
