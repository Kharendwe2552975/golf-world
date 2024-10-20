import React, { createContext, useContext, useRef, useState } from 'react';

// Define the context type, including position, applyForce, and setShootingAngle
type BallContextType = {
  position: [number, number, number];
  isAiming: boolean;
  setPosition: (pos: [number, number, number]) => void;
  applyForce: (strength: number) => void;
  setShootingAngle: (angle: number) => void;
  applyApi: (api: any) => void;
};

// Create the context
const BallContext = createContext<BallContextType | undefined>(undefined);

export const BallProvider = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [shootingAngle, setShootingAngleState] = useState(0);
  const [isAiming, setIsAiming] = useState(true);
  const apiRef = useRef<any>(null); // To store the physics API

  const setShootingAngle = (angle: number) => {
    setShootingAngleState(angle);
    setIsAiming(false);
  };

  const applyForce = (strength: number) => {
    if (apiRef.current) {
      const force = Math.min(Math.max(strength, 0), 100); // Clamp force between 0 and 100
      const forceX = Math.cos(shootingAngle) * force * 20;
      const forceZ = Math.sin(shootingAngle) * force * 20;
      apiRef.current.applyForce([forceX, 0, forceZ], [0, 0, 0]); // Apply force based on angle
    }
    setIsAiming(true);
  };

  const applyApi = (api: any) => {
    apiRef.current = api; // Store the physics API for later use
  };

  return (
    <BallContext.Provider
      value={{ position, isAiming, setPosition, applyForce, setShootingAngle, applyApi }}
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
