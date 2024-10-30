<?php
// create-session.php

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

// Get player name from POST request
$playerName = $_POST['playerName'];

// Generate a unique session code (e.g., random string of 6 characters)
$sessionCode = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));

// Create a new session in the database
try {
    // Insert the new session into the `sessions` table
    $stmt = $conn->prepare("INSERT INTO sessions (session_code, current_level, game_state) VALUES (?, 1, 'waiting')");
    $stmt->bind_param('s', $sessionCode);
    $stmt->execute();

    // Insert the player into the `players` table
    $stmt = $conn->prepare("INSERT INTO players (session_code, player_name, hits, ball_position_x, ball_position_y, ball_position_z) 
                            VALUES (?, ?, 0, 0, 0, 0)");
    $stmt->bind_param('ss', $sessionCode, $playerName);
    $stmt->execute();

    // Return the session code to the player
    echo json_encode(['status' => 'success', 'sessionCode' => $sessionCode]);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

// Close the MySQLi connection
$conn->close();
?>
