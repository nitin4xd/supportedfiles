<?php

require_once "admin-auth.php";
require_once "db.php";

header("Content-Type: application/json");

$username = trim($_POST["username"] ?? "");

if ($username === "") {

    echo json_encode([
        "success" => false,
        "message" => "Username required"
    ]);

    exit;
}

if ($username === "admin") {

    echo json_encode([
        "success" => false,
        "message" => "Admin status cannot be changed"
    ]);

    exit;
}

/* Current status निकालें */

$stmt = $conn->prepare(
    "SELECT id, active
     FROM users
     WHERE username = ?
     AND role = 'user'
     LIMIT 1"
);

$stmt->bind_param("s", $username);
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

/* Status उल्टा करें */

$newStatus = $user["active"] ? 0 : 1;

$update = $conn->prepare(
    "UPDATE users
     SET active = ?
     WHERE id = ?"
);

$update->bind_param(
    "ii",
    $newStatus,
    $user["id"]
);

if ($update->execute()) {

    echo json_encode([
        "success" => true,
        "active" => (bool)$newStatus,
        "message" => $newStatus
            ? "User activated"
            : "User deactivated"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Status update failed"
    ]);
}

?>