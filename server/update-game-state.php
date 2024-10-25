<?php
// update-game-state.php

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
$pass = "sd2556833";

// Create a new MySQLi connection
$conn = mysqli_connect($host, $user, $pass, $db);

// Check connection
if (!$conn) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . mysqli_connect_error()]));
}

// Get session code, player name, ball position, hits, and current level from POST request
$sessionCode = $_POST['sessionCode'];
$playerName = $_POST['playerName'];
$ballPosition = json_decode($_POST['ballPosition'], true);  // Expecting [x, y, z] coordinates
$hits = $_POST['hits'];  // Number of hits made by the player
$currentLevel = $_POST['currentLevel']; // Current level of the game

// Verify that the session exists
$sessionQuery = $conn->prepare("SELECT game_state FROM sessions WHERE session_code = ?");
$sessionQuery->bind_param('s', $sessionCode);
$sessionQuery->execute();
$sessionResult = $sessionQuery->get_result();

if ($sessionResult->num_rows > 0) {
    $sessionData = $sessionResult->fetch_assoc();

    // Update ball position and hits for the player
    $updatePlayerQuery = $conn->prepare("
        UPDATE players 
        SET hits = ?, ball_position_x = ?, ball_position_y = ?, ball_position_z = ? 
        WHERE session_code = ? AND player_name = ?
    ");
    $updatePlayerQuery->bind_param('idddss', $hits, $ballPosition[0], $ballPosition[1], $ballPosition[2], $sessionCode, $playerName);
    $updatePlayerQuery->execute();

    // Optionally update the current level
    if (!empty($currentLevel)) {
        $updateLevelQuery = $conn->prepare("UPDATE sessions SET current_level = ? WHERE session_code = ?");
        $updateLevelQuery->bind_param('is', $currentLevel, $sessionCode);
        $updateLevelQuery->execute();
    }

    // Change game state to 'ongoing' if it was 'waiting'
    if ($sessionData['game_state'] === 'waiting') {
        $updateGameStateQuery = $conn->prepare("UPDATE sessions SET game_state = 'ongoing' WHERE session_code = ?");
        $updateGameStateQuery->bind_param('s', $sessionCode);
        $updateGameStateQuery->execute();
    }

    echo json_encode(['status' => 'success', 'message' => 'Game state updated.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}

// Close the MySQLi connection
$conn->close();
?>
