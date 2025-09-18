<?php
 include 'db_head.php';

 $work_id =test_input($_GET['work_id']);


 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}
$sql = "
SELECT
work_com_status,
cus,
CONCAT('<ol class=\"list-group list-group-numbered\">',GROUP_CONCAT(CONCAT('<li class=\"list-group-item\">',ct,'</li>') SEPARATOR '\n'),'</ol>')as ct,
CONCAT('<ol class=\"list-group list-group-numbered\">',GROUP_CONCAT(CONCAT('<li class=\"list-group-item\">',(select emp_name from employee where emp_id = work_created_by),'-->',emp_name ,'</li>') SEPARATOR '\n'),'</ol>')as emp_name,
work_com_status,
GROUP_CONCAT(his SEPARATOR '\n') as his
FROM (
SELECT DISTINCT
employee.emp_name,
work.pipeline_id,
customer.cus_id,
work.work_id,
work.work_created_by,
work.emp_id,
CONCAT(customer.cus_name, '<br>', customer.cus_phone) as cus,
(
SELECT CONCAT(
'<div class=\"accordion m-0 p-0\">
  <div class=\"accordion-item\">
    <div class=\"accordion-header\">',
      '<div class=\"accordion-button collapsed\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#id_',
        work.work_id, '\" aria-expanded=\"false\">
                <div class=\"d-flex justify-content-between  w-100\">
               <div>' , work.work_type, '(<span class=\"small text-danger\">' , work.work_description, '</span>) - ' ,
        work.work_status, ' </div>
               <mark>' , FROM_UNIXTIME(work.work_date/1000,\"%d-%m-%Y %H:%i:%s\"), '</mark>
               <div class=\"me-2\">',(select IF(
                 UNIX_TIMESTAMP()*1000> work.work_date AND work.work_com_status = \"complete\" 
                 ,\"<i class=' h5 text-success fa-regular fa-thumbs-up'></i>\",
                 (if( UNIX_TIMESTAMP()*1000 < work.work_date AND work.work_com_status = \"incomplete\",\"<i class='h5 text-info fa-solid fa-user-clock'></i>\",\"<i class='h5 text-danger fa-regular fa-calendar-xmark'></i>\")))),'</div>
               </div>
              </div>
            </div>
              <div id=\"id_' ,
        work.work_id, '\" class=\"accordion-collapse collapse\" ><div class=\"accordion-body\"><ol class=\"list-group list-group-numbered\">'
        , GROUP_CONCAT(CONCAT('<li class=\"list-group-item\">', CONCAT(work_history.comments, ' on -', CONCAT('<span
          class=\"fw-bold\">', FROM_UNIXTIME(work_history.his_date/1000,\"%d-%m-%Y %H:%i:%s\"), '</span>')),'</li>')
        SEPARATOR '\n'),'</ol>
      </div>
    </div>
  </div>
</div>
</ol>') FROM work_history WHERE work_history.work_id= work.work_id GROUP by work_history.work_id
) as his,
(
SELECT FROM_UNIXTIME(MIN(work_history.his_date/1000), \"%d-%m-%Y %H:%i:%s\")
FROM work_history WHERE work_history.work_id = work.work_id GROUP BY work.work_id HAVING MIN(work_history.work_id)
) as ct,
FROM_UNIXTIME(work.work_date/1000, \"%d-%m-%Y %H:%i:%s\") as work_time,
work.work_type,
work.work_status,
work.work_description,
work.work_com_status,
work.work_attachment
FROM
work
INNER JOIN employee ON work.emp_id = employee.emp_id
INNER JOIN work_history ON work.work_id = work_history.work_id
LEFT JOIN customer ON work.cus_id = customer.cus_id
WHERE (CASE 
          WHEN work.pipeline_id = 0 THEN work.work_id  = $work_id
          ELSE  work.pipeline_id = (SELECT work.pipeline_id from work WHERE work.work_id = $work_id)
       END) 
ORDER BY work.work_id ASC
) as f
;
";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);
} else {
  echo "0 result";
}
$conn->close();

 ?>







