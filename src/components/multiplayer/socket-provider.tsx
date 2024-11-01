import { useGame } from '@/game-context';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';

// Define types for player state, session data, and context value
interface PlayerData {
  name: string;
  hits: number;
  ball_position: { x: number; y: number; z: number };
  aim_direction: number;
  force: number;
}

interface SessionData {
  host: string;
  game_status: string;
  current_level: number;
  game_creator: string;
  players: { [key: string]: PlayerData };
}

interface SocketContextValue {
  gameStarted: boolean;
  socket: Socket | null;
  sessionCode: string | null;
  players: { [key: string]: PlayerData };
  currentPlayer: string | null;
  startGame: () => void;
  createSession: (playerName: string) => Promise<string>;
  joinSession: (playerName: string, code: string) => Promise<SessionData>;
  updatePlayerState: (data: Partial<PlayerData>) => void;
}

// Create the context with default values
const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// Custom hook to access the socket context
export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Define the provider component
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const [sessionCode, setSessionCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ [key: string]: PlayerData }>({});
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const { setCurrentLevel, setLevelCompleted, levelCompleted } = useGame();

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io(import.meta.env.VITE_SERVER_URL);

    // Clean up the connection on unmount
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  // Handle events from the server
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('playerJoined', (playerData: PlayerData) => {
      setPlayers((prevPlayers) => ({ ...prevPlayers, [playerData.name]: playerData }));
    });

    socket.current.on('stateUpdated', (playerData: PlayerData) => {
      setPlayers((prevPlayers) => ({ ...prevPlayers, [playerData.name]: playerData }));
    });

    socket.current.on('playerLeft', ({ name }: { name: string }) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = { ...prevPlayers };
        delete updatedPlayers[name];
        return updatedPlayers;
      });
    });

    socket.current.on('nextLevel', ({ level }: { level: any }) => {
      setLevelCompleted(false);
      setCurrentLevel(parseInt(level, 10));
    });

    socket.current.on('gameStarted', () => {
      setCurrentLevel(1);
      setGameStarted(true);
    });
  }, []);

  // Handle level completion
  useEffect(() => {
    if (levelCompleted) {
      if (sessionCode && socket.current) {
        socket.current.emit('levelCompleted', sessionCode);
      }
    }
  }, [levelCompleted]);

  // Create a session
  const createSession = useCallback((playerName: string): Promise<string> => {
    return new Promise((resolve) => {
      socket.current?.emit('createSession', playerName, ({ code }: { code: string }) => {
        setSessionCode(code);
        setCurrentPlayer(playerName);
        resolve(code);
      });
    });
  }, []);

  // Join a session
  const joinSession = useCallback((playerName: string, code: string): Promise<SessionData> => {
    return new Promise((resolve, reject) => {
      socket.current?.emit(
        'joinSession',
        playerName,
        code,
        ({
          success,
          sessionData,
          message,
        }: {
          success: boolean;
          sessionData: SessionData;
          message: string;
        }) => {
          if (success) {
            setSessionCode(code);
            setCurrentPlayer(playerName);
            setPlayers(sessionData.players);
            if (sessionData.game_status === 'playing') {
              setGameStarted(true);
            }
            resolve(sessionData);
          } else {
            reject(new Error(message));
          }
        },
      );
    });
  }, []);

  const startGame = useCallback(() => {
    if (sessionCode && socket.current) {
      socket.current.emit('startGame', sessionCode);
    }
  }, [sessionCode]);

  // Update player state
  const updatePlayerState = useCallback(
    (data: Partial<PlayerData>) => {
      if (sessionCode && socket.current) {
        socket.current.emit('updateState', sessionCode, data);
      }
    },
    [sessionCode],
  );

  // Provide context values
  const contextValue = {
    socket: socket.current,
    gameStarted,
    sessionCode,
    players,
    currentPlayer,
    startGame,
    createSession,
    joinSession,
    updatePlayerState,
  };

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
