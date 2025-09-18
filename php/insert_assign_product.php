<?php
 include 'db_head.php';

 $opid = test_input($_GET['opid']);
$qty = ($_GET['qty']);
$selected_type = test_input($_GET['selected_type']);
$selected_date = test_input($_GET['selected_date']);
$is_emergency = test_input($_GET['is_emergency']);
$des = test_input($_GET['des']);
$godown = test_input($_GET['godown']);



 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}

if($selected_type != "'Production'")
{

for ($i = 1; $i <= $qty; $i++) {
  
  $sql = "INSERT INTO assign_product (opid,qty,assign_type,dated,finished_details,emergency_order,godown) VALUES ($opid,1,$selected_type,$selected_date,$des,$is_emergency,$godown)";

  if ($conn->query($sql) === TRUE) {

  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}
}


else
{
    for ($i = 0; $i < $qty; $i++) {
   
        $last_line_no = 0;
            $get_last_id = "SELECT line_no  FROM `assign_product` WHERE dated >= $selected_date and assign_type = 'Production'  ORDER by line_no ASC LIMIT 1";
        
        
        
            $result = $conn->query($get_last_id);
            if ($result && $result->num_rows > 0) {
                $r = $result->fetch_assoc();
                $last_line_no =  $r["line_no"]; // Append to array
               
            } else {
            //   echo "no line no";
            }
        
        
            if( $last_line_no > 0)
            {
              $sql_update_line = "UPDATE assign_product SET  line_no =  line_no + 1  where line_no >=  $last_line_no and assign_type = 'Production'";
        
        
          
              if ($conn->query($sql_update_line) === TRUE) {
               
              } else {
                echo "Error: " . $sql_update_line . "<br>" . $conn->error;
              }
            }
          
        
            $get_max_line_no = 0;
        if($last_line_no == 0)
        {
          $get_max_last_id = "SELECT COALESCE(MAX(line_no), 0) + 1 as max_line_no FROM assign_product";
        
          $result = $conn->query($get_max_last_id);
          if ($result && $result->num_rows > 0) {
              $r = $result->fetch_assoc();
              $get_max_line_no  =  $r["max_line_no"]; // Append to array
              
          } else {
           
          }
        
     
        //   $sql_insert= "INSERT INTO  assign_product  (opid, emergency_order, assign_type, line_no,qty,dated )
        //     VALUES ($opid_a[$i],$emergency_order[$i],'Production',$get_max_line_no ,'1','$selected_date')";
    
    
         $sql_insert = "INSERT INTO assign_product (opid,qty,assign_type,dated,finished_details,emergency_order,line_no,godown) VALUES ($opid,1,$selected_type,$selected_date,$des,$is_emergency,$get_max_line_no,$godown)";
    
        }
           
             else
            //  $sql_insert= "INSERT INTO  assign_product  ( ass_id, opid, emergency_order, assign_type, line_no,qty,dated )
            // VALUES ($ass_id[$i],$opid_a[$i],$emergency_order[$i],'Production','$last_line_no','1','$selected_date')";
    
    $sql_insert = "INSERT INTO assign_product (opid,qty,assign_type,dated,finished_details,emergency_order,line_no) VALUES ($opid,1,$selected_type,$selected_date,$des,$is_emergency,$last_line_no )";
              
               if ($conn->query($sql_insert) === TRUE) {
               
               } 
               else {
                 echo "Error: " . $sql_insert . "<br>" . $conn->error;
               }
        }
}

$sql_update =  "update sales_order_form set sales_order_form.approve_sts = (SELECT if(assign.required_qty > assign.assign_qty, 3 ,1) as res from (SELECT
    (
    SELECT
       ifnull (SUM(assign_product.qty),0)
    FROM
        assign_product
    WHERE
        assign_product.opid IN(
       SELECT sales_order_product.opid from sales_order_product WHERE sales_order_product.oid = (SELECT sales_order_product.oid from sales_order_product WHERE sales_order_product.opid = $opid)
    )
)  as assign_qty,
sales_order_form.oid,
sales_order_form.required_qty
FROM
    sales_order_form
WHERE
    sales_order_form.oid =(
    SELECT
        sales_order_product.oid
    FROM
        sales_order_product
    WHERE
        sales_order_product.opid = $opid
)
              ) as  assign) WHERE sales_order_form.oid = (SELECT sales_order_product.oid from sales_order_product WHERE sales_order_product.opid = $opid) ";

if ($conn->query($sql_update) === TRUE) {
 echo "ok";
} else {
  echo "Error: " . $sql_update . "<br>" . $conn->error;
}


$conn->close();

 ?>


