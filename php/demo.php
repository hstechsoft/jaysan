<?php
$value = "null";
 if ($value === 'null' || $value === '' || is_null($value) || $value === NULL || strtolower($value) === 'null' || strcmp($value,'null') == 0) {
        return "NULL";
    }

?>
