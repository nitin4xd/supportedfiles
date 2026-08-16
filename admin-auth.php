<?php

session_start();

header("Content-Type: application/json");

if(
    !isset($_SESSION["user_id"]) ||
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
){

    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Admin access required"
    ]);

    exit;
}

?>