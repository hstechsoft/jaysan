<?php
// get paramerter as array
function stock_reserve(mysqli $conn,$stock_json,$replace_type = null)
{

try

    {
        $conn->begin_transaction();
        print_r($stock_json);
   foreach ($stock_json as $stock) {
 
    $stock_id = $stock['stock_id'];
    $qty = $stock['qty'];
    $owner = $stock['owner'];
  
$inserted_stock = $qty;
// get total reserve qty and check if qty is greater than reserve qty
    $sql_reserve = "SELECT sum(reserve_qty) as total_reserve_qty FROM stock_reserve sr 
    inner join jaysan_stock js on sr.stock_id = js.stock_id where sr.stock_id = $stock_id and sr.reserve_type in (select   GROUP_CONCAT(reserve_type) as reserve_type from granted_stock WHERE owner = '$owner')";
    $result_reserve = $conn->query($sql_reserve);
    if ($result_reserve->num_rows > 0) {
        $row_reserve = $result_reserve->fetch_assoc();
        $total_reserve_qty = $row_reserve['total_reserve_qty'];
        if ($qty > $total_reserve_qty) {
            throw new Exception("Quantity to reserve cannot be greater than total reserved quantity for stock id $stock_id");
        }
    } else {
        throw new Exception("No reserved stock found for stock id $stock_id");
    }

// loop until qty is 0 and reserve stock from stock reserve table
while ($qty > 0) {
    // get stock details from stock id and reserve id
    $sql_stock = "select reserve_qty,stock_reserve_id from stock_reserve sr 
inner join jaysan_stock js on sr.stock_id = js.stock_id where sr.stock_id = $stock_id and sr.reserve_type in (select   GROUP_CONCAT(reserve_type) as reserve_type from granted_stock WHERE owner = '$owner')";
    $result_stock = $conn->query($sql_stock);
    if ($result_stock->num_rows > 0) {
        $row_stock = $result_stock->fetch_assoc();
        $reserve_qty = $row_stock['reserve_qty'];
        $stock_reserve_id = $row_stock['stock_reserve_id'];
        if ($qty >= $reserve_qty) {
            // update stock reserve table and set reserve qty to 0
            // $sql_update = "UPDATE stock_reserve SET reserve_qty = 0 WHERE stock_reserve_id = $stock_reserve_id";
            // if (!$conn->query($sql_update)) {
            //     throw new Exception("Error updating stock reserve id $stock_reserve_id: " . $conn->error);
            // }

            // if reserve qty 0 then delte that record
            $sql_delete = "DELETE FROM stock_reserve WHERE stock_reserve_id = $stock_reserve_id";
            if (!$conn->query($sql_delete)) {
                throw new Exception("Error deleting stock reserve id $stock_reserve_id: " . $conn->error);
            }
            $qty -= $reserve_qty;
        } else {
            // update stock reserve table and set reserve qty to reserve qty - qty
            $sql_update = "UPDATE stock_reserve SET reserve_qty = reserve_qty - $qty WHERE stock_reserve_id = $stock_reserve_id";
            if (!$conn->query($sql_update)) {
                throw new Exception("Error updating stock reserve id $stock_reserve_id: " . $conn->error);
            }
            $qty = 0;
        }
    } else {
        throw new Exception("No reserved stock found for stock id $stock_id");
    }

   }


//    after reducing reserve qty now we update to replace type in stock reserve table for that stock id use insert on duplicate key update to update reserve type for that stock id and reserve type in granted stock for that owner

    $sql_replace = "INSERT INTO stock_reserve (stock_id, reserve_type, reserve_qty) VALUES ($stock_id, '$replace_type', $inserted_stock) ON DUPLICATE KEY UPDATE reserve_qty = reserve_qty + $inserted_stock";
    if (!$conn->query($sql_replace)) {
        throw new Exception("Error updating stock reserve id $stock_reserve_id: " . $conn->error);
    }


    // finally check total stock and total reserve qty for that stock id and if total reserve qty is greater than total stock then throw error
    $sql_total = "SELECT sum(reserve_qty) as total_reserve_qty, js.qty as total_stock_qty FROM stock_reserve sr 
    inner join jaysan_stock js on sr.stock_id = js.stock_id where sr.stock_id = $stock_id";
    $result_total = $conn->query($sql_total);
    $row_total = $result_total->fetch_assoc();
    $total_reserve_qty = $row_total['total_reserve_qty'];
    $total_stock_qty = $row_total['total_stock_qty'];
    if ($total_reserve_qty > $total_stock_qty) {
        
        throw new Exception("Total reserved quantity cannot be greater than total stock quantity for stock id $stock_id");
    }

   }
   $conn->commit();
   return "ok";
} catch (Exception $e) {
    $conn->rollback();
    return "Transaction failed: " . $e->getMessage();
    
}
}
 ?>