<?php

include "firebase_token.php";

// Example values
$fcm_token = "f2NOgT82Sy6VMbgsq0h1uV:APA91bHbC_pjp1RD8D447BUm4Tvcq8zNYyOZMf_bET11MIrR9KR0i5VwuwBHhTRGKcW7c7QdDC0ZIXTGNICughx_TfmwgLWCH1U6xqMHuOIbjiTNziAcAf0";   // fetch from DB normally
$title = "New Order";
$body  = "Order #123 created";
$url   = "https://jaysan.cloud/role.html";

$accessToken = getFirebaseAccessToken();

if (!$accessToken) {
    echo "Failed to get access token";
    exit;
}

$projectId = "jaysan-8fa8d";

$payload = [
    "message" => [
        "token" => $fcm_token,
        "notification" => [
            "title" => $title,
            "body"  => $body
        ],
        "data" => [
            "url" => $url
        ]
    ]
];

$ch = curl_init("https://fcm.googleapis.com/v1/projects/$projectId/messages:send");

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $accessToken",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
