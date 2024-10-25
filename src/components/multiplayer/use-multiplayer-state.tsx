import { useEffect, useState } from 'react';
import { useBall } from '../ball/ball-provider';

const useMultiplayerGameState = () => {
  const sessionCode = localStorage.getItem('sessionCode');
  const playerName = localStorage.getItem('playerName');

  const [players, setPlayers] = useState<string[]>([]);
  const [ballPositions, setBallPositions] = useState<{ [key: string]: [number, number, number] }>(
    {},
  );
  const [hits, setHits] = useState<{ [key: string]: number }>({}); // Store hits for each player

  const { getPosition, hits: localHits } = useBall(); // Get the local position and hits

  // Fetch game state from the server
  const fetchGameState = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/get-game-state.php?sessionCode=${sessionCode}`,
    );
    const data = await response.json();
    if (data.status === 'success') {
      setPlayers(Object.keys(data['state'].players));
      // Extract ball positions and hits for convenience
      const newBallPositions: { [key: string]: [number, number, number] } = {};
      const newHits: { [key: string]: number } = {};
      Object.entries(data['state'].players).forEach(([name, details]: any) => {
        newBallPositions[name] = [
          details.ballPosition.x,
          details.ballPosition.y,
          details.ballPosition.z,
        ];
        newHits[name] = details.hits;
      });

      setBallPositions(newBallPositions);
      setHits(newHits);
    }
  };

  // Update game state if local position differs from the fetched position
  const updateGameState = async () => {
    if (!playerName) return;
    const serverPosition = ballPositions[playerName];
    const localPosition = getPosition();

    // Compare local position with server position
    if (
      !serverPosition ||
      Math.abs(localPosition[0] - serverPosition[0]) > 0.1 ||
      Math.abs(localPosition[1] - serverPosition[1]) > 0.1 ||
      Math.abs(localPosition[2] - serverPosition[2]) > 0.1
    ) {
      // If they differ, send the local position to the server
      await fetch(`${import.meta.env.VITE_SERVER_URL}/update-game-state.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        //@ts-ignore
        body: new URLSearchParams({
          sessionCode,
          playerName,
          ballPosition: JSON.stringify(localPosition), // Send local position
          hits: localHits.toString(), // Send the number of hits
        }),
      });
    }
  };

  useEffect(() => {
    if (!sessionCode) {
      return;
    }

    const interval = setInterval(() => {
      fetchGameState(); // Fetch game state every second
      updateGameState(); // Update game state if positions are different
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [ballPositions]); // Re-run if localPosition or ballPositions changes

  return { players, ballPositions, hits, playerName, localHits }; // Expose relevant data
};

export default useMultiplayerGameState;
