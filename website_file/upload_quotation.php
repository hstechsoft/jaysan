
<?php
 include 'php/db_head.php';
 

 $upload_type = $_POST['upload_type'];
 $qid = $_POST['qid'];
echo $upload_type;

if($_FILES['file']['name'] != ''){
  
  
    $dirname = $qid;
    $target_path = "rate_quotation/" . $dirname . "/" ;

    if (file_exists($target_path)) {
       
    } else {
        mkdir($target_path, 0777, true);
      
       
    }
        $target_path = $target_path .  $upload_type.".pdf"; 

        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            if( $upload_type  == "quotation")
            $sql = "UPDATE rate_quotation SET  quotation_addr =  '$target_path' WHERE rqid = $qid";
            else if( $upload_type  == "spec")
            $sql = "UPDATE rate_quotation SET  spec_addr =  '$target_path' WHERE rqid = $qid";
  if ( $conn->query($sql) === TRUE) {
  } 
   else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

        } else{
           
        }

        
}

$conn->close();

 
?>
