<?php

require_once "db.php";

header("Content-Type: application/json");

$result = $conn->query(
    "SELECT
        id,
        username,
        role,
        created,
        last_login,
        active
     FROM users
     WHERE role = 'user'
     ORDER BY id DESC"
);

$users = [];

while ($row = $result->fetch_assoc()) {

    $users[] = [
        "id" => $row["id"],
        "username" => $row["username"],
        "role" => $row["role"],
        "created" => $row["created"],
        "lastLogin" => $row["last_login"] ?? "Never",
        "active" => (bool)$row["active"]
    ];
}

echo json_encode([
    "success" => true,
    "users" => $users
]);

?>