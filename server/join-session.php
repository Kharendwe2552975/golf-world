<?php
// join-session.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Database credentials
$host = "127.0.0.1";
$db = "d2556833";
$user = "s2556833";
$pass = "s2556833";

// Create a new MySQLi connection
$conn = mysqli_connect($host, $user, $pass, $db);

// Check connection
if (!$conn) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . mysqli_connect_error()]));
}

// Get session code and player name from POST request
$sessionCode = $_POST['sessionCode'];
$playerName = $_POST['playerName'];

// Check if the session exists in the database
$sessionCheckQuery = $conn->prepare("SELECT * FROM sessions WHERE session_code = ?");
$sessionCheckQuery->bind_param('s', $sessionCode);
$sessionCheckQuery->execute();
$sessionResult = $sessionCheckQuery->get_result();

// If the session exists
if ($sessionResult->num_rows > 0) {
    // Check if the player already exists in the session
    $playerCheckQuery = $conn->prepare("SELECT * FROM players WHERE session_code = ? AND player_name = ?");
    $playerCheckQuery->bind_param('ss', $sessionCode, $playerName);
    $playerCheckQuery->execute();
    $playerResult = $playerCheckQuery->get_result();

    // If player does not already exist, add them
    if ($playerResult->num_rows === 0) {
        $addPlayerQuery = $conn->prepare("INSERT INTO players (session_code, player_name, hits, ball_position_x, ball_position_y, ball_position_z) VALUES (?, ?, 0, 0, 0, 0)");
        $addPlayerQuery->bind_param('ss', $sessionCode, $playerName);
        $addPlayerQuery->execute();
    }

    // Return a success message
    echo json_encode(['status' => 'success', 'message' => 'Joined session successfully.']);
} else {
    // If the session does not exist, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}

// Close the MySQLi connection
$conn->close();
?>
