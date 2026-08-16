<?php

require_once "session.php";
require_once "db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "loggedIn" => false
    ]);

    exit;
}

$id = $_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT username, role, active
     FROM users
     WHERE id = ?
     LIMIT 1"
);

$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    session_unset();
    session_destroy();

    echo json_encode([
        "success" => false,
        "loggedIn" => false,
        "message" => "Account not found"
    ]);

    exit;
}

$user = $result->fetch_assoc();

/* User deactivate हो चुका है */

if (
    $user["role"] === "user" &&
    $user["active"] != 1
) {

    session_unset();
    session_destroy();

    echo json_encode([
        "success" => false,
        "loggedIn" => false,
        "message" => "Account is inactive"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "loggedIn" => true,
    "user_id" => $user["id"] ?? $id,
    "username" => $user["username"],
    "role" => $user["role"],
    "active" => (bool)$user["active"]
]);

$stmt->close();

?>