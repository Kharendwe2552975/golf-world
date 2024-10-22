<?php
// create-session.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get player name from POST request
$playerName = $_POST['playerName'];

// Generate a unique session code (e.g., random string of 6 characters)
$sessionCode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));

// Load existing sessions
$filename = 'sessions.json';
if (file_exists($filename)) {
    $sessions = json_decode(file_get_contents($filename), true);
} else {
    $sessions = [];
}

// Create a new session with the player's name
$sessions[$sessionCode] = [
    'players' => [$playerName],
    'ballPositions' => [$playerName => [0, 0, 0]], // Start position for player
    'hits' => [$playerName => 0], // Initial hits
    'currentLevel' => 1, // Initial level
    'gameState' => 'waiting' // Set game state to 'waiting' initially
];

// Save the updated sessions back to the file
file_put_contents($filename, json_encode($sessions));

// Return the session code to the player
echo json_encode(['status' => 'success', 'sessionCode' => $sessionCode]);
?>
