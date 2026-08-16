<?php

require_once "db.php";
require_once "session.php";

header("Content-Type: application/json");

if (
    !isset($_SESSION["user_id"]) ||
    $_SESSION["role"] !== "admin"
) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);

    exit;
}


/*
=================================
ALL USERS FROM USERS TABLE
=================================
*/

$result = $conn->query(
    "SELECT username
     FROM users
     WHERE username IS NOT NULL
       AND username != ''
     ORDER BY username ASC"
);


$users = [];


if ($result) {

    while ($row = $result->fetch_assoc()) {

        $users[] = $row["username"];

    }

}


echo json_encode([
    "success" => true,
    "users" => $users
]);


exit;
?>