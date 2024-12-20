import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from '../multiplayer/socket-provider';

// Define the context type, including hits, state, applyForce, setShootingAngle, lastStationaryPosition, getPosition, texture, and setTexture
type BallContextType = {
  hits: number;
  setHits: (hits: number) => void;
  lastStationaryPosition: [number, number, number];
  state: 'aiming' | 'shooting' | 'rolling';
  setState: (state: 'aiming' | 'shooting' | 'rolling') => void;
  applyForce: (strength: number) => void;
  setShootingAngle: (angle: number) => void;
  applyApi: (api: any) => void;
  setLastStationaryPosition: (pos: [number, number, number]) => void;
  getPosition: () => [number, number, number]; // Function to get the current position
  texture: string;
  setTexture: (texture: string) => void;
};

// Create the context
const BallContext = createContext<BallContextType | undefined>(undefined);

export const BallProvider = ({ children }: { children: React.ReactNode }) => {
  const [hits, setHits] = useState(0);
  const [lastStationaryPosition, setLastStationaryPosition] = useState<[number, number, number]>([
    0, 10, 80,
  ]);
  const [shootingAngle, setShootingAngleState] = useState(0);
  const [state, setState] = useState<'aiming' | 'shooting' | 'rolling'>('aiming');
  // const [texture, setTexture] = useState('/whiteBall.png'); // Default texture
  const [texture, setTexture] = useState<string>(() => {
    const savedTexture = localStorage.getItem('texture');
    return savedTexture ? savedTexture : '/whiteBall.png';
  });

  useEffect(() => {
    localStorage.setItem('texture', texture);
  }, [texture]);

  const apiRef = useRef<any>(null);
  const { updatePlayerState } = useSocket();

  const setShootingAngle = useCallback(
    (angle: number) => {
      if (state !== 'aiming') return;
      setShootingAngleState(angle);
      setState('shooting'); // Transition to shooting state
    },
    [state],
  );

  const applyForce = useCallback(
    (strength: number) => {
      if (state !== 'shooting') return;
      if (apiRef.current) {
        const force = Math.min(Math.max(strength, 0), 100); // Clamp force between 0-100
        const forceX = Math.cos(-shootingAngle) * force * 4;
        const forceZ = Math.sin(-shootingAngle) * force * 4;

        apiRef.current.applyForce([-forceX, 0, -forceZ], [0, 0, 0]); // Apply force
      }
      setState('rolling'); // Transition to rolling state
      setHits((hits) => hits + 1);

      updatePlayerState({
        hits,
        force: strength,
        aim_direction: shootingAngle,
        ball_position: {
          x: lastStationaryPosition[0],
          y: lastStationaryPosition[1],
          z: lastStationaryPosition[2],
        },
      });
    },
    [state, shootingAngle],
  );

  const applyApi = useCallback((api: any) => {
    apiRef.current = api;
  }, []);

  const getPosition = useCallback((): [number, number, number] => {
    if (apiRef.current) {
      const { x, y, z } = apiRef.current.position;
      return [x, y, z];
    }
    return [0, 0, 0];
  }, []);
  return (
    <BallContext.Provider
      value={{
        hits,
        setHits,
        lastStationaryPosition,
        state,
        setState,
        applyForce,
        setShootingAngle,
        applyApi,
        setLastStationaryPosition,
        getPosition,
        texture,
        setTexture,
      }}
    >
      {children}
    </BallContext.Provider>
  );
};

// Custom hook to use the BallContext
export const useBall = () => {
  const context = useContext(BallContext);
  if (!context) {
    throw new Error('useBall must be used within a BallProvider');
  }
  return context;
};
