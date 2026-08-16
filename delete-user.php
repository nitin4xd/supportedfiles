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

/* Admin को delete नहीं करने देंगे */

if ($username === "admin") {

    echo json_encode([
        "success" => false,
        "message" => "Admin cannot be deleted"
    ]);

    exit;
}

/* User delete करें */

$stmt = $conn->prepare(
    "DELETE FROM users
     WHERE username = ?
     AND role = 'user'"
);

$stmt->bind_param("s", $username);

if (!$stmt->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "Delete failed"
    ]);

    exit;
}

if ($stmt->affected_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "message" => "User deleted successfully"
]);

?>