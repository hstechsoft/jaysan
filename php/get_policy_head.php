<?php
 include 'db_head.php';

 
 $sql_department = "SELECT DISTINCT department FROM `policy`;";
$sql_insurance_type = "SELECT DISTINCT insurance_type FROM `policy`;";
$sql_company_details = "SELECT DISTINCT company_details FROM `policy`;";
$sql_business_source = "SELECT DISTINCT business_source FROM `policy`;";
$sql_rm = "SELECT DISTINCT rm FROM `policy`;";
$sql_policy_type = "SELECT DISTINCT policy_type FROM `policy`;";


$result_department = $conn->query($sql_department);
$result_insurance_type = $conn->query($sql_insurance_type);
$result_company_details = $conn->query($sql_company_details);
$result_business_source = $conn->query($sql_business_source);
$result_rm = $conn->query($sql_rm);
$result_policy_type = $conn->query($sql_policy_type);

$department_rows = array();
$insurance_type_rows = array();
$company_details_rows = array();
$business_source_rows = array();
$rm_rows = array();
$policy_type_rows = array();
 
 
if ($result_department->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_department)) {
        $department_rows[] = $row;
    }
}


if ($result_insurance_type->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_insurance_type)) {
        $insurance_type_rows[] = $row;
    }
}
if ($result_insurance_type->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_company_details)) {
        $company_details_rows[] = $row;
    }
}

if ($result_insurance_type->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_business_source)) {
        $business_source_rows[] = $row;
    }
}


if ($result_insurance_type->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_rm)) {
        $rm_rows[] = $row;
    }
}

if ($result_insurance_type->num_rows > 0) {
    while($row = mysqli_fetch_assoc($result_policy_type)) {
        $policy_type_rows[] = $row;
    }
}


$output = array(
    "departments" => $department_rows,
    "insurance_types" => $insurance_type_rows,
    "company_detail" => $company_details_rows,
    "business_sources" => $business_source_rows,
    "rms" => $rm_rows,
    "policy_types" => $policy_type_rows
);

print json_encode($output);

$conn->close();

 ?>

