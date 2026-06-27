<?php
function loadBom(mysqli $conn)
{
    $bom = [];

    $sql = "SELECT
                process_id,
                previous_process_id,
                qty
            FROM input_wel_parts
            WHERE previous_process_id IS NOT NULL
            ORDER BY process_id";

    $result = $conn->query($sql);

    while($row = $result->fetch_assoc())
    {
        $bom[(int)$row['process_id']][] = [

            'child' => (int)$row['previous_process_id'],

            'qty' => (float)$row['qty']

        ];
    }

    return $bom;
}
 ?>