<?php
// get-game-state.php

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

// Get session code from the GET request
$sessionCode = $_GET['sessionCode'];

// Check if the session exists
$sessionQuery = $conn->prepare("SELECT * FROM sessions WHERE session_code = ?");
$sessionQuery->bind_param('s', $sessionCode);
$sessionQuery->execute();
$sessionResult = $sessionQuery->get_result();

// If the session exists
if ($sessionResult->num_rows > 0) {
    $sessionData = $sessionResult->fetch_assoc();

    // Fetch players in this session
    $playersQuery = $conn->prepare("SELECT player_name, hits, ball_position_x, ball_position_y, ball_position_z FROM players WHERE session_code = ?");
    $playersQuery->bind_param('s', $sessionCode);
    $playersQuery->execute();
    $playersResult = $playersQuery->get_result();

    // Collect players' data
    $players = [];
    while ($player = $playersResult->fetch_assoc()) {
        $players[$player['player_name']] = [
            'hits' => $player['hits'],
            'ballPosition' => [
                'x' => $player['ball_position_x'],
                'y' => $player['ball_position_y'],
                'z' => $player['ball_position_z']
            ]
        ];
    }

    // Return the game state for the session
    echo json_encode([
        'status' => 'success',
        'state' => [
            'sessionCode' => $sessionData['session_code'],
            'currentLevel' => $sessionData['current_level'],
            'gameState' => $sessionData['game_state'],
            'players' => $players
        ]
    ]);
} else {
    // If the session does not exist, return an error
    echo json_encode(['status' => 'error', 'message' => 'Invalid session code.']);
}

// Close the MySQLi connection
$conn->close();
?>
