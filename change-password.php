<?php

require_once "admin-auth.php";
require_once "db.php";

header("Content-Type: application/json");

$oldPass = $_POST["oldPassword"] ?? "";
$newPass = $_POST["newPassword"] ?? "";

if ($oldPass === "" || $newPass === "") {

    echo json_encode([
        "success" => false,
        "message" => "Password required"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "SELECT id, password
     FROM users
     WHERE username = 'admin'
     LIMIT 1"
);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Admin account not found"
    ]);

    exit;
}

$admin = $result->fetch_assoc();

if (!password_verify($oldPass, $admin["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Current password is incorrect"
    ]);

    exit;
}

$newHash = password_hash(
    $newPass,
    PASSWORD_DEFAULT
);

$update = $conn->prepare(
    "UPDATE users
     SET password = ?
     WHERE id = ?"
);

$update->bind_param(
    "si",
    $newHash,
    $admin["id"]
);

if ($update->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Admin password updated successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Password update failed"
    ]);
}

?>