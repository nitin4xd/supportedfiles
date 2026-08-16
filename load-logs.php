<?php

require_once "db.php";
require_once "session.php";

header("Content-Type: application/json");


/* =========================
   ADMIN CHECK
========================= */

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


/* =========================
   PAGINATION
========================= */

$limit = 20;

$page = isset($_GET["page"])
    ? intval($_GET["page"])
    : 1;

if ($page < 1) {
    $page = 1;
}


/* =========================
   FILTER VALUES
========================= */

$date = isset($_GET["date"])
    ? trim($_GET["date"])
    : "";

$username = isset($_GET["username"])
    ? trim($_GET["username"])
    : "";


/* =========================
   BUILD WHERE
========================= */

$conditions = [];

$params = [];

$types = "";


/* DATE */

if ($date !== "") {

    $conditions[] =
        "DATE(activity_time) = ?";

    $params[] = $date;

    $types .= "s";
}


/* USERNAME */

if ($username !== "") {

    $conditions[] =
        "username = ?";

    $params[] = $username;

    $types .= "s";
}


/* WHERE */

$where = "";
$params = [];
$types = "";

$conditions = [];


/* DATE FILTER */

if ($date !== "") {

    $conditions[] =
        "DATE(activity_time) = ?";

    $params[] = $date;

    $types .= "s";
}


/* USERNAME FILTER */

if ($username !== "" && $username !== "all") {

    $conditions[] =
        "LOWER(username) = LOWER(?)";

    $params[] = $username;

    $types .= "s";
}


/* WHERE बनाएं */

if (!empty($conditions)) {

    $where =
        " WHERE " .
        implode(
            " AND ",
            $conditions
        );

}


/* =========================
   COUNT RECORDS
========================= */

$countSql =
    "SELECT COUNT(*) AS total
     FROM activity_logs" .
    $where;


$countStmt =
    $conn->prepare($countSql);


if (!$countStmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}


if (!empty($params)) {

    $countStmt->bind_param(
        $types,
        ...$params
    );

}


$countStmt->execute();


$countResult =
    $countStmt->get_result();


$countRow =
    $countResult->fetch_assoc();


$totalRecords =
    intval($countRow["total"]);


$countStmt->close();


/* =========================
   TOTAL PAGES
========================= */

$totalPages =
    max(
        1,
        (int)ceil(
            $totalRecords / $limit
        )
    );


/* =========================
   PAGE LIMIT
========================= */

if ($page > $totalPages) {

    $page = $totalPages;

}


/* =========================
   OFFSET
========================= */

$offset =
    ($page - 1) * $limit;


/* =========================
   LOAD LOGS
========================= */

$sql =
    "SELECT
        username,
        activity,
        activity_time
     FROM activity_logs" .
    $where .
    " ORDER BY id DESC
      LIMIT ?, ?";


$stmt =
    $conn->prepare($sql);


if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}


/* =========================
   BIND PARAMETERS
========================= */

if (!empty($params)) {

    $bindTypes =
        $types . "ii";

    $bindValues =
        array_merge(
            $params,
            [
                $offset,
                $limit
            ]
        );

    $stmt->bind_param(
        $bindTypes,
        ...$bindValues
    );

}
else {

    $stmt->bind_param(
        "ii",
        $offset,
        $limit
    );

}


/* =========================
   EXECUTE
========================= */

$stmt->execute();


$result =
    $stmt->get_result();


/* =========================
   LOG ARRAY
========================= */

$logs = [];


while (
    $row =
    $result->fetch_assoc()
) {

    $logs[] = [

        "username" =>
            $row["username"],

        "activity" =>
            $row["activity"],

        "time" =>
            $row["activity_time"]

    ];

}


$stmt->close();


/* =========================
   RESPONSE
========================= */

echo json_encode([

    "success" => true,

    "logs" => $logs,

    "currentPage" => $page,

    "totalPages" =>
        intval($totalPages),

    "totalRecords" =>
        $totalRecords,

    "limit" =>
        $limit,

    "date" =>
        $date,

    "username" =>
        $username

]);


exit;

?>