<?php

include "firebase_token.php";

$token = getFirebaseAccessToken();

if ($token) {
    echo "ACCESS TOKEN OK<br>";
    echo substr($token, 0, 40) . "...";
} else {
    echo "FAILED";
}
