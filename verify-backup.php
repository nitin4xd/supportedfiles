<?php

require_once "admin-auth.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "POST request required"
    ]);

    exit;
}

if (!isset($_FILES["backup"])) {

    echo json_encode([
        "success" => false,
        "message" => "Backup file required"
    ]);

    exit;
}

$file = $_FILES["backup"];

if ($file["error"] !== UPLOAD_ERR_OK) {

    echo json_encode([
        "success" => false,
        "message" => "File upload failed"
    ]);

    exit;
}

if ($file["size"] <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Backup file is empty"
    ]);

    exit;
}

$content = file_get_contents($file["tmp_name"]);

if ($content === false) {

    echo json_encode([
        "success" => false,
        "message" => "Backup file could not be read"
    ]);

    exit;
}

/* Check required tables */

$hasUsers =
    preg_match(
        '/(?:CREATE TABLE|DROP TABLE IF EXISTS)\s+`?users`?/i',
        $content
    );

$hasActivityLogs =
    preg_match(
        '/(?:CREATE TABLE|DROP TABLE IF EXISTS)\s+`?activity_logs`?/i',
        $content
    );

if (!$hasUsers || !$hasActivityLogs) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid backup: users or activity_logs table missing"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Backup verified successfully",
    "usersTable" => true,
    "activityLogsTable" => true,
    "fileSize" => $file["size"]
]);

?>