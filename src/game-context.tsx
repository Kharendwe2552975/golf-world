import React, { createContext, useContext, useEffect, useState } from 'react';
import startSound from './assets/start.mp3';
import winSound from './assets/win.mp3';

type GameContextType = {
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
  maxHits: number;
  setMaxHits: (hits: number) => void;
  hasFailed: boolean;
  setHasFailed: (failed: boolean) => void;
  musicOn: boolean;
  toggleMusic: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [maxHits, setMaxHits] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  const initialMusicState = localStorage.getItem('musicOn') === 'false' ? false : true;
  const [musicOn, setMusicOn] = useState(initialMusicState);

  const winAudio = new Audio(winSound);
  const startAudio = new Audio(startSound);

  useEffect(() => {
    winAudio.load();
    startAudio.load();
  }, []);

  useEffect(() => {
    if (musicOn) startAudio.play();
  }, [currentLevel, musicOn]);

  useEffect(() => {
    if (levelCompleted && musicOn) {
      winAudio.play();
    }
  }, [levelCompleted, musicOn]);

  const toggleMusic = () => {
    setMusicOn((prev) => {
      const newState = !prev;
      localStorage.setItem('musicOn', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        levelCompleted,
        setLevelCompleted,
        maxHits,
        setMaxHits,
        hasFailed,
        setHasFailed,
        musicOn,
        toggleMusic,
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
