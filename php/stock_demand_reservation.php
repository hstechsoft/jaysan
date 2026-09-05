<?php
 include 'db_head.php';

 
//  $demand_id = test_input($_GET['demand_id']);
$work_process_id = test_input($_GET['work_process_id']);
 $work_order_qty = test_input($_GET['work_order_qty']);
  $work_order_qty1 = $work_order_qty ;
 $godown = test_input($_GET['godown']);
 $dep = test_input($_GET['dep']);
 $sec = test_input($_GET['sec']);
 $emp_id = test_input($_GET['emp_id']);
 
$godown = sql_nullable($godown);
$dep = sql_nullable($dep);
$sec = sql_nullable($sec);

// $godown_string = $godown.$dep.$sec;
$godown_string = $godown;
$dep_string = $godown.$dep;
$sec_string = $godown.$dep.$sec;
$place_string = $godown.$dep.$sec;

 $same_godown_string = "";
 $same_dep_string = "";
 $same_sec_string = "";
 $same_place_string = "";
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);

  return $data;
}

$result_json = array();

try
{

$conn->begin_transaction();


$demand_array = array();
$total_unaassigned_qty = 0;
// get total unaassigned qty for the work_process_id
$sql_total_unaassigned_qty = "select (demand_qty) - sum(ifnull(wo.qty, 0)) as total_unaassigned_qty,demand.demand_id from demand
left join work_order wo on demand.demand_id = wo.demand_id
 where process_id = $work_process_id  GROUP BY demand.demand_id having total_unaassigned_qty > 0";
$result_total_unaassigned_qty = $conn->query($sql_total_unaassigned_qty);

if ($result_total_unaassigned_qty->num_rows > 0) {
  while($row_total_unaassigned_qty = mysqli_fetch_assoc($result_total_unaassigned_qty)) {
    $demand_array[] = array(
      "demand_id" => $row_total_unaassigned_qty['demand_id'],
      "total_unaassigned_qty" => $row_total_unaassigned_qty['total_unaassigned_qty']
    );
    $total_unaassigned_qty += $row_total_unaassigned_qty['total_unaassigned_qty'];
  }
} else {
    throw new Exception("No unaassigned qty found for the work_process_id: " . $work_process_id);
}

$result_json['demand_array'][] = $demand_array;
$result_json['total_unaassigned_qty'][] = $total_unaassigned_qty;




if($total_unaassigned_qty < $work_order_qty) {
    throw new Exception("Not enough unaassigned qty for the work_process_id: " . $work_process_id . ". Total unaassigned qty: " . $total_unaassigned_qty . ", requested work order qty: " . $work_order_qty);
}


// loop through the demand_array and assign the work_order_qty to the demands until the work_order_qty is fulfilled
while($work_order_qty > 0 && count($demand_array) > 0) {
    $demand = array_shift($demand_array);
    $demand_id = $demand['demand_id'];
    $total_unaassigned_qty = $demand['total_unaassigned_qty'];

    if($total_unaassigned_qty <= $work_order_qty) {
        // assign the entire unaassigned qty to the work order
        $assign_qty = $total_unaassigned_qty;
    } else {
        // assign only the remaining work order qty to the demand
        $assign_qty = $work_order_qty;
    }
$result_json['assignments'][] = array(
        "demand_id" => $demand_id,
        "assigned_qty" => $assign_qty
    );
    // insert work order record for the demand
    $sql_insert_work_order = "insert into work_order (demand_id,work_order_type,godown,dep,sec,qty,status,created_by) values ($demand_id,'INTERNAL',$godown,$dep,$sec,$assign_qty,'open',$emp_id)";
   
    if ($conn->query($sql_insert_work_order) === TRUE) {
      $result_json['work_orders'][] = array(
            "demand_id" => $demand_id,
            "assigned_qty" => $assign_qty,
            "work_order_id" => $conn->insert_id
        );
       
    } else {
      $result_json['errors'][] = "Error inserting work order for demand_id: " . $demand_id . ": " . $conn->error;
        throw new Exception("Error inserting work order for demand_id: " . $demand_id . ": " . $conn->error);
    }

    // reduce the remaining work order qty
    $work_order_qty -= $assign_qty;
}





// begin transaction

// get the raw materail for the demand id
$sql = "select iwp.input_part_id, iwp.previous_process_id,iwp.qty* $work_order_qty1 as required_qty from input_wel_parts iwp 
where iwp.process_id = $work_process_id";

$result_json['messages']['raw material query'][] = $sql;
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    
    while($r = mysqli_fetch_assoc($result)) {
      
    $input_part_id = $r['input_part_id'];
    $previous_process_id = $r['previous_process_id'];
    $required_qty = $r['required_qty'];


//  $sql_demand_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
//         left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.process_id = $previous_process_id";
//     if($input_part_id>0)
//       {
//            $sql_demand_reservation = "select js.*,concat(ifnull(js.godown,'NULL'),ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as godown_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
//         left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.part_id = $input_part_id";
//       }


 $sql_demand_reservation = "select js.*,js.godown as godown_string,concat(js.godown,ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as same_place_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
        left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.process_id = $previous_process_id";
    if($input_part_id>0)
      {
           $sql_demand_reservation = "select js.*,js.godown as godown_string,concat(js.godown,ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as same_place_string,sr.reserve_qty,sr.stock_reserve_id from stock_reserve_view js 
        left join stock_reserve sr on js.stock_id = sr.stock_id and sr.reserve_type = 'demand' where    js.part_id = $input_part_id";
      }

      $result_json['messages']['demand query'][] = $sql_demand_reservation;
      
        $total_holded_qty = 0;
        // get demand reservation for the input part id
           $demand_array = array();
        $result_demand_reservation = $conn->query($sql_demand_reservation);
        if ($result_demand_reservation->num_rows > 0) {
    
          while($r_demand_reservation = mysqli_fetch_assoc($result_demand_reservation)) {
            $godown_string_db = $r_demand_reservation['godown_string'];
            $same_place_string_db = $r_demand_reservation['same_place_string'];
        
            $demand_reserve_qty = $r_demand_reservation['reserve_qty'];
            $total_holded_qty += $demand_reserve_qty;
            $stock_id = $r_demand_reservation['stock_id'];
            $godown_id = $r_demand_reservation['godown'];
            $dep_id = $r_demand_reservation['dep'];
            $sec_id = $r_demand_reservation['sec'];
            $available_qty = $r_demand_reservation['available_qty'];
            $stock_reserve_id = $r_demand_reservation['stock_reserve_id'];
$same_godown = false;
$same_dep = false;
$same_sec = false;
$same_place = false;
// if($godown_string_db == $godown_string)
//             {
//              $same_godown = true;
//              $same_godown_string = $godown_string_db;
//             }
if($same_place_string_db == $place_string)
  {
$same_place = true;
  }
  else if($godown_string_db == $godown_string)
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
              "same_place" => $same_place,
              "same_godown" => $same_godown,
              "same_dep" => $same_dep,
              "same_sec" => $same_sec,
              "stock_reserve_id" => $stock_reserve_id
            );

            $result_json['demand_reservations'][] = array(
              "stock_id" => $stock_id,
              "godown_id" => $godown_id,
              "dep_id" => $dep_id,
              "sec_id" => $sec_id,
              "godown_string" => $godown_string_db,
              "reserve_qty" => $demand_reserve_qty,
              "available_qty" => $available_qty,
              "same_place" => $same_place,
              "same_godown" => $same_godown,
              "stock_reserve_id" => $stock_reserve_id
            );
         
          }


        } else {
         
          $result_json['warnings'][] = "No demand reservation found for input_part_id: " . $input_part_id;
        }


 $result_json['input_parts'][] = array(
        
            "total_holded_qty" => $total_holded_qty,
           
        );

    


// if holded qty > 0 need to release the holded qty  first relese same godown qty first then other godown qty
if($total_holded_qty > 0)
  {
    // 1st find same godown qty and release it
$same_godown = current(array_filter($demand_array, function ($item) {
    return is_array($item) && ($item['same_godown'] ?? false);
}));

$same_dep = current(array_filter($demand_array, function ($item) {
    return is_array($item) && ($item['same_dep'] ?? false);
}));

$same_sec = current(array_filter($demand_array, function ($item) {
    return is_array($item) && ($item['same_sec'] ?? false);
}));

$same_place = current(array_filter($demand_array, function ($item) {
    return is_array($item) && ($item['same_place'] ?? false);
}));


$result_json['messages']['raw material result'][] = $same_godown['same_godown'] ?? false;
$result_json['messages']['raw material result'][] = $same_place['same_place'] ?? false;


$stock_to_be_released = min($required_qty, $total_holded_qty);

// 1st release same place qty if found
if($same_place['same_place'] ?? false)
  {
    foreach($demand_array as $item)
    {
      if($item['same_place'] == true && $stock_to_be_released > 0 && $item['reserve_qty'] > 0)
      {
        $stock_id = $item['stock_id'];
        $reserve_qty = $item['reserve_qty'];
        $stock_reserve_id = $item['stock_reserve_id'];
        $stock_to_be_released_same_place = min($reserve_qty, $stock_to_be_released); 
        // release the reserve qty
        $sql_release = "update stock_reserve set reserve_qty = reserve_qty - $stock_to_be_released_same_place where stock_reserve_id = $stock_reserve_id and reserve_type = 'demand'";
        if ($conn->query($sql_release) === TRUE) {
          $result_json['messages']['result1'][] = "stock internally released successfully";
       $stock_to_be_released -= $stock_to_be_released_same_place;
        } else {
         throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }

  }

  // if stock to be released is still greater than 0, continue with other releases noe realese same godown not same place
if($stock_to_be_released > 0)
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
          $result_json['messages']['result1'][] = "stock internally released successfully";
       $stock_to_be_released -= $stock_to_be_released_same_godown;
        } else {
         throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
  }

  // if stock to be released is still greater than 0, continue with other releases not same_godown,same places false

  if($stock_to_be_released > 0)
  {
    foreach($demand_array as $item)
    {
      if($item['same_godown'] == false && $item['same_place'] == false && $stock_to_be_released > 0 && $item['reserve_qty'] > 0)
      {
        $stock_id = $item['stock_id'];
        $reserve_qty = $item['reserve_qty'];
        $stock_reserve_id = $item['stock_reserve_id'];
        $stock_to_be_released_other = min($reserve_qty, $stock_to_be_released); 
        // release the reserve qty
        $sql_release = "update stock_reserve set reserve_qty = reserve_qty - $stock_to_be_released_other where stock_reserve_id = $stock_reserve_id and reserve_type = 'demand'";
        if ($conn->query($sql_release) === TRUE) {
          $result_json['messages']['result1'][] = "stock internally released successfully";
       $stock_to_be_released -= $stock_to_be_released_other;
        } else {
         throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
  }







  $result_json['messages'][' result2'][] = "stock_to_be_released: ".$stock_to_be_released;
  // if stock to be released is still > 0 then release other godown qty


    
  }


  // after realeasing now we reserve if same godown as work_order other as job_work_order
  // after releasing now we reserve samePlace as work order,same godown as stock transfer to work place, other stock as job work order
$stock_reservation_array = array();
$stock_to_be_reserved = $required_qty;

 $sql_reservation = "select js.*,js.godown as godown_string,concat(js.godown,ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as same_place_string from stock_reserve_view js 
         where    js.process_id = $previous_process_id";
    if($input_part_id>0)
      {
           $sql_reservation = "select js.*,js.godown as godown_string,concat(js.godown,ifnull(js.dep,'NULL'),ifnull(js.sec,'NULL')) as same_place_string from stock_reserve_view js 
         where    js.part_id = $input_part_id";
      }

$result_reservation = $conn->query($sql_reservation);
        if ($result_reservation->num_rows > 0) {
    
          while($r_reservation = mysqli_fetch_assoc($result_reservation)) {
           
            $stock_id = $r_reservation['stock_id']; 
            $available_qty = $r_reservation['available_qty'];
            $godown_string_db = $r_reservation['godown_string'];
            $same_place_string_db = $r_reservation['same_place_string'];
         
            $same_godown_chk = false;
        
            $same_place_chk = false;
if($same_place_string_db == $place_string)
            {
             $same_place_chk = true;
            }
            else if($godown_string_db == $godown_string)
            {
             $same_godown_chk = true;
            }

            $stock_reservation_array[] = array(
              "stock_id" => $stock_id,
              "available_qty" => $available_qty,
              "godown_string" => $godown_string_db,
           
              "same_godown" => $same_godown_chk,
              "same_place" => $same_place_chk,
              "godown" => $r_reservation['godown'],
              "dep" => $r_reservation['dep'],
              "sec" => $r_reservation['sec'],
            );

          }
    }

$same_place = current(array_filter($stock_reservation_array, function ($item) {
    return is_array($item) && ($item['same_place'] ?? false); 
}));
$same_godown = current(array_filter($stock_reservation_array, function ($item) {
    return is_array($item) && ($item['same_godown'] ?? false);
}));




    

// $same_godown = current(array_filter($stock_reservation_array, function ($item) {
//     return $item['same_godown'] == true;
// }));


$result_json['stock_reservation_array'][] = $stock_reservation_array;


// if($same_sec['same_sec']?? false)
//   {
//  foreach($stock_reservation_array as $item)
//     {
//       if($item['same_sec'] == true && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
//       {
//         $stock_id = $item['stock_id'];
//         $available_qty = $item['available_qty'];
   
//         $stock_to_be_reserved_same_sec = min($available_qty, $stock_to_be_reserved); 
//         // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_sec
//         $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_same_sec,'work_order') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_sec";
//         if ($conn->query($sql_release) === TRUE) {
//           $result_json['messages']['result4'][] = "stock internally reserved successfully";
//        $stock_to_be_reserved -= $stock_to_be_reserved_same_sec;
//         } else {
//           throw new Exception("Error updating record: " . $conn->error);
//         }
//       }
//     }
//   }

$result_json['same_place_details'] = [
    'same_godown' => $same_godown['same_godown'] ?? false,
    'same_place' => $same_place['same_place'] ?? false
];

$result_json['messages']['result4'][] = "starting stock reservation process";
$result_json['messages']['result4'][] = "current stock to be reserved: " . $stock_to_be_reserved;

// reserve same place as work order
if($same_place['same_place']?? false && $stock_to_be_reserved > 0)
  {
    $result_json['messages']['result4'][] = "reserving stock in the same place";
 foreach($stock_reservation_array as $item)
    {
      if($item['same_place'] == true && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
      {
        $result_json['messages']['result4'][] = "reserving stock from stock_id: " . $item['stock_id'];
        $stock_id = $item['stock_id'];
        $available_qty = $item['available_qty'];
   
        $stock_to_be_reserved_same_place = min($available_qty, $stock_to_be_reserved); 
        // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_place
        $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_same_place,'work_order') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_place";
        if ($conn->query($sql_release) === TRUE) {
          $result_json['messages']['result4'][] = "stock internally reserved successfully";
       $stock_to_be_reserved -= $stock_to_be_reserved_same_place;


// insert on duplicate key input_demand

$demand_part_id = sql_nullable($input_part_id);
$demand_process_id = sql_nullable($previous_process_id);
if($input_part_id !== null) {
  $demand_process_id = "NULL";
}
		
$sql_input_demand = "insert into input_demand (work_process_id,godown,dep,sec,part_id,process_id,cat,qty) values ($work_process_id,$godown,$dep,$sec,$demand_part_id,$demand_process_id,'work_order',$stock_to_be_reserved_same_place) on duplicate key update qty = qty + $stock_to_be_reserved_same_place";
if ($conn->query($sql_input_demand) === TRUE) {
  $result_json['messages']['result4'][] = "input demand updated successfully";
} else {
  throw new Exception("Error updating input demand: " . $conn->error);
}


        } else {
          throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
  }


// reserve same godown as stock transfer
  if($same_godown['same_godown']?? false && $stock_to_be_reserved > 0)
  {
    $result_json['messages']['result4'][] = "reserving stock in the same godown";
 foreach($stock_reservation_array as $item)
    {
      if($item['same_godown'] == true && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
      {
        $result_json['messages']['result4'][] = "reserving stock from stock_id: " . $item['stock_id'];
        $stock_id = $item['stock_id'];
        $available_qty = $item['available_qty'];
   
        $stock_to_be_reserved_same_godown = min($available_qty, $stock_to_be_reserved); 
        // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_godown
        $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_same_godown,'stock_transfer') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_same_godown";
        if ($conn->query($sql_release) === TRUE) {
          $result_json['messages']['result4'][] = "stock internally reserved successfully as transfer";
       $stock_to_be_reserved -= $stock_to_be_reserved_same_godown;
       
$demand_part_id = sql_nullable($input_part_id);
$demand_process_id = sql_nullable($previous_process_id);
if($input_part_id !== null) {
  $demand_process_id = "NULL";
}
		
$sql_input_demand = "insert into input_demand (work_process_id,godown,dep,sec,part_id,process_id,cat,qty) values ($work_process_id,$godown,$dep,$sec,$demand_part_id,$demand_process_id,'stock_transfer',$stock_to_be_reserved_same_godown) on duplicate key update qty = qty + $stock_to_be_reserved_same_godown";
if ($conn->query($sql_input_demand) === TRUE) {
  $result_json['messages']['result4'][] = "input demand updated successfully";
} else {
  throw new Exception("Error updating input demand: " . $conn->error);
}

// insert stock_allocation
$part_id_allocation = $input_part_id;
$process_id_allocation = $previous_process_id;
$from_sec = sql_nullable ($item['sec']);
$from_dep = sql_nullable($item['dep']);
$from_godown = sql_nullable($item['godown']);
$to_godown = $godown;
$to_dep = $dep;
$to_sec = $sec;
// part_id_allocation is not null assign null to process_id_allocation
if($part_id_allocation !== null) {
  $process_id_allocation = "NULL";
}
else
  {
    $part_id_allocation = sql_nullable($part_id_allocation);
    $process_id_allocation = sql_nullable($process_id_allocation);
  }


 $sql_allocation = "INSERT INTO stock_allocation ( part_id,from_sec,from_dep,from_godown,to_godown,to_dep,to_sec,qty,process_id) VALUES ($part_id_allocation,$from_sec,$from_dep,$from_godown,$to_godown,$to_dep,$to_sec,$stock_to_be_reserved_same_godown,$process_id_allocation)";

$result_json['messages']['result4'][] = "executing stock allocation query";
$result_json['messages']['result4'][] = "stock allocation query: " . $sql_allocation;
  if ($conn->query($sql_allocation) === TRUE) {
    $result_json['messages']['result4'][] = "stock allocation updated successfully";
  } else {
    throw new Exception("Error updating stock allocation: " . $conn->error);
  }

        } else {
          throw new Exception("Error updating record: " . $conn->error);
        }
      }
    }
  }
  
  // if stock still needs to be reserved, try other godowns
if( $stock_to_be_reserved > 0)
{
  $result_json['messages']['result5'][] = "reserving stock in other godowns";
  foreach($stock_reservation_array as $item)
    {
      if($item['same_godown'] == false && $item['same_place'] == false  && $stock_to_be_reserved > 0 && $item['available_qty'] > 0)
      {
        $result_json['messages']['result5'][] = "reserving stock from stock_id: " . $item['stock_id'];
        $stock_id = $item['stock_id'];
        $available_qty = $item['available_qty'];
        
        $stock_to_be_reserved_other_godown = min($available_qty, $stock_to_be_reserved); 
        // release the reserve qty insert on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_other_godown
        $sql_release = "insert into stock_reserve (stock_id,reserve_qty,reserve_type) values ($stock_id,$stock_to_be_reserved_other_godown,'job_work_order') on duplicate key update reserve_qty = reserve_qty + $stock_to_be_reserved_other_godown";
        if ($conn->query($sql_release) === TRUE) {
          $result_json['messages']['result5'][] = "stock externally reserved successfully";
       $stock_to_be_reserved -= $stock_to_be_reserved_other_godown;
        } else {
          throw new Exception("Error updating record: " . $conn->error);
        }
      }


    }

}

    }
    }
    // -----------------
    
 else {
throw new Exception("No raw material found for the process id: " . $work_process_id);
}

// work_order_id	work_order_no	demand_id	work_order_type	godown	dep	sec	qty	completed_qty	status	due_date	remarks	created_by	created_date	updated_date	

// // insert work order record
// $sql_insert_work_order = "insert into work_order (demand_id,work_order_type,godown,dep,sec,qty,status,created_by) values ($demand_id,'INTERNAL',$godown,$dep,$sec,$work_order_qty,'open',$emp_id)";
// if ($conn->query($sql_insert_work_order) === TRUE) {
//   echo "New work order created successfully";
// } else {
//   throw new Exception("Error inserting work order: " . $conn->error);
// }


// delete all reserve record whose reserve_qty = 0
$sql_delete_zero_reserve = "delete from stock_reserve where reserve_qty = 0";
if ($conn->query($sql_delete_zero_reserve) === TRUE) {
  // get deleted zero reserve records
  $deleted_zero_reserve_records = $conn->affected_rows;
  $result_json['messages']['result6'][] = "zero reserve records deleted successfully. Total deleted: " . $deleted_zero_reserve_records;
} else {
  throw new Exception("Error deleting zero reserve records: " . $conn->error);
}
  // $result_json['success'] = true;
      $conn->commit();

}
catch (Exception $e) {
  $result_json['success'] = false;
  // Rollback the transaction if an exception occurs
  $conn->rollback();
  $result_json['error'] = $e->getMessage();
 
}

echo json_encode($result_json);
$conn->close();



 ?>


