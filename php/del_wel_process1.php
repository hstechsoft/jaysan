<?php
include 'db_head.php';



$process_id =  $_POST['process_id'];
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);

return $data;
}

// Delete process
$sql_delete = "DELETE FROM process_wel_tbl
               WHERE final_process_id = $process_id";

if ($conn->query($sql_delete) === TRUE) {

    echo "ok";

} else {

    echo "Delete Error: " . $conn->error . "<br>";

    // Get foreign keys referencing process_wel_tbl.final_process_id
    $sql_fk = "
        SELECT
            TABLE_NAME,
            COLUMN_NAME,
            CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
          AND REFERENCED_TABLE_NAME = 'process_wel_tbl'
          AND REFERENCED_COLUMN_NAME = 'final_process_id'
    ";

    $result_fk = $conn->query($sql_fk);

    if ($result_fk && $result_fk->num_rows > 0) {

        while ($fk = $result_fk->fetch_assoc()) {

            $table_name = $fk['TABLE_NAME'];
            $column_name = $fk['COLUMN_NAME'];
            $constraint_name = $fk['CONSTRAINT_NAME'];

            // Quote identifiers safely
            $quoted_table = '`' . str_replace('`', '``', $table_name) . '`';
            $quoted_column = '`' . str_replace('`', '``', $column_name) . '`';

            // Find referencing rows
            $sql_check = "
                SELECT *
                FROM $quoted_table
                WHERE $quoted_column = ?
            ";

            $stmt = $conn->prepare($sql_check);

            if (!$stmt) {
                echo "Check Error: " . $conn->error . "<br>";
                continue;
            }

            $stmt->bind_param("i", $process_id);
            $stmt->execute();

            $result_check = $stmt->get_result();

            if ($result_check && $result_check->num_rows > 0) {

                echo "<hr>";
                echo "<b>Referencing Table:</b> " .
                     htmlspecialchars($table_name) . "<br>";

                echo "<b>Referencing Column:</b> " .
                     htmlspecialchars($column_name) . "<br>";

                echo "<b>Foreign Key:</b> " .
                     htmlspecialchars($constraint_name) . "<br>";

                echo "<b>Matching Rows:</b><br>";

                while ($row = $result_check->fetch_assoc()) {
                    echo "<pre>" .
                         htmlspecialchars(
                             json_encode(
                                 $row,
                                 JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                             )
                         ) .
                         "</pre>";
                }
            }

            $stmt->close();
        }

    } else {
        echo "No foreign keys found referencing this column.";
    }
}





$conn->close();
?>
