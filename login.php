<?php

require_once "db.php";
require_once "session.php";

header("Content-Type: application/json");

$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";

if ($username === "" || $password === "") {

    echo json_encode([
        "success" => false,
        "message" => "Username and Password required"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "SELECT id, username, password, role, active
     FROM users
     WHERE username = ?
     LIMIT 1"
);

$stmt->bind_param("s", $username);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid Username or Password"
    ]);

    exit;
}

$user = $result->fetch_assoc();

if ($user["active"] != 1) {

    echo json_encode([
        "success" => false,
        "message" => "User account is inactive"
    ]);

    exit;
}

if (!password_verify($password, $user["password"])) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid Username or Password"
    ]);

    exit;
}

// Update last login time
$update = $conn->prepare(
    "UPDATE users SET last_login = NOW() WHERE id = ?"
);

$update->bind_param("i", $user["id"]);
$update->execute();
$update->close();

session_regenerate_id(true);

$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $user["username"];
$_SESSION["role"] = $user["role"];

echo json_encode([

    "success" => true,

    "id" => $user["id"],

    "username" => $user["username"],

    "role" => $user["role"]
]);

?>