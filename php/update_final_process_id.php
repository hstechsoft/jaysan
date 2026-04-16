<?php






function update_final_id(mysqli $conn, int $final_id)
{

    $current_id = $final_id;

    while ($current_id != null) {

        $conn->query("UPDATE process_wel_tbl 
                      SET final_process_id = '$final_id' 
                      WHERE process_id = '$current_id'");

        $res = $conn->query("SELECT previous_process_id 
                             FROM process_wel_tbl 
                             WHERE process_id = '$current_id'");

        $row = $res->fetch_assoc();
        $current_id = $row['previous_process_id'];
    }
}

?>
