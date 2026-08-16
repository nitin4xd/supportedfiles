<?php

require_once "session.php";
require_once "db.php";

header("Content-Type: application/json");

if (
    !isset($_SESSION["user_id"]) ||
    $_SESSION["role"] !== "user"
) {

    echo json_encode([
        "success" => false,
        "message" => "User access required"
    ]);

    exit;
}

$id = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT username, role, created, last_login, active
     FROM users
     WHERE id = ?"
);

$stmt->bind_param("i", $id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);

    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "username" => $user["username"],
    "role" => $user["role"],
    "created" => $user["created"],
    "lastLogin" => $user["last_login"],
    "active" => (bool)$user["active"]
]);

$stmt->close();

?>