const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Use CORS middleware
app.use(
  cors({
    origin: true, // Allow any origin
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);

const sessions = {};

function generateCode() {
  return crypto.randomBytes(3).toString('hex');
}

const levelTimers = {}; // Store timers for each session to avoid overlap

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a session
  socket.on('createSession', (name, callback) => {
    const code = generateCode();
    sessions[code] = {
      host: socket.id,
      game_status: 'waiting',
      game_creator: name,
      current_level: 1,
      players: {
        [socket.id]: {
          name,
          hits: 0,
          ball_position: { x: 0, y: 0, z: 0 },
          aim_direction: 0,
          force: 0,
        },
      },
    };
    socket.join(code);
    callback({ code });
    console.log(`Session ${code} created by ${name}`);
  });

  // Join a session
  socket.on('joinSession', (name, code, callback) => {
    if (sessions[code]) {
      sessions[code].players[socket.id] = {
        name,
        hits: 0,
        ball_position: { x: 0, y: 0, z: 0 },
        aim_direction: 0,
        force: 0,
      };
      socket.join(code);
      io.to(code).emit('playerJoined', { name });
      callback({ success: true, sessionData: sessions[code] });
      console.log(`${name} joined session ${code}`);
    } else {
      callback({ success: false, message: 'Session not found' });
    }
  });

  // Start the game
  socket.on('startGame', (code) => {
    if (sessions[code] && sessions[code].host === socket.id) {
      sessions[code].game_status = 'playing';
      io.to(code).emit('gameStarted');
      console.log(`Game started in session ${code}`);
    }
  });

  // Update player state
  socket.on('updateState', (code, data) => {
    if (sessions[code] && sessions[code].players[socket.id]) {
      const player = sessions[code].players[socket.id];
      player.hits = data.hits || player.hits;
      player.ball_position = data.ball_position || player.ball_position;
      player.aim_direction = data.aim_direction || player.aim_direction;
      player.force = data.force || player.force;

      io.to(code).emit('stateUpdated', {
        playerId: socket.id,
        name: player.name,
        hits: player.hits,
        ball_position: player.ball_position,
        aim_direction: player.aim_direction,
        force: player.force,
      });
      console.log(`${player.name} updated state in session ${code}`);
    }
  });

  // Player completes a level
  socket.on('levelCompleted', (code) => {
    if (sessions[code]) {
      const session = sessions[code];

      // Check if the timer has already been started for this level
      if (!session.levelTimerStarted) {
        session.levelTimerStarted = true; // Set the flag to prevent re-triggering

        console.log(`Level completed in session ${code}, starting 30s timer`);

        // Start a 30-second countdown
        levelTimers[code] = setTimeout(() => {
          // Move to the next level
          session.current_level += 1;
          session.levelTimerStarted = false; // Reset the flag for the next level
          io.to(code).emit('nextLevel', { level: session.current_level });

          console.log(`Session ${code} moved to level ${session.current_level}`);

          // Clear the timer after use
          delete levelTimers[code];
        }, 10000); // 10 seconds
      } else {
        console.log(`Timer already running for level ${session.current_level} in session ${code}`);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const [code, session] of Object.entries(sessions)) {
      if (session.players[socket.id]) {
        const { name } = session.players[socket.id];
        delete session.players[socket.id];
        io.to(code).emit('playerLeft', { name });
        if (Object.keys(session.players).length === 0) {
          delete sessions[code];
          console.log(`Session ${code} closed`);
        }
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
