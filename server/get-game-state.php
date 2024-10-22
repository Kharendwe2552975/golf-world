<?php
// get-game-state.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get session code from the GET request
$sessionCode = $_GET['sessionCode'];

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
    // Return the current game state for the session
    echo json_encode([
        'status' => 'success',
        'state' => $sessions[$sessionCode]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}
?>
