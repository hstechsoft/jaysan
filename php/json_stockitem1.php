<?php

include 'db_head.php';


   
    $filename = 'StockItem.json';

    if (file_exists($filename)) {
        $json = file_get_contents($filename);
        $data = json_decode($json, true);
 $i = 1;

 foreach ($data['StockItem'] as $item) {
echo $i.". ";
echo $item['Name'] . "\t\t<br>\t\t";
if(isset($item['MULTICOMPONENTLIST'])) {
        foreach ($item['MULTICOMPONENTLIST'] as $component)
        {
           
if(isset($component['MULTICOMPONENTITEMLIST'])){

     $out_part_name = isset($item['Name']) ? $item['Name'] : "no name";
           

            $out_part_name = str_replace("'", "", $out_part_name);

            
 echo $out_part_name . "\t\t\t-----".$component['COMPONENTLISTNAME']."-----";
     echo "<br>";
$component_cat = $component['COMPONENTLISTNAME'];

     
             $sql_bom = "INSERT INTO bom_output (part_id,component_cat) VALUES ( (SELECT part_id FROM parts_tbl WHERE part_name = '$out_part_name'),'$component_cat')";
            
  if ($conn->query($sql_bom) === TRUE) {
  $last_insert_id = $conn->insert_id;

    foreach ($component['MULTICOMPONENTITEMLIST'] as $component_item)
  {
      $in_part_name = $component_item['StockItemName'];
                        $in_part_name = str_replace("'", "", $in_part_name);

                        $in_part_qty = $component_item['ACTUALQTY'];
                        $in_part_qty = preg_replace('/\D/', '', $in_part_qty);


echo  $in_part_name . "\t\t";
echo "- " . $in_part_qty. "\t\t";
echo "<br>";


$sql = "INSERT  INTO bom_input (bom_id,qty,part_id)
 VALUES ($last_insert_id ,$in_part_qty , (SELECT part_id FROM parts_tbl WHERE part_name = '$in_part_name'))";
  
  if ($conn->query($sql) === TRUE) {
   
    
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  
  }
                      

  }
 else {
    echo "Error: " . $sql_bom . "<br>" . $conn->error;
  }



 echo '<br>';
}

        }
        } else {
            echo "No components";
        }
       
        echo "<br>";
    $i++;
    }

}
  
    ?>

