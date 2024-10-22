<?php
// update-game-state.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get session code, player name, ball position, and hits from POST request
$sessionCode = $_POST['sessionCode'];
$playerName = $_POST['playerName'];
$ballPosition = json_decode($_POST['ballPosition'], true);  // Expecting [x, y, z] coordinates
$hits = $_POST['hits'];  // Number of hits made by the player
$currentLevel = $_POST['currentLevel']; // Current level of the game

// Load existing sessions
$filename = 'sessions.json';
if (file_exists($filename)) {
    $sessions = json_decode(file_get_contents($filename), true);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No active sessions found.']);
    exit;
}

// Check if session exists
if (isset($sessions[$sessionCode])) {
    // Update ball position and hits for the player
    $sessions[$sessionCode]['ballPositions'][$playerName] = $ballPosition;
    $sessions[$sessionCode]['hits'][$playerName] = $hits;

    // Optionally update the current level
    if (!empty($currentLevel)) {
        $sessions[$sessionCode]['currentLevel'] = $currentLevel;
    }

    // Change game state to 'ongoing' if it was 'waiting'
    if ($sessions[$sessionCode]['gameState'] === 'waiting') {
        $sessions[$sessionCode]['gameState'] = 'ongoing';
    }

    // Save the updated sessions back to the file
    file_put_contents($filename, json_encode($sessions));

    echo json_encode(['status' => 'success', 'message' => 'Game state updated.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}
?>
