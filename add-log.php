<?php

require_once "db.php";
require_once "session.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$activity = trim($data["activity"] ?? "");

if ($activity === "") {

    echo json_encode([
        "success" => false,
        "message" => "Activity required"
    ]);

    exit;
}

$username = $_SESSION["username"];

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

if ($stmt->execute()) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Log save failed"
    ]);

}

$stmt->close();

?>