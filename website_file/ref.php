
<?php
// if( isset( $_POST["Upload"] ) )
// {
//     $target_path = "uploads/";

//     $target_path = $target_path . basename( $_FILES['filename']['name']); 
// echo $target_path;
//     if(move_uploaded_file($_FILES['filename']['tmp_name'], $target_path)) {
//         echo "The file ".  basename( $_FILES['filename']['name']). " has been uploaded";
//     } else{
//         echo "There was an error uploading the file, please try again!";
//     }
// }

if($_FILES['file']['name'] != ''){
    $target_path = "php/upload/";

        $target_path = $target_path . basename( $_FILES['file']['name']); 
    echo $target_path;
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            echo "The file ".  basename( $_FILES['file']['name']). " has been uploaded";
        } else{
            echo "There was an error uploading the file, please try again!";
        }
}
?>
