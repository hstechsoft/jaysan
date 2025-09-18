<?php

include 'db_head.php';


   
    $filename = 'StockItem.json';

    if (file_exists($filename)) {
        $json = file_get_contents($filename);
        $data = json_decode($json, true);
 $i = 1;
        foreach ($data['StockItem'] as $item) {
            $out_part_name = isset($item['Name']) ? $item['Name'] : "no name";
           

            $out_part_name = str_replace("'", "", $out_part_name);
             
            //    $i = 1;
            // if (isset($item['MULTICOMPONENTLIST'])) {
            //     $components = [];
            //     foreach ($item['MULTICOMPONENTLIST'] as $component) {
            //         if (isset($component['MULTICOMPONENTITEMLIST'])) {
            //             foreach ($component['MULTICOMPONENTITEMLIST'] as $multiComponentItem) {
            //                 $components[] = $multiComponentItem;
            //             }
            //         }
            //     }

            //     if (!empty($components)) {
            // echo $i . ". ";
            // $i++;
            //         echo ($item['Name']);
            //         echo isset($item['Part No']) ? $item['Part No'] : null;
            //         echo "<br>";
                 
            //         // foreach ($components as $component) {
            //         //     echo $component['StockItemName'];
            //         //     echo $component['ACTUALQTY'];
                      
            //         // }

                   
            //     }
            // }



  
            if (isset($item['MULTICOMPONENTLIST'])) {
                $components = [];
                $component_cat =  $item['MULTICOMPONENTLIST'][0]['MULTICOMPONENTCAT'] ?? 'default_category';
                $component_cat = str_replace("'", "", $component_cat);
                
       
                foreach ($item['MULTICOMPONENTLIST'] as $component) {
                    if (isset($component['MULTICOMPONENTITEMLIST'])) {
                        foreach ($component['MULTICOMPONENTITEMLIST'] as $multiComponentItem) {
                            $components[] = $multiComponentItem;
                        }
                    }
                }

                if (!empty($components)) {
                $sql_bom = "INSERT INTO bom_output (part_id,component_cat) VALUES ( (SELECT part_id FROM parts_tbl WHERE part_name = '$out_part_name'),'$component_cat')";
            
  if ($conn->query($sql_bom) === TRUE) {
  $last_insert_id = $conn->insert_id;
               
                 
                    foreach ($components as $component) {
                      

                        $in_part_name = $component['StockItemName'];
                        $in_part_name = str_replace("'", "", $in_part_name);

                        $in_part_qty = $component['ACTUALQTY'];
                        $in_part_qty = preg_replace('/\D/', '', $in_part_qty);
                        


                      
$sql = "INSERT  INTO bom_input (bom_id,qty,part_id)
 VALUES ($last_insert_id ,$in_part_qty , (SELECT part_id FROM parts_tbl WHERE part_name = '$in_part_name'))";
  
  if ($conn->query($sql) === TRUE) {
   
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
                    }
echo $i . ". ";
            $i++;
            echo "<br>";
                   
                }
            }

            else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  } 






         
                    

        }
    } else {
        echo "<div class='alert alert-danger'>File not found: $filename</div>";
    }
    ?>

