<?php

require_once "admin-auth.php";
require_once "db.php";

header("Content-Type: application/json");

$username = trim($_POST["username"] ?? "");
$newPass  = $_POST["newPassword"] ?? "";

if ($username === "" || $newPass === "") {

    echo json_encode([
        "success" => false,
        "message" => "Username and new password required"
    ]);

    exit;
}

/* Admin का password इस function से नहीं बदलेंगे */

if ($username === "admin") {

    echo json_encode([
        "success" => false,
        "message" => "Use Admin Password Change for admin"
    ]);

    exit;
}

/* User मौजूद है या नहीं */

$check = $conn->prepare(
    "SELECT id
     FROM users
     WHERE username = ?
     AND role = 'user'
     LIMIT 1"
);

$check->bind_param("s", $username);
$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);

    exit;
}

$user = $result->fetch_assoc();

/* New password को secure hash करें */

$newHash = password_hash(
    $newPass,
    PASSWORD_DEFAULT
);

/* Database में password update करें */

$update = $conn->prepare(
    "UPDATE users
     SET password = ?
     WHERE id = ?"
);

$update->bind_param(
    "si",
    $newHash,
    $user["id"]
);

if ($update->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "User password updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Password update failed"
    ]);
}

?>