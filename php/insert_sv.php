
<?php
 include 'db_head.php';
    $industry_type = test_input($_GET['industry_type']);
    $eb_no = test_input($_GET['eb_no']);
    $eb_reg_no= test_input($_GET['eb_reg_no']);
    $eb_amount= test_input($_GET['eb_amount']);
    $eb_tariff = test_input($_GET['eb_tariff']);
    $eb_san_load =test_input($_GET['eb_san_load']);
    $eb_tri_load= test_input($_GET['eb_tri_load']);
    $type_ins = test_input($_GET['type_ins']);
    $p2p_dis = test_input($_GET['p2p_dis']);
    $total_mea = test_input($_GET['total_mea']);
    $shift = test_input($_GET['shift']);
    $fund = test_input($_GET['fund']);
    $company_photo =test_input($_GET['company_photo']);
    $vc_photo = test_input($_GET['vc_photo']);
    $roof_photo =test_input($_GET['roof_photo']);
    $ge_photo =test_input($_GET['ge_photo']);
    $hs_photo = test_input($_GET['hs_photo']);
    $site_photo = test_input($_GET['site_photo']);
    $ep_photo = test_input($_GET['ep_photo']);
    $cus_rating =test_input($_GET['cus_rating']);
    $remark = test_input($_GET['remark']);
    $work_id = test_input($_GET['work_id']);
    $latti = test_input($_GET['latti']);
    $longi = test_input($_GET['longi']);
    $cur_time = test_input($_GET['cur_time']);
    $emp_id = test_input($_GET['emp_id']);

  
 
function test_input($data) {
$data = trim($data);
$data = stripslashes($data);
$data = htmlspecialchars($data);
$data = "'".$data."'";
return $data;
}




$sql = "INSERT INTO site_survey (industry_type,eb_no,eb_reg_no,eb_amount,eb_tariff,eb_san_load,eb_tri_load,type_ins,p2p_dis,total_mea,shift,fund,company_photo,vc_photo,roof_photo,ge_photo,hs_photo,site_photo,ep_photo,cus_rating,remark,work_id,latti,longi,sv_date,emp_id )
 VALUES ($industry_type,$eb_no,$eb_reg_no,$eb_amount,$eb_tariff,$eb_san_load,$eb_tri_load,$type_ins,$p2p_dis,$total_mea,$shift,$fund,$company_photo,$vc_photo,$roof_photo,$ge_photo,$hs_photo,$site_photo,$ep_photo,$cus_rating,$remark,$work_id,$latti,$longi,$cur_time,$emp_id)";
    $last_id_work =0;
  if ($conn->query($sql) === TRUE) {
    
    $last_id_work = $conn->insert_id;
echo $last_id_work;
    $sql_insert_history= "INSERT INTO  work_history  ( work_id,his_date,comments,cus_id,emp_id,his_status)
    VALUES ($last_id_work , UNIX_TIMESTAMP(current_timestamp())*1000 ,'site visit created' ,'0','0','create')";
     
      
       if ($conn->query($sql_insert_history) === TRUE) {

       } 
       else {
        
       }
  } else {
    
  }
  
 
 



$conn->close();

 ?>





