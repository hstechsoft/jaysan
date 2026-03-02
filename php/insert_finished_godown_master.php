<?php
 include 'db_head.php';
$PartsData = $_POST['PartsData'];
 $part_id = test_input($_POST['part_id']);


function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if (count($PartsData) === 0) {
  echo "No parts data provided";
  exit;
}

 foreach ($PartsData as $partdata)
  {

    $time_taken = test_input($partdata['time_taken']);
    $godown_id = test_input($partdata['godown_id']);
    $category = test_input($partdata['category']);
    $sql = "INSERT INTO finished_godown_master ( part_id,time_taken,godown_id,category) VALUES ($part_id,$time_taken,$godown_id,$category)";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  }
 



    echo "ok";
$conn->close();

 ?>


