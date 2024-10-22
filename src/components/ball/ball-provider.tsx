import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

// Define the context type, including position, applyForce, setShootingAngle, and lastStationaryPosition
type BallContextType = {
  hits: number;
  position: [number, number, number];
  lastStationaryPosition: [number, number, number];
  state: 'aiming' | 'shooting' | 'rolling';
  setState: (state: 'aiming' | 'shooting' | 'rolling') => void;
  setPosition: (pos: [number, number, number]) => void;
  applyForce: (strength: number) => void;
  setShootingAngle: (angle: number) => void;
  applyApi: (api: any) => void;
  setLastStationaryPosition: (pos: [number, number, number]) => void;
};

// Create the context
const BallContext = createContext<BallContextType | undefined>(undefined);
export const BallProvider = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [hits, setHits] = useState(0);
  const [lastStationaryPosition, setLastStationaryPosition] = useState<[number, number, number]>([
    0, 10, 80,
  ]);
  const [shootingAngle, setShootingAngleState] = useState(0);
  const [state, setState] = useState<'aiming' | 'shooting' | 'rolling'>('aiming');
  const apiRef = useRef<any>(null);

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
      setHits((hits) => {
        return hits + 1;
      });
    },
    [state, shootingAngle],
  );

  const applyApi = useCallback((api: any) => {
    apiRef.current = api;
  }, []);

  return (
    <BallContext.Provider
      value={{
        hits,
        position,
        lastStationaryPosition,
        state,
        setState,
        setPosition,
        applyForce,
        setShootingAngle,
        applyApi,
        setLastStationaryPosition,
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
