```php
<?php
include 'db_head.php';

$process_id = filter_input(INPUT_POST, 'process_id', FILTER_VALIDATE_INT);

if ($process_id === false || $process_id === null || $process_id <= 0) {
    exit("Invalid process ID");
}

try {

    // Attempt to delete the process
    $stmt = $conn->prepare("
        DELETE FROM process_wel_tbl
        WHERE final_process_id = ?
    ");

    $stmt->bind_param("i", $process_id);
    $stmt->execute();

    echo "ok";
    $stmt->close();

} catch (mysqli_sql_exception $e) {

    echo "<b>Delete Error:</b> " .
         htmlspecialchars($e->getMessage()) . "<br><br>";

    echo "<h3>Checking Foreign Key References</h3>";

    // Find all foreign keys in this database that reference
    // process_wel_tbl.final_process_id OR input_wel_parts.process_id
    $sql_fk = "
        SELECT
            TABLE_NAME,
            COLUMN_NAME,
            CONSTRAINT_NAME,
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND REFERENCED_TABLE_NAME IS NOT NULL
          AND (
                (
                    REFERENCED_TABLE_NAME = 'process_wel_tbl'
                    AND REFERENCED_COLUMN_NAME = 'final_process_id'
                )
                OR
                (
                    REFERENCED_TABLE_NAME = 'input_wel_parts'
                    AND REFERENCED_COLUMN_NAME = 'process_id'
                )
          )
        ORDER BY TABLE_NAME, CONSTRAINT_NAME
    ";

    $result_fk = $conn->query($sql_fk);

    $found = false;

    if ($result_fk) {

        while ($fk = $result_fk->fetch_assoc()) {

            $table_name = $fk['TABLE_NAME'];
            $column_name = $fk['COLUMN_NAME'];
            $constraint_name = $fk['CONSTRAINT_NAME'];
            $referenced_table = $fk['REFERENCED_TABLE_NAME'];
            $referenced_column = $fk['REFERENCED_COLUMN_NAME'];

            // Check whether this foreign key references the ID
            // being deleted.
            $quoted_table = '`' .
                str_replace('`', '``', $table_name) . '`';

            $quoted_column = '`' .
                str_replace('`', '``', $column_name) . '`';

            $sql_check = "
                SELECT *
                FROM $quoted_table
                WHERE $quoted_column = ?
            ";

            $stmt_check = $conn->prepare($sql_check);
            $stmt_check->bind_param("i", $process_id);
            $stmt_check->execute();

            $result_check = $stmt_check->get_result();

            if ($result_check->num_rows > 0) {

                $found = true;

                echo "<hr>";
                echo "<b>Referencing Table:</b> " .
                    htmlspecialchars($table_name) . "<br>";

                echo "<b>Referencing Column:</b> " .
                    htmlspecialchars($column_name) . "<br>";

                echo "<b>Foreign Key:</b> " .
                    htmlspecialchars($constraint_name) . "<br>";

                echo "<b>Referenced Table:</b> " .
                    htmlspecialchars($referenced_table) . "<br>";

                echo "<b>Referenced Column:</b> " .
                    htmlspecialchars($referenced_column) . "<br>";

                echo "<b>Matching Rows:</b><br>";

                while ($row = $result_check->fetch_assoc()) {

                    echo "<pre>" .
                        htmlspecialchars(
                            json_encode(
                                $row,
                                JSON_PRETTY_PRINT |
                                JSON_UNESCAPED_UNICODE
                            )
                        ) .
                        "</pre>";
                }
            }

            $stmt_check->close();
        }
    }

    if (!$found) {
        echo "No matching referencing rows found for the checked foreign keys.";
        echo "<br>Check the reported constraint and database schema.";
    }
}

$conn->close();
?>