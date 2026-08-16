<?php

require_once "db.php";
require_once "session.php";

header("Content-Type: application/json");

/* Logged-in username */

$username = $_SESSION["username"] ?? "";

if ($username !== "") {

    $activity = $username . " logged out";

    $stmt = $conn->prepare(
        "INSERT INTO activity_logs
        (username, activity, activity_time)
        VALUES (?, ?, NOW())"
    );

    $stmt->bind_param(
        "ss",
        $username,
        $activity
    );

    $stmt->execute();

    $stmt->close();
}

/* Logout */

$_SESSION = [];

session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);

?>