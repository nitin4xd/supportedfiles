<?php

$url = "http://localhost/Admin-User%20Dashboard/login.php";

$data = [
    "username" => "admin",
    "password" => "admin123"
];

$options = [
    "http" => [
        "header"  => "Content-Type: application/x-www-form-urlencoded",
        "method"  => "POST",
        "content" => http_build_query($data)
    ]
];

$context = stream_context_create($options);

$result = file_get_contents($url, false, $context);

echo $result;

?>