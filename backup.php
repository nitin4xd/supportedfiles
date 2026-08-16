<?php

require_once "admin-auth.php";
require_once "db.php";

/* Backup Activity Log */

$username = $_SESSION["username"] ?? "admin";
$activity = "Database backup downloaded";

$log = $conn->prepare(
    "INSERT INTO activity_logs
    (username, activity, activity_time)
    VALUES (?, ?, NOW())"
);

$log->bind_param(
    "ss",
    $username,
    $activity
);

$log->execute();
$log->close();

/* Backup Activity Log Close */

header("Content-Type: application/sql");

$filename = "admin_panel_backup_" . date("Y-m-d_H-i-s") . ".sql";

header("Content-Disposition: attachment; filename=\"$filename\"");

echo "-- Admin Panel Database Backup\n";
echo "-- Created: " . date("Y-m-d H:i:s") . "\n\n";

$tables = ["users", "activity_logs"];

foreach ($tables as $table) {

    echo "-- Table: $table\n";

    $create = $conn->query(
        "SHOW CREATE TABLE `$table`"
    );

    if ($create) {

        $row = $create->fetch_assoc();

        echo "DROP TABLE IF EXISTS `$table`;\n";
        echo $row["Create Table"] . ";\n\n";
    }

    $result = $conn->query(
        "SELECT * FROM `$table`"
    );

    if ($result && $result->num_rows > 0) {

        $fields = $result->fetch_fields();

        while ($row = $result->fetch_assoc()) {

            $columns = [];
            $values = [];

            foreach ($fields as $field) {

                $columns[] =
                    "`" . $field->name . "`";

                if ($row[$field->name] === null) {

                    $values[] = "NULL";

                } else {

                    $values[] =
                        "'" .
                        $conn->real_escape_string(
                            $row[$field->name]
                        ) .
                        "'";
                }
            }

            echo "INSERT INTO `$table` (";
            echo implode(", ", $columns);
            echo ") VALUES (";
            echo implode(", ", $values);
            echo ");\n";
        }

        echo "\n";
    }
}

exit;

?>