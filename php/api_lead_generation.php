<?php
 include 'db_head.php';
 $start_time = date("Y-m-d");
 


 $date = new DateTime(); // For today/now, don't pass an arg.
 $date->modify("+1 day");
 $end_time = $date->format("Y-m-d");


//  $start_time = "2023-05-02";
//  $end_time = "2023-05-03";

 // $url = "https://www.tradeindia.com/utils/my_inquiry.html?userid=13844654&profile_id=28177097&key=2227d27668f75ad699c3013c358148eb&from_date=".$start_time."&to_date=".$end_time;

 $url = "https://www.tradeindia.com/utils/my_inquiry.html?userid=13844654&profile_id=28177097&key=2227d27668f75ad699c3013c358148eb&from_date=".$start_time."&to_date=".$end_time;
 $result = file_get_contents( $url);;
 

   echo $result. "<br>"; 
 
 //  echo $end_time;
 
 $obj = (array)json_decode($result ,true);
 
 
 foreach ($obj as $k=>$v) {
 
     
     $generated_date = $v["generated_date"];
     $sender_mobile= $v["sender_mobile"];
     $sender_mobile = substr($sender_mobile, strpos($sender_mobile, "+91") + 3);

     $subject= $v["subject"];
     $sender_state= $v["sender_state"];
     $generated= $v["generated"];
     $sender_name= $v["sender_name"];
     $sender_city= $v["sender_city"];
     $message= $v["message"];
     $query_id= $v["rfi_id"];
     $message = str_replace("'","", $message);

$sql = "INSERT IGNORE INTO `api` (`sender_mobile`, `subject`, `sender_state`, `generated_date`, `generated`, `sender_name`, `sender_city`, `message`,query_id,lead_source,status) VALUES ('$sender_mobile', '$subject', '$sender_state', '$generated_date', '$generated', '$sender_name', '$sender_city', '$message', '$query_id','tradeindia','new');";
  
  if ($conn->query($sql) === TRUE) {
   
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

   }

   $key_file = 'glusr_crm_key.txt';
   if (file_exists($key_file)) {
       $glusr_crm_key = trim(file_get_contents($key_file));
   } else {
       die("Key file not found!");
   }
   $url = "https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=" . $glusr_crm_key . "&start_time=" . $start_time . "&end_time=" . $end_time;

//  $url = "https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=mR27FLtt5H/DT/ep4nOC7luKoFbBlDFk&start_time=".$start_time."&end_time=".$end_time;
 
// $url = "http://192.168.1.150/soft/php/txt.xml";

$result = file_get_contents( $url);;
 
echo $result."<br><br>";

//  echo $end_time;

$obj1 = json_decode($result);

echo $obj1->STATUS."<br><br>";
$obj = ($obj1->RESPONSE);
$obj = ($obj);

foreach ($obj as $k) {
 

    
    $generated_date = $k->QUERY_TIME;
    $sender_mobile= $k->SENDER_MOBILE;
       
    $sender_mobile = substr($sender_mobile, strpos($sender_mobile, "-") + 1);    


    $subject= $k->SUBJECT;
    $sender_state= $k->SENDER_STATE;
    $generated= $k->UNIQUE_QUERY_ID;
    $sender_name= $k->SENDER_NAME;
    $sender_city= $k->SENDER_CITY;
    $message= $k->QUERY_MESSAGE;
    $query_id= $k->UNIQUE_QUERY_ID;
   
    $message = str_replace("'","", $message);
$sql = "INSERT IGNORE INTO `api` (`sender_mobile`, `subject`, `sender_state`, `generated_date`, `generated`, `sender_name`, `sender_city`, `message`,query_id,lead_source,status) VALUES ('$sender_mobile', '$subject', '$sender_state', '$generated_date', '$generated', '$sender_name', '$sender_city', '$message', '$query_id','indiamart','new');";
 
 if ($conn->query($sql) === TRUE) {
  
 } else {
   echo "Error: " . $sql . "<br>" . $conn->error;
 }
 

  }
 
 
// function test_input($data) {
// $data = trim($data);
// $data = stripslashes($data);
// $data = htmlspecialchars($data);
// $data = "'".$data."'";
// return $data;
// }


// $sql = "SELECT * FROM ref ";

// $result = $conn->query($sql);

// if ($result->num_rows > 0) {
//     $rows = array();
//     while($r = mysqli_fetch_assoc($result)) {
//         $rows[] = $r;
//     }
//     print json_encode($rows);
// } else {
//   echo "0 result";
// }
// $conn->close();
$conn->close();
 ?>


