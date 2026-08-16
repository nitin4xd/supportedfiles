<?php

require_once "admin-auth.php";

header("Content-Type: application/json");

include "db.php";

$sql = "DELETE FROM activity_logs";

if($conn->query($sql)){

    echo json_encode([
        "success" => true,
        "message" => "All logs cleared successfully"
    ]);

}else{

    echo json_encode([
        "success" => false,
        "message" => "Logs clear नहीं हुए"
    ]);

}

?>