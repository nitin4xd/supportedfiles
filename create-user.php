<?php

require_once "admin-auth.php";
require_once "db.php";

header("Content-Type: application/json");

$username = trim($_POST["username"] ?? "");
$password = $_POST["password"] ?? "";

if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Username and password required"
    ]);

    exit;
}

/* Check username already exists */

$check = $conn->prepare(
    "SELECT id FROM users WHERE username = ? LIMIT 1"
);

$check->bind_param("s", $username);
$check->execute();

$result = $check->get_result();

if ($result->num_rows > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Username already exists"
    ]);

    exit;
}

/* Secure password */

$hash = password_hash(
    $password,
    PASSWORD_DEFAULT
);

/* Create user */

$stmt = $conn->prepare(
    "INSERT INTO users
    (username, password, role, created, active)
    VALUES (?, ?, 'user', NOW(), 1)"
);

$stmt->bind_param(
    "ss",
    $username,
    $hash
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "User Created"
    ]);

}else {

    echo json_encode([
        "success" => false,
        "message" => "User creation failed"
    ]);
}

?>