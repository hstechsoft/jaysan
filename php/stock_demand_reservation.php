<?php
 include 'db_head.php';

 
 $demand_id = test_input($_GET['demand_id']);
 $work_order_qty = test_input($_GET['work_order_qty']);
 $godown = test_input($_GET['godown']);
 $dep = test_input($_GET['dep']);
 $sec = test_input($_GET['sec']);
 $emp_id = test_input($_GET['emp_id']);
 
$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

$godown_string = $godown.$dep.$sec;
echo $godown_string;
 
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);

  return $data;
}

try
{

// begin transaction
$conn->begin_transaction();
// get the raw materail for the demand id
$sql = "select iwp.input_part_id, iwp.previous_process_id,iwp.qty* $work_order_qty as required_qty from input_wel_parts iwp 
where iwp.process_id = (select process_id from demand where demand_id = $demand_id)";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    
    while($r = mysqli_fetch_assoc($result)) {
      
    $input_part_id = $r['input_part_id'];
    $previous_process_id = $r['previous_process_id'];
    $required_qty = $r['required_qty'];
echo "input_part_id: ".$input_part_id." previous_process_id: ".$previous_process_id." required_qty: ".$required_qty;

 $sql_demand_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
        left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.process_id = $previous_process_id";
    if($input_part_id>0)
      {
           $sql_demand_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
        left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.part_id = $input_part_id";
      }
      
        $total_holded_qty = 0;
        // get demand reservation for the input part id
           $demand_array = array();
        $result_demand_reservation = $conn->query($sql_demand_reservation);
        if ($result_demand_reservation->num_rows > 0) {
    
          while($r_demand_reservation = mysqli_fetch_assoc($result_demand_reservation)) {
            $godown_string_db = $r_demand_reservation['godown_string'];
            $demand_reserve_qty = $r_demand_reservation['reserve_qty'];
            $total_holded_qty += $demand_reserve_qty;
            $stock_id = $r_demand_reservation['stock_id'];
            $godown_id = $r_demand_reservation['godown'];
            $dep_id = $r_demand_reservation['dep'];
            $sec_id = $r_demand_reservation['sec'];
            $available_qty = $r_demand_reservation['available_qty'];
            $stock_reserve_id = $r_demand_reservation['stock_reserve_id'];
$same_godown = false;
if($godown_string_db == $godown_string)
            {
             $same_godown = true;
            }

            $demand_array[] = array(
              "stock_id" => $stock_id,
              "godown_id" => $godown_id,
              "dep_id" => $dep_id,
              "sec_id" => $sec_id,
              "godown_string" => $godown_string_db,
              "reserve_qty" => $demand_reserve_qty,
              "available_qty" => $available_qty,
              "same_godown" => $same_godown,
              "stock_reserve_id" => $stock_reserve_id
            );
         
          }


        } else {
          echo "not_reserved";
        }


 echo json_encode($demand_array);
 echo "total_holded_qty: ".$total_holded_qty;

// if holded qty > 0 need to release the holded qty  first relese same godown qty first then other godown qty
if($total_holded_qty > 0)
  {
    // 1st find same godown qty and release it
$same_godown = current(array_filter($demand_array, function ($item) {
    return $item['same_godown'] == true;
}));

$stock_to_be_released = min($required_qty, $total_holded_qty);

// if same godown qty found then release it
if($same_godown)
  {
    foreach($demand_array as $item)
    {
      if($item['same_godown'] == true && $stock_to_be_released > 0 && $item['reserve_qty'] > 0)
      {
        $stock_id = $item['stock_id'];
        $reserve_qty = $item['reserve_qty'];
        $stock_reserve_id = $item['stock_reserve_id'];
        $stock_to_be_released_same_godown = min($reserve_qty, $stock_to_be_released); 
        // release the reserve qty
        $sql_release = "update stock_reserve set reserve_qty = reserve_qty - $stock_to_be_released_same_godown where stock_reserve_id = $stock_reserve_id and reserve_type = 'demand'";
        if ($conn->query($sql_release) === TRUE) {
          echo "stock internally released successfully";
       $stock_to_be_released -= $stock_to_be_released_same_godown;
        } else {
         throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
print_r($same_godown);
  }

  echo "stock_to_be_released: ".$stock_to_be_released;
  // if stock to be released is still > 0 then release other godown qty

  if($stock_to_be_released > 0)
    {
      foreach($demand_array as $item)
      {
        if($item['same_godown'] == false && $stock_to_be_released > 0 && $item['reserve_qty'] > 0)
        {
          $stock_id = $item['stock_id'];
          $reserve_qty = $item['reserve_qty'];
          $stock_reserve_id = $item['stock_reserve_id'];
          $stock_to_be_released_other_godown = min($reserve_qty, $stock_to_be_released); 
          // release the reserve qty
          $sql_release = "update stock_reserve set reserve_qty = reserve_qty - $stock_to_be_released_other_godown where stock_reserve_id = $stock_reserve_id and reserve_type = 'demand'";
          if ($conn->query($sql_release) === TRUE) {
            echo "stock released externally successfully";
         $stock_to_be_released -= $stock_to_be_released_other_godown;
          } else {
            throw new Exception("Error updating record: " . $conn->error);
          }
        }



}

    }

    
  }

  // after realeasing now we reserve if same godown as work_order other as job_work_order
$stock_reservation_array = array();
$stock_to_be_reserved = $required_qty;

 $sql_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string from stock_reserve_view js 
         where    js.process_id = $previous_process_id";
    if($input_part_id>0)
      {
           $sql_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string from stock_reserve_view js 
         where    js.part_id = $input_part_id";
      }

$result_reservation = $conn->query($sql_reservation);
        if ($result_reservation->num_rows > 0) {
    
          while($r_reservation = mysqli_fetch_assoc($result_reservation)) {
           
            $stock_id = $r_reservation['stock_id']; 
            $available_qty = $r_reservation['available_qty'];
            $godown_string = $r_reservation['godown_string'];
            if($godown_string_db == $godown_string)
            {
             $same_godown = true;
            }

            $stock_reservation_array[] = array(
              "stock_id" => $stock_id,
              "available_qty" => $available_qty,
              "godown_string" => $godown_string,
              "same_godown" => $same_godown
            );

          }
    }

    

$same_godown = current(array_filter($stock_reservation_array, function ($item) {
    return $item['same_godown'] == true;
}));




if($same_godown)
  {
 foreach($stock_reservation_array as $item)
    {
      if($item['same_godown'] == true && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
      {
        $stock_id = $item['stock_id'];
        $available_qty = $item['available_qty'];
   
        $stock_to_be_reserved_same_godown = min($available_qty, $stock_to_be_reserved); 
        // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_godown
        $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_same_godown,'work_order') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_godown";
        if ($conn->query($sql_release) === TRUE) {
          echo "stock internally reserved successfully";
       $stock_to_be_reserved -= $stock_to_be_reserved_same_godown;
        } else {
          throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
  }


  foreach($stock_reservation_array as $item)
    {
      if($item['same_godown'] == false && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
      {
        $stock_id = $item['stock_id'];
        $available_qty = $item['available_qty'];
        
        $stock_to_be_reserved_other_godown = min($available_qty, $stock_to_be_reserved); 
        // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_other_godown
        $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_other_godown,'job_work_order') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_other_godown";
        if ($conn->query($sql_release) === TRUE) {
          echo "stock externally reserved successfully";
       $stock_to_be_reserved -= $stock_to_be_reserved_other_godown;
        } else {
          throw new Exception("Error updating record: " . $conn->error);
        }
      }


    }
    }
    
} else {
throw new Exception("No raw material found for the demand id: " . $demand_id);
}

// work_order_id	work_order_no	demand_id	work_order_type	godown	dep	sec	qty	completed_qty	status	due_date	remarks	created_by	created_date	updated_date	

// insert work order record
$sql_insert_work_order = "insert into work_order (demand_id,work_order_type,godown,dep,sec,qty,status,created_by) values ($demand_id,'INTERNAL',$godown,$dep,$sec,$work_order_qty,'open',$emp_id)";
if ($conn->query($sql_insert_work_order) === TRUE) {
  echo "New work order created successfully";
} else {
  throw new Exception("Error inserting work order: " . $conn->error);
}
$conn->commit();

}
catch (Exception $e) {
  // Rollback the transaction if an exception occurs
  $conn->rollback();
  echo "Error: " . $e->getMessage();
}
$conn->close();



 ?>


