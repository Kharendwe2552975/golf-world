import React, { createContext, useContext, useEffect, useState } from 'react';
import startSound from './assets/start.mp3';
import winSound from './assets/win.mp3';

type GameContextType = {
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  levelUp: () => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const winAudio = new Audio(winSound);
  const startAudio = new Audio(startSound);

  const levelUp = () => {
    setCurrentLevel((prev) => prev + 1);
    setLevelCompleted(false);
  };

  useEffect(() => {
    winAudio.load();
    startAudio.load();
  }, []);

  // Play start sound when the level changes
  useEffect(() => {
    startAudio.play();
  }, [currentLevel]);

  // Play win sound when the level is completed
  useEffect(() => {
    if (levelCompleted) {
      winAudio.play();
    }
  }, [levelCompleted]);

  return (
    <GameContext.Provider
      value={{ currentLevel, setCurrentLevel, levelCompleted, setLevelCompleted, levelUp }}
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
