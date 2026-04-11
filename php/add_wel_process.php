<?php
include 'db_head.php';



$process_id = test_input($_POST['process_id']);

function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}



// 1st get previous process id of deleted process_id
$previous_process_id = null;
$cat = '';
$output_part = null;
$get_previous_process_id_sql = "select previous_process_id,cat,output_part from process_wel_tbl where process_id = $process_id;";
$result_previous_process_id = $conn->query($get_previous_process_id_sql);

$row_previous_process_id = $result_previous_process_id->fetch_assoc();
$previous_process_id = $row_previous_process_id['previous_process_id'];
$cat = $row_previous_process_id['cat'];
$output_part = $row_previous_process_id['output_part'];


// insert new process id
$insert_process_sql = "insert into process_wel_tbl (previous_process_id,cat,output_part,process) values ($process_id,'$cat',$output_part,null);";
echo $insert_process_sql;
if ($conn->query($insert_process_sql) === TRUE) {
    $new_process_id = $conn->insert_id;
} else {
    echo "Error: " . $insert_process_sql . "<br>" . $conn->error;
    $conn->close();
    exit();
}

// update cat = '' and output_part = null for old process id
$update_old_process_sql = "update process_wel_tbl set cat = '', output_part = null where process_id = $process_id;";
if ($conn->query($update_old_process_sql) === TRUE) {
} else {
    echo "Error: " . $update_old_process_sql . "<br>" . $conn->error;
    $conn->close();
    exit();
}

// 2nd update all process which have previous_process_id = deleted process_id to previous_process_id = previous_process_id of deleted process_id
$update_previous_process_id_sql = "update process_wel_tbl set previous_process_id = $new_process_id where previous_process_id = $process_id;";
if ($conn->query($update_previous_process_id_sql) === TRUE) {

} else {
    echo "Error: " . $update_previous_process_id_sql . "<br>" . $conn->error;
}
// 3rd  also update input_wel_parts table pre_process_id
$update_input_wel_parts_sql = "update input_wel_parts set previous_process_id = $new_process_id where previous_process_id = $process_id;";
if ($conn->query($update_input_wel_parts_sql) === TRUE) {

} else {
    echo "Error: " . $update_input_wel_parts_sql . "<br>" . $conn->error;
}






$conn->close();
?>
