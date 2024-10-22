<?php
// join-session.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Get session code and player name from POST request
$sessionCode = $_POST['sessionCode'];
$playerName = $_POST['playerName'];

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
    // Check if player already exists in the session
    if (!in_array($playerName, $sessions[$sessionCode]['players'])) {
        // Add player to the session
        $sessions[$sessionCode]['players'][] = $playerName;
        $sessions[$sessionCode]['ballPositions'][$playerName] = [0, 0, 0]; // Initial position
        $sessions[$sessionCode]['hits'][$playerName] = 0; // Initial hits
    }

    // Save the updated sessions back to the file
    file_put_contents($filename, json_encode($sessions));

    echo json_encode(['status' => 'success', 'message' => 'Joined session successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}
?>
