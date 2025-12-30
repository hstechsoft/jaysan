
<?php
 include 'php/db_head.php';
 

 



$sql ="SELECT max(pgid) as insert_key FROM process_group";
$pgid = 0;
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
       $pgid = $row["insert_key"];
    }
}
$pgid = $pgid + 1;

if($_FILES['file']['name'] != ''){
  
  
    $dirname = $pgid;
    $target_path = "attachment/nesting/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }

    echo $target_path;
        $target_path = $target_path ."nesting.pdf"; 

        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo "The file ".  basename( $_FILES['file']['name']). " has been uploaded";

        } else{
           
        }

        
}

$conn->close();

 
?>
